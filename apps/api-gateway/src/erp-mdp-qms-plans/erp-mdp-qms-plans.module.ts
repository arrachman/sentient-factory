import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpQmsPlansController } from './erp-mdp-qms-plans.controller';
import { ErpMdpQmsPlansService } from './erp-mdp-qms-plans.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpQmsPlansController],
  providers: [ErpMdpQmsPlansService],
  exports: [ErpMdpQmsPlansService],
})
export class ErpMdpQmsPlansModule {}
