import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClinicWaModule } from '../clinic-wa/clinic-wa.module';
import { ClinicBookingController } from './clinic-booking.controller';
import { ClinicBookingService } from './clinic-booking.service';

@Module({
  imports: [PrismaModule, ClinicWaModule],
  controllers: [ClinicBookingController],
  providers: [ClinicBookingService],
  exports: [ClinicBookingService],
})
export class ClinicBookingModule {}
