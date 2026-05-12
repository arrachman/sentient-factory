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

@Injectable()
export class AlertingConfigService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly alertingRuleService: AlertingRuleService,
    private readonly alertingDeliveryService: AlertingDeliveryService,
  ) {}

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

  async validateAlertTemplateSource(sourceType: string, sourceRef: string) {
    if (!sourceType || !sourceRef) {
      return;
    }

    if (sourceType === 'business-metric') {
      const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
        SELECT metric_id FROM public.metric_business_registry
        WHERE metric_key = '${escapeSqlLiteral(sourceRef)}'
          AND deleted_at IS NULL AND is_active = TRUE LIMIT 1
      `);
      if (!rows[0]) {
        throw new BadRequestException(
          `Template source_ref "${sourceRef}" was not found in metric_business_registry.`,
        );
      }
    }

    if (sourceType === 'system-metric') {
      const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
        SELECT system_metric_id FROM public.metric_system_registry
        WHERE metric_key = '${escapeSqlLiteral(sourceRef)}'
          AND deleted_at IS NULL AND is_active = TRUE LIMIT 1
      `);
      if (!rows[0]) {
        throw new BadRequestException(
          `Template source_ref "${sourceRef}" was not found in metric_system_registry.`,
        );
      }
    }
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

  async alertingTemplates(module?: string) {
    const where = ['deleted_at IS NULL'];
    if (module && module !== 'all') {
      where.push(`module_key = '${escapeSqlLiteral(module)}'`);
    }

    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        template_id, template_key, name, description, module_key, severity,
        recommended_channels, default_recipients, source_type, source_ref,
        schedule_value, condition_summary, message_template, metadata,
        is_default, is_active, sort_order, created_at
      FROM public.alert_template
      WHERE ${where.join(' AND ')}
      ORDER BY is_default DESC, sort_order, created_at DESC, template_id DESC
    `);

    return {
      success: true,
      data: rows.map((row) => ({
        template_id: Number(row.template_id || 0),
        template_key: row.template_key,
        name: row.name,
        description: row.description || null,
        module_key: row.module_key,
        severity: row.severity,
        recommended_channels: asJson(row.recommended_channels, []),
        default_recipients: asJson(row.default_recipients, []),
        source_type: row.source_type || null,
        source_ref: row.source_ref || null,
        schedule_value: row.schedule_value || null,
        condition_summary: row.condition_summary || null,
        message_template: row.message_template || null,
        metadata: asJson(row.metadata, {}),
        is_default: Boolean(row.is_default),
        is_active: Boolean(row.is_active),
        sort_order: Number(row.sort_order || 0),
        created_at: row.created_at,
      })),
    };
  }

  async createAlertingTemplate(body: Record<string, unknown>, actor: string) {
    const name = String(body.name || '').trim();
    const moduleKey = String(body.moduleKey || body.module_key || '').trim();
    const severity = String(body.severity || 'medium').trim().toLowerCase();
    if (!name || !moduleKey) {
      throw new BadRequestException('name and moduleKey are required.');
    }

    const description = String(body.description || '').trim();
    const sourceType = String(body.sourceType || body.source_type || '').trim();
    const sourceRef = String(body.sourceRef || body.source_ref || '').trim();
    const scheduleValue = String(body.scheduleValue || body.schedule_value || '').trim();
    const conditionSummary = String(body.conditionSummary || body.condition_summary || '').trim();
    const messageTemplate = String(body.messageTemplate || body.message_template || '').trim();
    const recommendedChannels = Array.isArray(body.recommendedChannels)
      ? body.recommendedChannels
      : Array.isArray(body.recommended_channels)
        ? body.recommended_channels
        : [];
    const defaultRecipients = Array.isArray(body.defaultRecipients)
      ? body.defaultRecipients
      : Array.isArray(body.default_recipients)
        ? body.default_recipients
        : [];
    const isDefault = Boolean(body.isDefault ?? body.is_default);
    const templateKey = `template-${this.alertingRuleService.slugify(name)}-${Date.now()}`;

    await this.validateAlertTemplateSource(sourceType, sourceRef);

    if (isDefault) {
      await this.prisma.$executeRawUnsafe(`
        UPDATE public.alert_template SET
          is_default = FALSE, updated_by = '${escapeSqlLiteral(actor)}'
        WHERE module_key = '${escapeSqlLiteral(moduleKey)}' AND deleted_at IS NULL
      `);
    }

    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.alert_template (
        template_key, name, description, module_key, severity, recommended_channels,
        default_recipients, source_type, source_ref, schedule_value, condition_summary,
        message_template, metadata, is_default, is_active, created_by, updated_by
      ) VALUES (
        '${escapeSqlLiteral(templateKey)}',
        '${escapeSqlLiteral(name)}',
        ${description ? `'${escapeSqlLiteral(description)}'` : 'NULL'},
        '${escapeSqlLiteral(moduleKey)}',
        '${escapeSqlLiteral(severity || 'medium')}',
        '${escapeSqlLiteral(JSON.stringify(recommendedChannels))}'::jsonb,
        '${escapeSqlLiteral(JSON.stringify(defaultRecipients))}'::jsonb,
        ${sourceType ? `'${escapeSqlLiteral(sourceType)}'` : 'NULL'},
        ${sourceRef ? `'${escapeSqlLiteral(sourceRef)}'` : 'NULL'},
        ${scheduleValue ? `'${escapeSqlLiteral(scheduleValue)}'` : 'NULL'},
        ${conditionSummary ? `'${escapeSqlLiteral(conditionSummary)}'` : 'NULL'},
        ${messageTemplate ? `'${escapeSqlLiteral(messageTemplate)}'` : 'NULL'},
        '{}'::jsonb,
        ${isDefault ? 'TRUE' : 'FALSE'},
        TRUE,
        '${escapeSqlLiteral(actor)}',
        '${escapeSqlLiteral(actor)}'
      )
    `);

    return this.alertingTemplates(moduleKey);
  }

  async alertingTemplateDetail(templateId: string) {
    const normalizedTemplateId = Number(templateId);
    if (!Number.isFinite(normalizedTemplateId) || normalizedTemplateId <= 0) {
      throw new BadRequestException('Invalid template id.');
    }

    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        template_id, template_key, name, description, module_key, severity,
        recommended_channels, default_recipients, source_type, source_ref,
        schedule_value, condition_summary, message_template, metadata,
        is_default, is_active, sort_order, created_at
      FROM public.alert_template
      WHERE deleted_at IS NULL AND template_id = ${normalizedTemplateId}
      LIMIT 1
    `);

    if (!rows[0]) {
      throw new NotFoundException('Alert template not found.');
    }

    return {
      success: true,
      data: {
        template_id: Number(rows[0].template_id || 0),
        template_key: rows[0].template_key,
        name: rows[0].name,
        description: rows[0].description || null,
        module_key: rows[0].module_key,
        severity: rows[0].severity,
        recommended_channels: asJson(rows[0].recommended_channels, []),
        default_recipients: asJson(rows[0].default_recipients, []),
        source_type: rows[0].source_type || null,
        source_ref: rows[0].source_ref || null,
        schedule_value: rows[0].schedule_value || null,
        condition_summary: rows[0].condition_summary || null,
        message_template: rows[0].message_template || null,
        metadata: asJson(rows[0].metadata, {}),
        is_default: Boolean(rows[0].is_default),
        is_active: Boolean(rows[0].is_active),
        sort_order: Number(rows[0].sort_order || 0),
        created_at: rows[0].created_at,
      },
    };
  }

  async updateAlertingTemplate(templateId: string, body: Record<string, unknown>, actor: string) {
    const normalizedTemplateId = Number(templateId);
    if (!Number.isFinite(normalizedTemplateId) || normalizedTemplateId <= 0) {
      throw new BadRequestException('Invalid template id.');
    }

    const name = String(body.name || '').trim();
    const moduleKey = String(body.moduleKey || body.module_key || '').trim();
    const severity = String(body.severity || 'medium').trim().toLowerCase();
    if (!name || !moduleKey) {
      throw new BadRequestException('name and moduleKey are required.');
    }

    const description = String(body.description || '').trim();
    const sourceType = String(body.sourceType || body.source_type || '').trim();
    const sourceRef = String(body.sourceRef || body.source_ref || '').trim();
    const scheduleValue = String(body.scheduleValue || body.schedule_value || '').trim();
    const conditionSummary = String(body.conditionSummary || body.condition_summary || '').trim();
    const messageTemplate = String(body.messageTemplate || body.message_template || '').trim();
    const recommendedChannels = Array.isArray(body.recommendedChannels)
      ? body.recommendedChannels
      : Array.isArray(body.recommended_channels) ? body.recommended_channels : [];
    const defaultRecipients = Array.isArray(body.defaultRecipients)
      ? body.defaultRecipients
      : Array.isArray(body.default_recipients) ? body.default_recipients : [];
    const isDefault = Boolean(body.isDefault ?? body.is_default);

    await this.validateAlertTemplateSource(sourceType, sourceRef);

    if (isDefault) {
      await this.prisma.$executeRawUnsafe(`
        UPDATE public.alert_template SET
          is_default = FALSE, updated_by = '${escapeSqlLiteral(actor)}'
        WHERE module_key = '${escapeSqlLiteral(moduleKey)}'
          AND template_id <> ${normalizedTemplateId} AND deleted_at IS NULL
      `);
    }

    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_template SET
        name = '${escapeSqlLiteral(name)}',
        description = ${description ? `'${escapeSqlLiteral(description)}'` : 'NULL'},
        module_key = '${escapeSqlLiteral(moduleKey)}',
        severity = '${escapeSqlLiteral(severity || 'medium')}',
        recommended_channels = '${escapeSqlLiteral(JSON.stringify(recommendedChannels))}'::jsonb,
        default_recipients = '${escapeSqlLiteral(JSON.stringify(defaultRecipients))}'::jsonb,
        source_type = ${sourceType ? `'${escapeSqlLiteral(sourceType)}'` : 'NULL'},
        source_ref = ${sourceRef ? `'${escapeSqlLiteral(sourceRef)}'` : 'NULL'},
        schedule_value = ${scheduleValue ? `'${escapeSqlLiteral(scheduleValue)}'` : 'NULL'},
        condition_summary = ${conditionSummary ? `'${escapeSqlLiteral(conditionSummary)}'` : 'NULL'},
        message_template = ${messageTemplate ? `'${escapeSqlLiteral(messageTemplate)}'` : 'NULL'},
        is_default = ${isDefault ? 'TRUE' : 'FALSE'},
        updated_by = '${escapeSqlLiteral(actor)}'
      WHERE template_id = ${normalizedTemplateId} AND deleted_at IS NULL
    `);

    if (!updatedCount) {
      throw new NotFoundException('Alert template not found.');
    }

    return this.alertingTemplates(moduleKey);
  }

  async updateAlertingTemplateState(templateId: string, body: Record<string, unknown>, actor: string) {
    const normalizedTemplateId = Number(templateId);
    if (!Number.isFinite(normalizedTemplateId) || normalizedTemplateId <= 0) {
      throw new BadRequestException('Invalid template id.');
    }

    const isActive = Boolean(body.isActive ?? body.is_active);
    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_template SET
        is_active = ${isActive ? 'TRUE' : 'FALSE'},
        updated_by = '${escapeSqlLiteral(actor)}'
      WHERE template_id = ${normalizedTemplateId} AND deleted_at IS NULL
    `);

    if (!updatedCount) {
      throw new NotFoundException('Alert template not found.');
    }

    return this.alertingTemplates('all');
  }

  async deleteAlertingTemplate(templateId: string, actor: string) {
    const normalizedTemplateId = Number(templateId);
    if (!Number.isFinite(normalizedTemplateId) || normalizedTemplateId <= 0) {
      throw new BadRequestException('Invalid template id.');
    }

    const existing = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT module_key FROM public.alert_template
      WHERE template_id = ${normalizedTemplateId} AND deleted_at IS NULL LIMIT 1
    `);

    if (!existing[0]) {
      throw new NotFoundException('Alert template not found.');
    }

    await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_template SET
        is_active = FALSE, deleted_at = NOW(), updated_by = '${escapeSqlLiteral(actor)}'
      WHERE template_id = ${normalizedTemplateId} AND deleted_at IS NULL
    `);

    return this.alertingTemplates(String(existing[0].module_key || 'all'));
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

    const testRule = await this.alertingDeliveryService.ensureAlertingTestRule(actor);
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

  async alertingEscalationPolicies(module?: string, targetType?: string) {
    const where = ['deleted_at IS NULL'];
    if (module && module !== 'all') {
      where.push(`module_key = '${escapeSqlLiteral(module)}'`);
    }
    if (targetType && targetType !== 'all') {
      where.push(`target_type = '${escapeSqlLiteral(targetType)}'`);
    }

    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT policy_id, module_key, escalation_level, target_type, target_ref,
        priority, is_active, metadata, created_at
      FROM public.alert_triage_escalation_policy
      WHERE ${where.join(' AND ')}
      ORDER BY module_key, escalation_level, priority, created_at DESC, policy_id DESC
    `);

    return {
      success: true,
      data: rows.map((row) => ({
        policy_id: Number(row.policy_id || 0),
        module_key: String(row.module_key || ''),
        escalation_level: String(row.escalation_level || ''),
        target_type: String(row.target_type || ''),
        target_ref: String(row.target_ref || ''),
        priority: Number(row.priority || 0),
        is_active: Boolean(row.is_active),
        metadata: asJson(row.metadata, {}),
        created_at: row.created_at,
      })),
    };
  }

  async validateAlertingEscalationTarget(targetType: string, targetRef: string) {
    if (!targetType || !targetRef) {
      throw new BadRequestException('targetType and targetRef are required.');
    }

    if (targetType === 'channel') {
      const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
        SELECT channel_id FROM public.alert_notification_channel
        WHERE channel_key = '${escapeSqlLiteral(targetRef)}' AND deleted_at IS NULL LIMIT 1
      `);
      if (!rows[0]) {
        throw new BadRequestException(
          `Escalation target_ref "${targetRef}" was not found in alert_notification_channel.`,
        );
      }
    } else if (targetType === 'role') {
      const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
        SELECT role_id FROM public.alert_routing_role
        WHERE role_key = '${escapeSqlLiteral(targetRef)}' AND is_active = TRUE LIMIT 1
      `);
      if (!rows[0]) {
        throw new BadRequestException(
          `Escalation target_ref "${targetRef}" was not found in alert_routing_role.`,
        );
      }
    } else if (targetType === 'team') {
      const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
        SELECT team_id FROM public.alert_routing_team
        WHERE team_key = '${escapeSqlLiteral(targetRef)}' AND is_active = TRUE LIMIT 1
      `);
      if (!rows[0]) {
        throw new BadRequestException(
          `Escalation target_ref "${targetRef}" was not found in alert_routing_team.`,
        );
      }
    }
  }

  async createAlertingEscalationPolicy(body: Record<string, unknown>, actor: string) {
    const moduleKey = String(body.moduleKey || body.module_key || '').trim().toLowerCase();
    const escalationLevel = String(body.escalationLevel || body.escalation_level || '').trim().toLowerCase();
    const targetType = String(body.targetType || body.target_type || 'channel').trim().toLowerCase();
    const targetRef = String(body.targetRef || body.target_ref || '').trim();
    const priority = Number.parseInt(String(body.priority ?? 10), 10);

    if (!moduleKey || !escalationLevel || !targetRef) {
      throw new BadRequestException('moduleKey, escalationLevel, and targetRef are required.');
    }
    if (!['all', 'sales', 'finance', 'warehouse', 'purchasing'].includes(moduleKey)) {
      throw new BadRequestException('moduleKey must be all, sales, finance, warehouse, or purchasing.');
    }
    if (!['warning', 'critical'].includes(escalationLevel)) {
      throw new BadRequestException('escalationLevel must be warning or critical.');
    }
    if (!['channel', 'role', 'team'].includes(targetType)) {
      throw new BadRequestException('targetType must be channel, role, or team.');
    }
    if (!Number.isFinite(priority)) {
      throw new BadRequestException('priority must be a valid integer.');
    }

    await this.validateAlertingEscalationTarget(targetType, targetRef);

    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.alert_triage_escalation_policy (
        module_key, escalation_level, target_type, target_ref, priority,
        metadata, is_active, created_by, updated_by
      ) VALUES (
        '${escapeSqlLiteral(moduleKey)}', '${escapeSqlLiteral(escalationLevel)}',
        '${escapeSqlLiteral(targetType)}', '${escapeSqlLiteral(targetRef)}',
        ${priority}, '{}'::jsonb, TRUE,
        '${escapeSqlLiteral(actor)}', '${escapeSqlLiteral(actor)}'
      )
    `);

    return this.alertingEscalationPolicies('all', 'all');
  }

  async updateAlertingEscalationPolicy(policyId: string, body: Record<string, unknown>, actor: string) {
    const normalizedPolicyId = Number(policyId);
    if (!Number.isFinite(normalizedPolicyId) || normalizedPolicyId <= 0) {
      throw new BadRequestException('Invalid escalation policy id.');
    }

    const moduleKey = String(body.moduleKey || body.module_key || '').trim().toLowerCase();
    const escalationLevel = String(body.escalationLevel || body.escalation_level || '').trim().toLowerCase();
    const targetType = String(body.targetType || body.target_type || 'channel').trim().toLowerCase();
    const targetRef = String(body.targetRef || body.target_ref || '').trim();
    const priority = Number.parseInt(String(body.priority ?? 10), 10);

    if (!moduleKey || !escalationLevel || !targetRef) {
      throw new BadRequestException('moduleKey, escalationLevel, and targetRef are required.');
    }
    if (!['all', 'sales', 'finance', 'warehouse', 'purchasing'].includes(moduleKey)) {
      throw new BadRequestException('moduleKey must be all, sales, finance, warehouse, or purchasing.');
    }
    if (!['warning', 'critical'].includes(escalationLevel)) {
      throw new BadRequestException('escalationLevel must be warning or critical.');
    }
    if (!['channel', 'role', 'team'].includes(targetType)) {
      throw new BadRequestException('targetType must be channel, role, or team.');
    }
    if (!Number.isFinite(priority)) {
      throw new BadRequestException('priority must be a valid integer.');
    }

    await this.validateAlertingEscalationTarget(targetType, targetRef);

    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_escalation_policy SET
        module_key = '${escapeSqlLiteral(moduleKey)}',
        escalation_level = '${escapeSqlLiteral(escalationLevel)}',
        target_type = '${escapeSqlLiteral(targetType)}',
        target_ref = '${escapeSqlLiteral(targetRef)}',
        priority = ${priority},
        updated_by = '${escapeSqlLiteral(actor)}'
      WHERE policy_id = ${normalizedPolicyId} AND deleted_at IS NULL
    `);

    if (!updatedCount) {
      throw new NotFoundException('Escalation policy not found.');
    }

    return this.alertingEscalationPolicies('all', 'all');
  }

  async updateAlertingEscalationPolicyState(policyId: string, body: Record<string, unknown>, actor: string) {
    const normalizedPolicyId = Number(policyId);
    if (!Number.isFinite(normalizedPolicyId) || normalizedPolicyId <= 0) {
      throw new BadRequestException('Invalid escalation policy id.');
    }

    const isActive = Boolean(body.isActive ?? body.is_active);
    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_escalation_policy SET
        is_active = ${isActive ? 'TRUE' : 'FALSE'},
        updated_by = '${escapeSqlLiteral(actor)}'
      WHERE policy_id = ${normalizedPolicyId} AND deleted_at IS NULL
    `);

    if (!updatedCount) {
      throw new NotFoundException('Escalation policy not found.');
    }

    return this.alertingEscalationPolicies('all', 'all');
  }

  async deleteAlertingEscalationPolicy(policyId: string, actor: string) {
    const normalizedPolicyId = Number(policyId);
    if (!Number.isFinite(normalizedPolicyId) || normalizedPolicyId <= 0) {
      throw new BadRequestException('Invalid escalation policy id.');
    }

    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_escalation_policy SET
        is_active = FALSE, deleted_at = NOW(), updated_by = '${escapeSqlLiteral(actor)}'
      WHERE policy_id = ${normalizedPolicyId} AND deleted_at IS NULL
    `);

    if (!updatedCount) {
      throw new NotFoundException('Escalation policy not found.');
    }

    return this.alertingEscalationPolicies('all', 'all');
  }

  async alertingTriageSavedViews(actor: string) {
    const normalizedActor = String(actor || 'system').trim() || 'system';
    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        view_id, view_key, name, owner_actor, is_shared, is_default,
        filters_json, sort_by, sort_order, metadata, is_active, created_at
      FROM public.alert_triage_saved_view
      WHERE deleted_at IS NULL
        AND (
          owner_actor = '${escapeSqlLiteral(normalizedActor)}'
          OR is_shared = TRUE OR owner_actor IS NULL
        )
      ORDER BY is_default DESC, is_shared DESC, created_at DESC, view_id DESC
    `);

    return {
      success: true,
      data: rows.map((row) => ({
        view_id: Number(row.view_id || 0),
        view_key: String(row.view_key || ''),
        name: String(row.name || ''),
        owner_actor: row.owner_actor ? String(row.owner_actor) : null,
        is_shared: Boolean(row.is_shared),
        is_default: Boolean(row.is_default),
        filters_json: asJson(row.filters_json, {}),
        sort_by: String(row.sort_by || 'dead_lettered_at'),
        sort_order: String(row.sort_order || 'desc'),
        metadata: asJson(row.metadata, {}),
        is_active: Boolean(row.is_active),
        created_at: row.created_at || null,
        is_owned_by_current_user: String(row.owner_actor || '') === normalizedActor,
      })),
    };
  }

  private normalizeAlertingTriageSavedViewPayload(body: Record<string, unknown>) {
    const name = String(body.name || '').trim();
    const isShared = Boolean(body.isShared ?? body.is_shared ?? false);
    const isDefault = Boolean(body.isDefault ?? body.is_default ?? false);
    const filtersJson = asJson(body.filtersJson ?? body.filters_json, {});
    const sortBy = String(body.sortBy || body.sort_by || 'dead_lettered_at').trim() || 'dead_lettered_at';
    const sortOrder = String(body.sortOrder || body.sort_order || 'desc').trim().toLowerCase() === 'asc' ? 'asc' : 'desc';

    if (!name) {
      throw new BadRequestException('name is required.');
    }
    if (!['dead_lettered_at', 'age_minutes', 'sla_due_at', 'triage_updated_at', 'escalation_count', 'event_title'].includes(sortBy)) {
      throw new BadRequestException('sortBy is invalid.');
    }

    return { name, isShared, isDefault, filtersJson, sortBy, sortOrder };
  }

  async createAlertingTriageSavedView(body: Record<string, unknown>, actor: string) {
    const normalizedActor = String(actor || 'system').trim() || 'system';
    const payload = this.normalizeAlertingTriageSavedViewPayload(body);
    const viewKey = `triage-view-${Date.now()}`;

    if (payload.isDefault) {
      await this.prisma.$executeRawUnsafe(`
        UPDATE public.alert_triage_saved_view SET
          is_default = FALSE, updated_by = '${escapeSqlLiteral(normalizedActor)}'
        WHERE deleted_at IS NULL AND owner_actor = '${escapeSqlLiteral(normalizedActor)}'
      `);
    }

    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.alert_triage_saved_view (
        view_key, name, owner_actor, is_shared, is_default, filters_json,
        sort_by, sort_order, metadata, is_active, created_by, updated_by
      ) VALUES (
        '${escapeSqlLiteral(viewKey)}',
        '${escapeSqlLiteral(payload.name)}',
        '${escapeSqlLiteral(normalizedActor)}',
        ${payload.isShared ? 'TRUE' : 'FALSE'},
        ${payload.isDefault ? 'TRUE' : 'FALSE'},
        '${escapeSqlLiteral(JSON.stringify(payload.filtersJson))}'::jsonb,
        '${escapeSqlLiteral(payload.sortBy)}',
        '${escapeSqlLiteral(payload.sortOrder)}',
        '{}'::jsonb, TRUE,
        '${escapeSqlLiteral(normalizedActor)}',
        '${escapeSqlLiteral(normalizedActor)}'
      )
    `);

    return this.alertingTriageSavedViews(normalizedActor);
  }

  async updateAlertingTriageSavedView(viewId: string, body: Record<string, unknown>, actor: string) {
    const normalizedViewId = Number(viewId);
    if (!Number.isFinite(normalizedViewId) || normalizedViewId <= 0) {
      throw new BadRequestException('Invalid saved view id.');
    }
    const normalizedActor = String(actor || 'system').trim() || 'system';
    const payload = this.normalizeAlertingTriageSavedViewPayload(body);

    const existingRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT owner_actor FROM public.alert_triage_saved_view
      WHERE view_id = ${normalizedViewId} AND deleted_at IS NULL LIMIT 1
    `);
    const existing = existingRows[0];
    if (!existing) {
      throw new NotFoundException('Saved view not found.');
    }
    const ownerActor = String(existing.owner_actor || '');
    if (ownerActor && ownerActor !== normalizedActor) {
      throw new BadRequestException('You can only update your own saved view.');
    }

    if (payload.isDefault) {
      await this.prisma.$executeRawUnsafe(`
        UPDATE public.alert_triage_saved_view SET
          is_default = FALSE, updated_by = '${escapeSqlLiteral(normalizedActor)}'
        WHERE deleted_at IS NULL AND owner_actor = '${escapeSqlLiteral(normalizedActor)}'
      `);
    }

    await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_saved_view SET
        name = '${escapeSqlLiteral(payload.name)}',
        is_shared = ${payload.isShared ? 'TRUE' : 'FALSE'},
        is_default = ${payload.isDefault ? 'TRUE' : 'FALSE'},
        filters_json = '${escapeSqlLiteral(JSON.stringify(payload.filtersJson))}'::jsonb,
        sort_by = '${escapeSqlLiteral(payload.sortBy)}',
        sort_order = '${escapeSqlLiteral(payload.sortOrder)}',
        updated_by = '${escapeSqlLiteral(normalizedActor)}'
      WHERE view_id = ${normalizedViewId} AND deleted_at IS NULL
    `);

    return this.alertingTriageSavedViews(normalizedActor);
  }

  async updateAlertingTriageSavedViewState(viewId: string, body: Record<string, unknown>, actor: string) {
    const normalizedViewId = Number(viewId);
    if (!Number.isFinite(normalizedViewId) || normalizedViewId <= 0) {
      throw new BadRequestException('Invalid saved view id.');
    }
    const normalizedActor = String(actor || 'system').trim() || 'system';
    const isActive = Boolean(body.isActive ?? body.is_active);

    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_saved_view SET
        is_active = ${isActive ? 'TRUE' : 'FALSE'},
        updated_by = '${escapeSqlLiteral(normalizedActor)}'
      WHERE view_id = ${normalizedViewId} AND deleted_at IS NULL
        AND (owner_actor = '${escapeSqlLiteral(normalizedActor)}' OR owner_actor IS NULL)
    `);

    if (!updatedCount) {
      throw new NotFoundException('Saved view not found.');
    }

    return this.alertingTriageSavedViews(normalizedActor);
  }

  async deleteAlertingTriageSavedView(viewId: string, actor: string) {
    const normalizedViewId = Number(viewId);
    if (!Number.isFinite(normalizedViewId) || normalizedViewId <= 0) {
      throw new BadRequestException('Invalid saved view id.');
    }
    const normalizedActor = String(actor || 'system').trim() || 'system';

    const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_triage_saved_view SET
        is_active = FALSE, deleted_at = NOW(),
        updated_by = '${escapeSqlLiteral(normalizedActor)}'
      WHERE view_id = ${normalizedViewId} AND deleted_at IS NULL
        AND owner_actor = '${escapeSqlLiteral(normalizedActor)}'
    `);

    if (!updatedCount) {
      throw new NotFoundException('Saved view not found or not owned by current user.');
    }

    return this.alertingTriageSavedViews(normalizedActor);
  }

  async updateAlertingEvent(eventId: string, body: { status?: string }, actor: string) {
    const normalizedEventId = Number(eventId);
    if (!Number.isFinite(normalizedEventId) || normalizedEventId <= 0) {
      throw new BadRequestException('Invalid event id.');
    }

    const status = String(body?.status || '').trim().toLowerCase();
    if (!['acknowledged', 'resolved', 'open', 'muted'].includes(status)) {
      throw new BadRequestException('Invalid event status.');
    }

    const existingRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT status FROM public.alert_event
      WHERE deleted_at IS NULL AND event_id = ${normalizedEventId} LIMIT 1
    `);

    if (!existingRows[0]) {
      throw new NotFoundException('Alert event not found.');
    }

    const currentStatus = String(existingRows[0].status || '').trim().toLowerCase();
    const allowedTransitions: Record<string, string[]> = {
      open: ['acknowledged', 'resolved', 'muted'],
      acknowledged: ['resolved', 'muted', 'open'],
      muted: ['open', 'resolved'],
      resolved: [],
    };

    if (currentStatus !== status && !(allowedTransitions[currentStatus] || []).includes(status)) {
      throw new BadRequestException(
        `Invalid event transition from "${currentStatus}" to "${status}".`,
      );
    }

    const updates = [
      `status = '${escapeSqlLiteral(status)}'`,
      `updated_by = '${escapeSqlLiteral(actor)}'`,
    ];
    if (status === 'acknowledged') updates.push('acknowledged_at = NOW()');
    if (status === 'resolved') updates.push('resolved_at = NOW()');
    if (status === 'open') {
      updates.push('acknowledged_at = NULL');
      updates.push('resolved_at = NULL');
    }

    const affected = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_event
      SET ${updates.join(', ')}
      WHERE deleted_at IS NULL AND event_id = ${normalizedEventId}
    `);

    if (!affected) {
      throw new NotFoundException('Alert event not found.');
    }

    const result = await this.alertingRuleService.alertingEvents(undefined, String(normalizedEventId));
    return { success: true, data: result.data[0] || null };
  }

  async alertingBaileysPairing(body: { phoneNumber?: string; phone_number?: string }, actor: string) {
    const config = this.getBaileysConfig();
    const requestedPhoneNumber = String(body.phoneNumber || body.phone_number || '').replace(/\D/g, '').trim();
    const pairingMode = requestedPhoneNumber ? 'pairing-code' : 'qr';

    if (!config.enabled || !config.authDir) {
      await this.alertingDeliveryService.createAlertProviderSessionAudit({
        providerName: 'baileys', channelType: 'wa-group', actionType: 'pairing-start',
        status: 'failed', pairingMode, phoneNumber: requestedPhoneNumber || null,
        authDir: config.authDir || null,
        detailPayload: { requested_phone_number: requestedPhoneNumber || null, enabled: config.enabled },
        errorMessage: 'Baileys is not enabled or auth dir is not configured.', actor,
      });
      await this.alertingDeliveryService.upsertAlertProviderSessionState({
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

    await this.alertingDeliveryService.createAlertProviderSessionAudit({
      providerName: 'baileys', channelType: 'wa-group', actionType: 'pairing-start',
      status: 'captured', pairingMode, phoneNumber: requestedPhoneNumber || null,
      authDir: config.authDir || null,
      detailPayload: { requested_phone_number: requestedPhoneNumber || null, enabled: config.enabled },
      actor,
    });
    await this.alertingDeliveryService.upsertAlertProviderSessionState({
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

      await this.alertingDeliveryService.createAlertProviderSessionAudit({
        providerName: 'baileys', channelType: 'wa-group', actionType: 'pairing-result',
        status: result.pairing_required ? 'warning' : 'success',
        pairingMode: result.mode, phoneNumber: requestedPhoneNumber || null,
        authDir: config.authDir || null, detailPayload: result, actor,
      });
      await this.alertingDeliveryService.upsertAlertProviderSessionState({
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
      await this.alertingDeliveryService.createAlertProviderSessionAudit({
        providerName: 'baileys', channelType: 'wa-group', actionType: 'pairing-result',
        status: 'failed', pairingMode, phoneNumber: requestedPhoneNumber || null,
        authDir: config.authDir || null,
        detailPayload: { requested_phone_number: requestedPhoneNumber || null },
        errorMessage: error instanceof Error ? error.message : 'Unknown pairing error.', actor,
      });
      await this.alertingDeliveryService.upsertAlertProviderSessionState({
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
