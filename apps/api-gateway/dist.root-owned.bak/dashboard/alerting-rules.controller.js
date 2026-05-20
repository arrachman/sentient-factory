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
exports.AlertingRulesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const dashboard_alerting_facade_service_1 = require("./dashboard-alerting-facade.service");
let AlertingRulesController = class AlertingRulesController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    alertingBusinessMetrics(moduleKey) {
        return this.dashboardService.alertingBusinessMetrics(moduleKey);
    }
    alertingSystemMetrics(moduleKey) {
        return this.dashboardService.alertingSystemMetrics(moduleKey);
    }
    alertingMetricBuilderContext(moduleKey, metricKey) {
        return this.dashboardService.alertingMetricBuilderContext(moduleKey, metricKey);
    }
    alertingInsights(moduleKey, snapshotId) {
        return this.dashboardService.alertingInsights(moduleKey, snapshotId);
    }
    alertingSavedQueries(channel, limit) {
        return this.dashboardService.alertingSavedQueries(channel, limit);
    }
    alertingRules(moduleKey) {
        return this.dashboardService.alertingRules(moduleKey);
    }
    alertingRuleDetail(ruleId) {
        return this.dashboardService.alertingRuleDetail(ruleId);
    }
    runAlertingRule(ruleId, req) {
        return this.dashboardService.runAlertingRule(ruleId, req.user?.username || req.user?.email || 'system');
    }
    createAlertingRule(req, body) {
        return this.dashboardService.createAlertingRule(body, req.user?.username || req.user?.email || 'system');
    }
    updateAlertingRule(ruleId, req, body) {
        return this.dashboardService.updateAlertingRule(ruleId, body, req.user?.username || req.user?.email || 'system');
    }
    updateAlertingRuleState(ruleId, req, body) {
        return this.dashboardService.updateAlertingRuleState(ruleId, body, req.user?.username || req.user?.email || 'system');
    }
    deleteAlertingRule(ruleId, req) {
        return this.dashboardService.deleteAlertingRule(ruleId, req.user?.username || req.user?.email || 'system');
    }
    alertingEvents(moduleKey, eventId) {
        return this.dashboardService.alertingEvents(moduleKey, eventId);
    }
    updateAlertingEvent(eventId, req, body) {
        return this.dashboardService.updateAlertingEvent(eventId, body, req.user?.username || req.user?.email || 'system');
    }
};
exports.AlertingRulesController = AlertingRulesController;
__decorate([
    (0, common_1.Get)('alerting/business-metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'List business metrics for alerting' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Business metrics payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('module')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AlertingRulesController.prototype, "alertingBusinessMetrics", null);
__decorate([
    (0, common_1.Get)('alerting/system-metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'List system metrics for alerting' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System metrics payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('module')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AlertingRulesController.prototype, "alertingSystemMetrics", null);
__decorate([
    (0, common_1.Get)('alerting/metric-builder-context'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alerting metric builder context' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Metric builder context payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('module')),
    __param(1, (0, common_1.Query)('metricKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AlertingRulesController.prototype, "alertingMetricBuilderContext", null);
__decorate([
    (0, common_1.Get)('alerting/insights'),
    (0, swagger_1.ApiOperation)({ summary: 'List metric insight snapshots for alert center' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Metric insight snapshot payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('module')),
    __param(1, (0, common_1.Query)('snapshotId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AlertingRulesController.prototype, "alertingInsights", null);
__decorate([
    (0, common_1.Get)('alerting/saved-queries'),
    (0, swagger_1.ApiOperation)({ summary: 'List saved AI queries for alerting' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Saved query payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('channel')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AlertingRulesController.prototype, "alertingSavedQueries", null);
__decorate([
    (0, common_1.Get)('alerting/rules'),
    (0, swagger_1.ApiOperation)({ summary: 'List alert rules' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert rule payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('module')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AlertingRulesController.prototype, "alertingRules", null);
__decorate([
    (0, common_1.Get)('alerting/rules/:ruleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alert rule detail' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert rule detail payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('ruleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AlertingRulesController.prototype, "alertingRuleDetail", null);
__decorate([
    (0, common_1.Post)('alerting/rules/:ruleId/run'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute alert rule manually' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert rule run result' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('ruleId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AlertingRulesController.prototype, "runAlertingRule", null);
__decorate([
    (0, common_1.Post)('alerting/rules'),
    (0, swagger_1.ApiOperation)({ summary: 'Create alert rule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert rule create result' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AlertingRulesController.prototype, "createAlertingRule", null);
__decorate([
    (0, common_1.Patch)('alerting/rules/:ruleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update alert rule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert rule update result' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('ruleId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AlertingRulesController.prototype, "updateAlertingRule", null);
__decorate([
    (0, common_1.Patch)('alerting/rules/:ruleId/state'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle alert rule active state' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert rule state update result' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('ruleId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AlertingRulesController.prototype, "updateAlertingRuleState", null);
__decorate([
    (0, common_1.Delete)('alerting/rules/:ruleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete alert rule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert rule delete result' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('ruleId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AlertingRulesController.prototype, "deleteAlertingRule", null);
__decorate([
    (0, common_1.Get)('alerting/events'),
    (0, swagger_1.ApiOperation)({ summary: 'List alert events' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert event payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('module')),
    __param(1, (0, common_1.Query)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AlertingRulesController.prototype, "alertingEvents", null);
__decorate([
    (0, common_1.Patch)('alerting/events/:eventId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update alert event status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert event update result' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AlertingRulesController.prototype, "updateAlertingEvent", null);
exports.AlertingRulesController = AlertingRulesController = __decorate([
    (0, swagger_1.ApiTags)('Dashboard'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_alerting_facade_service_1.DashboardAlertingFacadeService])
], AlertingRulesController);
//# sourceMappingURL=alerting-rules.controller.js.map