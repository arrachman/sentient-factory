import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpFinReportsExtService } from './erp-fin-reports-ext.service';
import { ErpFinReportsController } from './erp-fin-reports.controller';
import { ErpFinReportsService } from './erp-fin-reports.service';
import { ReportExportService } from './report-export.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpFinReportsController],
  providers: [ErpFinReportsService, ErpFinReportsExtService, ReportExportService],
  exports: [ErpFinReportsService, ErpFinReportsExtService],
})
export class ErpFinReportsModule {}
