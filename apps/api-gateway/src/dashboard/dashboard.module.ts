import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AlertingConfigService } from './alerting-config.service';
import { AlertingDeliveryService } from './alerting-delivery.service';
import { AlertingRuleService } from './alerting-rule.service';
import { DashboardController } from './dashboard.controller';
import { DashboardMysqlService } from './dashboard-mysql.service';
import { DashboardService } from './dashboard.service';
import { SemanticSchemaService } from './semantic-schema.service';

@Module({
  imports: [PrismaModule],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    DashboardMysqlService,
    SemanticSchemaService,
    AlertingRuleService,
    AlertingConfigService,
    AlertingDeliveryService,
  ],
  exports: [
    DashboardService,
    SemanticSchemaService,
    AlertingRuleService,
    AlertingConfigService,
    AlertingDeliveryService,
  ],
})
export class DashboardModule {}
