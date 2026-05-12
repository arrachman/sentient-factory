import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { InboundsController } from './inbounds.controller';
import { InboundLedgerSyncService } from './inbound-ledger-sync.service';
import { InboundStockGuardService } from './inbound-stock-guard.service';
import { InboundWarehouseResolverService } from './inbound-warehouse-resolver.service';
import { InboundsService } from './inbounds.service';

@Module({
  imports: [PrismaModule],
  controllers: [InboundsController],
  providers: [
    InboundsService,
    InboundStockGuardService,
    InboundLedgerSyncService,
    InboundWarehouseResolverService,
  ],
  exports: [InboundsService],
})
export class InboundsModule {}
