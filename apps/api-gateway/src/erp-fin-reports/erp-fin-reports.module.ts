import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpFinReportsController } from './erp-fin-reports.controller';
import { ErpFinReportsService } from './erp-fin-reports.service';
import { ReportExportService } from './report-export.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpFinReportsController],
  providers: [ErpFinReportsService, ReportExportService],
  exports: [ErpFinReportsService],
})
export class ErpFinReportsModule {}
