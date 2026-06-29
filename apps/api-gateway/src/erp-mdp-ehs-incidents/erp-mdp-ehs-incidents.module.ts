import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpEhsIncidentsController } from './erp-mdp-ehs-incidents.controller';
import { ErpMdpEhsIncidentsService } from './erp-mdp-ehs-incidents.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpEhsIncidentsController],
  providers: [ErpMdpEhsIncidentsService],
  exports: [ErpMdpEhsIncidentsService],
})
export class ErpMdpEhsIncidentsModule {}
