import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AlertingConfigService } from './alerting-config.service';
import { AlertingDeliveryService } from './alerting-delivery.service';
import { AlertingObservabilityService } from './alerting-observability.service';
import { AlertingRuleService } from './alerting-rule.service';
import { AlertingSchedulerService } from './alerting-scheduler.service';
import { DashboardController } from './dashboard.controller';
import { DashboardCustomDbService } from './dashboard-custom-db.service';
import { DashboardInsightService } from './dashboard-insight.service';
import { DashboardMysqlService } from './dashboard-mysql.service';
import { DashboardService } from './dashboard.service';
import { SemanticSchemaService } from './semantic-schema.service';

@Module({
  imports: [PrismaModule],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    DashboardCustomDbService,
    DashboardInsightService,
    DashboardMysqlService,
    SemanticSchemaService,
    AlertingRuleService,
    AlertingConfigService,
    AlertingDeliveryService,
    AlertingObservabilityService,
    AlertingSchedulerService,
  ],
  exports: [
    DashboardService,
    SemanticSchemaService,
    AlertingRuleService,
    AlertingConfigService,
    AlertingDeliveryService,
    AlertingObservabilityService,
    AlertingSchedulerService,
  ],
})
export class DashboardModule {}
