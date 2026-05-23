import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { groupServiceIdsByUser } from './psikolog.utils';
import { localDateAtMidnight, localPartsInTimezone } from '../clinic-booking/timezone.util';

/**
 * Hasil batch-load stats untuk admin list page.
 * - serviceIdsByUser : junction map (avoid N+1 service lookup)
 * - hasBookingsSet   : userId yang punya booking aktif (disable delete di FE)
 * - todayMap          : count booking hari ini per psikolog
 * - weekMap           : count booking minggu ini per psikolog
 * - clientMap         : distinct client 90 hari per psikolog
 */
export interface PsikologListStats {
  serviceIdsByUser: Map<number, number[]>;
  hasBookingsSet: Set<number>;
  todayMap: Map<number, number>;
  weekMap: Map<number, number>;
  clientMap: Map<number, number>;
}

@Injectable()
export class PsikologListStatsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Batch-load semua stats yang dibutuhkan `ClinicPsikologService.findAll`
   * dalam satu panggilan. Query, ordering, parameter, dan output IDENTIK
   * dengan implementasi inline sebelumnya — pure restructure, zero behavior change.
   */
  async loadListStats(userIds: number[]): Promise<PsikologListStats> {
    // Batch-load serviceIds junction untuk avoid N+1
    const junctionRows =
      userIds.length === 0
        ? []
        : await this.prisma.clinicPsikologService.findMany({
            where: { psikologUserId: { in: userIds } },
            select: { psikologUserId: true, serviceId: true },
          });
    const serviceIdsByUser = groupServiceIdsByUser(junctionRows);

    // Batch-check booking existence untuk disable delete button di FE
    const bookingUserIds =
      userIds.length === 0
        ? []
        : await this.prisma.clinicBooking.findMany({
            where: { psikologUserId: { in: userIds }, deletedAt: null },
            select: { psikologUserId: true },
            distinct: ['psikologUserId'],
          });
    const hasBookingsSet = new Set(bookingUserIds.map((b) => b.psikologUserId));

    // Batch stats untuk admin card: today / week / distinct clients 90d
    const tz = 'Asia/Jakarta';
    const nowLocal = localPartsInTimezone(new Date(), tz);
    const todayStart = localDateAtMidnight(nowLocal.dateStr, tz);
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    const isoDow = nowLocal.dow === 0 ? 6 : nowLocal.dow - 1;
    const weekStart = new Date(todayStart.getTime() - isoDow * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(todayStart.getTime() - 90 * 24 * 60 * 60 * 1000);

    const todayCounts = userIds.length === 0 ? [] : await this.prisma.clinicBooking.groupBy({
      by: ['psikologUserId'],
      where: { psikologUserId: { in: userIds }, status: { not: 'cancelled' }, scheduledStart: { gte: todayStart, lt: todayEnd }, deletedAt: null },
      _count: { id: true },
    });
    const weekCounts = userIds.length === 0 ? [] : await this.prisma.clinicBooking.groupBy({
      by: ['psikologUserId'],
      where: { psikologUserId: { in: userIds }, status: { not: 'cancelled' }, scheduledStart: { gte: weekStart, lt: weekEnd }, deletedAt: null },
      _count: { id: true },
    });
    const clientCountRows: Array<{ psikolog_user_id: number; client_count: number }> =
      userIds.length === 0
        ? []
        : await this.prisma.$queryRaw`
            SELECT psikolog_user_id, COUNT(DISTINCT client_id)::int AS client_count
            FROM clinic_booking
            WHERE psikolog_user_id IN (${Prisma.join(userIds)})
              AND status != 'cancelled'
              AND scheduled_start >= ${ninetyDaysAgo}
              AND deleted_at IS NULL
            GROUP BY psikolog_user_id
          `;

    const todayMap = new Map(todayCounts.map((r) => [r.psikologUserId, r._count.id]));
    const weekMap = new Map(weekCounts.map((r) => [r.psikologUserId, r._count.id]));
    const clientMap = new Map(clientCountRows.map((r) => [Number(r.psikolog_user_id), Number(r.client_count)]));

    return { serviceIdsByUser, hasBookingsSet, todayMap, weekMap, clientMap };
  }
}
