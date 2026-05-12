import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { access, mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import nodemailer, { type Transporter } from 'nodemailer';

interface DispatchInput {
  channelType: string;
  targetValue: string;
  eventKey: string;
  eventTitle: string;
  message: string;
  eventPayload: Record<string, unknown>;
}

/**
 * AlertingDeliveryDispatchService
 *
 * Owns channel dispatch logic: WhatsApp (Baileys), SMTP email, and webhook
 * fallback. Also exposes provider config accessors consumed by the
 * observability layer.
 *
 * Orchestration and delivery-log management → AlertingDeliveryService
 */
@Injectable()
export class AlertingDeliveryDispatchService {
  private readonly logger = new Logger(AlertingDeliveryDispatchService.name);
  private smtpTransporter: Transporter | null = null;

  // ── Config accessors ─────────────────────────────────────────────────

  getAlertDeliveryWebhookConfig(channelType: string) {
    const n = channelType.trim().toLowerCase();
    const map: Record<string, { providerName: string; url: string; token: string }> = {
      'wa-group': {
        providerName: 'wa-group-webhook',
        url: process.env.ALERTING_WA_GROUP_WEBHOOK_URL || '',
        token: process.env.ALERTING_WA_GROUP_WEBHOOK_TOKEN || '',
      },
      'wa-personal': {
        providerName: 'wa-personal-webhook',
        url: process.env.ALERTING_WA_PERSONAL_WEBHOOK_URL || '',
        token: process.env.ALERTING_WA_PERSONAL_WEBHOOK_TOKEN || '',
      },
      email: {
        providerName: 'email-webhook',
        url: process.env.ALERTING_EMAIL_WEBHOOK_URL || '',
        token: process.env.ALERTING_EMAIL_WEBHOOK_TOKEN || '',
      },
    };
    return map[n] ?? { providerName: 'unknown-channel', url: '', token: '' };
  }

  getBaileysConfig() {
    const authDir = (process.env.ALERTING_WA_BAILEYS_AUTH_DIR || '').trim();
    const enabled = (process.env.ALERTING_WA_BAILEYS_ENABLED || '').trim().toLowerCase() === 'true';
    return { enabled, authDir: authDir ? path.resolve(authDir) : '' };
  }

  async getBaileysHealth() {
    const config = this.getBaileysConfig();
    const health = {
      enabled: config.enabled,
      auth_dir: config.authDir || null,
      auth_dir_exists: false,
      auth_file_count: 0,
      creds_present: false,
      session_ready: false,
      last_auth_update_at: null as string | null,
      pairing_required: false,
      status_label: 'disabled',
    };

    if (!config.enabled) {
      return health;
    }

    if (!config.authDir) {
      return { ...health, pairing_required: true, status_label: 'missing-auth-dir' };
    }

    try {
      await access(config.authDir);
      health.auth_dir_exists = true;

      const fileNames: string[] = await readdir(config.authDir).catch(() => [] as string[]);
      health.auth_file_count = fileNames.length;
      health.creds_present = fileNames.includes('creds.json');

      const stats: Array<Date | null> = await Promise.all(
        fileNames.map(async (fileName) => {
          try {
            const fileStat = await stat(path.join(config.authDir, fileName));
            return fileStat.mtime;
          } catch {
            return null;
          }
        }),
      );

      const latestMtime = stats
        .filter((s) => s instanceof Date)
        .sort((l, r) => r.getTime() - l.getTime())[0];

      health.last_auth_update_at = latestMtime ? latestMtime.toISOString() : null;
      health.session_ready = health.creds_present && health.auth_file_count > 0;
      health.pairing_required = !health.session_ready;
      health.status_label = health.session_ready ? 'ready' : 'pairing-required';
      return health;
    } catch {
      return { ...health, pairing_required: true, status_label: 'auth-dir-not-found' };
    }
  }

  getSmtpConfig() {
    const env = process.env;
    const port = Number(env.ALERTING_EMAIL_SMTP_PORT || env.SMTP_PORT || '') || 0;
    const secure = (env.ALERTING_EMAIL_SMTP_SECURE || env.SMTP_SECURE || '').trim().toLowerCase() === 'true' || port === 465;
    return {
      host: (env.ALERTING_EMAIL_SMTP_HOST || env.SMTP_HOST || '').trim(),
      port,
      user: (env.ALERTING_EMAIL_SMTP_USER || env.SMTP_USER || '').trim(),
      pass: (env.ALERTING_EMAIL_SMTP_PASS || env.SMTP_PASS || '').trim(),
      secure,
      from: (env.ALERTING_EMAIL_FROM || env.SMTP_FROM || env.SMTP_USER || '').trim(),
    };
  }

  mapBaileysHealthToSessionStatus(baileys: {
    enabled: boolean;
    session_ready: boolean;
    pairing_required: boolean;
    status_label: string;
  }) {
    if (!baileys.enabled) {
      return 'disabled';
    }
    if (baileys.session_ready) {
      return 'ready';
    }
    if (baileys.pairing_required || baileys.status_label === 'pairing-required') {
      return 'pairing-required';
    }
    return 'disconnected';
  }

  // ── Dispatch entry point ─────────────────────────────────────────────

  async dispatchAlertDelivery(input: DispatchInput) {
    if (input.channelType === 'wa-group' || input.channelType === 'wa-personal') {
      const baileysResult = await this.dispatchWhatsAppViaBaileys(input);
      if (baileysResult) {
        return baileysResult;
      }
    }

    if (input.channelType === 'email') {
      const smtpResult = await this.dispatchEmailViaSmtp(input);
      if (smtpResult) {
        return smtpResult;
      }
    }

    const webhookConfig = this.getAlertDeliveryWebhookConfig(input.channelType);
    if (!webhookConfig.url) {
      return {
        providerName: 'dry-run',
        providerMessageId: `dry-${Date.now()}`,
        deliveryStatus: 'delivered',
        responsePayload: {
          dry_run: true,
          channel_type: input.channelType,
          target_value: input.targetValue,
          event_key: input.eventKey,
        },
      };
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (webhookConfig.token) {
      headers.Authorization = `Bearer ${webhookConfig.token}`;
    }

    const response = await fetch(webhookConfig.url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        channel_type: input.channelType,
        target_value: input.targetValue,
        event_key: input.eventKey,
        event_title: input.eventTitle,
        message: input.message,
        payload: input.eventPayload,
      }),
    });

    const rawText = await response.text();
    let parsedPayload: unknown = rawText;
    try {
      parsedPayload = rawText ? JSON.parse(rawText) : {};
    } catch {
      parsedPayload = rawText;
    }

    if (!response.ok) {
      throw new Error(
        `Delivery provider ${webhookConfig.providerName} rejected request with status ${response.status}.`,
      );
    }

    const providerMessageId =
      parsedPayload && typeof parsedPayload === 'object'
        ? String(
            (parsedPayload as Record<string, unknown>).message_id ||
              (parsedPayload as Record<string, unknown>).id ||
              '',
          ).trim() || null
        : null;

    return {
      providerName: webhookConfig.providerName,
      providerMessageId,
      deliveryStatus: 'delivered',
      responsePayload: parsedPayload,
    };
  }

  // ── Channel senders ──────────────────────────────────────────────────

  private async dispatchWhatsAppViaBaileys(input: DispatchInput) {
    const config = this.getBaileysConfig();
    if (!config.enabled || !config.authDir) {
      return null;
    }

    const jid = this.normalizeWhatsAppJid(input.channelType, input.targetValue);
    const baileys = await import('@whiskeysockets/baileys');
    await mkdir(config.authDir, { recursive: true });
    const { state, saveCreds } = await baileys.useMultiFileAuthState(config.authDir);
    const socket = baileys.makeWASocket({
      auth: state,
      browser: baileys.Browsers.ubuntu('Sentient Factory Alerting'),
      syncFullHistory: false,
      markOnlineOnConnect: false,
      printQRInTerminal: false,
    });

    socket.ev.on('creds.update', saveCreds);

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Baileys connection timed out. Pair the WhatsApp session first.'));
      }, 30000);

      socket.ev.on('connection.update', (update: Record<string, unknown>) => {
        const connection = String(update.connection || '');
        if (connection === 'open') {
          clearTimeout(timeout);
          resolve();
          return;
        }
        if (typeof update.qr === 'string' && update.qr.trim()) {
          this.logger.warn(
            'Baileys session requires QR pairing before WhatsApp delivery can be used.',
          );
        }
        if (connection === 'close') {
          clearTimeout(timeout);
          reject(new Error('Baileys connection closed before delivery could be sent.'));
        }
      });
    });

    try {
      const sendResult = await socket.sendMessage(jid, {
        text: [
          input.message,
          '',
          `Event Key: ${input.eventKey}`,
          `Title: ${input.eventTitle}`,
        ].join('\n'),
      });

      return {
        providerName: 'baileys',
        providerMessageId: String(sendResult?.key?.id || '').trim() || null,
        deliveryStatus: 'delivered',
        responsePayload: {
          jid,
          event_key: input.eventKey,
          message_id: sendResult?.key?.id || null,
        },
      };
    } finally {
      try {
        socket.end(undefined);
      } catch {
        // ignore socket shutdown errors
      }
    }
  }

  private async dispatchEmailViaSmtp(input: DispatchInput) {
    const config = this.getSmtpConfig();
    if (!config.host || !config.port || !config.from) {
      return null;
    }

    const transporter = this.getSmtpTransporter(config);
    const info = await transporter.sendMail({
      from: config.from,
      to: input.targetValue,
      subject: `[Alert] ${input.eventTitle}`.slice(0, 180),
      text: [
        input.message,
        '',
        `Event Key: ${input.eventKey}`,
        `Target: ${input.targetValue}`,
        `Payload: ${JSON.stringify(input.eventPayload, null, 2)}`,
      ].join('\n'),
      html: `
        <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;">
          <h2 style="margin:0 0 12px;">${this.escapeHtml(input.eventTitle)}</h2>
          <p>${this.escapeHtml(input.message)}</p>
          <p><strong>Event Key:</strong> ${this.escapeHtml(input.eventKey)}</p>
          <pre style="background:#f6f8fa;padding:12px;border-radius:8px;overflow:auto;">${this.escapeHtml(
            JSON.stringify(input.eventPayload, null, 2),
          )}</pre>
        </div>
      `,
    });

    return {
      providerName: 'smtp',
      providerMessageId: info.messageId || null,
      deliveryStatus: 'delivered',
      responsePayload: {
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
        message_id: info.messageId,
      },
    };
  }

  // ── Private helpers ──────────────────────────────────────────────────

  private getSmtpTransporter(config: { host: string; port: number; user: string; pass: string; secure: boolean; from: string }) {
    if (!this.smtpTransporter) {
      this.smtpTransporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: config.user || config.pass ? { user: config.user, pass: config.pass } : undefined,
      });
    }
    return this.smtpTransporter;
  }

  private normalizeWhatsAppJid(channelType: string, targetValue: string) {
    const normalizedTarget = targetValue.trim();
    if (!normalizedTarget) {
      throw new BadRequestException('WhatsApp target value is required.');
    }

    if (channelType === 'wa-group') {
      if (normalizedTarget.includes('@')) {
        return normalizedTarget;
      }
      if (/^\d+-\d+$/.test(normalizedTarget) || /^\d+$/.test(normalizedTarget)) {
        return `${normalizedTarget}@g.us`;
      }
      throw new BadRequestException(
        'WhatsApp group target must be a valid group JID or numeric group identifier.',
      );
    }

    if (normalizedTarget.includes('@')) {
      return normalizedTarget;
    }
    const digits = normalizedTarget.replace(/\D/g, '');
    if (!digits) {
      throw new BadRequestException(
        'WhatsApp personal target must be a phone number or WhatsApp JID.',
      );
    }
    return `${digits}@s.whatsapp.net`;
  }

  private escapeHtml(value: string) {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }
}
