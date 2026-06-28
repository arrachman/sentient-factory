import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpWorkCalendarsController } from './erp-mdp-work-calendars.controller';
import { ErpMdpWorkCalendarsService } from './erp-mdp-work-calendars.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpWorkCalendarsController],
  providers: [ErpMdpWorkCalendarsService],
  exports: [ErpMdpWorkCalendarsService],
})
export class ErpMdpWorkCalendarsModule {}
