import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OutboundBatchService } from './outbound-batch.service';
import { OutboundController } from './outbound.controller';
import { OutboundInventoryService } from './outbound-inventory.service';
import { OutboundService } from './outbound.service';
import { OutboundStockReportService } from './outbound-stock-report.service';

@Module({
  imports: [PrismaModule],
  controllers: [OutboundController],
  providers: [
    OutboundService,
    OutboundBatchService,
    OutboundInventoryService,
    OutboundStockReportService,
  ],
  exports: [OutboundService],
})
export class OutboundModule {}
