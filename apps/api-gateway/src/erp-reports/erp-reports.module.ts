import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpReportsController } from './erp-reports.controller';
import { ErpReportsService } from './erp-reports.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpReportsController],
  providers: [ErpReportsService],
})
export class ErpReportsModule {}
