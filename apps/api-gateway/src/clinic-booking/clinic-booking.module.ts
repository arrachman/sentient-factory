import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClinicWaModule } from '../clinic-wa/clinic-wa.module';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';
import { BookingEventsService } from './booking-events.service';
import { BookingNotesService } from './booking-notes.service';
import { BookingNotificationService } from './booking-notification.service';
import { BookingPackageService } from './booking-package.service';
import { BookingAutoTransitionScheduler } from './booking-auto-transition.scheduler';
import { BookingReminderScheduler } from './booking-reminder.scheduler';
import { BookingStreamController } from './booking-stream.controller';
import { BookingValidationService } from './booking-validation.service';
import { ClinicBookingController } from './clinic-booking.controller';
import { ClinicBookingService } from './clinic-booking.service';
import { WaSchedulerTriggerController } from './wa-scheduler-trigger.controller';

@Module({
  imports: [PrismaModule, ClinicWaModule],
  controllers: [ClinicBookingController, BookingStreamController, WaSchedulerTriggerController],
  providers: [
    ClinicBookingService,
    BookingValidationService,
    BookingNotificationService,
    BookingNotesService,
    BookingPackageService,
    BookingEventsService,
    BookingReminderScheduler,
    BookingAutoTransitionScheduler,
    IdempotencyInterceptor,
  ],
  exports: [ClinicBookingService, BookingEventsService, BookingReminderScheduler],
})
export class ClinicBookingModule {}
