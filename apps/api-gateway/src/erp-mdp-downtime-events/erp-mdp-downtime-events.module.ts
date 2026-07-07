import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpDowntimeEventsController } from './erp-mdp-downtime-events.controller';
import { ErpMdpDowntimeEventsService } from './erp-mdp-downtime-events.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpDowntimeEventsController],
  providers: [ErpMdpDowntimeEventsService],
  exports: [ErpMdpDowntimeEventsService],
})
export class ErpMdpDowntimeEventsModule {}
