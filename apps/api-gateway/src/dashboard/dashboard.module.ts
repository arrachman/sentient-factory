import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DashboardController } from './dashboard.controller';
import { DashboardMysqlService } from './dashboard-mysql.service';
import { DashboardService } from './dashboard.service';
import { SemanticSchemaService } from './semantic-schema.service';

@Module({
  imports: [PrismaModule],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardMysqlService, SemanticSchemaService],
  exports: [DashboardService, SemanticSchemaService],
})
export class DashboardModule {}
