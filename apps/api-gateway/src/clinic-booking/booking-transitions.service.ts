import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BookingEventsService } from './booking-events.service';
import { BookingNotificationService } from './booking-notification.service';
import { BookingValidationService } from './booking-validation.service';
import { BookingCrudService } from './booking-crud.service';
import { buildIncludeRelations } from './booking-crud.service';
import { type BookingStatus, CancelBookingDto, RescheduleBookingDto } from './dto/clinic-booking.dto';
import { VALID_TRANSITIONS } from './booking-state-machine';
import { formatClinicTimeOfDay } from './timezone.util';

@Injectable()
export class BookingTransitionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: BookingEventsService,
    private readonly notifier: BookingNotificationService,
    private readonly validation: BookingValidationService,
    private readonly crudService: BookingCrudService,
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

    // Slice 9: WA event triggers per status
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
    const existing = await this.crudService.findOne(id);
    const current = existing.data.status as BookingStatus;
    if (!VALID_TRANSITIONS[current].includes('cancelled')) {
      throw new BadRequestException(`Booking sudah ${current}, tidak bisa cancel`);
    }
    const updated = await this.prisma.clinicBooking.update({
      where: { id },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelReason: dto.reason,
        updatedBy: actorId,
      },
      include: buildIncludeRelations(),
    });

    void this.notifier.notify(updated, 'Cancel Booking', { alasan: dto.reason ?? '-' });

    return { success: true, data: updated, message: 'Booking cancelled' };
  }

  async reschedule(id: number, dto: RescheduleBookingDto, actorId?: number) {
    const existing = await this.crudService.findOne(id);
    const current = existing.data.status as BookingStatus;
    if (current === 'cancelled' || current === 'completed' || current === 'in_progress') {
      throw new BadRequestException(`Booking ${current}, tidak bisa di-reschedule`);
    }

    const newStart = new Date(dto.scheduledStart);
    const newEnd = new Date(dto.scheduledEnd);
    if (!(newStart.getTime() < newEnd.getTime())) {
      throw new BadRequestException('scheduledStart harus sebelum scheduledEnd');
    }

    const newPsikologUserId = dto.psikologUserId ?? existing.data.psikologUserId;
    const newRoomId = dto.roomId ?? existing.data.roomId;

    await this.validation.assertNoRoomConflict({
      roomId: newRoomId,
      scheduledStart: newStart,
      scheduledEnd: newEnd,
      excludeBookingId: id,
    });

    await this.validation.assertNoConflict({
      psikologUserId: newPsikologUserId,
      roomId: newRoomId,
      scheduledStart: newStart,
      scheduledEnd: newEnd,
      excludeBookingId: id,
    });

    const history = (existing.data.rescheduleHistory as unknown[]) || [];
    history.push({
      from: {
        start: existing.data.scheduledStart,
        end: existing.data.scheduledEnd,
        roomId: existing.data.roomId,
        psikologUserId: existing.data.psikologUserId,
      },
      to: {
        start: newStart,
        end: newEnd,
        roomId: newRoomId,
        psikologUserId: newPsikologUserId,
      },
      reason: dto.reason ?? null,
      by: actorId ?? null,
      at: new Date(),
    });

    const updated = await this.prisma.clinicBooking.update({
      where: { id },
      data: {
        scheduledStart: newStart,
        scheduledEnd: newEnd,
        psikologUserId: newPsikologUserId,
        roomId: newRoomId,
        rescheduleHistory: history as Prisma.InputJsonValue,
        updatedBy: actorId,
      },
      include: buildIncludeRelations(),
    });

    const fmtTanggal = (d: Date) =>
      d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta',
      });
    const fmtWaktu = (d: Date) => `${formatClinicTimeOfDay(d)} WIB`;

    void this.notifier.notify(updated, 'Reschedule Booking', {
      tanggal_lama: fmtTanggal(existing.data.scheduledStart),
      waktu_lama: fmtWaktu(existing.data.scheduledStart),
      tanggal_baru: fmtTanggal(newStart),
      waktu_baru: fmtWaktu(newStart),
      alasan: dto.reason ?? '-',
    });

    return { success: true, data: updated, message: 'Booking rescheduled' };
  }
}
