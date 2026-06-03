/**
 * Warehouse (M3) reports module. Imports the moving-average engine for stock
 * aggregation reports. Registers the generic view + export controller.
 */

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpInvGlModule } from '../erp-inv-gl/erp-inv-gl.module';
import { ErpInvReportsController } from './erp-inv-reports.controller';
import { InvReportsService } from './inv-reports.service';
import { ReportExportService } from './report-export.service';

@Module({
  imports: [PrismaModule, ErpInvGlModule],
  controllers: [ErpInvReportsController],
  providers: [InvReportsService, ReportExportService],
})
export class ErpInvReportsModule {}
