import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BookingEventsService } from './booking-events.service';
import { BookingValidationService } from './booking-validation.service';
import { BookingCrudService } from './booking-crud.service';
import { buildIncludeRelations } from './booking-crud.service';
import { type BookingStatus, EditBookingDto } from './dto/clinic-booking.dto';
import { buildClinicInstant, localPartsInTimezone } from './timezone.util';
import { resolveServiceSlots, type SlotDef, type SlotOverride } from './slot-resolve.util';

@Injectable()
export class BookingEditWizardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: BookingEventsService,
    private readonly validation: BookingValidationService,
    private readonly crudService: BookingCrudService,
  ) {}

  /**
   * Auto-resolve scheduledStart/End saat service berubah tapi UI tidak kirim
   * eksplisit start/end. Identifikasi slot index di layanan lama, lalu map ke
   * slot yang sama di layanan baru (slot identity via index).
   */
  private async resolveScheduleForServiceChange(
    bookingScheduledStart: Date,
    bookingScheduledEnd: Date,
    oldServiceId: number,
    newServiceSlotOverrides: unknown,
    tz: string,
    globalSlots: SlotDef[],
  ): Promise<{ newStart: Date; newEnd: Date }> {
    const oldService = await this.prisma.clinicService.findFirst({
      where: { id: oldServiceId },
      select: { slotOverrides: true },
    });
    const oldResolved = resolveServiceSlots(
      globalSlots,
      (oldService?.slotOverrides as SlotOverride[] | null) ?? null,
    );
    const oldStartParts = localPartsInTimezone(bookingScheduledStart, tz);
    const oldEndParts = localPartsInTimezone(bookingScheduledEnd, tz);
    const slotIdx = oldResolved.findIndex(
      (sl) => sl.start === oldStartParts.hhmm && sl.end === oldEndParts.hhmm,
    );
    if (slotIdx < 0) {
      throw new BadRequestException(
        `Booking saat ini (${oldStartParts.hhmm}-${oldEndParts.hhmm}) tidak match slot manapun di layanan lama — tidak bisa auto-resolve ke layanan baru. Reschedule dulu, lalu ubah layanan.`,
      );
    }

    const newResolved = resolveServiceSlots(
      globalSlots,
      (newServiceSlotOverrides as SlotOverride[] | null) ?? null,
    );
    const newSlot = newResolved[slotIdx];
    if (!newSlot) {
      throw new BadRequestException(`Layanan baru tidak punya slot di posisi ${slotIdx + 1}.`);
    }

    return {
      newStart: buildClinicInstant(oldStartParts.dateStr, newSlot.start, tz),
      newEnd: buildClinicInstant(oldStartParts.dateStr, newSlot.end, tz),
    };
  }

  /**
   * Recompute payment amounts setelah service berubah.
   * DP 50%, PPN 11%.
   */
  private async recomputePayment(
    bookingId: number,
    basePrice: number,
    actorId?: number,
  ): Promise<void> {
    const payment = await this.prisma.clinicPayment.findUnique({
      where: { bookingId },
      select: { id: true, paidAmount: true, dpPaidAt: true, lunasAt: true },
    });
    if (!payment) return;

    const base = basePrice;
    const tax = Math.round(base * 0.11);
    const total = base + tax;
    const dp = Math.round(total * 0.5);
    const paid = Number(payment.paidAmount);
    let status: 'pending' | 'dp_paid' | 'lunas' = 'pending';
    if (paid >= total) status = 'lunas';
    else if (paid >= dp) status = 'dp_paid';

    await this.prisma.clinicPayment.update({
      where: { id: payment.id },
      data: {
        totalAmount: total,
        taxAmount: tax,
        dpAmount: dp,
        status,
        lunasAt: status === 'lunas' ? payment.lunasAt ?? new Date() : null,
        dpPaidAt:
          status === 'dp_paid' || status === 'lunas' ? payment.dpPaidAt ?? new Date() : null,
        updatedBy: actorId,
      },
    });
  }

  /**
   * Atomic edit untuk booking ber-status `checked_in` — backend dari wizard
   * "Ubah Booking" (mulai step 2 Layanan). Admin boleh ubah service,
   * scheduledStart/End, psikolog, room, notes — semua dalam satu transaksi.
   *
   * Flow:
   *   1. Status guard: harus `checked_in`
   *   2. Build nilai baru (fallback ke existing kalau field tidak dikirim)
   *   3. Validate entities exist (client/service/psikolog/room aktif)
   *   4. Validate psikolog handle service baru (junction kosong = handle semua)
   *   5. Validate slot match (pakai serviceId baru → hormati slotOverrides)
   *   6. Validate no conflict (psikolog + room, exclude self)
   *   7. Detect schedule/psikolog/room change → push ke rescheduleHistory
   *   8. Update booking + recompute payment (kalau service berubah)
   *
   * Sengaja TIDAK fan-out WA — admin action saat klien sudah hadir di klinik
   * (silent, audit-logged via interceptor).
   */
  async editBooking(id: number, dto: EditBookingDto, actorId?: number) {
    const existing = await this.crudService.findOne(id);
    const booking = existing.data;
    const current = booking.status as BookingStatus;
    if (current !== 'checked_in') {
      throw new BadRequestException(
        `Ubah booking hanya boleh saat status checked_in. Status saat ini: ${current}.`,
      );
    }

    const newServiceId = dto.serviceId ?? booking.serviceId;
    const newPsikologUserId = dto.psikologUserId ?? booking.psikologUserId;
    const newRoomId = dto.roomId ?? booking.roomId;

    await this.validation.assertEntitiesExist(
      booking.clientId,
      newServiceId,
      newPsikologUserId,
      newRoomId,
    );

    const service = await this.prisma.clinicService.findFirst({
      where: { id: newServiceId, deletedAt: null, isActive: true },
      select: {
        id: true,
        name: true,
        basePrice: true,
        durationMinutes: true,
        slotOverrides: true,
        psikologs: { select: { psikologUserId: true } },
      },
    });
    if (!service) {
      throw new BadRequestException(`Layanan ${newServiceId} tidak ditemukan / nonaktif.`);
    }

    let newStart = dto.scheduledStart ? new Date(dto.scheduledStart) : booking.scheduledStart;
    let newEnd = dto.scheduledEnd ? new Date(dto.scheduledEnd) : booking.scheduledEnd;

    if (!dto.scheduledStart && !dto.scheduledEnd && newServiceId !== booking.serviceId) {
      const settings = await this.prisma.clinicSettings.findFirst({ where: { id: 1 } });
      const tz = settings?.timezone || 'Asia/Jakarta';
      const globalSlots = (settings?.slotsOfDay as SlotDef[]) || [];

      const resolved = await this.resolveScheduleForServiceChange(
        booking.scheduledStart,
        booking.scheduledEnd,
        booking.serviceId,
        service.slotOverrides,
        tz,
        globalSlots,
      );
      newStart = resolved.newStart;
      newEnd = resolved.newEnd;
    }

    if (!(newStart.getTime() < newEnd.getTime())) {
      throw new BadRequestException('scheduledStart harus sebelum scheduledEnd.');
    }

    if (service.psikologs.length > 0) {
      const ok = service.psikologs.some((p) => p.psikologUserId === newPsikologUserId);
      if (!ok) {
        throw new BadRequestException(
          `Psikolog yang ditugaskan tidak menangani layanan "${service.name}". Pilih psikolog lain atau layanan lain.`,
        );
      }
    }

    await this.validation.assertSlotMatch(newStart, newEnd, service.id);

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

    const scheduleChanged =
      newStart.getTime() !== booking.scheduledStart.getTime() ||
      newEnd.getTime() !== booking.scheduledEnd.getTime() ||
      newPsikologUserId !== booking.psikologUserId ||
      newRoomId !== booking.roomId;
    const serviceChanged = newServiceId !== booking.serviceId;

    const data: Prisma.ClinicBookingUpdateInput = { updatedBy: actorId };
    if (serviceChanged) {
      data.service = { connect: { id: newServiceId } };
    }
    if (newPsikologUserId !== booking.psikologUserId) {
      data.psikolog = { connect: { id: newPsikologUserId } };
    }
    if (newRoomId !== booking.roomId) {
      data.room = { connect: { id: newRoomId } };
    }
    if (newStart.getTime() !== booking.scheduledStart.getTime()) {
      data.scheduledStart = newStart;
    }
    if (newEnd.getTime() !== booking.scheduledEnd.getTime()) {
      data.scheduledEnd = newEnd;
    }
    if (dto.notes !== undefined) data.notes = dto.notes;

    if (scheduleChanged) {
      const history = (booking.rescheduleHistory as unknown[]) || [];
      history.push({
        from: {
          start: booking.scheduledStart,
          end: booking.scheduledEnd,
          roomId: booking.roomId,
          psikologUserId: booking.psikologUserId,
          serviceId: booking.serviceId,
        },
        to: {
          start: newStart,
          end: newEnd,
          roomId: newRoomId,
          psikologUserId: newPsikologUserId,
          serviceId: newServiceId,
        },
        reason: dto.reason ?? null,
        by: actorId ?? null,
        at: new Date(),
        source: 'edit-wizard',
      });
      data.rescheduleHistory = history as Prisma.InputJsonValue;
    }

    const updated = await this.prisma.clinicBooking.update({
      where: { id },
      data,
      include: buildIncludeRelations(),
    });

    if (serviceChanged) {
      await this.recomputePayment(id, Number(service.basePrice), actorId);
    }

    this.events.emit({ type: 'transition', bookingId: id, status: current });

    return {
      success: true,
      data: updated,
      message: 'Booking diperbarui',
    };
  }
}
