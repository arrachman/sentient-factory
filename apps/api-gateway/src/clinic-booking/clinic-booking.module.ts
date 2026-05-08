import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClinicWaModule } from '../clinic-wa/clinic-wa.module';
import { BookingEventsService } from './booking-events.service';
import { BookingStreamController } from './booking-stream.controller';
import { ClinicBookingController } from './clinic-booking.controller';
import { ClinicBookingService } from './clinic-booking.service';

@Module({
  imports: [PrismaModule, ClinicWaModule],
  controllers: [ClinicBookingController, BookingStreamController],
  providers: [ClinicBookingService, BookingEventsService],
  exports: [ClinicBookingService, BookingEventsService],
})
export class ClinicBookingModule {}
