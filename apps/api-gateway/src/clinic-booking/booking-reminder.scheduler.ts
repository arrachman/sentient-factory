import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ClinicWaService } from '../clinic-wa/clinic-wa.service';
import { formatClinicTimeOfDay, localPartsInTimezone, localDateAtMidnight } from './timezone.util';

/**
 * Cron-based booking reminders.
 *
 * - H-1 reminder: polling EVERY_5_MINUTES, kirim dalam window [sendTime, sendTime+5min) WIB.
 *   Jam kirim dibaca dari ClinicSettings.notifH1SendTime (default "08:00").
 *   Toggle: notifH1Klien.
 * - 30-min reminder: EVERY_5_MINUTES, window 25-35 menit sebelum sesi.
 *   Toggle: notifM30Klien.
 * - Form Feedback H+1: polling EVERY_5_MINUTES, window [feedbackSendTime, feedbackSendTime+5min) WIB.
 *   Jam kirim: ClinicSettings.notifFeedbackSendTime (default "08:00").
 *   Toggle: notifFeedbackKlien.
 *
 * Semua scheduler pakai ClinicWaLog.metadata.reminderFlag untuk dedupe per-booking per-hari.
 */
export type ReminderRunResult = {
  type: string;
  dispatched: number;
  skipped: number;
  bookingIds: number[];
};

/** Check apakah waktu sekarang (WIB) berada dalam window [configTime, configTime+windowMin). */
function isWithinSendWindow(nowWib: { hhmm: string }, configTime: string, windowMinutes = 5): boolean {
  const [ch, cm] = configTime.split(':').map(Number);
  const [nh, nm] = nowWib.hhmm.split(':').map(Number);
  const configMinutes = ch * 60 + cm;
  const nowMinutes = nh * 60 + nm;
  return nowMinutes >= configMinutes && nowMinutes < configMinutes + windowMinutes;
}

@Injectable()
export class BookingReminderScheduler {
  private readonly logger = new Logger(BookingReminderScheduler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly wa: ClinicWaService,
  ) {}

  /** Baca settings dari DB — null-safe dengan defaults. */
  private async getSettings() {
    const s = await this.prisma.clinicSettings.findUnique({ where: { id: 1 } });
    return {
      waSendEnabled:        s?.waSendEnabled        ?? false,
      notifH1Klien:         s?.notifH1Klien         ?? true,
      notifH1SendTime:      s?.notifH1SendTime       ?? '08:00',
      notifM30Klien:        s?.notifM30Klien         ?? true,
      notifFeedbackKlien:   s?.notifFeedbackKlien    ?? true,
      notifFeedbackSendTime: s?.notifFeedbackSendTime ?? '08:00',
    };
  }

