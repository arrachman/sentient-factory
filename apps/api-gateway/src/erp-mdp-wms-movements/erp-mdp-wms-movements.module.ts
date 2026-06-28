import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpWmsMovementsController } from './erp-mdp-wms-movements.controller';
import { ErpMdpWmsMovementsService } from './erp-mdp-wms-movements.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpWmsMovementsController],
  providers: [ErpMdpWmsMovementsService],
  exports: [ErpMdpWmsMovementsService],
})
export class ErpMdpWmsMovementsModule {}
