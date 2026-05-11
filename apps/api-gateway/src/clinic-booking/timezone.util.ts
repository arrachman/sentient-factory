/**
 * Timezone helpers untuk validasi booking.
 *
 * Backend run di Docker container yang biasanya UTC (`TZ=UTC`). Klien
 * (admin/psikolog) submit `scheduledStart` sebagai ISO UTC, tapi slot
 * operasional (`08:30-10:00`, dst) dan `weeklyAvailability` di-define
 * dalam timezone klinik (default Asia/Jakarta).
 *
 * Helper ini extract dow + dateStr + hh:mm di TZ klinik dari Date object.
 *
 * Bug yang difix: sebelumnya `start.getHours()` return jam UTC server,
 * jadi booking `2026-05-12T01:30Z` (= 08:30 WIB, slot Pagi 1) di-format
 * jadi `01:30` dan tidak match slot list klinik.
 */

const DOW_MAP: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export type LocalDateParts = {
  /** Day of week 0=Minggu .. 6=Sabtu, di TZ klinik */
  dow: number;
  /** YYYY-MM-DD di TZ klinik */
  dateStr: string;
  /** HH:MM di TZ klinik (24-jam) */
  hhmm: string;
};

/**
 * Format Date object jadi parts (dow + dateStr + hhmm) di timezone klinik.
 *
 * @param d  Date object (biasanya parsed dari ISO UTC)
 * @param timezone  IANA timezone, mis. "Asia/Jakarta". Default "Asia/Jakarta".
 */
export function localPartsInTimezone(d: Date, timezone = 'Asia/Jakarta'): LocalDateParts {
  // en-GB locale supaya hour 00-23 (bukan 24, bukan AM/PM)
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    hour12: false,
  }).formatToParts(d);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '';

  const weekday = get('weekday'); // "Tue", "Wed", dst
  const dow = DOW_MAP[weekday] ?? 0;

  let hour = get('hour');
  if (hour === '24') hour = '00'; // edge case beberapa runtime

  return {
    dow,
    dateStr: `${get('year')}-${get('month')}-${get('day')}`,
    hhmm: `${hour}:${get('minute')}`,
  };
}

/**
 * Convert local-date-string (YYYY-MM-DD di TZ klinik) jadi Date object
 * yang mewakili 00:00 di TZ tsb (sebagai UTC instant).
 *
 * Dipakai untuk lookup `clinic_psikolog_date_override.date` (column
 * disimpan sebagai "midnight di TZ klinik" expressed as UTC).
 */
export function localDateAtMidnight(dateStr: string, timezone = 'Asia/Jakarta'): Date {
  // Parse YYYY-MM-DD assuming clinic TZ. Trick: build ISO with offset
  // computed dari Intl.DateTimeFormat.
  // Simpler: ambil UTC date sama-sama lalu adjust. Cukup pakai
  // Date constructor dengan TZ-offset string.
  const offset = getTimezoneOffsetString(dateStr, timezone);
  return new Date(`${dateStr}T00:00:00${offset}`);
}

function getTimezoneOffsetString(dateStr: string, timezone: string): string {
  // Compute offset di tanggal tsb (mis. WIB = +07:00 — fixed; tapi negara
  // dengan DST bisa berubah)
  const probe = new Date(`${dateStr}T00:00:00Z`);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'longOffset',
  }).formatToParts(probe);
  const tz = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+07:00';
  // Format: "GMT+07:00" → "+07:00"
  const m = tz.match(/GMT([+-]\d{2}:\d{2})/);
  return m ? m[1] : '+07:00';
}
