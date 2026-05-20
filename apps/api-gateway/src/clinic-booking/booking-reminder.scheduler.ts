import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ClinicWaService } from '../clinic-wa/clinic-wa.service';
import { formatClinicTimeOfDay, localPartsInTimezone, localDateAtMidnight } from './timezone.util';

/**
 * Cron-based booking reminders.
 *
 * - H-1 reminder: setiap hari jam 08:00 WIB (Asia/Jakarta). Kirim ke semua
 *   booking yang dijadwalkan esok hari (00:00–23:59:59 WIB), belum di-remind.
 * - 30-min reminder: every 5 minutes, find bookings 25-35 minutes from now.
 * - Form Feedback H+1: setiap hari jam 08:00 WIB. Kirim ke semua booking yang
 *   berstatus `completed` di hari kemarin (completedAt 00:00–23:59:59 WIB
 *   kemarin), belum dikirimi feedback. Klien diminta balas WA langsung.
 *
 * Uses ClinicWaLog.metadata.reminderFlag flags untuk dedupe.
 *
 * Note: untuk production-grade, replace dengan Bull queue + delayed jobs untuk
 * exact timing. This sync cron approach acceptable untuk MVP volume kecil.
 */
@Injectable()
export class BookingReminderScheduler {
  private readonly logger = new Logger(BookingReminderScheduler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly wa: ClinicWaService,
  ) {}

