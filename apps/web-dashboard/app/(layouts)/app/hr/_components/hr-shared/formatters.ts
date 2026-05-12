/**
 * Date/time/status formatters untuk HR module.
 * Semua menggunakan timezone Asia/Jakarta sesuai bisnis HR.
 */
import { HR_TIME_ZONE } from './constants';

export function statusTone(value: string | null | undefined) {
  switch (value) {
    case 'success':
      return 'bg-emerald-100 text-emerald-700';
    case 'manual_review':
      return 'bg-amber-100 text-amber-800';
    case 'warning':
      return 'bg-orange-100 text-orange-800';
    case 'rejected':
      return 'bg-rose-100 text-rose-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

export function humanizeStatus(value: string | null | undefined) {
  switch (value) {
    case 'pending':
      return 'Menunggu Review';
    case 'manual_review':
      return 'Perlu Review';
    case 'success':
      return 'Berhasil';
    case 'rejected':
      return 'Ditolak';
    case 'approved':
      return 'Disetujui';
    case 'needs_clarification':
      return 'Perlu Klarifikasi';
    case 'warning':
      return 'Peringatan';
    default:
      if (!value) return '-';
      return value
        .split('_')
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(' ');
  }
}

export function getJakartaCalendarParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: HR_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  return {
    year: Number(parts.find((part) => part.type === 'year')?.value ?? '0'),
    month: Number(parts.find((part) => part.type === 'month')?.value ?? '1'),
    day: Number(parts.find((part) => part.type === 'day')?.value ?? '1'),
  };
}

export function getJakartaDayKey(date: Date) {
  const { year, month, day } = getJakartaCalendarParts(date);
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function shiftDateKey(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split('-').map((value) => Number(value));
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  utcDate.setUTCDate(utcDate.getUTCDate() + days);
  return getJakartaDayKey(utcDate);
}

export function getHistoryQuickRange(range: 'today' | 'week' | 'month') {
  const today = getJakartaDayKey(new Date());
  if (range === 'today') return { dateFrom: today, dateTo: today };

  if (range === 'week') {
    const parts = getJakartaCalendarParts(new Date());
    const localMidnightUtc = new Date(
      Date.UTC(parts.year, parts.month - 1, parts.day),
    );
    const dayOfWeek = localMidnightUtc.getUTCDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    return { dateFrom: shiftDateKey(today, mondayOffset), dateTo: today };
  }

  const { year, month } = getJakartaCalendarParts(new Date());
  return {
    dateFrom: `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-01`,
    dateTo: today,
  };
}

export function parseHrWallClock(value: string) {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d{1,6})?(?:Z)?)?$/,
  );

  if (!match) return null;
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4] ?? '0'),
    minute: Number(match[5] ?? '0'),
  };
}

export function formatJakartaWallClock(parts: {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}) {
  const monthLabel = new Intl.DateTimeFormat('id-ID', {
    timeZone: HR_TIME_ZONE,
    month: 'short',
  }).format(new Date(Date.UTC(parts.year, parts.month - 1, 1)));

  return {
    dateLabel: `${String(parts.day).padStart(2, '0')} ${monthLabel} ${parts.year}`,
    timeLabel: `${String(parts.hour).padStart(2, '0')}.${String(parts.minute).padStart(2, '0')}`,
    dayKey: `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`,
  };
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return '-';

  const wallClock = parseHrWallClock(value);
  if (wallClock) {
    const currentJakarta = getJakartaDayKey(new Date());
    const formatted = formatJakartaWallClock(wallClock);
    return `${
      formatted.dayKey === currentJakarta
        ? formatted.timeLabel
        : `${formatted.dateLabel}, ${formatted.timeLabel}`
    } WIB`;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const isToday = getJakartaDayKey(date) === getJakartaDayKey(new Date());
  return (
    new Intl.DateTimeFormat(
      'id-ID',
      isToday
        ? { timeZone: HR_TIME_ZONE, hour: '2-digit', minute: '2-digit' }
        : {
            timeZone: HR_TIME_ZONE,
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          },
    ).format(date) + ' WIB'
  );
}

export function formatWorkDate(value: string | null | undefined) {
  if (!value) {
    return new Intl.DateTimeFormat('id-ID', {
      timeZone: HR_TIME_ZONE,
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date());
  }

  const wallClock = parseHrWallClock(value);
  if (wallClock) return formatJakartaWallClock(wallClock).dateLabel;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('id-ID', {
    timeZone: HR_TIME_ZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function humanizeReasonCode(value: string | null | undefined) {
  switch (value) {
    case 'outside_geofence':
      return 'Di luar radius worksite';
    case 'gps_denied':
      return 'Akses GPS ditolak';
    case 'gps_unavailable':
      return 'GPS tidak tersedia';
    case 'face_mismatch':
      return 'Wajah tidak cocok';
    case 'liveness_failed':
      return 'Liveness gagal';
    case 'device_blocked':
      return 'Perangkat diblokir';
    default:
      if (!value) return null;
      return value
        .split('_')
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(' ');
  }
}

export function humanizeValidationUiState(value: string | null | undefined) {
  switch (value) {
    case 'idle':
      return 'Idle';
    case 'scanning':
      return 'Sedang Memindai';
    case 'success':
      return 'Berhasil';
    case 'failure':
      return 'Gagal';
    case 'low-confidence':
      return 'Kemiripan Rendah';
    default:
      if (!value) return '-';
      return value
        .split(/[-_]/)
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(' ');
  }
}

export function formatEventLabel(value: string) {
  switch (value) {
    case 'clock_in':
      return 'Clock In';
    case 'clock_out':
      return 'Clock Out';
    default:
      return value
        .split('_')
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(' ');
  }
}

export function formatMinutes(value: number | null | undefined) {
  if (typeof value !== 'number') return '-';
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${hours}h ${minutes}m`;
}

export function formatCompactInteger(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '0';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
    value,
  );
}

export function formatPercentValue(
  value: number | null | undefined,
  digits = 0,
) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '0%';
  return `${value.toFixed(digits)}%`;
}

export function formatScorePercentage(
  value: number | null | undefined,
  digits = 0,
) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '-';
  const normalized = value <= 1 ? value * 100 : value;
  return `${normalized.toFixed(digits)}`;
}

export function formatDecimalValue(
  value: number | null | undefined,
  digits = 2,
) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '-';
  return value.toFixed(digits);
}
