import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClinicWaService } from '../clinic-wa/clinic-wa.service';
import { formatClinicTimeOfDay } from './timezone.util';

/**
 * WA notification dispatch untuk booking lifecycle events.
 *
 * Extracted dari ClinicBookingService — notif logic terpisah dari
 * state machine. Single source of truth untuk format variable
 * (nama_klien, tanggal, waktu, dll) yang dipakai di template WA.
 *
 * Fire-and-forget pattern: error tidak boleh block transition,
 * cuma logged ke console (dipantau Sentry di production).
 *
 * Fan-out ke psikolog: di-drive oleh kolom `ClinicWaTemplate.recipients`.
 * Kalau template recipients mengandung 'psikolog' dan psikolog punya
 * User.phone, dispatch kedua dilakukan paralel dengan recipientType
 * 'psikolog'. Error sisi psikolog tidak ganggu kirim ke klien.
 */

type BookingForNotification = {
  id: number;
  scheduledStart: Date;
  scheduledEnd: Date;
  client: { name: string; phoneWa: string | null };
  service: { name: string; basePrice: unknown };
  psikolog: {
    fullName: string | null;
    phone?: string | null;
    clinicPsikologProfile?: { title: string | null; specialty: string[]; license: string | null } | null;
  };
  room: { name: string };
};

/** Subset settings yang dipakai oleh notifier — cukup field notif booleans. */
type NotifSettings = {
  waSendEnabled: boolean;
  notifConfirmKlien: boolean;
  notifConfirmPsikolog: boolean;
  notifFollowupKlien: boolean;
  notifRescheduleKlien: boolean;
  notifReschedulePsikolog: boolean;
  notifCancelKlien: boolean;
  notifCancelPsikolog: boolean;
  notifUbahRuanganKlien: boolean;
  notifUbahRuanganPsikolog: boolean;
  notifUbahLayananKlien: boolean;
  notifUbahLayananPsikolog: boolean;
  notifWelcomeKlien: boolean;
  notifWelcomePsikolog: boolean;
  notifDpKlien: boolean;
  notifBuktiPembayaranKlien: boolean;
  notifPelunasanKlien: boolean;
};

/**
 * Map template name → toggle field yang mengontrol dispatch-nya.
 * Struktur: { klien?: keyof NotifSettings, psikolog?: keyof NotifSettings }
 */
const TEMPLATE_TOGGLE: Record<string, { klien?: keyof NotifSettings; psikolog?: keyof NotifSettings }> = {
  'Konfirmasi Booking':         { klien: 'notifConfirmKlien',        psikolog: 'notifConfirmPsikolog' },
  'Follow-up Post Session':     { klien: 'notifFollowupKlien' },
  'Reschedule Booking':         { klien: 'notifRescheduleKlien',     psikolog: 'notifReschedulePsikolog' },
  'Cancel Booking':             { klien: 'notifCancelKlien',         psikolog: 'notifCancelPsikolog' },
  'Ubah Ruangan':               { klien: 'notifUbahRuanganKlien',    psikolog: 'notifUbahRuanganPsikolog' },
  'Ubah Layanan':               { klien: 'notifUbahLayananKlien',    psikolog: 'notifUbahLayananPsikolog' },
  'Welcome New Client':         { klien: 'notifWelcomeKlien' },
  'Welcome Psikolog Baru':      { psikolog: 'notifWelcomePsikolog' },
  'Tagihan DP':                 { klien: 'notifDpKlien' },
  'Bukti Pembayaran':           { klien: 'notifBuktiPembayaranKlien' },
  'Pengingat Pelunasan':        { klien: 'notifPelunasanKlien' },
};

@Injectable()
export class BookingNotificationService {
  private readonly logger = new Logger(BookingNotificationService.name);

  constructor(
    private readonly wa: ClinicWaService,
    private readonly prisma: PrismaService,
  ) {}