  @Cron('0 8 * * *', { name: 'reminder-h1', timeZone: 'Asia/Jakarta' })
  async dispatchH1Reminders() {
    const tz = 'Asia/Jakarta';
    const now = new Date();

    // Compute window: seluruh hari esok dalam TZ klinik
    const { dateStr: todayStr } = localPartsInTimezone(now, tz);
    const todayMidnight = localDateAtMidnight(todayStr, tz);
    const tomorrowStart = new Date(todayMidnight.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowEnd = new Date(tomorrowStart.getTime() + 24 * 60 * 60 * 1000 - 1);

    const { dateStr: tomorrowStr } = localPartsInTimezone(tomorrowStart, tz);
    this.logger.log(`[reminder-h1] checking bookings for ${tomorrowStr}`);

    const bookings = await this.findBookingsInWindow(tomorrowStart, tomorrowEnd, 'h1');
    this.logger.log(`[reminder-h1] candidate ${bookings.length} bookings`);

    for (const b of bookings) {
      await this.dispatchAndMark(b, 'Pengingat H-1 Booking', 'h1');
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES, { name: 'reminder-30m' })
  async dispatch30mReminders() {
    const now = new Date();
    const start = new Date(now.getTime() + 25 * 60 * 1000);
    const end = new Date(now.getTime() + 35 * 60 * 1000);

    const bookings = await this.findBookingsInWindow(start, end, 'm30');
    this.logger.log(`[reminder-30m] candidate ${bookings.length} bookings`);

    for (const b of bookings) {
      await this.dispatchAndMark(b, 'Pengingat 30 Menit Sebelum Sesi', 'm30');
    }
  }

  /**
   * Form Feedback H+1 — setiap hari jam 08:00 WIB.
   * Kirim "Form Feedback" ke klien yang booking-nya `completed` kemarin.
   * Klien diminta membalas pesan WA langsung (bukan link form).
   */
  @Cron('0 8 * * *', { name: 'feedback-h1', timeZone: 'Asia/Jakarta' })
  async dispatchFeedbackH1() {
    const tz = 'Asia/Jakarta';
    const now = new Date();

    // Window: seluruh hari KEMARIN dalam TZ klinik
    const { dateStr: todayStr } = localPartsInTimezone(now, tz);
    const todayMidnight = localDateAtMidnight(todayStr, tz);
    const yesterdayStart = new Date(todayMidnight.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayEnd = new Date(todayMidnight.getTime() - 1);

    const { dateStr: yesterdayStr } = localPartsInTimezone(yesterdayStart, tz);
    this.logger.log(`[feedback-h1] checking bookings completed on ${yesterdayStr}`);

    const bookings = await this.findCompletedInWindow(yesterdayStart, yesterdayEnd);
    this.logger.log(`[feedback-h1] candidate ${bookings.length} bookings`);

    for (const b of bookings) {
      await this.dispatchFeedbackAndMark(b);
    }
  }

  // -----------------------------------------------------------------

  private async findCompletedInWindow(start: Date, end: Date) {
    const bookings = await this.prisma.clinicBooking.findMany({
      where: {
        deletedAt: null,
        status: 'completed',
        completedAt: { gte: start, lte: end },
      },
      include: {
        client: { select: { id: true, name: true, phoneWa: true, waOptedOut: true } },
        psikolog: { select: { fullName: true } },
      },
    });

    const result: typeof bookings = [];
    for (const b of bookings) {
      if (!b.client?.phoneWa || b.client.waOptedOut) continue;
      const existingLog = await this.prisma.clinicWaLog.findFirst({
        where: {
          bookingId: b.id,
          metadata: { path: ['reminderFlag'], equals: 'feedback_h1' } as Prisma.JsonFilter,
        },
        select: { id: true },
      });
      if (!existingLog) result.push(b);
    }
    return result;
  }

  private async dispatchFeedbackAndMark(booking: {
    id: number;
    client: { name: string; phoneWa: string };
    psikolog: { fullName: string | null } | null;
  }) {
    try {
      const result = await this.wa.dispatch({
        templateName: 'Form Feedback',
        recipientType: 'klien',
        recipientPhone: booking.client.phoneWa,
        variables: {
          nama_klien: booking.client.name,
          nama_psikolog: booking.psikolog?.fullName ?? 'psikolog kami',
        },
        bookingId: booking.id,
      });
      const lastLog = await this.prisma.clinicWaLog.findFirst({
        where: { bookingId: booking.id },
        orderBy: { createdAt: 'desc' },
      });
      if (lastLog) {
        await this.prisma.clinicWaLog.update({
          where: { id: lastLog.id },
          data: {
            metadata: {
              ...((lastLog.metadata as Record<string, unknown>) ?? {}),
              reminderFlag: 'feedback_h1',
            } as Prisma.InputJsonValue,
          },
        });
      }
      this.logger.log(
        `[feedback-h1] sent booking ${booking.id} → ${result.success ? 'OK' : 'fail'}`,
      );
    } catch (err) {
      this.logger.warn(
        `[feedback-h1] failed booking ${booking.id}: ${err instanceof Error ? err.message : err}`,
      );
    }
  }

  private async findBookingsInWindow(start: Date, end: Date, flag: 'h1' | 'm30') {
    // Find bookings dalam window yang belum di-reminder
    const bookings = await this.prisma.clinicBooking.findMany({
      where: {
        deletedAt: null,
        status: { in: ['confirmed', 'checked_in'] },
        scheduledStart: { gte: start, lte: end },
      },
      include: {
        client: { select: { id: true, name: true, phoneWa: true, waOptedOut: true } },
        service: { select: { name: true } },
        psikolog: { select: { fullName: true } },
        room: { select: { name: true } },
      },
    });

    // Filter out bookings yang sudah punya log dengan flag ini
    const result: typeof bookings = [];
    for (const b of bookings) {
      if (!b.client?.phoneWa || b.client.waOptedOut) continue;
      const existingLog = await this.prisma.clinicWaLog.findFirst({
        where: {
          bookingId: b.id,
          metadata: { path: ['reminderFlag'], equals: flag } as Prisma.JsonFilter,
        },
        select: { id: true },
      });
      if (!existingLog) result.push(b);
    }
    return result;
  }

  private async dispatchAndMark(
    booking: {
      id: number;
      scheduledStart: Date;
      client: { name: string; phoneWa: string };
      service: { name: string } | null;
      psikolog: { fullName: string | null } | null;
      room: { name: string } | null;
    },
    templateName: string,
    flag: 'h1' | 'm30',
  ) {
    const date = new Date(booking.scheduledStart);
    try {
      const result = await this.wa.dispatch({
        templateName,
        recipientType: 'klien',
        recipientPhone: booking.client.phoneWa,
        variables: {
          nama_klien: booking.client.name,
          layanan: booking.service?.name ?? '',
          nama_psikolog: booking.psikolog?.fullName ?? 'psikolog kami',
          ruang: booking.room?.name ?? '',
          tanggal: date.toLocaleString('id-ID', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }),
          waktu: formatClinicTimeOfDay(date),
        },
        bookingId: booking.id,
      });
      // Mark flag di metadata log terakhir untuk dedupe future runs
      const lastLog = await this.prisma.clinicWaLog.findFirst({
        where: { bookingId: booking.id },
        orderBy: { createdAt: 'desc' },
      });
      if (lastLog) {
        await this.prisma.clinicWaLog.update({
          where: { id: lastLog.id },
          data: {
            metadata: {
              ...((lastLog.metadata as Record<string, unknown>) ?? {}),
              reminderFlag: flag,
            } as Prisma.InputJsonValue,
          },
        });
      }
      this.logger.log(
        `[reminder-${flag}] sent booking ${booking.id} → ${result.success ? 'OK' : 'fail'}`,
      );
    } catch (err) {
      this.logger.warn(
        `[reminder-${flag}] failed booking ${booking.id}: ${err instanceof Error ? err.message : err}`,
      );
    }
  }
}
