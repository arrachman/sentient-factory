import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpQmsCapaActionsController } from './erp-mdp-qms-capa-actions.controller';
import { ErpMdpQmsCapaActionsService } from './erp-mdp-qms-capa-actions.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpQmsCapaActionsController],
  providers: [ErpMdpQmsCapaActionsService],
  exports: [ErpMdpQmsCapaActionsService],
})
export class ErpMdpQmsCapaActionsModule {}
