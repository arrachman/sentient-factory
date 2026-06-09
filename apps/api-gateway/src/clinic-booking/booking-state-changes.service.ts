import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BookingNotificationService } from './booking-notification.service';
import { BookingValidationService } from './booking-validation.service';
import { BookingCrudService } from './booking-crud.service';
import { buildIncludeRelations } from './booking-crud.service';
import {
  type BookingStatus,
  CancelBookingDto,
  RescheduleBookingDto,
} from './dto/clinic-booking.dto';
import { VALID_TRANSITIONS } from './booking-state-machine';
import { formatClinicTimeOfDay } from './timezone.util';

@Injectable()
export class BookingStateChangesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifier: BookingNotificationService,
    private readonly validation: BookingValidationService,
    private readonly crudService: BookingCrudService,
  ) {}

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

    await this.validation.assertDefaultSlotsCapacity(newPsikologUserId, newStart, id);

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
