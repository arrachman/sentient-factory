import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpProductionOrdersController } from './erp-mdp-production-orders.controller';
import { ErpMdpProductionOrdersService } from './erp-mdp-production-orders.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpProductionOrdersController],
  providers: [ErpMdpProductionOrdersService],
  exports: [ErpMdpProductionOrdersService],
})
export class ErpMdpProductionOrdersModule {}
