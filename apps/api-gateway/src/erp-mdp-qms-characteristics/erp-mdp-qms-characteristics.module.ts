import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpQmsCharacteristicsController } from './erp-mdp-qms-characteristics.controller';
import { ErpMdpQmsCharacteristicsService } from './erp-mdp-qms-characteristics.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpQmsCharacteristicsController],
  providers: [ErpMdpQmsCharacteristicsService],
  exports: [ErpMdpQmsCharacteristicsService],
})
export class ErpMdpQmsCharacteristicsModule {}
