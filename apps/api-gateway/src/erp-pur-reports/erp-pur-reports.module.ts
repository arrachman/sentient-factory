/**
 * Purchasing (M4) reports module. Registers the generic view + export controller.
 */

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpPurReportsController } from './erp-pur-reports.controller';
import { PurReportsService } from './pur-reports.service';
import { ReportExportService } from './report-export.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpPurReportsController],
  providers: [PurReportsService, ReportExportService],
})
export class ErpPurReportsModule {}
