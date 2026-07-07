import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpQmsInspectionsController } from './erp-mdp-qms-inspections.controller';
import { ErpMdpQmsInspectionsService } from './erp-mdp-qms-inspections.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpQmsInspectionsController],
  providers: [ErpMdpQmsInspectionsService],
  exports: [ErpMdpQmsInspectionsService],
})
export class ErpMdpQmsInspectionsModule {}
