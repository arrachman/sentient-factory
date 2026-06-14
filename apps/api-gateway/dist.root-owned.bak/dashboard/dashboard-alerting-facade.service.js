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
exports.DashboardAlertingFacadeService = void 0;
const common_1 = require("@nestjs/common");
const alerting_config_service_1 = require("./alerting-config.service");
const alerting_delivery_service_1 = require("./alerting-delivery.service");
const alerting_observability_service_1 = require("./alerting-observability.service");
const alerting_provider_session_service_1 = require("./alerting-provider-session.service");
const alerting_rule_service_1 = require("./alerting-rule.service");
const alerting_scheduler_service_1 = require("./alerting-scheduler.service");
const alerting_triage_service_1 = require("./alerting-triage.service");
let DashboardAlertingFacadeService = class DashboardAlertingFacadeService {
    alertingRuleService;
    alertingConfigService;
    alertingObservabilityService;
    alertingSchedulerService;
    alertingDeliveryService;
    alertingTriageService;
    alertingProviderSessionService;
    constructor(alertingRuleService, alertingConfigService, alertingObservabilityService, alertingSchedulerService, alertingDeliveryService, alertingTriageService, alertingProviderSessionService) {
        this.alertingRuleService = alertingRuleService;
        this.alertingConfigService = alertingConfigService;
        this.alertingObservabilityService = alertingObservabilityService;
        this.alertingSchedulerService = alertingSchedulerService;
        this.alertingDeliveryService = alertingDeliveryService;
        this.alertingTriageService = alertingTriageService;
        this.alertingProviderSessionService = alertingProviderSessionService;
    }
    alertingBusinessMetrics(moduleKey) {
        return this.alertingRuleService.alertingBusinessMetrics(moduleKey);
    }
    alertingSystemMetrics(moduleKey) {
        return this.alertingRuleService.alertingSystemMetrics(moduleKey);
    }
    alertingMetricBuilderContext(moduleKey, metricKey) {
        return this.alertingRuleService.alertingMetricBuilderContext(moduleKey, metricKey);
    }
    alertingInsights(moduleKey, snapshotId) {
        return this.alertingRuleService.alertingInsights(moduleKey, snapshotId);
    }
    alertingSavedQueries(channel, limit) {
        return this.alertingRuleService.alertingSavedQueries(channel, limit);
    }
    alertingRules(moduleKey) {
        return this.alertingRuleService.alertingRules(moduleKey);
    }
    alertingRuleDetail(ruleId) {
        return this.alertingRuleService.alertingRuleDetail(ruleId);
    }
    createAlertingRule(body, actor) {
        return this.alertingRuleService.createAlertingRule(body, actor);
    }
    updateAlertingRule(ruleId, body, actor) {
        return this.alertingRuleService.updateAlertingRule(ruleId, body, actor);
    }
    updateAlertingRuleState(ruleId, body, actor) {
        return this.alertingRuleService.updateAlertingRuleState(ruleId, body, actor);
    }
    deleteAlertingRule(ruleId, actor) {
        return this.alertingRuleService.deleteAlertingRule(ruleId, actor);
    }
    runAlertingRule(ruleId, actor) {
        return this.alertingRuleService.runAlertingRule(ruleId, actor);
    }
    alertingEvents(moduleKey, eventId) {
        return this.alertingRuleService.alertingEvents(moduleKey, eventId);
    }
    updateAlertingEvent(eventId, body, actor) {
        return this.alertingConfigService.updateAlertingEvent(eventId, body, actor);
    }
    runAlertingSchedulerCycle(actor = 'system-scheduler') {
        return this.alertingSchedulerService.runAlertingSchedulerCycle(actor);
    }
    runAlertingTriageEscalationCycle(actor = 'system-triage-escalation') {
        return this.alertingSchedulerService.runAlertingTriageEscalationCycle(actor);
    }
    runAlertDeliveryCycle(actor = 'system-delivery') {
        return this.alertingDeliveryService.runAlertDeliveryCycle(actor);
    }
    alertingDeliveryLogs(eventId) {
        return this.alertingDeliveryService.alertingDeliveryLogs(eventId);
    }
    requeueAlertingDeliveryLog(deliveryId, actor) {
        return this.alertingDeliveryService.requeueAlertingDeliveryLog(deliveryId, actor);
    }
    alertingDeadLetterTriage(query = {}) {
        return this.alertingTriageService.alertingDeadLetterTriage(query);
    }
    updateAlertingDeadLetterTriage(deliveryId, body, actor) {
        return this.alertingTriageService.updateAlertingDeadLetterTriage(deliveryId, body, actor);
    }
    alertingAnalytics() {
        return this.alertingObservabilityService.alertingAnalytics();
    }
    alertingDeliveryObservability() {
        return this.alertingObservabilityService.alertingDeliveryObservability();
    }
    alertingOpsOverview() {
        return this.alertingObservabilityService.alertingOpsOverview();
    }
    alertingDeliveryStatus() {
        return this.alertingObservabilityService.alertingDeliveryStatus();
    }
    alertingProviderHealth() {
        return this.alertingObservabilityService.alertingProviderHealth();
    }
    alertingBaileysPairing(body, actor) {
        return this.alertingConfigService.alertingBaileysPairing(body, actor);
    }
    alertingChannels(channelType) {
        return this.alertingConfigService.alertingChannels(channelType);
    }
    alertingTemplates(module) {
        return this.alertingConfigService.alertingTemplates(module);
    }
    createAlertingTemplate(body, actor) {
        return this.alertingConfigService.createAlertingTemplate(body, actor);
    }
    alertingTemplateDetail(templateId) {
        return this.alertingConfigService.alertingTemplateDetail(templateId);
    }
    updateAlertingTemplate(templateId, body, actor) {
        return this.alertingConfigService.updateAlertingTemplate(templateId, body, actor);
    }
    updateAlertingTemplateState(templateId, body, actor) {
        return this.alertingConfigService.updateAlertingTemplateState(templateId, body, actor);
    }
    deleteAlertingTemplate(templateId, actor) {
        return this.alertingConfigService.deleteAlertingTemplate(templateId, actor);
    }
    createAlertingChannel(body, actor) {
        return this.alertingConfigService.createAlertingChannel(body, actor);
    }
    updateAlertingChannel(channelId, body, actor) {
        return this.alertingConfigService.updateAlertingChannel(channelId, body, actor);
    }
    updateAlertingChannelState(channelId, body, actor) {
        return this.alertingConfigService.updateAlertingChannelState(channelId, body, actor);
    }
    deleteAlertingChannel(channelId, actor) {
        return this.alertingConfigService.deleteAlertingChannel(channelId, actor);
    }
    testAlertingChannel(channelId, actor) {
        return this.alertingConfigService.testAlertingChannel(channelId, actor);
    }
    alertingSettings() {
        return this.alertingConfigService.alertingSettings();
    }
    updateAlertingSetting(settingKey, body, actor) {
        return this.alertingConfigService.updateAlertingSetting(settingKey, body, actor);
    }
    alertingEscalationPolicies(module, targetType) {
        return this.alertingConfigService.alertingEscalationPolicies(module, targetType);
    }
    createAlertingEscalationPolicy(body, actor) {
        return this.alertingConfigService.createAlertingEscalationPolicy(body, actor);
    }
    updateAlertingEscalationPolicy(policyId, body, actor) {
        return this.alertingConfigService.updateAlertingEscalationPolicy(policyId, body, actor);
    }
    updateAlertingEscalationPolicyState(policyId, body, actor) {
        return this.alertingConfigService.updateAlertingEscalationPolicyState(policyId, body, actor);
    }
    deleteAlertingEscalationPolicy(policyId, actor) {
        return this.alertingConfigService.deleteAlertingEscalationPolicy(policyId, actor);
    }
    alertingTriageSavedViews(actor) {
        return this.alertingConfigService.alertingTriageSavedViews(actor);
    }
    createAlertingTriageSavedView(body, actor) {
        return this.alertingConfigService.createAlertingTriageSavedView(body, actor);
    }
    updateAlertingTriageSavedView(viewId, body, actor) {
        return this.alertingConfigService.updateAlertingTriageSavedView(viewId, body, actor);
    }
    updateAlertingTriageSavedViewState(viewId, body, actor) {
        return this.alertingConfigService.updateAlertingTriageSavedViewState(viewId, body, actor);
    }
    deleteAlertingTriageSavedView(viewId, actor) {
        return this.alertingConfigService.deleteAlertingTriageSavedView(viewId, actor);
    }
    ensureAlertingTestRule(actor) {
        return this.alertingProviderSessionService.ensureAlertingTestRule(actor);
    }
    createAlertProviderSessionAudit(input) {
        return this.alertingProviderSessionService.createAlertProviderSessionAudit(input);
    }
    upsertAlertProviderSessionState(input) {
        return this.alertingProviderSessionService.upsertAlertProviderSessionState(input);
    }
};
exports.DashboardAlertingFacadeService = DashboardAlertingFacadeService;
exports.DashboardAlertingFacadeService = DashboardAlertingFacadeService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => alerting_config_service_1.AlertingConfigService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => alerting_scheduler_service_1.AlertingSchedulerService))),
    __metadata("design:paramtypes", [alerting_rule_service_1.AlertingRuleService,
        alerting_config_service_1.AlertingConfigService,
        alerting_observability_service_1.AlertingObservabilityService,
        alerting_scheduler_service_1.AlertingSchedulerService,
        alerting_delivery_service_1.AlertingDeliveryService,
        alerting_triage_service_1.AlertingTriageService,
        alerting_provider_session_service_1.AlertingProviderSessionService])
], DashboardAlertingFacadeService);
//# sourceMappingURL=dashboard-alerting-facade.service.js.map