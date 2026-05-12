import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { escapeSqlLiteral, asJson } from './dashboard.utils';
import { AlertingRuleService } from './alerting-rule.service';

@Injectable()
export class AlertingTemplateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly alertingRuleService: AlertingRuleService,
  ) {}

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
}
