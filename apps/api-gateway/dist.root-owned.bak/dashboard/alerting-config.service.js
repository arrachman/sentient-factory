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
exports.AlertingConfigService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const dashboard_utils_1 = require("./dashboard.utils");
const alerting_template_service_1 = require("./alerting-template.service");
const alerting_escalation_service_1 = require("./alerting-escalation.service");
const alerting_channel_service_1 = require("./alerting-channel.service");
const alerting_baileys_service_1 = require("./alerting-baileys.service");
let AlertingConfigService = class AlertingConfigService {
    prisma;
    alertingTemplateService;
    alertingEscalationService;
    alertingChannelService;
    alertingBaileysService;
    constructor(prisma, alertingTemplateService, alertingEscalationService, alertingChannelService, alertingBaileysService) {
        this.prisma = prisma;
        this.alertingTemplateService = alertingTemplateService;
        this.alertingEscalationService = alertingEscalationService;
        this.alertingChannelService = alertingChannelService;
        this.alertingBaileysService = alertingBaileysService;
    }
    async alertingTemplates(module) {
        return this.alertingTemplateService.alertingTemplates(module);
    }
    async alertingTemplateDetail(templateId) {
        return this.alertingTemplateService.alertingTemplateDetail(templateId);
    }
    async createAlertingTemplate(body, actor) {
        return this.alertingTemplateService.createAlertingTemplate(body, actor);
    }
    async updateAlertingTemplate(templateId, body, actor) {
        return this.alertingTemplateService.updateAlertingTemplate(templateId, body, actor);
    }
    async updateAlertingTemplateState(templateId, body, actor) {
        return this.alertingTemplateService.updateAlertingTemplateState(templateId, body, actor);
    }
    async deleteAlertingTemplate(templateId, actor) {
        return this.alertingTemplateService.deleteAlertingTemplate(templateId, actor);
    }
    async alertingEscalationPolicies(module, targetType) {
        return this.alertingEscalationService.alertingEscalationPolicies(module, targetType);
    }
    async createAlertingEscalationPolicy(body, actor) {
        return this.alertingEscalationService.createAlertingEscalationPolicy(body, actor);
    }
    async updateAlertingEscalationPolicy(policyId, body, actor) {
        return this.alertingEscalationService.updateAlertingEscalationPolicy(policyId, body, actor);
    }
    async updateAlertingEscalationPolicyState(policyId, body, actor) {
        return this.alertingEscalationService.updateAlertingEscalationPolicyState(policyId, body, actor);
    }
    async deleteAlertingEscalationPolicy(policyId, actor) {
        return this.alertingEscalationService.deleteAlertingEscalationPolicy(policyId, actor);
    }
    async alertingTriageSavedViews(actor) {
        return this.alertingEscalationService.alertingTriageSavedViews(actor);
    }
    async createAlertingTriageSavedView(body, actor) {
        return this.alertingEscalationService.createAlertingTriageSavedView(body, actor);
    }
    async updateAlertingTriageSavedView(viewId, body, actor) {
        return this.alertingEscalationService.updateAlertingTriageSavedView(viewId, body, actor);
    }
    async updateAlertingTriageSavedViewState(viewId, body, actor) {
        return this.alertingEscalationService.updateAlertingTriageSavedViewState(viewId, body, actor);
    }
    async deleteAlertingTriageSavedView(viewId, actor) {
        return this.alertingEscalationService.deleteAlertingTriageSavedView(viewId, actor);
    }
    async updateAlertingEvent(eventId, body, actor) {
        return this.alertingEscalationService.updateAlertingEvent(eventId, body, actor);
    }
    async alertingChannels(channelType) {
        return this.alertingChannelService.alertingChannels(channelType);
    }
    async createAlertingChannel(body, actor) {
        return this.alertingChannelService.createAlertingChannel(body, actor);
    }
    async updateAlertingChannel(channelId, body, actor) {
        return this.alertingChannelService.updateAlertingChannel(channelId, body, actor);
    }
    async updateAlertingChannelState(channelId, body, actor) {
        return this.alertingChannelService.updateAlertingChannelState(channelId, body, actor);
    }
    async deleteAlertingChannel(channelId, actor) {
        return this.alertingChannelService.deleteAlertingChannel(channelId, actor);
    }
    async testAlertingChannel(channelId, actor) {
        return this.alertingChannelService.testAlertingChannel(channelId, actor);
    }
    async alertingSettings() {
        const rows = await this.prisma.$queryRawUnsafe(`
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
                value_json: (0, dashboard_utils_1.asJson)(row.value_json, {}),
                description: row.description || null,
                is_active: Boolean(row.is_active),
            })),
        };
    }
    async updateAlertingSetting(settingKey, body, actor) {
        const normalizedSettingKey = String(settingKey || '').trim();
        if (!normalizedSettingKey) {
            throw new common_1.BadRequestException('Invalid setting key.');
        }
        const valueText = typeof body.valueText === 'string'
            ? body.valueText.trim()
            : typeof body.value_text === 'string' ? body.value_text.trim() : '';
        const valueJson = body.valueJson && typeof body.valueJson === 'object'
            ? body.valueJson
            : body.value_json && typeof body.value_json === 'object' ? body.value_json : {};
        const updatedCount = await this.prisma.$executeRawUnsafe(`
      UPDATE public.alert_runtime_setting SET
        value_text = ${valueText ? `'${(0, dashboard_utils_1.escapeSqlLiteral)(valueText)}'` : 'NULL'},
        value_json = '${(0, dashboard_utils_1.escapeSqlLiteral)(JSON.stringify(valueJson))}'::jsonb,
        updated_by = '${(0, dashboard_utils_1.escapeSqlLiteral)(actor)}'
      WHERE setting_key = '${(0, dashboard_utils_1.escapeSqlLiteral)(normalizedSettingKey)}' AND is_active = TRUE
    `);
        if (!updatedCount) {
            throw new common_1.NotFoundException('Alert runtime setting not found.');
        }
        return this.alertingSettings();
    }
    async alertingBaileysPairing(body, actor) {
        return this.alertingBaileysService.alertingBaileysPairing(body, actor);
    }
};
exports.AlertingConfigService = AlertingConfigService;
exports.AlertingConfigService = AlertingConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        alerting_template_service_1.AlertingTemplateService,
        alerting_escalation_service_1.AlertingEscalationService,
        alerting_channel_service_1.AlertingChannelService,
        alerting_baileys_service_1.AlertingBaileysService])
], AlertingConfigService);
//# sourceMappingURL=alerting-config.service.js.map