  /** Baca notif settings dari DB (single-row). Null-safe — pakai defaults kalau row belum ada. */
  private async getNotifSettings(): Promise<NotifSettings> {
    const s = await this.prisma.clinicSettings.findUnique({ where: { id: 1 } });
    return {
      waSendEnabled:              s?.waSendEnabled              ?? false,
      notifConfirmKlien:          s?.notifConfirmKlien          ?? true,
      notifConfirmPsikolog:       s?.notifConfirmPsikolog       ?? true,
      notifFollowupKlien:         s?.notifFollowupKlien         ?? true,
      notifRescheduleKlien:       s?.notifRescheduleKlien       ?? true,
      notifReschedulePsikolog:    s?.notifReschedulePsikolog    ?? true,
      notifCancelKlien:           s?.notifCancelKlien           ?? true,
      notifCancelPsikolog:        s?.notifCancelPsikolog        ?? true,
      notifUbahRuanganKlien:      s?.notifUbahRuanganKlien      ?? true,
      notifUbahRuanganPsikolog:   s?.notifUbahRuanganPsikolog   ?? true,
      notifUbahLayananKlien:      s?.notifUbahLayananKlien      ?? false,
      notifUbahLayananPsikolog:   s?.notifUbahLayananPsikolog   ?? false,
      notifWelcomeKlien:          s?.notifWelcomeKlien          ?? true,
      notifWelcomePsikolog:       s?.notifWelcomePsikolog       ?? true,
      notifDpKlien:               s?.notifDpKlien               ?? true,
      notifBuktiPembayaranKlien:  s?.notifBuktiPembayaranKlien  ?? false,
      notifPelunasanKlien:        s?.notifPelunasanKlien        ?? true,
    };
  }

  /**
   * Cek `ClinicWaTemplate.recipients` — apakah template ini juga harus
   * dikirim ke psikolog. Return false kalau template tidak ditemukan
   * (dispatch() yang akan log warn).
   */
  private async templateTargetsPsikolog(templateName: string): Promise<boolean> {
    const tpl = await this.prisma.clinicWaTemplate.findFirst({
      where: { name: templateName, isActive: true, deletedAt: null },
      select: { recipients: true },
    });
    return tpl?.recipients?.includes('psikolog') ?? false;
  }

  /**
   * Fire-and-forget WA dispatch untuk booking event.
   * Caller pakai `void this.notify(...)` — error logged, tidak throw.
   * Cek notif toggle dari ClinicSettings sebelum dispatch — kalau off, skip.
   */
  async notify(
    booking: BookingForNotification,
    templateName: string,
    extraVars: Record<string, string | number> = {},
  ): Promise<void> {
    if (!booking.client.phoneWa) {
      return;
    }

    const settings = await this.getNotifSettings();
    if (!settings.waSendEnabled) return;

    const toggle = TEMPLATE_TOGGLE[templateName];
    if (toggle?.klien !== undefined && !settings[toggle.klien]) {
      this.logger.debug(`[notify] skip klien — ${templateName} (toggle off)`);
      return;
    }

    try {
      // Format tanggal/waktu human-readable Indonesia (Asia/Jakarta)
      // supaya template variable {{tanggal}} {{waktu}} muncul rapi:
      //   tanggal: 'Senin, 11 Mei 2026'
      //   waktu:   '14.30 WIB'  (24-jam, dot separator)
      const tanggalFormatted = booking.scheduledStart.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta',
      });
      const waktuFormatted = formatClinicTimeOfDay(booking.scheduledStart);
      const waktuEndFormatted = formatClinicTimeOfDay(booking.scheduledEnd);
      const totalFormatted = new Intl.NumberFormat('id-ID').format(
        Number(booking.service.basePrice),
      );

      // jadwal_lengkap & total_baris: default single-session, di-override oleh extraVars
      // kalau dipanggil dari notifyPackageConfirmation (multi-sesi).
      const defaultJadwalLengkap = `${tanggalFormatted} · ${waktuFormatted}–${waktuEndFormatted} WIB · ${booking.room.name}`;

