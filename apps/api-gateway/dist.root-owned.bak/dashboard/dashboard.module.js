"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const dashboard_alerting_facade_service_1 = require("./dashboard-alerting-facade.service");
const alerting_analytics_service_1 = require("./alerting-analytics.service");
const alerting_baileys_service_1 = require("./alerting-baileys.service");
const alerting_channel_service_1 = require("./alerting-channel.service");
const alerting_config_service_1 = require("./alerting-config.service");
const alerting_delivery_dispatch_service_1 = require("./alerting-delivery-dispatch.service");
const alerting_delivery_service_1 = require("./alerting-delivery.service");
const alerting_escalation_service_1 = require("./alerting-escalation.service");
const alerting_insight_query_service_1 = require("./alerting-insight-query.service");
const alerting_metric_service_1 = require("./alerting-metric.service");
const alerting_observability_service_1 = require("./alerting-observability.service");
const alerting_provider_session_service_1 = require("./alerting-provider-session.service");
const alerting_rule_runner_service_1 = require("./alerting-rule-runner.service");
const alerting_rule_service_1 = require("./alerting-rule.service");
const alerting_scheduler_service_1 = require("./alerting-scheduler.service");
const alerting_template_service_1 = require("./alerting-template.service");
const alerting_triage_escalation_resolver_service_1 = require("./alerting-triage-escalation-resolver.service");
const alerting_triage_escalation_service_1 = require("./alerting-triage-escalation.service");
const alerting_triage_service_1 = require("./alerting-triage.service");
const alerting_triage_update_service_1 = require("./alerting-triage-update.service");
const alerting_triage_view_service_1 = require("./alerting-triage-view.service");
const alerting_config_controller_1 = require("./alerting-config.controller");
const alerting_delivery_controller_1 = require("./alerting-delivery.controller");
const alerting_ops_controller_1 = require("./alerting-ops.controller");
const alerting_rules_controller_1 = require("./alerting-rules.controller");
const dashboard_controller_1 = require("./dashboard.controller");
const dashboard_custom_db_service_1 = require("./dashboard-custom-db.service");
const dashboard_custom_db_widget_service_1 = require("./dashboard-custom-db-widget.service");
const dashboard_insight_service_1 = require("./dashboard-insight.service");
const dashboard_kpi_service_1 = require("./dashboard-kpi.service");
const dashboard_mysql_service_1 = require("./dashboard-mysql.service");
const dashboard_query_service_1 = require("./dashboard-query.service");
const dashboard_query_m2_service_1 = require("./dashboard-query-m2.service");
const dashboard_query_m2cr_service_1 = require("./dashboard-query-m2cr.service");
const dashboard_service_1 = require("./dashboard.service");
const semantic_schema_service_1 = require("./semantic-schema.service");
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [
            dashboard_controller_1.DashboardController,
            alerting_rules_controller_1.AlertingRulesController,
            alerting_config_controller_1.AlertingConfigController,
            alerting_delivery_controller_1.AlertingDeliveryController,
            alerting_ops_controller_1.AlertingOpsController,
        ],
        providers: [
            dashboard_service_1.DashboardService,
            dashboard_alerting_facade_service_1.DashboardAlertingFacadeService,
            dashboard_query_service_1.DashboardQueryService,
            dashboard_kpi_service_1.DashboardKpiService,
            dashboard_query_m2_service_1.DashboardQueryM2Service,
            dashboard_query_m2cr_service_1.DashboardQueryM2CrService,
            dashboard_custom_db_service_1.DashboardCustomDbService,
            dashboard_custom_db_widget_service_1.DashboardCustomDbWidgetService,
            dashboard_insight_service_1.DashboardInsightService,
            dashboard_mysql_service_1.DashboardMysqlService,
            semantic_schema_service_1.SemanticSchemaService,
            alerting_analytics_service_1.AlertingAnalyticsService,
            alerting_metric_service_1.AlertingMetricService,
            alerting_insight_query_service_1.AlertingInsightQueryService,
            alerting_rule_runner_service_1.AlertingRuleRunnerService,
            alerting_rule_service_1.AlertingRuleService,
            alerting_template_service_1.AlertingTemplateService,
            alerting_escalation_service_1.AlertingEscalationService,
            alerting_baileys_service_1.AlertingBaileysService,
            alerting_channel_service_1.AlertingChannelService,
            alerting_config_service_1.AlertingConfigService,
            alerting_delivery_dispatch_service_1.AlertingDeliveryDispatchService,
            alerting_delivery_service_1.AlertingDeliveryService,
            alerting_provider_session_service_1.AlertingProviderSessionService,
            alerting_triage_update_service_1.AlertingTriageUpdateService,
            alerting_triage_service_1.AlertingTriageService,
            alerting_observability_service_1.AlertingObservabilityService,
            alerting_triage_escalation_resolver_service_1.AlertingTriageEscalationResolverService,
            alerting_triage_escalation_service_1.AlertingTriageEscalationService,
            alerting_scheduler_service_1.AlertingSchedulerService,
            alerting_triage_view_service_1.AlertingTriageViewService,
        ],
        exports: [
            dashboard_service_1.DashboardService,
            dashboard_alerting_facade_service_1.DashboardAlertingFacadeService,
            semantic_schema_service_1.SemanticSchemaService,
            alerting_metric_service_1.AlertingMetricService,
            alerting_insight_query_service_1.AlertingInsightQueryService,
            alerting_rule_service_1.AlertingRuleService,
            alerting_template_service_1.AlertingTemplateService,
            alerting_escalation_service_1.AlertingEscalationService,
            alerting_baileys_service_1.AlertingBaileysService,
            alerting_channel_service_1.AlertingChannelService,
            alerting_config_service_1.AlertingConfigService,
            alerting_delivery_dispatch_service_1.AlertingDeliveryDispatchService,
            alerting_delivery_service_1.AlertingDeliveryService,
            alerting_provider_session_service_1.AlertingProviderSessionService,
            alerting_triage_service_1.AlertingTriageService,
            alerting_observability_service_1.AlertingObservabilityService,
            alerting_scheduler_service_1.AlertingSchedulerService,
        ],
    })
], DashboardModule);
//# sourceMappingURL=dashboard.module.js.map