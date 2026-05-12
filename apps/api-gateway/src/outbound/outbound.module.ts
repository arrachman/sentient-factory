import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OutboundBatchService } from './outbound-batch.service';
import { OutboundController } from './outbound.controller';
import { OutboundInventoryService } from './outbound-inventory.service';
import { OutboundQueryService } from './outbound-query.service';
import { OutboundService } from './outbound.service';
import { OutboundStockReportService } from './outbound-stock-report.service';
import { OutboundValidatorsService } from './outbound-validators.service';

@Module({
  imports: [PrismaModule],
  controllers: [OutboundController],
  providers: [
    OutboundService,
    OutboundBatchService,
    OutboundInventoryService,
    OutboundStockReportService,
    OutboundValidatorsService,
    OutboundQueryService,
  ],
  exports: [OutboundService],
})
export class OutboundModule {}
