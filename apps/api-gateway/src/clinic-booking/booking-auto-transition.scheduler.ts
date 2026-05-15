import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { BookingEventsService } from './booking-events.service';

/**
 * Auto-transition booking status berdasarkan waktu terjadwal.
 *
 * Setiap 1 menit:
 * - scheduledStart ≤ now AND status masih aktif (awaiting_dp/confirmed/checked_in)
 *   → langsung set in_progress (skip intermediate steps karena sesi sudah dimulai).
 * - scheduledEnd ≤ now AND status in_progress
 *   → set completed.
 *
 * Bypass state machine — ini sistem operasi, bukan transisi manual admin.
 * Emits SSE event agar frontend realtime update tanpa refresh.
 */
@Injectable()
export class BookingAutoTransitionScheduler {
  private readonly logger = new Logger(BookingAutoTransitionScheduler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly events: BookingEventsService,
  ) {}

  @Cron('* * * * *', { name: 'auto-transition' })
  async run() {
    const now = new Date();
    await Promise.all([this.autoStart(now), this.autoComplete(now)]);
  }

  // -----------------------------------------------------------------

  private async autoStart(now: Date) {
    const bookings = await this.prisma.clinicBooking.findMany({
      where: {
        deletedAt: null,
        status: { in: ['checked_in'] },
        scheduledStart: { lte: now },
        scheduledEnd: { gt: now }, // sesi masih berlangsung (belum lewat end)
      },
      select: { id: true, status: true },
    });

    if (bookings.length === 0) return;
    this.logger.log(`[auto-start] ${bookings.length} booking(s) → in_progress`);

    for (const b of bookings) {
      await this.prisma.clinicBooking.update({
        where: { id: b.id },
        data: { status: 'in_progress', updatedAt: now },
      });
      this.events.emit({ type: 'transition', bookingId: b.id, status: 'in_progress' });
    }
  }

  private async autoComplete(now: Date) {
    const bookings = await this.prisma.clinicBooking.findMany({
      where: {
        deletedAt: null,
        status: 'in_progress',
        scheduledEnd: { lte: now },
      },
      select: { id: true },
    });

    if (bookings.length === 0) return;
    this.logger.log(`[auto-complete] ${bookings.length} booking(s) → completed`);

    for (const b of bookings) {
      await this.prisma.clinicBooking.update({
        where: { id: b.id },
        data: { status: 'completed', updatedAt: now },
      });
      this.events.emit({ type: 'transition', bookingId: b.id, status: 'completed' });
    }
  }
}
