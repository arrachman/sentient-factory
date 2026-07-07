import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpWorkCentersController } from './erp-mdp-work-centers.controller';
import { ErpMdpWorkCentersService } from './erp-mdp-work-centers.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpWorkCentersController],
  providers: [ErpMdpWorkCentersService],
  exports: [ErpMdpWorkCentersService],
})
export class ErpMdpWorkCentersModule {}
