import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BookingEventsService } from './booking-events.service';
import { BookingNotificationService } from './booking-notification.service';
import { BookingValidationService } from './booking-validation.service';
import { BookingCrudService } from './booking-crud.service';
import { buildIncludeRelations } from './booking-crud.service';
import {
  type BookingStatus,
  CancelBookingDto,
  EditBookingDto,
  RescheduleBookingDto,
} from './dto/clinic-booking.dto';
import { VALID_TRANSITIONS } from './booking-state-machine';
import { buildClinicInstant, formatClinicTimeOfDay, localPartsInTimezone } from './timezone.util';
import { resolveServiceSlots, type SlotDef, type SlotOverride } from './slot-resolve.util';

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

  /**
   * Atomic edit untuk booking ber-status `checked_in` atau `completed` —
   * backend dari wizard "Ubah Booking" (mulai step 2 Layanan).
   *
   * Mode `checked_in`: admin boleh ubah service, scheduledStart/End, psikolog,
   * room, notes — semua dalam satu transaksi, dengan validasi penuh
   * (slot-match, no-conflict, junction psikolog↔service).
   *
   * Mode `completed` (recategorisasi historis): sesi sudah lewat, jadi
   * jadwal/slot/konflik TIDAK divalidasi. scheduledStart/End TETAP — meskipun
   * durasi layanan baru berbeda, kita TIDAK auto-resolve waktu. Use case:
   * admin salah pilih layanan saat booking & ingin koreksi laporan +
   * pembayaran (recompute total/DP, paidAmount tetap, status re-derive).
   *
   * Flow:
   *   1. Status guard: `checked_in` atau `completed`
   *   2. Build nilai baru (fallback ke existing kalau field tidak dikirim)
   *   3. Validate entities exist (client/service/psikolog/room aktif)
   *   4. Validate psikolog handle service baru (junction kosong = handle semua)
   *   5. [checked_in only] Auto-resolve scheduledStart/End via slot index +
   *      assertSlotMatch + assertNo(Room)Conflict (exclude self)
   *   6. Detect perubahan service/jadwal/psikolog/room → push ke
   *      rescheduleHistory (juga untuk service-only edit, supaya audit
   *      tracking layanan tidak hilang)
   *   7. Update booking + recompute payment (kalau service berubah)
   *
   * Sengaja TIDAK fan-out WA — admin action saat klien sudah hadir / sudah
   * pulang (silent, audit-logged via interceptor).
   */
  async editBooking(id: number, dto: EditBookingDto, actorId?: number) {
    const existing = await this.crudService.findOne(id);
    const booking = existing.data;
    const current = booking.status as BookingStatus;
    if (current !== 'checked_in' && current !== 'completed') {
      throw new BadRequestException(
        `Ubah booking hanya boleh saat status checked_in atau completed. Status saat ini: ${current}.`,
      );
    }
    const isCompleted = current === 'completed';

    const newServiceId = dto.serviceId ?? booking.serviceId;
    const newPsikologUserId = dto.psikologUserId ?? booking.psikologUserId;
    const newRoomId = dto.roomId ?? booking.roomId;

    // Validate semua entitas yang relevan (dengan id baru kalau diubah).
    await this.validation.assertEntitiesExist(
      booking.clientId,
      newServiceId,
      newPsikologUserId,
      newRoomId,
    );

    // Fetch service baru — butuh `slotOverrides` & `durationMinutes` untuk
    // auto-recompute start/end saat client tidak kirim eksplisit (UI "Ubah
    // Layanan" hanya kirim serviceId).
    const service = await this.prisma.clinicService.findFirst({
      where: { id: newServiceId, deletedAt: null, isActive: true },
      select: {
        id: true,
        name: true,
        basePrice: true,
        durationMinutes: true,
        slotOverrides: true,
        disabledSlotIndices: true,
        psikologs: { select: { psikologUserId: true } },
      },
    });
    if (!service) {
      throw new BadRequestException(`Layanan ${newServiceId} tidak ditemukan / nonaktif.`);
    }

    // Auto-resolve start/end kalau client tidak kirim eksplisit & service
    // berubah. Penting: tidak boleh pakai `start + service.durationMinutes`
    // karena slot di layanan baru bisa beda durasi (override per-layanan).
    // Strategi: identifikasi slot INDEX booking saat ini (di resolved slots
    // layanan LAMA), lalu pakai slot di INDEX yang sama di layanan BARU →
    // newStart = newSlot.start, newEnd = newSlot.end. Slot identity (index)
    // konsisten lintas-layanan; hanya time range yang bisa beda.
    let newStart = dto.scheduledStart ? new Date(dto.scheduledStart) : booking.scheduledStart;
    let newEnd = dto.scheduledEnd ? new Date(dto.scheduledEnd) : booking.scheduledEnd;

    if (!isCompleted && !dto.scheduledStart && !dto.scheduledEnd && newServiceId !== booking.serviceId) {
      const settings = await this.prisma.clinicSettings.findFirst({ where: { id: 1 } });
      const tz = settings?.timezone || 'Asia/Jakarta';
      const globalSlots = (settings?.slotsOfDay as SlotDef[]) || [];

      const oldService = await this.prisma.clinicService.findFirst({
        where: { id: booking.serviceId },
        select: { slotOverrides: true },
      });
      const oldResolved = resolveServiceSlots(
        globalSlots,
        (oldService?.slotOverrides as SlotOverride[] | null) ?? null,
      );
      const oldStartParts = localPartsInTimezone(booking.scheduledStart, tz);
      const oldEndParts = localPartsInTimezone(booking.scheduledEnd, tz);
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
        (service.slotOverrides as SlotOverride[] | null) ?? null,
        (service.disabledSlotIndices as number[] | null) ?? null,
      );
      const newSlot = newResolved[slotIdx];
      if (!newSlot) {
        throw new BadRequestException(
          `Layanan baru tidak punya slot di posisi ${slotIdx + 1}.`,
        );
      }
      if (newSlot.disabled) {
        throw new BadRequestException(
          `Slot ke-${slotIdx + 1} dinonaktifkan untuk layanan "${service.name}". Reschedule ke slot lain dulu sebelum ubah layanan.`,
        );
      }

      newStart = buildClinicInstant(oldStartParts.dateStr, newSlot.start, tz);
      newEnd = buildClinicInstant(oldStartParts.dateStr, newSlot.end, tz);
    }

    if (!(newStart.getTime() < newEnd.getTime())) {
      throw new BadRequestException('scheduledStart harus sebelum scheduledEnd.');
    }

    // Cek psikolog handle service baru (junction). Kosong = handle semua.
    if (service.psikologs.length > 0) {
      const ok = service.psikologs.some((p) => p.psikologUserId === newPsikologUserId);
      if (!ok) {
        throw new BadRequestException(
          `Psikolog yang ditugaskan tidak menangani layanan "${service.name}". Pilih psikolog lain atau layanan lain.`,
        );
      }
    }

    // Validasi forward-looking — slot match + no-conflict — hanya untuk
    // booking aktif (`checked_in`). Untuk `completed`, sesi sudah lewat:
    // slot mungkin tidak match lagi karena layanan baru punya slotOverrides
    // berbeda, dan konflik psikolog/room sudah tidak relevan.
    if (!isCompleted) {
      // Slot match — pakai serviceId baru supaya slotOverrides per-layanan dihormati.
      await this.validation.assertSlotMatch(newStart, newEnd, service.id);

      // Cek konflik psikolog + room (exclude self).
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
    }

    // Deteksi perubahan jadwal/psikolog/room → tulis ke rescheduleHistory.
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

    // History entry untuk service-only edit juga (mis. recategorisasi
    // booking `completed`) — supaya admin punya jejak kapan layanan diubah.
    if (scheduleChanged || serviceChanged) {
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
        source: isCompleted ? 'edit-wizard-completed' : 'edit-wizard',
      });
      data.rescheduleHistory = history as Prisma.InputJsonValue;
    }

    const updated = await this.prisma.clinicBooking.update({
      where: { id },
      data,
      include: buildIncludeRelations(),
    });

    // Payment recompute hanya kalau service berubah.
    if (serviceChanged) {
      const payment = await this.prisma.clinicPayment.findUnique({
        where: { bookingId: id },
        select: { id: true, paidAmount: true, dpPaidAt: true, lunasAt: true },
      });
      if (payment) {
        const base = Number(service.basePrice);
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
              status === 'dp_paid' || status === 'lunas'
                ? payment.dpPaidAt ?? new Date()
                : null,
            updatedBy: actorId,
          },
        });
      }
    }

    this.events.emit({ type: 'transition', bookingId: id, status: current });

    return {
      success: true,
      data: updated,
      message: 'Booking diperbarui',
    };
  }
}
