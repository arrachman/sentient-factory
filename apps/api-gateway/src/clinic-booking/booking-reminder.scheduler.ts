import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ClinicWaService } from '../clinic-wa/clinic-wa.service';

/**
 * Cron-based booking reminders.
 *
 * - H-1 reminder: every hour, find bookings 23-25 hours from now (1 hour window
 *   to catch all). Mark dispatch flag in metadata to prevent duplicates.
 * - 30-min reminder: every 5 minutes, find bookings 25-35 minutes from now.
 *
 * Uses ClinicWaLog.metadata.reminderH1 / reminderM30 flags untuk dedupe.
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

  @Cron(CronExpression.EVERY_HOUR, { name: 'reminder-h1' })
  async dispatchH1Reminders() {
    const now = new Date();
    const start = new Date(now.getTime() + 23 * 60 * 60 * 1000);
    const end = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    const bookings = await this.findBookingsInWindow(start, end, 'h1');
    this.logger.log(`[reminder-h1] candidate ${bookings.length} bookings`);

    for (const b of bookings) {
      await this.dispatchAndMark(b, 'Pengingat H-1', 'h1');
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
      await this.dispatchAndMark(b, 'Pengingat 30 Menit', 'm30');
    }
  }

  // -----------------------------------------------------------------

  private async findBookingsInWindow(start: Date, end: Date, flag: 'h1' | 'm30') {
    // Find bookings dalam window yang belum di-reminder
    const bookings = await this.prisma.clinicBooking.findMany({
      where: {
        deletedAt: null,
        status: { in: ['confirmed', 'awaiting_dp'] },
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
          psikolog: booking.psikolog?.fullName ?? '',
          ruang: booking.room?.name ?? '',
          tanggal: date.toLocaleString('id-ID', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }),
          waktu: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
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
