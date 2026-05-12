import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { PrismaService } from '../prisma/prisma.service';
import { escapeSqlLiteral, asJson } from './dashboard.utils';
import { AlertingRuleService } from './alerting-rule.service';
import { AlertingDeliveryService } from './alerting-delivery.service';
import { AlertingProviderSessionService } from './alerting-provider-session.service';
import { AlertingTemplateService } from './alerting-template.service';
import { AlertingEscalationService } from './alerting-escalation.service';

@Injectable()
export class AlertingConfigService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly alertingRuleService: AlertingRuleService,
    private readonly alertingDeliveryService: AlertingDeliveryService,
    private readonly alertingProviderSessionService: AlertingProviderSessionService,
    private readonly alertingTemplateService: AlertingTemplateService,
    private readonly alertingEscalationService: AlertingEscalationService,
  ) {}

  // ---------------------------------------------------------------------------
  // Template delegation
  // ---------------------------------------------------------------------------

  async alertingTemplates(module?: string) {
    return this.alertingTemplateService.alertingTemplates(module);
  }

  async alertingTemplateDetail(templateId: string) {
    return this.alertingTemplateService.alertingTemplateDetail(templateId);
  }

  async createAlertingTemplate(body: Record<string, unknown>, actor: string) {
    return this.alertingTemplateService.createAlertingTemplate(body, actor);
  }

  async updateAlertingTemplate(templateId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingTemplateService.updateAlertingTemplate(templateId, body, actor);
  }

  async updateAlertingTemplateState(templateId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingTemplateService.updateAlertingTemplateState(templateId, body, actor);
  }

  async deleteAlertingTemplate(templateId: string, actor: string) {
    return this.alertingTemplateService.deleteAlertingTemplate(templateId, actor);
  }

  // ---------------------------------------------------------------------------
  // Escalation / saved-view / event delegation
  // ---------------------------------------------------------------------------

  async alertingEscalationPolicies(module?: string, targetType?: string) {
    return this.alertingEscalationService.alertingEscalationPolicies(module, targetType);
  }

  async createAlertingEscalationPolicy(body: Record<string, unknown>, actor: string) {
    return this.alertingEscalationService.createAlertingEscalationPolicy(body, actor);
  }

  async updateAlertingEscalationPolicy(policyId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingEscalationService.updateAlertingEscalationPolicy(policyId, body, actor);
  }

  async updateAlertingEscalationPolicyState(policyId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingEscalationService.updateAlertingEscalationPolicyState(policyId, body, actor);
  }

  async deleteAlertingEscalationPolicy(policyId: string, actor: string) {
    return this.alertingEscalationService.deleteAlertingEscalationPolicy(policyId, actor);
  }

  async alertingTriageSavedViews(actor: string) {
    return this.alertingEscalationService.alertingTriageSavedViews(actor);
  }

  async createAlertingTriageSavedView(body: Record<string, unknown>, actor: string) {
    return this.alertingEscalationService.createAlertingTriageSavedView(body, actor);
  }

  async updateAlertingTriageSavedView(viewId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingEscalationService.updateAlertingTriageSavedView(viewId, body, actor);
  }

  async updateAlertingTriageSavedViewState(viewId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingEscalationService.updateAlertingTriageSavedViewState(viewId, body, actor);
  }

  async deleteAlertingTriageSavedView(viewId: string, actor: string) {
    return this.alertingEscalationService.deleteAlertingTriageSavedView(viewId, actor);
  }

  async updateAlertingEvent(eventId: string, body: { status?: string }, actor: string) {
    return this.alertingEscalationService.updateAlertingEvent(eventId, body, actor);
  }

  // ---------------------------------------------------------------------------
  // Channels
  // ---------------------------------------------------------------------------

  async alertingChannels(channelType?: string) {
    const where = ['deleted_at IS NULL'];
    if (channelType && channelType !== 'all') {
      where.push(`channel_type = '${escapeSqlLiteral(channelType)}'`);
    }

    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        channel_id, channel_key, channel_type, label, target_value,
        ownership_type, owner_label, status, is_active, metadata, created_at
      FROM public.alert_notification_channel
      WHERE ${where.join(' AND ')}
      ORDER BY created_at DESC, channel_id DESC
    `);

    return {
      success: true,
      data: rows.map((row) => ({
        channel_id: Number(row.channel_id || 0),
        channel_key: row.channel_key,
        channel_type: row.channel_type,
        label: row.label,
        target_value: row.target_value,
        ownership_type: row.ownership_type,
        owner_label: row.owner_label || null,
        status: row.status,
        is_active: Boolean(row.is_active),
        metadata: asJson(row.metadata, {}),
        created_at: row.created_at,
      })),
    };
  }

  validateAlertChannelTarget(channelType: string, targetValue: string) {
    const normalizedType = channelType.trim().toLowerCase();
    const normalizedTarget = targetValue.trim();
    if (!normalizedType || !normalizedTarget) {
      return;
    }

    if (normalizedType === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(normalizedTarget)) {
        throw new BadRequestException('Email channel target must be a valid email address.');
      }
      return;
    }

    if (normalizedType === 'wa-personal') {
      const digits = normalizedTarget.replace(/\D/g, '');
      if (!normalizedTarget.includes('@') && digits.length < 8) {
        throw new BadRequestException(
          'WhatsApp personal target must be a phone number or WhatsApp JID.',
        );
      }
      return;
    }

    if (normalizedType === 'wa-group') {
      if (
        normalizedTarget.includes('@g.us') ||
        /^\d+-\d+$/.test(normalizedTarget) ||
        /^\d+$/.test(normalizedTarget)
      ) {
        return;
      }
      throw new BadRequestException(
        'WhatsApp group target must be a valid group JID or numeric group identifier.',
      );
    }
  }

  async createAlertingChannel(body: Record<string, unknown>, actor: string) {
    const channelType = String(body.channelType || body.channel_type || '').trim();
    const label = String(body.label || '').trim();
    const targetValue = String(body.targetValue || body.target_value || '').trim();
    if (!channelType || !label || !targetValue) {
      throw new BadRequestException('channelType, label, and targetValue are required.');
    }

    const ownershipType = String(body.ownershipType || body.ownership_type || 'standalone').trim();
    const ownerLabel = String(body.ownerLabel || body.owner_label || '').trim();
    const teamKey = String(body.teamKey || body.team_key || '').trim();
    const status = String(body.status || 'draft').trim();
    const channelKey = `channel-${this.alertingRuleService.slugify(label)}-${Date.now()}`;
    const metadata = teamKey ? { team: teamKey } : {};

    this.validateAlertChannelTarget(channelType, targetValue);

    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.alert_notification_channel (
        channel_key, channel_type, label, target_value, ownership_type, owner_label,
        status, metadata, is_active, created_by, updated_by
      ) VALUES (
        '${escapeSqlLiteral(channelKey)}',
        '${escapeSqlLiteral(channelType)}',
        '${escapeSqlLiteral(label)}',
        '${escapeSqlLiteral(targetValue)}',
        '${escapeSqlLiteral(ownershipType || 'standalone')}',
        ${ownerLabel ? `'${escapeSqlLiteral(ownerLabel)}'` : 'NULL'},
        '${escapeSqlLiteral(status || 'draft')}',
        '${escapeSqlLiteral(JSON.stringify(metadata))}'::jsonb,
        TRUE,
        '${escapeSqlLiteral(actor)}',
        '${escapeSqlLiteral(actor)}'
      )
    `);

    return this.alertingChannels(channelType);
  }

  async updateAlertingChannel(channelId: string, body: Record<string, unknown>, actor: string) {
    const normalizedChannelId = Number(channelId);
    if (!Number.isFinite(normalizedChannelId) || normalizedChannelId <= 0) {
      throw new BadRequestException('Invalid channel id.');
    }

    const channelType = String(body.channelType || body.channel_type || '').trim();
    const label = String(body.label || '').trim();
    const targetValue = String(body.targetValue || body.target_value || '').trim();
    if (!channelType || !label || !targetValue) {
      throw new BadRequestException('channelType, label, and targetValue are required.');
    }

    const ownershipType = String(body.ownershipType || body.ownership_type || 'standalone').trim();
    const ownerLabel = String(body.ownerLabel || body.owner_label || '').trim();
    const teamKey = String(body.teamKey || body.team_key || '').trim();
    const status = String(body.status || 'draft').trim();
    const metadata = teamKey ? { team: teamKey } : {};

    this.validateAlertChannelTarget(channelType, targetValue);

    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_notification_channel SET
        channel_type = '${escapeSqlLiteral(channelType)}',
        label = '${escapeSqlLiteral(label)}',
        target_value = '${escapeSqlLiteral(targetValue)}',
        ownership_type = '${escapeSqlLiteral(ownershipType || 'standalone')}',
        owner_label = ${ownerLabel ? `'${escapeSqlLiteral(ownerLabel)}'` : 'NULL'},
        status = '${escapeSqlLiteral(status || 'draft')}',
        metadata = '${escapeSqlLiteral(JSON.stringify(metadata))}'::jsonb,
        updated_by = '${escapeSqlLiteral(actor)}'
      WHERE channel_id = ${normalizedChannelId} AND deleted_at IS NULL
    `);

    if (!updatedCount) {
      throw new NotFoundException('Alert notification channel not found.');
    }

    return this.alertingChannels(channelType);
  }

  async updateAlertingChannelState(channelId: string, body: Record<string, unknown>, actor: string) {
    const normalizedChannelId = Number(channelId);
    if (!Number.isFinite(normalizedChannelId) || normalizedChannelId <= 0) {
      throw new BadRequestException('Invalid channel id.');
    }

    const isActive = Boolean(body.isActive ?? body.is_active);
    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_notification_channel SET
        is_active = ${isActive ? 'TRUE' : 'FALSE'},
        updated_by = '${escapeSqlLiteral(actor)}'
      WHERE channel_id = ${normalizedChannelId} AND deleted_at IS NULL
    `);

    if (!updatedCount) {
      throw new NotFoundException('Alert notification channel not found.');
    }

    return this.alertingChannels('all');
  }

  async deleteAlertingChannel(channelId: string, actor: string) {
    const normalizedChannelId = Number(channelId);
    if (!Number.isFinite(normalizedChannelId) || normalizedChannelId <= 0) {
      throw new BadRequestException('Invalid channel id.');
    }

    const existing = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT channel_type FROM public.alert_notification_channel
      WHERE channel_id = ${normalizedChannelId} AND deleted_at IS NULL LIMIT 1
    `);

    if (!existing[0]) {
      throw new NotFoundException('Alert notification channel not found.');
    }

    await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_notification_channel SET
        is_active = FALSE, deleted_at = NOW(), updated_by = '${escapeSqlLiteral(actor)}'
      WHERE channel_id = ${normalizedChannelId} AND deleted_at IS NULL
    `);

    return this.alertingChannels(String(existing[0].channel_type || 'all'));
  }

  async testAlertingChannel(channelId: string, actor: string) {
    const normalizedChannelId = Number(channelId);
    if (!Number.isFinite(normalizedChannelId) || normalizedChannelId <= 0) {
      throw new BadRequestException('Invalid channel id.');
    }

    const channels = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT channel_id, channel_key, channel_type, label, target_value
      FROM public.alert_notification_channel
      WHERE channel_id = ${normalizedChannelId} AND deleted_at IS NULL AND is_active = TRUE
      LIMIT 1
    `);

    const channel = channels[0];
    if (!channel) {
      throw new NotFoundException('Alert notification channel not found.');
    }

    const testRule = await this.alertingProviderSessionService.ensureAlertingTestRule(actor);
    const eventKey = `evt-test-channel-${normalizedChannelId}-${Date.now()}`;
    const title = `Test send for ${String(channel.label || 'channel')}`;
    const message = `Test notification for ${String(channel.label || 'channel')} via ${String(channel.channel_type || '')}.`;

    const insertedEvents = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      INSERT INTO public.alert_event (
        event_key, rule_id, metric_id, snapshot_id, title, description, severity,
        status, source_ref, event_payload, detected_at, created_by, updated_by
      ) VALUES (
        '${escapeSqlLiteral(eventKey)}',
        ${testRule.rule_id}, NULL, NULL,
        '${escapeSqlLiteral(title)}',
        '${escapeSqlLiteral(message)}',
        'low', 'open',
        '${escapeSqlLiteral(String(channel.channel_key || 'manual-test'))}',
        '${escapeSqlLiteral(JSON.stringify({
          test_send: true,
          channel_id: normalizedChannelId,
          channel_type: String(channel.channel_type || ''),
          target_value: String(channel.target_value || ''),
        }))}'::jsonb,
        NOW(),
        '${escapeSqlLiteral(actor)}',
        '${escapeSqlLiteral(actor)}'
      )
      RETURNING event_id
    `);

    const eventId = Number(insertedEvents[0]?.event_id || 0);
    const insertedDeliveries = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      INSERT INTO public.alert_delivery_log (
        event_id, rule_id, recipient_id, channel_type, target_value, provider_name,
        delivery_status, response_payload, requested_at, delivered_at
      ) VALUES (
        ${eventId}, ${testRule.rule_id}, NULL,
        '${escapeSqlLiteral(String(channel.channel_type || ''))}',
        '${escapeSqlLiteral(String(channel.target_value || ''))}',
        'test-send', 'queued', '{"trigger":"test-send"}'::jsonb, NOW(), NULL
      )
      RETURNING delivery_id
    `);

    const deliveryRun = await this.alertingDeliveryService.runAlertDeliveryCycle(actor);

    return {
      success: true,
      data: {
        channel_id: normalizedChannelId,
        event_id: eventId,
        delivery_id: Number(insertedDeliveries[0]?.delivery_id || 0),
        delivery_run: deliveryRun.data,
      },
    };
  }

  // ---------------------------------------------------------------------------
  // Settings
  // ---------------------------------------------------------------------------

  async alertingSettings() {
    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT setting_id, setting_key, setting_group, label, value_text, value_json,
        description, is_active
      FROM public.alert_runtime_setting
      WHERE is_active = TRUE
      ORDER BY setting_group, setting_key
    `);

    return {
      success: true,
      data: rows.map((row) => ({
        setting_id: Number(row.setting_id || 0),
        setting_key: row.setting_key,
        setting_group: row.setting_group,
        label: row.label,
        value_text: row.value_text || null,
        value_json: asJson(row.value_json, {}),
        description: row.description || null,
        is_active: Boolean(row.is_active),
      })),
    };
  }

  async updateAlertingSetting(settingKey: string, body: Record<string, unknown>, actor: string) {
    const normalizedSettingKey = String(settingKey || '').trim();
    if (!normalizedSettingKey) {
      throw new BadRequestException('Invalid setting key.');
    }

    const valueText = typeof body.valueText === 'string'
      ? body.valueText.trim()
      : typeof body.value_text === 'string' ? body.value_text.trim() : '';
    const valueJson = body.valueJson && typeof body.valueJson === 'object'
      ? body.valueJson
      : body.value_json && typeof body.value_json === 'object' ? body.value_json : {};

    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_runtime_setting SET
        value_text = ${valueText ? `'${escapeSqlLiteral(valueText)}'` : 'NULL'},
        value_json = '${escapeSqlLiteral(JSON.stringify(valueJson))}'::jsonb,
        updated_by = '${escapeSqlLiteral(actor)}'
      WHERE setting_key = '${escapeSqlLiteral(normalizedSettingKey)}' AND is_active = TRUE
    `);

    if (!updatedCount) {
      throw new NotFoundException('Alert runtime setting not found.');
    }

    return this.alertingSettings();
  }

  // ---------------------------------------------------------------------------
  // Baileys pairing
  // ---------------------------------------------------------------------------

  async alertingBaileysPairing(body: { phoneNumber?: string; phone_number?: string }, actor: string) {
    const config = this.getBaileysConfig();
    const requestedPhoneNumber = String(body.phoneNumber || body.phone_number || '').replace(/\D/g, '').trim();
    const pairingMode = requestedPhoneNumber ? 'pairing-code' : 'qr';

    if (!config.enabled || !config.authDir) {
      await this.alertingProviderSessionService.createAlertProviderSessionAudit({
        providerName: 'baileys', channelType: 'wa-group', actionType: 'pairing-start',
        status: 'failed', pairingMode, phoneNumber: requestedPhoneNumber || null,
        authDir: config.authDir || null,
        detailPayload: { requested_phone_number: requestedPhoneNumber || null, enabled: config.enabled },
        errorMessage: 'Baileys is not enabled or auth dir is not configured.', actor,
      });
      await this.alertingProviderSessionService.upsertAlertProviderSessionState({
        providerName: 'baileys', channelType: 'wa-group', sessionKey: 'baileys-wa-group',
        sessionStatus: 'disabled', pairingMode, phoneNumber: requestedPhoneNumber || null,
        authDir: config.authDir || null,
        statusMessage: 'Baileys is not enabled or auth dir is not configured.',
        detailPayload: { requested_phone_number: requestedPhoneNumber || null, enabled: config.enabled },
        lastPairingStartedAt: new Date(), lastPairingResultAt: new Date(),
        lastDisconnectedAt: new Date(), actor,
      });
      throw new BadRequestException('Baileys is not enabled or auth dir is not configured.');
    }

    await this.alertingProviderSessionService.createAlertProviderSessionAudit({
      providerName: 'baileys', channelType: 'wa-group', actionType: 'pairing-start',
      status: 'captured', pairingMode, phoneNumber: requestedPhoneNumber || null,
      authDir: config.authDir || null,
      detailPayload: { requested_phone_number: requestedPhoneNumber || null, enabled: config.enabled },
      actor,
    });
    await this.alertingProviderSessionService.upsertAlertProviderSessionState({
      providerName: 'baileys', channelType: 'wa-group', sessionKey: 'baileys-wa-group',
      sessionStatus: 'pairing-in-progress', pairingMode,
      phoneNumber: requestedPhoneNumber || null, authDir: config.authDir || null,
      statusMessage: 'Baileys pairing flow started.',
      detailPayload: { requested_phone_number: requestedPhoneNumber || null },
      lastPairingStartedAt: new Date(), actor,
    });

    const baileys = await import('@whiskeysockets/baileys');
    await mkdir(config.authDir, { recursive: true });
    const { state, saveCreds } = await baileys.useMultiFileAuthState(config.authDir);

    if (state.creds?.registered) {
      return {
        success: true,
        data: { mode: 'already-registered', pairing_required: false, message: 'Baileys session is already registered.' },
      };
    }

    const socket = baileys.makeWASocket({
      auth: state,
      browser: baileys.Browsers.ubuntu('Sentient Factory Alerting'),
      syncFullHistory: false, markOnlineOnConnect: false, printQRInTerminal: false,
    });

    socket.ev.on('creds.update', saveCreds);

    try {
      const result = await new Promise<{
        mode: 'pairing-code' | 'qr' | 'connected';
        pairing_required: boolean;
        pairing_code?: string;
        qr?: string;
        message: string;
      }>((resolve, reject) => {
        let settled = false;
        const finish = (handler: () => void) => {
          if (settled) return;
          settled = true;
          clearTimeout(timeout);
          handler();
        };

        const timeout = setTimeout(() => {
          finish(() => reject(new Error('Baileys pairing timed out before QR or pairing code was generated.')));
        }, 30000);

        socket.ev.on('connection.update', (update: Record<string, unknown>) => {
          const qr = typeof update.qr === 'string' ? update.qr.trim() : '';
          const connection = String(update.connection || '');
          if (qr) {
            finish(() => resolve({ mode: 'qr', pairing_required: true, qr, message: 'Scan the QR token with WhatsApp to complete pairing.' }));
            return;
          }
          if (connection === 'open') {
            finish(() => resolve({ mode: 'connected', pairing_required: false, message: 'Baileys session connected successfully.' }));
            return;
          }
          if (connection === 'close') {
            finish(() => reject(new Error('Baileys connection closed before pairing data was generated.')));
          }
        });

        if (requestedPhoneNumber) {
          void socket.requestPairingCode(requestedPhoneNumber)
            .then((code: string) => {
              const normalizedCode = String(code || '').trim();
              if (!normalizedCode) throw new Error('Baileys returned an empty pairing code.');
              finish(() => resolve({
                mode: 'pairing-code', pairing_required: true,
                pairing_code: normalizedCode,
                message: `Use this pairing code for ${requestedPhoneNumber}.`,
              }));
            })
            .catch((error: unknown) => {
              finish(() => reject(error instanceof Error ? error : new Error('Failed to request Baileys pairing code.')));
            });
        }
      });

      await this.alertingProviderSessionService.createAlertProviderSessionAudit({
        providerName: 'baileys', channelType: 'wa-group', actionType: 'pairing-result',
        status: result.pairing_required ? 'warning' : 'success',
        pairingMode: result.mode, phoneNumber: requestedPhoneNumber || null,
        authDir: config.authDir || null, detailPayload: result, actor,
      });
      await this.alertingProviderSessionService.upsertAlertProviderSessionState({
        providerName: 'baileys', channelType: 'wa-group', sessionKey: 'baileys-wa-group',
        sessionStatus: result.pairing_required ? 'pairing-required' : 'ready',
        pairingMode: result.mode, phoneNumber: requestedPhoneNumber || null,
        authDir: config.authDir || null, statusMessage: result.message,
        detailPayload: result as unknown as Record<string, unknown>,
        lastPairingResultAt: new Date(),
        lastConnectedAt: result.pairing_required ? null : new Date(),
        lastDisconnectedAt: result.pairing_required ? new Date() : null,
        actor,
      });
      return { success: true, data: result };
    } catch (error) {
      await this.alertingProviderSessionService.createAlertProviderSessionAudit({
        providerName: 'baileys', channelType: 'wa-group', actionType: 'pairing-result',
        status: 'failed', pairingMode, phoneNumber: requestedPhoneNumber || null,
        authDir: config.authDir || null,
        detailPayload: { requested_phone_number: requestedPhoneNumber || null },
        errorMessage: error instanceof Error ? error.message : 'Unknown pairing error.', actor,
      });
      await this.alertingProviderSessionService.upsertAlertProviderSessionState({
        providerName: 'baileys', channelType: 'wa-group', sessionKey: 'baileys-wa-group',
        sessionStatus: 'error', pairingMode, phoneNumber: requestedPhoneNumber || null,
        authDir: config.authDir || null,
        statusMessage: error instanceof Error ? error.message : 'Unknown pairing error.',
        detailPayload: { requested_phone_number: requestedPhoneNumber || null },
        lastPairingResultAt: new Date(), lastDisconnectedAt: new Date(), actor,
      });
      throw error;
    } finally {
      try { socket.end(undefined); } catch { /* ignore */ }
    }
  }

  private getBaileysConfig() {
    const authDir = (process.env.ALERTING_WA_BAILEYS_AUTH_DIR || '').trim();
    return {
      enabled: String(process.env.ALERTING_WA_BAILEYS_ENABLED || '').trim().toLowerCase() === 'true',
      authDir: authDir ? path.resolve(authDir) : '',
    };
  }
}
