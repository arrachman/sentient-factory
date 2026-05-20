"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertingTemplateService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const dashboard_utils_1 = require("./dashboard.utils");
const alerting_rule_service_1 = require("./alerting-rule.service");
let AlertingTemplateService = class AlertingTemplateService {
    prisma;
    alertingRuleService;
    constructor(prisma, alertingRuleService) {
        this.prisma = prisma;
        this.alertingRuleService = alertingRuleService;
    }
    async validateAlertTemplateSource(sourceType, sourceRef) {
        if (!sourceType || !sourceRef) {
            return;
        }
        if (sourceType === 'business-metric') {
            const rows = await this.prisma.$queryRawUnsafe(`
        SELECT metric_id FROM public.metric_business_registry
        WHERE metric_key = '${(0, dashboard_utils_1.escapeSqlLiteral)(sourceRef)}'
          AND deleted_at IS NULL AND is_active = TRUE LIMIT 1
      `);
            if (!rows[0]) {
                throw new common_1.BadRequestException(`Template source_ref "${sourceRef}" was not found in metric_business_registry.`);
            }
        }
        if (sourceType === 'system-metric') {
            const rows = await this.prisma.$queryRawUnsafe(`
        SELECT system_metric_id FROM public.metric_system_registry
        WHERE metric_key = '${(0, dashboard_utils_1.escapeSqlLiteral)(sourceRef)}'
          AND deleted_at IS NULL AND is_active = TRUE LIMIT 1
      `);
            if (!rows[0]) {
                throw new common_1.BadRequestException(`Template source_ref "${sourceRef}" was not found in metric_system_registry.`);
            }
        }
    }
    async alertingTemplates(module) {
        const where = ['deleted_at IS NULL'];
        if (module && module !== 'all') {
            where.push(`module_key = '${(0, dashboard_utils_1.escapeSqlLiteral)(module)}'`);
        }
        const rows = await this.prisma.$queryRawUnsafe(`
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
                recommended_channels: (0, dashboard_utils_1.asJson)(row.recommended_channels, []),
                default_recipients: (0, dashboard_utils_1.asJson)(row.default_recipients, []),
                source_type: row.source_type || null,
                source_ref: row.source_ref || null,
                schedule_value: row.schedule_value || null,
                condition_summary: row.condition_summary || null,
                message_template: row.message_template || null,
                metadata: (0, dashboard_utils_1.asJson)(row.metadata, {}),
                is_default: Boolean(row.is_default),
                is_active: Boolean(row.is_active),
                sort_order: Number(row.sort_order || 0),
                created_at: row.created_at,
            })),
        };
    }
    async createAlertingTemplate(body, actor) {
        const name = String(body.name || '').trim();
        const moduleKey = String(body.moduleKey || body.module_key || '').trim();
        const severity = String(body.severity || 'medium').trim().toLowerCase();
        if (!name || !moduleKey) {
            throw new common_1.BadRequestException('name and moduleKey are required.');
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
          is_default = FALSE, updated_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
        WHERE module_key = '${(0, dashboard_utils_1.escapeSqlLiteral)(moduleKey)}' AND deleted_at IS NULL
      `);
        }
        await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.alert_template (
        template_key, name, description, module_key, severity, recommended_channels,
        default_recipients, source_type, source_ref, schedule_value, condition_summary,
        message_template, metadata, is_default, is_active, created_by, updated_by
      ) VALUES (
        '${(0, dashboard_utils_1.escapeSqlLiteral)(templateKey)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(name)}',
        ${description ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(description)}'` : 'NULL'},
        '${(0, dashboard_utils_1.escapeSqlLiteral)(moduleKey)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(severity || 'medium')}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(JSON.stringify(recommendedChannels))}'::jsonb,
        '${(0, dashboard_utils_1.escapeSqlLiteral)(JSON.stringify(defaultRecipients))}'::jsonb,
        ${sourceType ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(sourceType)}'` : 'NULL'},
        ${sourceRef ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(sourceRef)}'` : 'NULL'},
        ${scheduleValue ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(scheduleValue)}'` : 'NULL'},
        ${conditionSummary ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(conditionSummary)}'` : 'NULL'},
        ${messageTemplate ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(messageTemplate)}'` : 'NULL'},
        '{}'::jsonb,
        ${isDefault ? 'TRUE' : 'FALSE'},
        TRUE,
        '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}',
        '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
      )
    `);
        return this.alertingTemplates(moduleKey);
    }
    async alertingTemplateDetail(templateId) {
        const normalizedTemplateId = Number(templateId);
        if (!Number.isFinite(normalizedTemplateId) || normalizedTemplateId <= 0) {
            throw new common_1.BadRequestException('Invalid template id.');
        }
        const rows = await this.prisma.$queryRawUnsafe(`
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
            throw new common_1.NotFoundException('Alert template not found.');
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
                recommended_channels: (0, dashboard_utils_1.asJson)(rows[0].recommended_channels, []),
                default_recipients: (0, dashboard_utils_1.asJson)(rows[0].default_recipients, []),
                source_type: rows[0].source_type || null,
                source_ref: rows[0].source_ref || null,
                schedule_value: rows[0].schedule_value || null,
                condition_summary: rows[0].condition_summary || null,
                message_template: rows[0].message_template || null,
                metadata: (0, dashboard_utils_1.asJson)(rows[0].metadata, {}),
                is_default: Boolean(rows[0].is_default),
                is_active: Boolean(rows[0].is_active),
                sort_order: Number(rows[0].sort_order || 0),
                created_at: rows[0].created_at,
            },
        };
    }
    async updateAlertingTemplate(templateId, body, actor) {
        const normalizedTemplateId = Number(templateId);
        if (!Number.isFinite(normalizedTemplateId) || normalizedTemplateId <= 0) {
            throw new common_1.BadRequestException('Invalid template id.');
        }
        const name = String(body.name || '').trim();
        const moduleKey = String(body.moduleKey || body.module_key || '').trim();
        const severity = String(body.severity || 'medium').trim().toLowerCase();
        if (!name || !moduleKey) {
            throw new common_1.BadRequestException('name and moduleKey are required.');
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
          is_default = FALSE, updated_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
        WHERE module_key = '${(0, dashboard_utils_1.escapeSqlLiteral)(moduleKey)}'
          AND template_id <> ${normalizedTemplateId} AND deleted_at IS NULL
      `);
        }
        const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_template SET
        name = '${(0, dashboard_utils_1.escapeSqlLiteral)(name)}',
        description = ${description ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(description)}'` : 'NULL'},
        module_key = '${(0, dashboard_utils_1.escapeSqlLiteral)(moduleKey)}',
        severity = '${(0, dashboard_utils_1.escapeSqlLiteral)(severity || 'medium')}',
        recommended_channels = '${(0, dashboard_utils_1.escapeSqlLiteral)(JSON.stringify(recommendedChannels))}'::jsonb,
        default_recipients = '${(0, dashboard_utils_1.escapeSqlLiteral)(JSON.stringify(defaultRecipients))}'::jsonb,
        source_type = ${sourceType ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(sourceType)}'` : 'NULL'},
        source_ref = ${sourceRef ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(sourceRef)}'` : 'NULL'},
        schedule_value = ${scheduleValue ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(scheduleValue)}'` : 'NULL'},
        condition_summary = ${conditionSummary ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(conditionSummary)}'` : 'NULL'},
        message_template = ${messageTemplate ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(messageTemplate)}'` : 'NULL'},
        is_default = ${isDefault ? 'TRUE' : 'FALSE'},
        updated_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
      WHERE template_id = ${normalizedTemplateId} AND deleted_at IS NULL
    `);
        if (!updatedCount) {
            throw new common_1.NotFoundException('Alert template not found.');
        }
        return this.alertingTemplates(moduleKey);
    }
    async updateAlertingTemplateState(templateId, body, actor) {
        const normalizedTemplateId = Number(templateId);
        if (!Number.isFinite(normalizedTemplateId) || normalizedTemplateId <= 0) {
            throw new common_1.BadRequestException('Invalid template id.');
        }
        const isActive = Boolean(body.isActive ?? body.is_active);
        const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_template SET
        is_active = ${isActive ? 'TRUE' : 'FALSE'},
        updated_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
      WHERE template_id = ${normalizedTemplateId} AND deleted_at IS NULL
    `);
        if (!updatedCount) {
            throw new common_1.NotFoundException('Alert template not found.');
        }
        return this.alertingTemplates('all');
    }
    async deleteAlertingTemplate(templateId, actor) {
        const normalizedTemplateId = Number(templateId);
        if (!Number.isFinite(normalizedTemplateId) || normalizedTemplateId <= 0) {
            throw new common_1.BadRequestException('Invalid template id.');
        }
        const existing = await this.prisma.$queryRawUnsafe(`
      SELECT module_key FROM public.alert_template
      WHERE template_id = ${normalizedTemplateId} AND deleted_at IS NULL LIMIT 1
    `);
        if (!existing[0]) {
            throw new common_1.NotFoundException('Alert template not found.');
        }
        await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_template SET
        is_active = FALSE, deleted_at = NOW(), updated_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
      WHERE template_id = ${normalizedTemplateId} AND deleted_at IS NULL
    `);
        return this.alertingTemplates(String(existing[0].module_key || 'all'));
    }
};
exports.AlertingTemplateService = AlertingTemplateService;
exports.AlertingTemplateService = AlertingTemplateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        alerting_rule_service_1.AlertingRuleService])
], AlertingTemplateService);
//# sourceMappingURL=alerting-template.service.js.map