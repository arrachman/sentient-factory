import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { InvStockMovementPostingService } from './inv-stock-movement-posting.service';
import { ErpInvStockMovementsController } from './erp-inv-stock-movements.controller';
import { ErpInvStockMovementsService } from './erp-inv-stock-movements.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpInvStockMovementsController],
  providers: [ErpInvStockMovementsService, InvStockMovementPostingService],
  exports: [ErpInvStockMovementsService],
})
export class ErpInvStockMovementsModule {}
