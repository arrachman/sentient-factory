import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { escapeSqlLiteral, asJson } from './dashboard.utils';
import { AlertingTemplateService } from './alerting-template.service';
import { AlertingEscalationService } from './alerting-escalation.service';
import { AlertingChannelService } from './alerting-channel.service';
import { AlertingBaileysService } from './alerting-baileys.service';

@Injectable()
export class AlertingConfigService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly alertingTemplateService: AlertingTemplateService,
    private readonly alertingEscalationService: AlertingEscalationService,
    private readonly alertingChannelService: AlertingChannelService,
    private readonly alertingBaileysService: AlertingBaileysService,
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
  // Channel delegation
  // ---------------------------------------------------------------------------

  async alertingChannels(channelType?: string) {
    return this.alertingChannelService.alertingChannels(channelType);
  }

  async createAlertingChannel(body: Record<string, unknown>, actor: string) {
    return this.alertingChannelService.createAlertingChannel(body, actor);
  }

  async updateAlertingChannel(channelId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingChannelService.updateAlertingChannel(channelId, body, actor);
  }

  async updateAlertingChannelState(channelId: string, body: Record<string, unknown>, actor: string) {
    return this.alertingChannelService.updateAlertingChannelState(channelId, body, actor);
  }

  async deleteAlertingChannel(channelId: string, actor: string) {
    return this.alertingChannelService.deleteAlertingChannel(channelId, actor);
  }

  async testAlertingChannel(channelId: string, actor: string) {
    return this.alertingChannelService.testAlertingChannel(channelId, actor);
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
  // Baileys pairing delegation
  // ---------------------------------------------------------------------------

  async alertingBaileysPairing(body: { phoneNumber?: string; phone_number?: string }, actor: string) {
    return this.alertingBaileysService.alertingBaileysPairing(body, actor);
  }
}
