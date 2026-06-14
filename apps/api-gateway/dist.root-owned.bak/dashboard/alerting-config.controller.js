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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertingConfigController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const dashboard_alerting_facade_service_1 = require("./dashboard-alerting-facade.service");
let AlertingConfigController = class AlertingConfigController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    alertingTemplates(module) {
        return this.dashboardService.alertingTemplates(module);
    }
    createAlertingTemplate(req, body) {
        return this.dashboardService.createAlertingTemplate(body, req.user?.username || req.user?.email || 'system');
    }
    alertingTemplateDetail(templateId) {
        return this.dashboardService.alertingTemplateDetail(templateId);
    }
    updateAlertingTemplate(templateId, req, body) {
        return this.dashboardService.updateAlertingTemplate(templateId, body, req.user?.username || req.user?.email || 'system');
    }
    updateAlertingTemplateState(templateId, req, body) {
        return this.dashboardService.updateAlertingTemplateState(templateId, body, req.user?.username || req.user?.email || 'system');
    }
    deleteAlertingTemplate(templateId, req) {
        return this.dashboardService.deleteAlertingTemplate(templateId, req.user?.username || req.user?.email || 'system');
    }
    alertingChannels(channelType) {
        return this.dashboardService.alertingChannels(channelType);
    }
    createAlertingChannel(req, body) {
        return this.dashboardService.createAlertingChannel(body, req.user?.username || req.user?.email || 'system');
    }
    updateAlertingChannel(channelId, req, body) {
        return this.dashboardService.updateAlertingChannel(channelId, body, req.user?.username || req.user?.email || 'system');
    }
    updateAlertingChannelState(channelId, req, body) {
        return this.dashboardService.updateAlertingChannelState(channelId, body, req.user?.username || req.user?.email || 'system');
    }
    deleteAlertingChannel(channelId, req) {
        return this.dashboardService.deleteAlertingChannel(channelId, req.user?.username || req.user?.email || 'system');
    }
    testAlertingChannel(channelId, req) {
        return this.dashboardService.testAlertingChannel(channelId, req.user?.username || req.user?.email || 'system');
    }
    alertingSettings() {
        return this.dashboardService.alertingSettings();
    }
    updateAlertingSetting(settingKey, req, body) {
        return this.dashboardService.updateAlertingSetting(settingKey, body, req.user?.username || req.user?.email || 'system');
    }
    alertingEscalationPolicies(module, targetType) {
        return this.dashboardService.alertingEscalationPolicies(module, targetType);
    }
    createAlertingEscalationPolicy(req, body) {
        return this.dashboardService.createAlertingEscalationPolicy(body, req.user?.username || req.user?.email || 'system');
    }
    updateAlertingEscalationPolicy(policyId, req, body) {
        return this.dashboardService.updateAlertingEscalationPolicy(policyId, body, req.user?.username || req.user?.email || 'system');
    }
    updateAlertingEscalationPolicyState(policyId, req, body) {
        return this.dashboardService.updateAlertingEscalationPolicyState(policyId, body, req.user?.username || req.user?.email || 'system');
    }
    deleteAlertingEscalationPolicy(policyId, req) {
        return this.dashboardService.deleteAlertingEscalationPolicy(policyId, req.user?.username || req.user?.email || 'system');
    }
    alertingTriageSavedViews(req) {
        return this.dashboardService.alertingTriageSavedViews(req.user?.username || req.user?.email || 'system');
    }
    createAlertingTriageSavedView(req, body) {
        return this.dashboardService.createAlertingTriageSavedView(body, req.user?.username || req.user?.email || 'system');
    }
    updateAlertingTriageSavedView(viewId, req, body) {
        return this.dashboardService.updateAlertingTriageSavedView(viewId, body, req.user?.username || req.user?.email || 'system');
    }
    updateAlertingTriageSavedViewState(viewId, req, body) {
        return this.dashboardService.updateAlertingTriageSavedViewState(viewId, body, req.user?.username || req.user?.email || 'system');
    }
    deleteAlertingTriageSavedView(viewId, req) {
        return this.dashboardService.deleteAlertingTriageSavedView(viewId, req.user?.username || req.user?.email || 'system');
    }
};
exports.AlertingConfigController = AlertingConfigController;
__decorate([
    (0, common_1.Get)('alerting/templates'),
    (0, swagger_1.ApiOperation)({ summary: 'List persisted alert templates' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert template payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('module')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "alertingTemplates", null);
__decorate([
    (0, common_1.Post)('alerting/templates'),
    (0, swagger_1.ApiOperation)({ summary: 'Create alert template' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert template create result' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "createAlertingTemplate", null);
__decorate([
    (0, common_1.Get)('alerting/templates/:templateId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alert template detail' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert template detail payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('templateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "alertingTemplateDetail", null);
__decorate([
    (0, common_1.Patch)('alerting/templates/:templateId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update alert template' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert template update result' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('templateId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "updateAlertingTemplate", null);
__decorate([
    (0, common_1.Patch)('alerting/templates/:templateId/state'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle alert template active state' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert template state update result' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('templateId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "updateAlertingTemplateState", null);
__decorate([
    (0, common_1.Delete)('alerting/templates/:templateId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete alert template' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert template delete result' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('templateId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "deleteAlertingTemplate", null);
__decorate([
    (0, common_1.Get)('alerting/channels'),
    (0, swagger_1.ApiOperation)({ summary: 'List persisted alert notification channels' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert notification channels payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('channelType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "alertingChannels", null);
__decorate([
    (0, common_1.Post)('alerting/channels'),
    (0, swagger_1.ApiOperation)({ summary: 'Create alert notification channel' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert notification channel create result' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "createAlertingChannel", null);
__decorate([
    (0, common_1.Patch)('alerting/channels/:channelId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update alert notification channel' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert notification channel update result' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "updateAlertingChannel", null);
__decorate([
    (0, common_1.Patch)('alerting/channels/:channelId/state'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle alert notification channel active state' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert notification channel state update result' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "updateAlertingChannelState", null);
__decorate([
    (0, common_1.Delete)('alerting/channels/:channelId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete alert notification channel' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert notification channel delete result' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "deleteAlertingChannel", null);
__decorate([
    (0, common_1.Post)('alerting/channels/:channelId/test-send'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a test notification to a channel' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert channel test send result' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "testAlertingChannel", null);
__decorate([
    (0, common_1.Get)('alerting/settings'),
    (0, swagger_1.ApiOperation)({ summary: 'List alert runtime settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert runtime settings payload' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "alertingSettings", null);
__decorate([
    (0, common_1.Patch)('alerting/settings/:settingKey'),
    (0, swagger_1.ApiOperation)({ summary: 'Update alert runtime setting' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert runtime setting update result' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('settingKey')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "updateAlertingSetting", null);
__decorate([
    (0, common_1.Get)('alerting/escalation-policies'),
    (0, swagger_1.ApiOperation)({ summary: 'List triage escalation policies' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Triage escalation policy payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('module')),
    __param(1, (0, common_1.Query)('targetType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "alertingEscalationPolicies", null);
__decorate([
    (0, common_1.Post)('alerting/escalation-policies'),
    (0, swagger_1.ApiOperation)({ summary: 'Create triage escalation policy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Triage escalation policy create result' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "createAlertingEscalationPolicy", null);
__decorate([
    (0, common_1.Patch)('alerting/escalation-policies/:policyId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update triage escalation policy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Triage escalation policy update result' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('policyId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "updateAlertingEscalationPolicy", null);
__decorate([
    (0, common_1.Patch)('alerting/escalation-policies/:policyId/state'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle triage escalation policy active state' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Triage escalation policy state update result' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('policyId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "updateAlertingEscalationPolicyState", null);
__decorate([
    (0, common_1.Delete)('alerting/escalation-policies/:policyId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete triage escalation policy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Triage escalation policy delete result' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('policyId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "deleteAlertingEscalationPolicy", null);
__decorate([
    (0, common_1.Get)('alerting/triage-saved-views'),
    (0, swagger_1.ApiOperation)({ summary: 'List triage saved views' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Triage saved view payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "alertingTriageSavedViews", null);
__decorate([
    (0, common_1.Post)('alerting/triage-saved-views'),
    (0, swagger_1.ApiOperation)({ summary: 'Create triage saved view' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Triage saved view create result' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "createAlertingTriageSavedView", null);
__decorate([
    (0, common_1.Patch)('alerting/triage-saved-views/:viewId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update triage saved view' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Triage saved view update result' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('viewId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "updateAlertingTriageSavedView", null);
__decorate([
    (0, common_1.Patch)('alerting/triage-saved-views/:viewId/state'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle triage saved view active state' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Triage saved view state update result' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('viewId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "updateAlertingTriageSavedViewState", null);
__decorate([
    (0, common_1.Delete)('alerting/triage-saved-views/:viewId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete triage saved view' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Triage saved view delete result' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('viewId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AlertingConfigController.prototype, "deleteAlertingTriageSavedView", null);
exports.AlertingConfigController = AlertingConfigController = __decorate([
    (0, swagger_1.ApiTags)('alerting-config'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_alerting_facade_service_1.DashboardAlertingFacadeService])
], AlertingConfigController);
//# sourceMappingURL=alerting-config.controller.js.map