import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AlertingAnalyticsService } from './alerting-analytics.service';
import { AlertingBaileysService } from './alerting-baileys.service';
import { AlertingChannelService } from './alerting-channel.service';
import { AlertingConfigService } from './alerting-config.service';
import { AlertingDeliveryDispatchService } from './alerting-delivery-dispatch.service';
import { AlertingDeliveryService } from './alerting-delivery.service';
import { AlertingEscalationService } from './alerting-escalation.service';
import { AlertingInsightQueryService } from './alerting-insight-query.service';
import { AlertingMetricService } from './alerting-metric.service';
import { AlertingObservabilityService } from './alerting-observability.service';
import { AlertingProviderSessionService } from './alerting-provider-session.service';
import { AlertingRuleRunnerService } from './alerting-rule-runner.service';
import { AlertingRuleService } from './alerting-rule.service';
import { AlertingSchedulerService } from './alerting-scheduler.service';
import { AlertingTemplateService } from './alerting-template.service';
import { AlertingTriageEscalationResolverService } from './alerting-triage-escalation-resolver.service';
import { AlertingTriageEscalationService } from './alerting-triage-escalation.service';
import { AlertingTriageService } from './alerting-triage.service';
import { AlertingTriageUpdateService } from './alerting-triage-update.service';
import { AlertingTriageViewService } from './alerting-triage-view.service';
import { AlertingConfigController } from './alerting-config.controller';
import { AlertingDeliveryController } from './alerting-delivery.controller';
import { AlertingOpsController } from './alerting-ops.controller';
import { AlertingRulesController } from './alerting-rules.controller';
import { DashboardController } from './dashboard.controller';
import { DashboardCustomDbService } from './dashboard-custom-db.service';
import { DashboardCustomDbWidgetService } from './dashboard-custom-db-widget.service';
import { DashboardInsightService } from './dashboard-insight.service';
import { DashboardMysqlService } from './dashboard-mysql.service';
import { DashboardQueryService } from './dashboard-query.service';
import { DashboardQueryM2Service } from './dashboard-query-m2.service';
import { DashboardQueryM2CrService } from './dashboard-query-m2cr.service';
import { DashboardService } from './dashboard.service';
import { SemanticSchemaService } from './semantic-schema.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    DashboardController,
    AlertingRulesController,
    AlertingConfigController,
    AlertingDeliveryController,
    AlertingOpsController,
  ],
  providers: [
    DashboardService,
    DashboardQueryService,
    DashboardQueryM2Service,
    DashboardQueryM2CrService,
    DashboardCustomDbService,
    DashboardCustomDbWidgetService,
    DashboardInsightService,
    DashboardMysqlService,
    SemanticSchemaService,
    AlertingAnalyticsService,
    AlertingMetricService,
    AlertingInsightQueryService,
    AlertingRuleRunnerService,
    AlertingRuleService,
    AlertingTemplateService,
    AlertingEscalationService,
    AlertingBaileysService,
    AlertingChannelService,
    AlertingConfigService,
    AlertingDeliveryDispatchService,
    AlertingDeliveryService,
    AlertingProviderSessionService,
    AlertingTriageUpdateService,
    AlertingTriageService,
    AlertingObservabilityService,
    AlertingTriageEscalationResolverService,
    AlertingTriageEscalationService,
    AlertingSchedulerService,
    AlertingTriageViewService,
  ],
  exports: [
    DashboardService,
    SemanticSchemaService,
    AlertingMetricService,
    AlertingInsightQueryService,
    AlertingRuleService,
    AlertingTemplateService,
    AlertingEscalationService,
    AlertingBaileysService,
    AlertingChannelService,
    AlertingConfigService,
    AlertingDeliveryDispatchService,
    AlertingDeliveryService,
    AlertingProviderSessionService,
    AlertingTriageService,
    AlertingObservabilityService,
    AlertingSchedulerService,
  ],
})
export class DashboardModule {}
