import { BadRequestException, Injectable } from '@nestjs/common';
import { ClinicWaService } from '../clinic-wa/clinic-wa.service';

/**
 * WA notification dispatch untuk booking lifecycle events.
 *
 * Extracted dari ClinicBookingService — notif logic terpisah dari
 * state machine. Single source of truth untuk format variable
 * (nama_klien, tanggal, waktu, dll) yang dipakai di template WA.
 *
 * Fire-and-forget pattern: error tidak boleh block transition,
 * cuma logged ke console (dipantau Sentry di production).
 */

type BookingForNotification = {
  id: number;
  scheduledStart: Date;
  scheduledEnd: Date;
  client: { name: string; phoneWa: string | null };
  service: { name: string; basePrice: unknown };
  psikolog: { fullName: string | null };
  room: { name: string };
};

@Injectable()
export class BookingNotificationService {
  constructor(private readonly wa: ClinicWaService) {}

  /**
   * Fire-and-forget WA dispatch untuk booking event.
   * Caller pakai `void this.notify(...)` — error logged, tidak throw.
   */
  async notify(
    booking: BookingForNotification,
    templateName: string,
    extraVars: Record<string, string | number> = {},
  ): Promise<void> {
    if (!booking.client.phoneWa) {
      // No phone, skip silently (some clients walk-in without WA)
      return;
    }
    try {
      const variables = {
        nama_klien: booking.client.name,
        nama_psikolog: booking.psikolog.fullName ?? 'Psikolog Althea',
        tanggal: booking.scheduledStart.toISOString().slice(0, 10),
        waktu: booking.scheduledStart.toISOString().slice(11, 16),
        ruang: booking.room.name,
        layanan: booking.service.name,
        total: String(booking.service.basePrice),
        ...extraVars,
      };
      await this.wa.dispatch({
        templateName,
        recipientType: 'klien',
        recipientPhone: booking.client.phoneWa,
        variables,
        bookingId: booking.id,
      });
    } catch (err) {
      console.error(`[BookingNotification] template=${templateName} bookingId=${booking.id}:`, err);
    }
  }

  /**
   * Manual reminder dispatch (admin/resepsionis trigger).
   * Beda dengan `notify()`: throw error kalau booking tidak punya phone
   * atau status final, supaya caller bisa show ke user.
   */
  async sendManualReminder(
    booking: {
      id: number;
      status: string;
      scheduledStart: Date;
      client: { name: string; phoneWa: string | null } | null;
      service: { name: string } | null;
      psikolog: { fullName: string | null } | null;
      room: { name: string } | null;
    },
    templateName: string,
  ) {
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      throw new BadRequestException(
        `Booking ${booking.status} — reminder hanya untuk booking aktif`,
      );
    }
    const phone = booking.client?.phoneWa;
    if (!phone) {
      throw new BadRequestException('Klien tidak punya nomor WhatsApp');
    }
    return this.wa.dispatch({
      templateName,
      recipientType: 'klien',
      recipientPhone: phone,
      variables: {
        nama_klien: booking.client?.name ?? '',
        layanan: booking.service?.name ?? '',
        psikolog: booking.psikolog?.fullName ?? '',
        ruang: booking.room?.name ?? '',
        tanggal: new Date(booking.scheduledStart).toLocaleString('id-ID', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
        waktu: new Date(booking.scheduledStart).toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
      bookingId: booking.id,
    });
  }
}
