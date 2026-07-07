import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpPrtEscalationsController } from './erp-mdp-prt-escalations.controller';
import { ErpMdpPrtEscalationsService } from './erp-mdp-prt-escalations.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpPrtEscalationsController],
  providers: [ErpMdpPrtEscalationsService],
  exports: [ErpMdpPrtEscalationsService],
})
export class ErpMdpPrtEscalationsModule {}
