import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AlertingConfigService } from './alerting-config.service';
import { AlertingDeliveryService } from './alerting-delivery.service';
import { AlertingEscalationService } from './alerting-escalation.service';
import { AlertingInsightQueryService } from './alerting-insight-query.service';
import { AlertingMetricService } from './alerting-metric.service';
import { AlertingObservabilityService } from './alerting-observability.service';
import { AlertingProviderSessionService } from './alerting-provider-session.service';
import { AlertingRuleService } from './alerting-rule.service';
import { AlertingSchedulerService } from './alerting-scheduler.service';
import { AlertingTemplateService } from './alerting-template.service';
import { AlertingTriageService } from './alerting-triage.service';
import { AlertingDeliveryController } from './alerting-delivery.controller';
import { AlertingOpsController } from './alerting-ops.controller';
import { AlertingRulesController } from './alerting-rules.controller';
import { DashboardController } from './dashboard.controller';
import { DashboardCustomDbService } from './dashboard-custom-db.service';
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
    AlertingDeliveryController,
    AlertingOpsController,
  ],
  providers: [
    DashboardService,
    DashboardQueryService,
    DashboardQueryM2Service,
    DashboardQueryM2CrService,
    DashboardCustomDbService,
    DashboardInsightService,
    DashboardMysqlService,
    SemanticSchemaService,
    AlertingMetricService,
    AlertingInsightQueryService,
    AlertingRuleService,
    AlertingTemplateService,
    AlertingEscalationService,
    AlertingConfigService,
    AlertingDeliveryService,
    AlertingProviderSessionService,
    AlertingTriageService,
    AlertingObservabilityService,
    AlertingSchedulerService,
  ],
  exports: [
    DashboardService,
    SemanticSchemaService,
    AlertingMetricService,
    AlertingInsightQueryService,
    AlertingRuleService,
    AlertingTemplateService,
    AlertingEscalationService,
    AlertingConfigService,
    AlertingDeliveryService,
    AlertingProviderSessionService,
    AlertingTriageService,
    AlertingObservabilityService,
    AlertingSchedulerService,
  ],
})
export class DashboardModule {}
