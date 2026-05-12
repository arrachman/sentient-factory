import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { access, mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import nodemailer, { type Transporter } from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';
import { asJson, escapeSqlLiteral } from './dashboard.utils';
import { AlertingTriageService } from './alerting-triage.service';

/**
 * AlertingDeliveryService
 *
 * Owns the delivery pipeline: run cycle, dispatch chain, channel senders
 * (SMTP / Baileys / webhook), delivery log queries, requeue, and provider
 * config accessors (getBaileysConfig, getSmtpConfig, etc.).
 *
 * Dead-letter triage state → AlertingTriageService
 * Provider session audit/state + test-rule → AlertingProviderSessionService
 */
@Injectable()
export class AlertingDeliveryService {
  private readonly logger = new Logger(AlertingDeliveryService.name);
  private alertDeliveryRunning = false;
  private smtpTransporter: Transporter | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly alertingTriageService: AlertingTriageService,
  ) {}

  // ── Delivery cycle ───────────────────────────────────────────────────

  async runAlertDeliveryCycle(actor = 'system-delivery') {
    if (this.alertDeliveryRunning) {
      return { success: true, data: { processed_delivery_count: 0, skipped: true, results: [] } };
    }

    this.alertDeliveryRunning = true;
    try {
      const triageRecoveryConfig = await this.alertingTriageService.getAlertingTriageRecoveryConfig();
      const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
        SELECT
          d.delivery_id,
          d.event_id,
          d.rule_id,
          d.channel_type,
          d.target_value,
          d.provider_name,
          d.retry_count,
          d.max_retries,
          e.event_key,
          e.title AS event_title,
          COALESCE(e.description, '') AS event_description,
          e.event_payload,
          r.rule_name,
          COALESCE(r.message_template, '') AS message_template
        FROM public.alert_delivery_log d
        JOIN public.alert_event e ON e.event_id = d.event_id
        JOIN public.alert_rule r ON r.rule_id = d.rule_id
        WHERE d.delivery_status = 'queued'
          AND (d.next_retry_at IS NULL OR d.next_retry_at <= NOW())
        ORDER BY d.requested_at ASC, d.delivery_id ASC
        LIMIT 25
      `);

      const results: Array<Record<string, unknown>> = [];
      for (const row of rows) {
        const deliveryId = Number(row.delivery_id || 0);
        try {
          const dispatchResult = await this.dispatchAlertDelivery({
            channelType: String(row.channel_type || ''),
            targetValue: String(row.target_value || ''),
            eventKey: String(row.event_key || ''),
            eventTitle: String(row.event_title || ''),
            message:
              String(row.message_template || '').trim() ||
              String(row.event_description || '').trim() ||
              String(row.event_title || '').trim(),
            eventPayload: asJson(row.event_payload, {}),
          });

          await this.prisma.$executeRawUnsafe(`
            UPDATE public.alert_delivery_log
            SET
              provider_name = '${escapeSqlLiteral(dispatchResult.providerName)}',
              provider_message_id = ${dispatchResult.providerMessageId ? `'${escapeSqlLiteral(dispatchResult.providerMessageId)}'` : 'NULL'},
              delivery_status = '${escapeSqlLiteral(dispatchResult.deliveryStatus)}',
              response_payload = '${escapeSqlLiteral(JSON.stringify(dispatchResult.responsePayload))}'::jsonb,
              error_message = NULL,
              last_attempt_at = NOW(),
              next_retry_at = NULL,
              dead_lettered_at = NULL,
              dead_letter_reason = NULL,
              delivered_at = ${dispatchResult.deliveryStatus === 'failed' ? 'NULL' : 'NOW()'}
            WHERE delivery_id = ${deliveryId}
          `);

          let autoClosedTriage = false;
          if (triageRecoveryConfig.enabled && dispatchResult.deliveryStatus !== 'failed') {
            const triageBeforeRows = await this.prisma.$queryRawUnsafe<
              Array<Record<string, unknown>>
            >(`
              SELECT triage_status, acknowledged_at, assigned_to, note
              FROM public.alert_dead_letter_triage
              WHERE delivery_id = ${deliveryId}
              LIMIT 1
            `);
            const resolvedCount = await this.prisma.$executeRawUnsafe(`
              UPDATE public.alert_dead_letter_triage
              SET
                triage_status = 'resolved',
                note = CASE
                  WHEN COALESCE(note, '') = '' THEN 'Auto-resolved after successful delivery recovery.'
                  ELSE note || E'\\nAuto-resolved after successful delivery recovery.'
                END,
                last_action_at = NOW(),
                updated_by = '${escapeSqlLiteral(actor)}'
              WHERE delivery_id = ${deliveryId}
                AND triage_status <> 'resolved'
            `);
            autoClosedTriage = Number(resolvedCount || 0) > 0;
            if (autoClosedTriage) {
              const previous = triageBeforeRows[0];
              await this.alertingTriageService.createAlertDeadLetterTriageAudit({
                deliveryId,
                actionType: 'auto-resolve',
                previousTriageStatus: previous?.triage_status
                  ? String(previous.triage_status)
                  : null,
                nextTriageStatus: 'resolved',
                previousAcknowledgedAt: previous?.acknowledged_at
                  ? String(previous.acknowledged_at)
                  : null,
                nextAcknowledgedAt: previous?.acknowledged_at
                  ? String(previous.acknowledged_at)
                  : null,
                previousAssignedTo: previous?.assigned_to ? String(previous.assigned_to) : null,
                nextAssignedTo: previous?.assigned_to ? String(previous.assigned_to) : null,
                noteSnapshot: previous?.note
                  ? String(previous.note)
                  : 'Auto-resolved after successful delivery recovery.',
                detailPayload: {
                  trigger: 'delivery-recovery',
                },
                actor,
              });
            }
          }

          results.push({
            delivery_id: deliveryId,
            channel_type: row.channel_type,
            target_value: row.target_value,
            delivery_status: dispatchResult.deliveryStatus,
            provider_name: dispatchResult.providerName,
            auto_closed_triage: autoClosedTriage,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown delivery worker error.';
          const retryCount = Number(row.retry_count || 0);
          const maxRetries = Math.max(Number(row.max_retries || 3) || 3, 1);
          const nextRetryCount = retryCount + 1;
          const shouldRetry = nextRetryCount < maxRetries;
          const backoffMinutes = Math.min(5 * nextRetryCount, 60);
          await this.prisma.$executeRawUnsafe(`
            UPDATE public.alert_delivery_log
            SET
              delivery_status = '${shouldRetry ? 'queued' : 'dead-lettered'}',
              error_message = '${escapeSqlLiteral(message)}',
              response_payload = '${escapeSqlLiteral(
                JSON.stringify({
                  worker: 'delivery',
                  status: shouldRetry ? 'queued_for_retry' : 'dead_lettered',
                  retry_count: nextRetryCount,
                  max_retries: maxRetries,
                  retry_backoff_minutes: shouldRetry ? backoffMinutes : null,
                }),
              )}'::jsonb,
              retry_count = ${nextRetryCount},
              last_attempt_at = NOW(),
              next_retry_at = ${shouldRetry ? `NOW() + INTERVAL '${backoffMinutes} minutes'` : 'NULL'},
              dead_lettered_at = ${shouldRetry ? 'NULL' : 'NOW()'},
              dead_letter_reason = ${shouldRetry ? 'NULL' : `'${escapeSqlLiteral(message)}'`},
              delivered_at = NULL
            WHERE delivery_id = ${deliveryId}
          `);
          this.logger.error(`Alert delivery failed for log ${deliveryId}: ${message}`);
          results.push({
            delivery_id: deliveryId,
            channel_type: row.channel_type,
            target_value: row.target_value,
            delivery_status: shouldRetry ? 'queued' : 'dead-lettered',
            retry_count: nextRetryCount,
            max_retries: maxRetries,
            error_message: message,
          });
        }
      }

      if (results.length) {
        this.logger.log(`Alert delivery worker processed ${results.length} queued deliveries.`);
      }

      return {
        success: true,
        data: {
          processed_delivery_count: results.length,
          skipped: false,
          actor,
          results,
        },
      };
    } finally {
      this.alertDeliveryRunning = false;
    }
  }

  // ── Dispatch helpers ─────────────────────────────────────────────────

  private async dispatchAlertDelivery(input: {
    channelType: string;
    targetValue: string;
    eventKey: string;
    eventTitle: string;
    message: string;
    eventPayload: Record<string, unknown>;
  }) {
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

  private async dispatchWhatsAppViaBaileys(input: {
    channelType: string;
    targetValue: string;
    eventKey: string;
    eventTitle: string;
    message: string;
    eventPayload: Record<string, unknown>;
  }) {
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

  private async dispatchEmailViaSmtp(input: {
    channelType: string;
    targetValue: string;
    eventKey: string;
    eventTitle: string;
    message: string;
    eventPayload: Record<string, unknown>;
  }) {
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

  // ── Config accessors (called externally) ────────────────────────────

  getAlertDeliveryWebhookConfig(channelType: string) {
    const normalized = channelType.trim().toLowerCase();
    if (normalized === 'wa-group') {
      return {
        providerName: 'wa-group-webhook',
        url: process.env.ALERTING_WA_GROUP_WEBHOOK_URL || '',
        token: process.env.ALERTING_WA_GROUP_WEBHOOK_TOKEN || '',
      };
    }
    if (normalized === 'wa-personal') {
      return {
        providerName: 'wa-personal-webhook',
        url: process.env.ALERTING_WA_PERSONAL_WEBHOOK_URL || '',
        token: process.env.ALERTING_WA_PERSONAL_WEBHOOK_TOKEN || '',
      };
    }
    if (normalized === 'email') {
      return {
        providerName: 'email-webhook',
        url: process.env.ALERTING_EMAIL_WEBHOOK_URL || '',
        token: process.env.ALERTING_EMAIL_WEBHOOK_TOKEN || '',
      };
    }
    return {
      providerName: 'unknown-channel',
      url: '',
      token: '',
    };
  }

  getBaileysConfig() {
    const authDir = (process.env.ALERTING_WA_BAILEYS_AUTH_DIR || '').trim();
    return {
      enabled:
        String(process.env.ALERTING_WA_BAILEYS_ENABLED || '')
          .trim()
          .toLowerCase() === 'true',
      authDir: authDir ? path.resolve(authDir) : '',
    };
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
      return {
        ...health,
        pairing_required: true,
        status_label: 'missing-auth-dir',
      };
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
        .filter((fileStat) => fileStat instanceof Date)
        .sort((left, right) => right.getTime() - left.getTime())[0];

      health.last_auth_update_at = latestMtime ? latestMtime.toISOString() : null;
      health.session_ready = health.creds_present && health.auth_file_count > 0;
      health.pairing_required = !health.session_ready;
      health.status_label = health.session_ready ? 'ready' : 'pairing-required';
      return health;
    } catch {
      return {
        ...health,
        pairing_required: true,
        status_label: 'auth-dir-not-found',
      };
    }
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

  getSmtpConfig() {
    const port = Number(process.env.ALERTING_EMAIL_SMTP_PORT || process.env.SMTP_PORT || '') || 0;
    return {
      host: (process.env.ALERTING_EMAIL_SMTP_HOST || process.env.SMTP_HOST || '').trim(),
      port,
      user: (process.env.ALERTING_EMAIL_SMTP_USER || process.env.SMTP_USER || '').trim(),
      pass: (process.env.ALERTING_EMAIL_SMTP_PASS || process.env.SMTP_PASS || '').trim(),
      secure:
        String(process.env.ALERTING_EMAIL_SMTP_SECURE || process.env.SMTP_SECURE || '')
          .trim()
          .toLowerCase() === 'true' || port === 465,
      from: (
        process.env.ALERTING_EMAIL_FROM ||
        process.env.SMTP_FROM ||
        process.env.SMTP_USER ||
        ''
      ).trim(),
    };
  }

  private getSmtpTransporter(config: {
    host: string;
    port: number;
    user: string;
    pass: string;
    secure: boolean;
    from: string;
  }) {
    if (this.smtpTransporter) {
      return this.smtpTransporter;
    }

    this.smtpTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.user || config.pass ? { user: config.user, pass: config.pass } : undefined,
    });

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

  // ── Delivery logs ────────────────────────────────────────────────────

  async alertingDeliveryLogs(eventId?: string) {
    const where = ['1 = 1'];
    if (eventId) {
      where.push(`d.event_id = ${Number(eventId) || 0}`);
    }

    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        d.delivery_id,
        d.event_id,
        e.event_key,
        e.title AS event_title,
        COALESCE(rr.target_label, '') AS target_label,
        d.channel_type,
        d.target_value,
        d.provider_name,
        d.provider_message_id,
        d.delivery_status,
        d.response_payload,
        d.error_message,
        d.retry_count,
        d.max_retries,
        d.next_retry_at,
        d.last_attempt_at,
        d.dead_lettered_at,
        d.dead_letter_reason,
        d.requested_at,
        d.delivered_at
      FROM public.alert_delivery_log d
      LEFT JOIN public.alert_event e ON e.event_id = d.event_id
      LEFT JOIN public.alert_rule_recipient rr ON rr.recipient_id = d.recipient_id
      WHERE ${where.join(' AND ')}
      ORDER BY d.requested_at DESC, d.delivery_id DESC
    `);

    return {
      success: true,
      data: rows.map((row) => ({
        delivery_log_id: Number(row.delivery_id || 0),
        event_id: Number(row.event_id || 0),
        event_key: row.event_key || null,
        event_title: row.event_title || null,
        target_label: row.target_label || null,
        channel_type: row.channel_type,
        target_value: row.target_value,
        provider_key: row.provider_name || null,
        external_message_id: row.provider_message_id || null,
        delivery_status: row.delivery_status,
        error_message: row.error_message || null,
        retry_count: Number(row.retry_count || 0),
        max_retries: Number(row.max_retries || 0),
        next_retry_at: row.next_retry_at || null,
        last_attempt_at: row.last_attempt_at || null,
        dead_lettered_at: row.dead_lettered_at || null,
        dead_letter_reason: row.dead_letter_reason || null,
        queued_at: row.requested_at,
        sent_at: row.requested_at,
        delivered_at: row.delivered_at,
        response_payload: asJson(row.response_payload, {}),
      })),
    };
  }

  async requeueAlertingDeliveryLog(deliveryId: string, actor: string) {
    const normalizedDeliveryId = Number(deliveryId);
    if (!Number.isFinite(normalizedDeliveryId) || normalizedDeliveryId <= 0) {
      throw new BadRequestException('Invalid delivery id.');
    }

    const existingRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT delivery_status
      FROM public.alert_delivery_log
      WHERE delivery_id = ${normalizedDeliveryId}
      LIMIT 1
    `);

    if (!existingRows[0]) {
      throw new NotFoundException('Alert delivery log not found.');
    }

    const currentStatus = String(existingRows[0].delivery_status || '')
      .trim()
      .toLowerCase();
    if (!['failed', 'dead-lettered'].includes(currentStatus)) {
      throw new BadRequestException('Only failed or dead-lettered deliveries can be requeued.');
    }

    await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_delivery_log
      SET
        delivery_status = 'queued',
        retry_count = 0,
        next_retry_at = NOW(),
        last_attempt_at = NULL,
        error_message = NULL,
        dead_lettered_at = NULL,
        dead_letter_reason = NULL
      WHERE delivery_id = ${normalizedDeliveryId}
    `);

    const triageBeforeRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT triage_status, acknowledged_at, assigned_to, note
      FROM public.alert_dead_letter_triage
      WHERE delivery_id = ${normalizedDeliveryId}
      LIMIT 1
    `);

    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.alert_dead_letter_triage (
        delivery_id,
        triage_status,
        acknowledged_at,
        acknowledged_by,
        assigned_to,
        note,
        last_action_at,
        created_by,
        updated_by
      ) VALUES (
        ${normalizedDeliveryId},
        'requeued',
        NULL,
        NULL,
        '${escapeSqlLiteral(actor)}',
        'Delivery was manually requeued.',
        NOW(),
        '${escapeSqlLiteral(actor)}',
        '${escapeSqlLiteral(actor)}'
      )
      ON CONFLICT (delivery_id) DO UPDATE SET
        triage_status = 'requeued',
        acknowledged_at = NULL,
        acknowledged_by = NULL,
        assigned_to = '${escapeSqlLiteral(actor)}',
        note = 'Delivery was manually requeued.',
        last_action_at = NOW(),
        updated_by = '${escapeSqlLiteral(actor)}'
    `);

    const triageBefore = triageBeforeRows[0];
    await this.alertingTriageService.createAlertDeadLetterTriageAudit({
      deliveryId: normalizedDeliveryId,
      actionType: 'requeue',
      previousTriageStatus: triageBefore?.triage_status ? String(triageBefore.triage_status) : null,
      nextTriageStatus: 'requeued',
      previousAcknowledgedAt: triageBefore?.acknowledged_at
        ? String(triageBefore.acknowledged_at)
        : null,
      nextAcknowledgedAt: null,
      previousAssignedTo: triageBefore?.assigned_to ? String(triageBefore.assigned_to) : null,
      nextAssignedTo: actor,
      noteSnapshot: 'Delivery was manually requeued.',
      detailPayload: {
        trigger: 'manual-requeue',
      },
      actor,
    });

    const deliveryRun = await this.runAlertDeliveryCycle(actor);
    const result = await this.alertingDeliveryLogs();
    return {
      success: true,
      data: {
        requeued_delivery_id: normalizedDeliveryId,
        delivery_run: deliveryRun.data,
        logs: result.data,
      },
    };
  }
}
