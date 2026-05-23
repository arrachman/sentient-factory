import { Injectable } from '@nestjs/common';
import { BookingNotesService } from './booking-notes.service';
import { BookingNotificationService } from './booking-notification.service';
import { BookingPackageService } from './booking-package.service';
import { BookingCrudService } from './booking-crud.service';
import { BookingTransitionsService } from './booking-transitions.service';
import {
  type BookingStatus,
  CancelBookingDto,
  CreateBookingDto,
  CreatePackageBookingDto,
  QueryBookingDto,
  RescheduleBookingDto,
  UpdateBookingDto,
} from './dto/clinic-booking.dto';

/**
 * Booking domain orchestrator — thin delegation only.
 * Sub-services: BookingCrudService, BookingTransitionsService,
 * BookingPackageService, BookingNotificationService, BookingNotesService.
 */
@Injectable()
export class ClinicBookingService {
  constructor(
    private readonly crudService: BookingCrudService,
    private readonly transitionsService: BookingTransitionsService,
    private readonly notifier: BookingNotificationService,
    private readonly notes: BookingNotesService,
    private readonly packageService: BookingPackageService,
  ) {}

  // CRUD
  create(dto: CreateBookingDto, actorId?: number) {
    return this.crudService.create(dto, actorId);
  }

  findAll(query: QueryBookingDto) {
    return this.crudService.findAll(query);
  }

  findOne(id: number) {
    return this.crudService.findOne(id);
  }

  update(id: number, dto: UpdateBookingDto, actorId?: number) {
    return this.crudService.update(id, dto, actorId);
  }

  createPackage(dto: CreatePackageBookingDto, actorId?: number) {
    return this.packageService.create(dto, actorId);
  }

  // State transitions
  transition(id: number, target: BookingStatus, actorId?: number) {
    return this.transitionsService.transition(id, target, actorId);
  }

  start(id: number, actorId?: number) {
    return this.transitionsService.start(id, actorId);
  }

  complete(id: number, actorId?: number) {
    return this.transitionsService.complete(id, actorId);
  }

  cancel(id: number, dto: CancelBookingDto, actorId?: number) {
    return this.transitionsService.cancel(id, dto, actorId);
  }

  reschedule(id: number, dto: RescheduleBookingDto, actorId?: number) {
    return this.transitionsService.reschedule(id, dto, actorId);
  }

  // Notes
  addNote(bookingId: number, noteText: string, actorId?: number) {
    return this.notes.addNote(bookingId, noteText, actorId);
  }

  listNotes(bookingId: number) {
    return this.notes.listNotes(bookingId);
  }

  // Manual WA reminder
  async sendReminder(id: number, templateName: string, actorId?: number) {
    const booking = await this.crudService.findOne(id);
    void actorId;
    const result = await this.notifier.sendManualReminder(booking.data, templateName);
    return { success: true, data: result, message: `Reminder '${templateName}' dispatched` };
  }
}