      const variables = {
        nama_klien: booking.client.name,
        nama_psikolog: booking.psikolog.fullName ?? 'Psikolog Althea',
        psikolog: booking.psikolog.fullName ?? 'Psikolog Althea', // alias
        tanggal: tanggalFormatted,
        waktu: `${waktuFormatted} WIB`,
        ruang: booking.room.name,
        layanan: booking.service.name,
        total: totalFormatted,
        jadwal_lengkap: defaultJadwalLengkap,
        total_baris: `💰 Total: Rp ${totalFormatted}`,
        ...extraVars,
      };
      await this.wa.dispatch({
        templateName,
        recipientType: 'klien',
        recipientPhone: booking.client.phoneWa,
        variables,
        bookingId: booking.id,
      });

      // Fan-out ke psikolog: cek toggle psikolog + template recipients
      const psikologToggleKey = toggle?.psikolog;
      const psikologToggleOn = psikologToggleKey ? settings[psikologToggleKey] : true;
      if (booking.psikolog.phone && psikologToggleOn && (await this.templateTargetsPsikolog(templateName))) {
        try {
          await this.wa.dispatch({
            templateName,
            recipientType: 'psikolog',
            recipientPhone: booking.psikolog.phone,
            variables,
            bookingId: booking.id,
          });
        } catch (errPsikolog) {
          this.logger.warn(
            `[BookingNotification] psikolog fan-out failed template=${templateName} bookingId=${booking.id}: ${errPsikolog instanceof Error ? errPsikolog.message : errPsikolog}`,
          );
        }
      }
    } catch (err) {
      console.error(`[BookingNotification] template=${templateName} bookingId=${booking.id}:`, err);
    }
  }

  /**
   * Manual reminder dispatch (admin/resepsionis trigger).
   * Beda dengan `notify()`: throw error kalau booking tidak punya phone
   * atau status final, supaya caller bisa show ke user.
   */
  /**
   * Kirim 1 WA Konfirmasi Booking untuk paket multi-sesi.
   * Satu notifikasi dengan jadwal_lengkap semua sesi — tidak loop per sesi.
   * Fire-and-forget — error tidak throw.
   */
  async notifyPackageConfirmation(bookings: BookingForNotification[]): Promise<void> {
    if (bookings.length === 0) return;
    const first = bookings[0];

    const jadwal_lengkap = bookings
      .map((b, i) => {
        const tgl = b.scheduledStart.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          timeZone: 'Asia/Jakarta',
        });
        const jamStart = formatClinicTimeOfDay(b.scheduledStart);
        const jamEnd = formatClinicTimeOfDay(b.scheduledEnd);
        return `Sesi ${i + 1}: ${tgl} · ${jamStart}–${jamEnd} WIB · ${b.room.name}`;
      })
      .join('\n');

    await this.notify(first, 'Konfirmasi Booking', {
      jadwal_lengkap,
      total_baris: '', // sembunyikan total untuk paket multi-sesi
    });
  }

  /**
   * Kirim profil psikolog ke klien saat booking pertama dikonfirmasi.
   * Fire-and-forget — error tidak throw.
   */
  async notifyPsikologInfo(booking: BookingForNotification): Promise<void> {
    if (!booking.client.phoneWa) return;
    try {
      const profile = booking.psikolog.clinicPsikologProfile;
      await this.wa.dispatch({
        templateName: 'Info Psikolog',
        recipientType: 'klien',
        recipientPhone: booking.client.phoneWa,
        variables: {
          nama_psikolog: booking.psikolog.fullName ?? 'Psikolog Althea',
          title: profile?.title ?? '',
          spesialisasi: profile?.specialty?.join(', ') ?? '',
          pendidikan: '',
          lisensi: profile?.license ?? '',
        },
        bookingId: booking.id,
      });
    } catch (err) {
      console.error(`[BookingNotification] template=Info Psikolog bookingId=${booking.id}:`, err);
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
        waktu: formatClinicTimeOfDay(new Date(booking.scheduledStart)),
      },
      bookingId: booking.id,
    });
  }
}
