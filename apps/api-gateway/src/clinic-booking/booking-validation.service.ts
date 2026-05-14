import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { dateStrToDateColumn, localDateAtMidnight, localPartsInTimezone } from './timezone.util';

/**
 * Validation helpers untuk booking operations.
 *
 * Extracted dari ClinicBookingService supaya:
 * - Single responsibility (validation logic terpisah dari CRUD/state)
 * - Reusable di package booking creation (yang juga butuh validate)
 * - Easier to mock di unit test (mock 1 service, bukan 4 prisma sub-clients)
 *
 * Throws NotFoundException / BadRequestException / ConflictException —
 * caller tinggal `await` tanpa cek return value.
 */
@Injectable()
export class BookingValidationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Pastikan client/service/psikolog/room exist + active.
   * Parallel query untuk minimal latency.
   */
  async assertEntitiesExist(
    clientId: number,
    serviceId: number,
    psikologUserId: number,
    roomId: number,
  ): Promise<void> {
    const [client, service, psikolog, room] = await Promise.all([
      this.prisma.clinicClient.findFirst({
        where: { id: clientId, deletedAt: null },
        select: { id: true },
      }),
      this.prisma.clinicService.findFirst({
        where: { id: serviceId, deletedAt: null, isActive: true },
        select: { id: true },
      }),
      this.prisma.user.findFirst({
        where: {
          id: psikologUserId,
          deletedAt: null,
          isActive: true,
          roles: { some: { deletedAt: null, role: { name: 'clinic-psikolog' } } },
        },
        select: { id: true },
      }),
      this.prisma.clinicRoom.findFirst({
        where: { id: roomId, deletedAt: null, isActive: true },
        select: { id: true },
      }),
    ]);
    if (!client) throw new NotFoundException(`Client ${clientId} not found / deleted`);
    if (!service) throw new NotFoundException(`Service ${serviceId} not found / inactive`);
    if (!psikolog) {
      throw new NotFoundException(
        `Psikolog user ${psikologUserId} not found / not active clinic-psikolog`,
      );
    }
    if (!room) throw new NotFoundException(`Room ${roomId} not found / inactive`);
  }

  /**
   * Cek room conflict — exact overlap tanpa buffer. SELALU dipanggil terlepas
   * dari bufferOverride, karena ruangan adalah sumber daya fisik yang tidak bisa
   * dipakai bersamaan. bufferOverride hanya berlaku untuk psikolog & slot check.
   *
   * Throws ConflictException dengan detail konflik (tipe + bookingId existing).
   */
  async assertNoRoomConflict(args: {
    roomId: number;
    scheduledStart: Date;
    scheduledEnd: Date;
    excludeBookingId: number | null;
  }): Promise<void> {
    const { roomId, scheduledStart, scheduledEnd, excludeBookingId } = args;

    const overlapWhere: Prisma.ClinicBookingWhereInput = {
      deletedAt: null,
      status: { in: ['awaiting_dp', 'confirmed', 'checked_in', 'in_progress'] },
      roomId,
      scheduledStart: { lt: scheduledEnd },
      scheduledEnd: { gt: scheduledStart },
    };
    if (excludeBookingId) overlapWhere.id = { not: excludeBookingId };

    const roomConflict = await this.prisma.clinicBooking.findFirst({
      where: overlapWhere,
      select: { id: true, scheduledStart: true, scheduledEnd: true },
    });

    if (roomConflict) {
      throw new ConflictException({
        message: 'Room conflict — ruangan sudah terpakai di waktu tersebut',
        conflictType: 'room',
        conflictBookingId: roomConflict.id,
        scheduledStart: roomConflict.scheduledStart,
        scheduledEnd: roomConflict.scheduledEnd,
      });
    }
  }

  /**
   * Cek psikolog conflict (plain overlap, tanpa buffer jeda).
   * Throws ConflictException dengan detail konflik (tipe + bookingId existing).
   */
  async assertNoConflict(args: {
    psikologUserId: number;
    roomId: number;
    scheduledStart: Date;
    scheduledEnd: Date;
    excludeBookingId: number | null;
  }): Promise<void> {
    const { psikologUserId, scheduledStart, scheduledEnd, excludeBookingId } = args;

    const overlapWhere: Prisma.ClinicBookingWhereInput = {
      deletedAt: null,
      status: { in: ['awaiting_dp', 'confirmed', 'checked_in', 'in_progress'] },
      // Overlap test: existing.start < end AND existing.end > start
      scheduledStart: { lt: scheduledEnd },
      scheduledEnd: { gt: scheduledStart },
    };
    if (excludeBookingId) overlapWhere.id = { not: excludeBookingId };

    const psikologConflict = await this.prisma.clinicBooking.findFirst({
      where: { ...overlapWhere, psikologUserId },
      select: { id: true, scheduledStart: true, scheduledEnd: true },
    });

    if (psikologConflict) {
      throw new ConflictException({
        message: 'Psikolog conflict',
        conflictType: 'psikolog',
        conflictBookingId: psikologConflict.id,
        scheduledStart: psikologConflict.scheduledStart,
        scheduledEnd: psikologConflict.scheduledEnd,
      });
    }
  }

  /**
   * Cek booking valid against slot operasional klinik:
   *  1. Hari tidak masuk closedDayOfWeek (mis. Minggu)
   *  2. Tanggal tidak masuk holidays ad-hoc
   *  3. Start/end persis cocok dengan salah satu slotsOfDay (HH:MM match)
   *
   * Bisa di-bypass dengan `bufferOverride` di caller.
   *
   * Mengganti `assertWithinOperatingHours` lama (operatingHours window per hari).
   */
  async assertSlotMatch(start: Date, end: Date): Promise<void> {
    const settings = await this.prisma.clinicSettings.findFirst({ where: { id: 1 } });
    if (!settings) return; // no settings, allow (bootstrap mode)

    const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    // Pakai TZ klinik (default Asia/Jakarta) supaya konsisten dengan slot list
    // dan weeklyAvailability yang format-nya TZ klinik. Container biasanya UTC
    // jadi start.getHours()/getDay() tidak boleh dipakai langsung.
    const tz = settings.timezone || 'Asia/Jakarta';
    const startParts = localPartsInTimezone(start, tz);
    const endParts = localPartsInTimezone(end, tz);

    // 1. Closed day check (pakai dow di TZ klinik)
    const closed = (settings.closedDayOfWeek as number[]) || [];
    if (closed.includes(startParts.dow)) {
      throw new BadRequestException(
        `Klinik tutup di hari ${DAY_NAMES[startParts.dow]}. Aktifkan "Lewati validasi jeda & jam buka" untuk override.`,
      );
    }

    // 2. Holiday check (pakai date di TZ klinik, bukan UTC)
    const holidays = (settings.holidays as string[]) || [];
    if (holidays.includes(startParts.dateStr)) {
      throw new BadRequestException(
        `Tanggal ${startParts.dateStr} adalah hari libur. Aktifkan "Lewati validasi jeda & jam buka" untuk override.`,
      );
    }

    // 3. Slot match check (pakai HH:MM di TZ klinik)
    const slots =
      (settings.slotsOfDay as Array<{ start: string; end: string; label?: string }>) || [];
    if (slots.length === 0) return; // belum di-config, allow (bootstrap mode)

    const matched = slots.find((s) => s.start === startParts.hhmm && s.end === endParts.hhmm);
    if (!matched) {
      const available = slots.map((s) => `${s.start}-${s.end}`).join(', ');
      throw new BadRequestException(
        `Booking ${startParts.hhmm}-${endParts.hhmm} tidak cocok dengan slot operasional klinik. Slot tersedia: ${available}.`,
      );
    }
  }

  /**
   * @deprecated Use `assertSlotMatch` instead. Stub kept for back-compat agar
   * caller existing tidak crash sampai semua di-migrasi.
   */
  async assertWithinOperatingHours(start: Date, end: Date): Promise<void> {
    return this.assertSlotMatch(start, end);
  }

  /**
   * Cek psikolog available di tanggal `start` berdasarkan dua sumber:
   *   1. **Date override** di ClinicPsikologDateOverride (PRIORITAS) —
   *      override per tanggal spesifik (cuti, makeup, jadwal khusus)
   *   2. **Weekly availability** di ClinicPsikologProfile (fallback) —
   *      pola berulang per day-of-week
   *
   *  - Empty weekly {} & no override → psikolog belum set jadwal → reject
   *  - Override `isOpen: false` → reject (cuti)
   *  - Weekly day `isOpen: false` & no override → reject (libur rutin)
   *  - `slotIndices` (override > weekly): kalau ada, slotIdx harus masuk list
   *  - Bisa di-bypass dengan bufferOverride di caller
   *
   * Param `slotIdx` = index slot di ClinicSettings.slotsOfDay yang di-pick.
   * Lewatkan null kalau caller tidak tahu (skip slotIndices check).
   */
  async assertPsikologAvailable(
    psikologUserId: number,
    start: Date,
    slotIdx: number | null = null,
  ): Promise<void> {
    const profile = await this.prisma.clinicPsikologProfile.findFirst({
      where: { userId: psikologUserId, deletedAt: null },
      select: { weeklyAvailability: true, user: { select: { fullName: true, email: true } } },
    });
    if (!profile) {
      throw new NotFoundException(`Psikolog profile untuk user ${psikologUserId} tidak ditemukan.`);
    }
    const settings = await this.prisma.clinicSettings.findFirst({
      where: { id: 1 },
      select: { timezone: true },
    });
    const tz = settings?.timezone || 'Asia/Jakarta';
    const psikologName = profile.user.fullName ?? profile.user.email;
    const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const DAY_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    // Pakai TZ klinik supaya dow + dateOnly konsisten dengan
    // weeklyAvailability + date overrides (yang dianggap WIB).
    const startParts = localPartsInTimezone(start, tz);
    const dow = startParts.dow;
    const dateOnly = dateStrToDateColumn(startParts.dateStr);

    // 1. PRIORITAS: cek date override untuk tanggal spesifik
    const override = await this.prisma.clinicPsikologDateOverride.findUnique({
      where: { psikologUserId_date: { psikologUserId, date: dateOnly } },
    });
    if (override) {
      if (!override.isOpen) {
        throw new BadRequestException(
          override.reason
            ? `${psikologName} tidak praktik di tanggal ini (${override.reason}).`
            : `${psikologName} tidak praktik di tanggal ini (override jadwal).`,
        );
      }
      const overrideSlots = (override.slotIndices ?? null) as number[] | null;
      if (
        slotIdx !== null &&
        Array.isArray(overrideSlots) &&
        overrideSlots.length > 0 &&
        !overrideSlots.includes(slotIdx)
      ) {
        throw new BadRequestException(
          `Slot terpilih tidak masuk jadwal khusus ${psikologName} di tanggal ini.`,
        );
      }
      return; // Override matched, skip weekly check
    }

    // 2. FALLBACK: weekly availability
    const availability = (profile.weeklyAvailability ?? {}) as Record<
      string,
      { isOpen: boolean; slotIndices?: number[] }
    >;
    if (Object.keys(availability).length === 0) {
      throw new BadRequestException(
        `Psikolog ${psikologName} belum mengatur jadwal mingguan. Set dulu di menu Psikolog → Edit → Jadwal Mingguan.`,
      );
    }
    const dayCfg = availability[DAY_KEYS[dow]];
    if (!dayCfg || !dayCfg.isOpen) {
      throw new BadRequestException(
        `Psikolog ${psikologName} tidak praktik di hari ${DAY_ID[dow]}. Pilih psikolog atau hari lain.`,
      );
    }
    if (slotIdx !== null && Array.isArray(dayCfg.slotIndices) && dayCfg.slotIndices.length > 0) {
      if (!dayCfg.slotIndices.includes(slotIdx)) {
        throw new BadRequestException(
          `Slot terpilih tidak masuk jadwal ${psikologName} di hari ${DAY_ID[dow]}.`,
        );
      }
    }
  }
}
