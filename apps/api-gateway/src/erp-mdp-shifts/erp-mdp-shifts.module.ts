import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpShiftsController } from './erp-mdp-shifts.controller';
import { ErpMdpShiftsService } from './erp-mdp-shifts.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpShiftsController],
  providers: [ErpMdpShiftsService],
  exports: [ErpMdpShiftsService],
})
export class ErpMdpShiftsModule {}
