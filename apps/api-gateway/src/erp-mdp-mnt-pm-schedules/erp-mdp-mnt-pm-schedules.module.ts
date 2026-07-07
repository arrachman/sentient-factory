import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpMntPmSchedulesController } from './erp-mdp-mnt-pm-schedules.controller';
import { ErpMdpMntPmSchedulesService } from './erp-mdp-mnt-pm-schedules.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpMntPmSchedulesController],
  providers: [ErpMdpMntPmSchedulesService],
  exports: [ErpMdpMntPmSchedulesService],
})
export class ErpMdpMntPmSchedulesModule {}