  /**
   * H-1 reminder — polling setiap 5 menit.
   * Hanya jalan dalam window [notifH1SendTime, notifH1SendTime+5min) WIB.
   * Dedup via reminderFlag='h1' supaya tidak double-send kalau cron overlap.
   */
  @Cron(CronExpression.EVERY_5_MINUTES, { name: 'reminder-h1' })
  async dispatchH1Reminders(): Promise<ReminderRunResult> {
    const tz = 'Asia/Jakarta';
    const now = new Date();
    const nowWib = localPartsInTimezone(now, tz);

    const settings = await this.getSettings();
    if (!settings.waSendEnabled || !settings.notifH1Klien) {
      return { type: 'h1', dispatched: 0, skipped: 0, bookingIds: [] };
    }
    if (!isWithinSendWindow(nowWib, settings.notifH1SendTime)) {
      return { type: 'h1', dispatched: 0, skipped: 0, bookingIds: [] };
    }

    // Window: seluruh hari esok dalam TZ klinik
    const { dateStr: todayStr } = nowWib;
    const todayMidnight = localDateAtMidnight(todayStr, tz);
    const tomorrowStart = new Date(todayMidnight.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowEnd = new Date(tomorrowStart.getTime() + 24 * 60 * 60 * 1000 - 1);

    const { dateStr: tomorrowStr } = localPartsInTimezone(tomorrowStart, tz);
    this.logger.log(`[reminder-h1] send-time=${settings.notifH1SendTime} checking bookings for ${tomorrowStr}`);

    const bookings = await this.findBookingsInWindow(tomorrowStart, tomorrowEnd, 'h1');
    this.logger.log(`[reminder-h1] candidate ${bookings.length} bookings`);

    const bookingIds: number[] = [];
    for (const b of bookings) {
      await this.dispatchAndMark(b, 'Pengingat H-1 Booking', 'h1');
      bookingIds.push(b.id);
    }
    return { type: 'h1', dispatched: bookingIds.length, skipped: 0, bookingIds };
  }

  /**
   * 30-min reminder — polling setiap 5 menit.
   * Toggle: notifM30Klien.
   */
  @Cron(CronExpression.EVERY_5_MINUTES, { name: 'reminder-30m' })
  async dispatch30mReminders(windowCenterMinutes = 30): Promise<ReminderRunResult> {
    const settings = await this.getSettings();
    if (!settings.waSendEnabled || !settings.notifM30Klien) {
      return { type: 'm30', dispatched: 0, skipped: 0, bookingIds: [] };
    }

    const now = new Date();
    const halfWindow = 5;
    const start = new Date(now.getTime() + (windowCenterMinutes - halfWindow) * 60 * 1000);
    const end = new Date(now.getTime() + (windowCenterMinutes + halfWindow) * 60 * 1000);

    const bookings = await this.findBookingsInWindow(start, end, 'm30');
    this.logger.log(`[reminder-30m] center=${windowCenterMinutes}m candidate ${bookings.length} bookings`);

    const bookingIds: number[] = [];
    for (const b of bookings) {
      await this.dispatchAndMark(b, 'Pengingat 30 Menit Sebelum Sesi', 'm30');
      bookingIds.push(b.id);
    }
    return { type: 'm30', dispatched: bookingIds.length, skipped: 0, bookingIds };
  }

  /**
   * Form Feedback H+1 — polling setiap 5 menit.
   * Kirim dalam window [notifFeedbackSendTime, notifFeedbackSendTime+5min) WIB.
   * Toggle: notifFeedbackKlien.
   */
  @Cron(CronExpression.EVERY_5_MINUTES, { name: 'feedback-h1' })
  async dispatchFeedbackH1(): Promise<ReminderRunResult> {
    const tz = 'Asia/Jakarta';
    const now = new Date();
    const nowWib = localPartsInTimezone(now, tz);

    const settings = await this.getSettings();
    if (!settings.waSendEnabled || !settings.notifFeedbackKlien) {
      return { type: 'feedback_h1', dispatched: 0, skipped: 0, bookingIds: [] };
    }
    if (!isWithinSendWindow(nowWib, settings.notifFeedbackSendTime)) {
      return { type: 'feedback_h1', dispatched: 0, skipped: 0, bookingIds: [] };
    }

    // Window: seluruh hari KEMARIN dalam TZ klinik
    const { dateStr: todayStr } = nowWib;
    const todayMidnight = localDateAtMidnight(todayStr, tz);
    const yesterdayStart = new Date(todayMidnight.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayEnd = new Date(todayMidnight.getTime() - 1);

    const { dateStr: yesterdayStr } = localPartsInTimezone(yesterdayStart, tz);
    this.logger.log(`[feedback-h1] send-time=${settings.notifFeedbackSendTime} checking bookings completed on ${yesterdayStr}`);

    const bookings = await this.findCompletedInWindow(yesterdayStart, yesterdayEnd);
    this.logger.log(`[feedback-h1] candidate ${bookings.length} bookings`);

    const bookingIds: number[] = [];
    for (const b of bookings) {
      await this.dispatchFeedbackAndMark(b);
      bookingIds.push(b.id);
    }
    return { type: 'feedback_h1', dispatched: bookingIds.length, skipped: 0, bookingIds };
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
          nama_layanan: booking.service?.name ?? '',
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
