import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpMaterialConsumptionsController } from './erp-mdp-material-consumptions.controller';
import { ErpMdpMaterialConsumptionsService } from './erp-mdp-material-consumptions.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpMaterialConsumptionsController],
  providers: [ErpMdpMaterialConsumptionsService],
  exports: [ErpMdpMaterialConsumptionsService],
})
export class ErpMdpMaterialConsumptionsModule {}
