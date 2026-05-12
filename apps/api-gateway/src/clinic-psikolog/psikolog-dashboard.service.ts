import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { localDateAtMidnight, localPartsInTimezone } from '../clinic-booking/timezone.util';

@Injectable()
export class PsikologDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Statistik 30 hari untuk own profile page.
   * - sesi30Hari   : count completed bookings (30d window)
   * - klienAktif   : distinct clientId with booking di 90d (lebih inklusif)
   * - kehadiran    : completed / (completed + cancelled) dalam %.
   *                  No 'no_show' status di schema → pakai (cancelled / total) sebagai proxy.
   * - ratingKlien  : null (belum ada rating endpoint)
   */
  async getMyStats(userId: number) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    const [completed30d, cancelled30d, distinctClients] = await Promise.all([
      this.prisma.clinicBooking.count({
        where: {
          psikologUserId: userId,
          status: 'completed',
          scheduledStart: { gte: thirtyDaysAgo, lte: now },
          deletedAt: null,
        },
      }),
      this.prisma.clinicBooking.count({
        where: {
          psikologUserId: userId,
          status: 'cancelled',
          scheduledStart: { gte: thirtyDaysAgo, lte: now },
          deletedAt: null,
        },
      }),
      this.prisma.clinicBooking.findMany({
        where: {
          psikologUserId: userId,
          status: { not: 'cancelled' },
          scheduledStart: { gte: ninetyDaysAgo },
          deletedAt: null,
        },
        select: { clientId: true },
        distinct: ['clientId'],
      }),
    ]);

    const total30d = completed30d + cancelled30d;
    const kehadiran = total30d > 0 ? Math.round((completed30d / total30d) * 100) : null;

    return {
      success: true,
      data: {
        sesi30Hari: completed30d,
        klienAktif: distinctClients.length,
        kehadiran, // % atau null kalau tidak ada data
        ratingKlien: null, // endpoint belum ada
      },
    };
  }

  /**
   * Dashboard psikolog stats — dipakai /psikolog/dashboard page.
   *
   * Berbeda dengan /me/stats (yang fokus 30-day profile metrics), endpoint
   * ini focus ke "today + this week + actionable queue":
   *   - today      : count by status (completed/in_progress/upcoming)
   *   - week       : 7 daily counts (Senin-Minggu, current week WIB)
   *   - klienAktif : distinct client 30d non-cancelled
   *   - pendingNotes: completed booking 7d tanpa ClinicSessionNote
   *   - packageEndingSoon: booking dengan sessionN = sessionTotal - 1, future 14d
   */
  async getDashboardStats(userId: number) {
    const tz = 'Asia/Jakarta';
    const nowLocal = localPartsInTimezone(new Date(), tz);
    const todayStr = nowLocal.dateStr; // YYYY-MM-DD di WIB
    const todayStart = localDateAtMidnight(todayStr, tz);
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    // Awal minggu = Senin (dow 1 .. 0=Minggu). Compute offset hari dari today.
    // Convert: Sen=0, Sel=1, ..., Min=6
    const isoDow = nowLocal.dow === 0 ? 6 : nowLocal.dow - 1;
    const weekStart = new Date(todayStart.getTime() - isoDow * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);

    const thirtyDaysAgo = new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAhead = new Date(todayStart.getTime() + 14 * 24 * 60 * 60 * 1000);

    const [todayBookings, weekBookings, distinctClients30d, completedNoNote, packageEnding] =
      await Promise.all([
        // Today bookings — needed untuk count by status
        this.prisma.clinicBooking.findMany({
          where: {
            psikologUserId: userId,
            scheduledStart: { gte: todayStart, lt: todayEnd },
            deletedAt: null,
          },
          select: { status: true },
        }),
        // Week bookings — needed untuk daily count chart
        this.prisma.clinicBooking.findMany({
          where: {
            psikologUserId: userId,
            scheduledStart: { gte: weekStart, lt: weekEnd },
            status: { not: 'cancelled' },
            deletedAt: null,
          },
          select: { scheduledStart: true },
        }),
        // Klien aktif — distinct client 30d non-cancelled
        this.prisma.clinicBooking.findMany({
          where: {
            psikologUserId: userId,
            status: { not: 'cancelled' },
            scheduledStart: { gte: thirtyDaysAgo, lte: todayEnd },
            deletedAt: null,
          },
          select: { clientId: true },
          distinct: ['clientId'],
        }),
        // Completed bookings tanpa session note (last 7d) — pakai raw scan
        // karena Prisma tidak support left-anti-join langsung. Limit 10.
        this.prisma.clinicBooking.findMany({
          where: {
            psikologUserId: userId,
            status: 'completed',
            scheduledStart: { gte: sevenDaysAgo, lte: todayEnd },
            deletedAt: null,
          },
          select: {
            id: true,
            scheduledStart: true,
            client: { select: { name: true } },
            service: { select: { name: true } },
          },
          orderBy: { scheduledStart: 'desc' },
          take: 20,
        }),
        // Package ending soon — sessionN = sessionTotal - 1, future ≤14d
        this.prisma.clinicBooking.findMany({
          where: {
            psikologUserId: userId,
            status: { notIn: ['cancelled', 'completed'] },
            scheduledStart: { gte: todayStart, lt: fourteenDaysAhead },
            sessionTotal: { gt: 1 },
            deletedAt: null,
          },
          select: {
            id: true,
            scheduledStart: true,
            sessionN: true,
            sessionTotal: true,
            client: { select: { name: true } },
          },
          orderBy: { scheduledStart: 'asc' },
          take: 10,
        }),
      ]);

    // Filter completed-without-note via separate query (avoid raw SQL)
    const completedIds = completedNoNote.map((b) => b.id);
    const notesExisting = completedIds.length
      ? await this.prisma.clinicSessionNote.findMany({
          where: {
            bookingId: { in: completedIds },
            deletedAt: null,
          },
          select: { bookingId: true },
        })
      : [];
    const bookingsWithNote = new Set(notesExisting.map((n) => n.bookingId));
    const pendingNotes = completedNoNote
      .filter((b) => !bookingsWithNote.has(b.id))
      .map((b) => ({
        bookingId: b.id,
        clientName: b.client.name,
        serviceName: b.service.name,
        scheduledStart: b.scheduledStart.toISOString(),
      }));

    // Filter package ending soon to one-per-package (latest sessionN-1)
    const packageEndingSoon = packageEnding
      .filter((b) => b.sessionN === b.sessionTotal - 1)
      .slice(0, 5)
      .map((b) => ({
        bookingId: b.id,
        clientName: b.client.name,
        sessionN: b.sessionN,
        sessionTotal: b.sessionTotal,
        scheduledStart: b.scheduledStart.toISOString(),
      }));

    // Today buckets
    const today = {
      total: todayBookings.length,
      completed: todayBookings.filter((b) => b.status === 'completed').length,
      inProgress: todayBookings.filter((b) => b.status === 'in_progress').length,
      upcoming: todayBookings.filter((b) =>
        ['awaiting_dp', 'confirmed', 'checked_in'].includes(b.status),
      ).length,
      cancelled: todayBookings.filter((b) => b.status === 'cancelled').length,
    };

    // Week bucket: array [Sen, Sel, Rab, Kam, Jum, Sab, Min]
    const weekData = [0, 0, 0, 0, 0, 0, 0];
    for (const b of weekBookings) {
      const parts = localPartsInTimezone(b.scheduledStart, tz);
      // parts.dow: 0=Min..6=Sab → convert to 0=Sen..6=Min
      const idx = parts.dow === 0 ? 6 : parts.dow - 1;
      weekData[idx]++;
    }
    const weekTotal = weekData.reduce((a, b) => a + b, 0);

    return {
      success: true,
      data: {
        today,
        week: {
          data: weekData,
          total: weekTotal,
          startDate: localPartsInTimezone(weekStart, tz).dateStr,
        },
        klienAktif: distinctClients30d.length,
        catatanTertunda: pendingNotes.length,
        pendingNotes,
        packageEndingSoon,
        anchorDate: todayStr,
      },
    };
  }
}
