import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardMysqlService } from './dashboard-mysql.service';
import { DashboardService } from './dashboard.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, DashboardMysqlService],
  exports: [DashboardService],
})
export class DashboardModule {}
