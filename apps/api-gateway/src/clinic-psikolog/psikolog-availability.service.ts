import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { localDateAtMidnight, localPartsInTimezone } from '../clinic-booking/timezone.util';
import { mapPsikologToResponse, userSelect } from './psikolog.utils';

@Injectable()
export class PsikologAvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  // -------------------- Self-service: Date overrides --------------------

  /** List override psikolog dalam range tanggal. Dipakai psikolog di dialog. */
  async listOwnDateOverrides(userId: number, from?: string, to?: string) {
    const where: Prisma.ClinicPsikologDateOverrideWhereInput = {
      psikologUserId: userId,
    };
    if (from || to) {
      where.date = {};
      if (from) (where.date as Prisma.DateTimeFilter).gte = new Date(from);
      if (to) (where.date as Prisma.DateTimeFilter).lte = new Date(to);
    }
    const items = await this.prisma.clinicPsikologDateOverride.findMany({
      where,
      orderBy: [{ date: 'asc' }],
    });
    return { success: true, data: items };
  }

  /** Upsert override (create kalau belum ada untuk (userId,date), else update). */
  async upsertOwnDateOverride(
    userId: number,
    input: {
      date: string;
      isOpen: boolean;
      slotIndices?: number[] | null;
      reason?: string | null;
    },
  ) {
    // Pastikan psikolog profile ada
    const profile = await this.prisma.clinicPsikologProfile.findFirst({
      where: { userId, deletedAt: null },
      select: { userId: true },
    });
    if (!profile) {
      throw new NotFoundException(`Profile psikolog tidak ditemukan untuk user ${userId}.`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
      throw new ConflictException(`Tanggal '${input.date}' bukan format ISO YYYY-MM-DD.`);
    }
    // Konversi date string ke midnight di TZ klinik (consistent dengan
    // resolveAvailabilityForDate + assertPsikologAvailable lookup).
    const settings = await this.prisma.clinicSettings.findFirst({
      where: { id: 1 },
      select: { timezone: true },
    });
    const dateObj = localDateAtMidnight(input.date, settings?.timezone || 'Asia/Jakarta');
    const slotIndicesValue: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue =
      input.slotIndices === undefined || input.slotIndices === null
        ? Prisma.DbNull
        : (input.slotIndices as Prisma.InputJsonValue);
    const upserted = await this.prisma.clinicPsikologDateOverride.upsert({
      where: { psikologUserId_date: { psikologUserId: userId, date: dateObj } },
      create: {
        psikologUserId: userId,
        date: dateObj,
        isOpen: input.isOpen,
        slotIndices: slotIndicesValue,
        reason: input.reason ?? null,
        createdBy: userId,
        updatedBy: userId,
      },
      update: {
        isOpen: input.isOpen,
        slotIndices: slotIndicesValue,
        reason: input.reason ?? null,
        updatedBy: userId,
      },
    });
    return { success: true, data: upserted, message: 'Override tersimpan' };
  }

  /** Hapus override → psikolog kembali ikut weeklyAvailability di tanggal tsb. */
  async deleteOwnDateOverride(userId: number, dateStr: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      throw new ConflictException(`Tanggal '${dateStr}' bukan format ISO YYYY-MM-DD.`);
    }
    const settings = await this.prisma.clinicSettings.findFirst({
      where: { id: 1 },
      select: { timezone: true },
    });
    const dateObj = localDateAtMidnight(dateStr, settings?.timezone || 'Asia/Jakarta');
    await this.prisma.clinicPsikologDateOverride
      .delete({
        where: { psikologUserId_date: { psikologUserId: userId, date: dateObj } },
      })
      .catch(() => {
        throw new NotFoundException(`Override tanggal ${dateStr} tidak ditemukan.`);
      });
    return { success: true, message: 'Override dihapus, kembali ke jadwal mingguan' };
  }

  /**
   * Psikolog update jadwal availability sendiri (self-service).
   * Lookup profile by userId (bukan profileId) dari JWT.
   */
  async updateOwnAvailability(
    userId: number,
    weeklyAvailability: Record<string, { isOpen: boolean; slotIndices?: number[] }>,
  ) {
    const profile = await this.prisma.clinicPsikologProfile.findFirst({
      where: { userId, deletedAt: null },
      select: { id: true },
    });
    if (!profile) {
      throw new NotFoundException(
        `Profile psikolog tidak ditemukan untuk user ${userId}. Hubungi admin.`,
      );
    }
    const updated = await this.prisma.clinicPsikologProfile.update({
      where: { id: profile.id },
      data: {
        weeklyAvailability: weeklyAvailability as Prisma.InputJsonValue,
        updatedBy: userId,
      },
      include: { user: userSelect() },
    });
    return {
      success: true,
      data: mapPsikologToResponse(updated.user, updated),
      message: 'Jadwal availability tersimpan',
    };
  }

  // -------------------- Resolve availability for booking wizard --------------------

  /**
   * Resolve effective availability untuk psikolog di tanggal tertentu.
   *
   * Priority:
   *   1. ClinicPsikologDateOverride (kalau ada untuk tanggal exact)
   *   2. weeklyAvailability[dayOfWeek] (fallback recurring)
   *   3. Belum set sama sekali → isOpen=false, source='unset'
   *
   * Dipakai oleh booking wizard untuk preview slot mana yang available
   * sebelum admin submit (mirror logic backend `assertPsikologAvailable`).
   *
   * Endpoint: GET /clinic/psikolog/:userId/availability-for-date?date=YYYY-MM-DD
   */
  async resolveAvailabilityForDate(psikologUserId: number, dateStr: string) {
    // Validate format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      throw new ConflictException(`Tanggal '${dateStr}' bukan format ISO YYYY-MM-DD.`);
    }

    const settings = await this.prisma.clinicSettings.findFirst({
      where: { id: 1 },
      select: { timezone: true },
    });
    const tz = settings?.timezone || 'Asia/Jakarta';

    // dateOnly = midnight di TZ klinik (sebagai UTC instant). Penting karena
    // ClinicPsikologDateOverride.date di-simpan dengan asumsi clinic-local
    // midnight. dow juga dihitung di TZ klinik supaya konsisten.
    const dateObj = localDateAtMidnight(dateStr, tz);
    const dow = localPartsInTimezone(dateObj, tz).dow;

    const [override, profile] = await Promise.all([
      this.prisma.clinicPsikologDateOverride.findUnique({
        where: { psikologUserId_date: { psikologUserId, date: dateObj } },
      }),
      this.prisma.clinicPsikologProfile.findFirst({
        where: { userId: psikologUserId, deletedAt: null },
        select: {
          weeklyAvailability: true,
          user: { select: { fullName: true, email: true } },
        },
      }),
    ]);

    if (!profile) {
      throw new NotFoundException(`Profile psikolog untuk user ${psikologUserId} tidak ditemukan.`);
    }

    // 1. Override priority
    if (override) {
      return {
        success: true,
        data: {
          isOpen: override.isOpen,
          slotIndices: (override.slotIndices as number[] | null) ?? null,
          source: 'override' as const,
          reason: override.reason,
          psikologName: profile.user.fullName ?? profile.user.email,
        },
      };
    }

    // 2. Weekly fallback
    const wa = (profile.weeklyAvailability ?? {}) as Record<
      string,
      { isOpen: boolean; slotIndices?: number[] }
    >;
    if (Object.keys(wa).length === 0) {
      return {
        success: true,
        data: {
          isOpen: false,
          slotIndices: [] as number[],
          source: 'unset' as const,
          reason: null,
          psikologName: profile.user.fullName ?? profile.user.email,
        },
      };
    }

    const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayCfg = wa[DAY_KEYS[dow]];
    return {
      success: true,
      data: {
        isOpen: !!dayCfg?.isOpen,
        slotIndices: dayCfg?.slotIndices ?? null, // null = semua slot (kalau isOpen)
        source: 'weekly' as const,
        reason: null,
        psikologName: profile.user.fullName ?? profile.user.email,
      },
    };
  }
}
