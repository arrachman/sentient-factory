import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BookingEventsService } from './booking-events.service';
import { BookingNotificationService } from './booking-notification.service';
import { BookingCrudService } from './booking-crud.service';
import { buildIncludeRelations } from './booking-crud.service';
import {
  type BookingStatus,
  CancelBookingDto,
  EditBookingDto,
  RescheduleBookingDto,
} from './dto/clinic-booking.dto';
import { VALID_TRANSITIONS } from './booking-state-machine';
import { formatClinicTimeOfDay } from './timezone.util';
import { BookingStateChangesService } from './booking-state-changes.service';
import { BookingEditWizardService } from './booking-edit-wizard.service';

@Injectable()
export class BookingTransitionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: BookingEventsService,
    private readonly notifier: BookingNotificationService,
    private readonly crudService: BookingCrudService,
    private readonly stateChanges: BookingStateChangesService,
    private readonly editWizard: BookingEditWizardService,
  ) {}

  async transition(id: number, target: BookingStatus, actorId?: number) {
    const existing = await this.crudService.findOne(id);
    const current = existing.data.status as BookingStatus;
    const allowed = VALID_TRANSITIONS[current] || [];
    if (!allowed.includes(target)) {
      throw new BadRequestException(
        `Transisi ${current} → ${target} tidak valid. Allowed: [${allowed.join(', ')}]`,
      );
    }
    const now = new Date();
    const data: Prisma.ClinicBookingUpdateInput = { status: target, updatedBy: actorId };
    if (target === 'checked_in') data.checkedInAt = now;
    if (target === 'in_progress') data.startedAt = now;
    if (target === 'completed') data.completedAt = now;
    if (target === 'cancelled') data.cancelledAt = now;

    const updated = await this.prisma.clinicBooking.update({
      where: { id },
      data,
      include: buildIncludeRelations(),
    });

    if (target === 'completed') {
      const nextBooking = await this.prisma.clinicBooking.findFirst({
        where: {
          clientId: updated.clientId,
          id: { not: updated.id },
          deletedAt: null,
          status: { in: ['scheduled', 'confirmed', 'checked_in'] },
          scheduledStart: { gt: now },
        },
        orderBy: { scheduledStart: 'asc' },
        select: { scheduledStart: true },
      });
      const sesiBerikutTanggal = nextBooking
        ? `${nextBooking.scheduledStart.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            timeZone: 'Asia/Jakarta',
          })} pukul ${formatClinicTimeOfDay(nextBooking.scheduledStart)} WIB`
        : '(belum dijadwalkan)';
      void this.notifier.notify(updated, 'Follow-up Post Session', {
        sesi_berikut_tanggal: sesiBerikutTanggal,
      });
    }

    this.events.emit({ type: 'transition', bookingId: id, status: target });

    return { success: true, data: updated, message: `Booking → ${target}` };
  }

  async start(id: number, actorId?: number) {
    return this.transition(id, 'in_progress', actorId);
  }

  async complete(id: number, actorId?: number) {
    return this.transition(id, 'completed', actorId);
  }

  async cancel(id: number, dto: CancelBookingDto, actorId?: number) {
    return this.stateChanges.cancel(id, dto, actorId);
  }

  async reschedule(id: number, dto: RescheduleBookingDto, actorId?: number) {
    return this.stateChanges.reschedule(id, dto, actorId);
  }

  async editBooking(id: number, dto: EditBookingDto, actorId?: number) {
    return this.editWizard.editBooking(id, dto, actorId);
  }
}
