'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type HistoryRow = {
  id: number;
  work_date: string;
  clock_in_at: string | null;
  clock_out_at: string | null;
  clock_in_status: string | null;
  clock_out_status: string | null;
  total_work_minutes: number | null;
  clock_in_worksite_name: string | null;
  clock_out_worksite_name: string | null;
  username: string;
  full_name: string | null;
};

type HistoryMeta = { page: number; limit: number; total: number; totalPages: number };

const HR_TIME_ZONE = 'Asia/Jakarta';

function getJakartaCalendarParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: HR_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  return { year: Number(parts.find((p) => p.type === 'year')?.value ?? '0'), month: Number(parts.find((p) => p.type === 'month')?.value ?? '1'), day: Number(parts.find((p) => p.type === 'day')?.value ?? '1') };
}

function getJakartaDayKey(date: Date) {
  const { year, month, day } = getJakartaCalendarParts(date);
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseHrWallClock(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d{1,6})?(?:Z)?)?$/);
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]), hour: Number(match[4] ?? '0'), minute: Number(match[5] ?? '0') };
}

function formatJakartaWallClock(parts: { year: number; month: number; day: number; hour: number; minute: number }) {
  const monthLabel = new Intl.DateTimeFormat('id-ID', { timeZone: HR_TIME_ZONE, month: 'short' }).format(new Date(Date.UTC(parts.year, parts.month - 1, 1)));
  return { dateLabel: `${String(parts.day).padStart(2, '0')} ${monthLabel} ${parts.year}`, timeLabel: `${String(parts.hour).padStart(2, '0')}.${String(parts.minute).padStart(2, '0')}`, dayKey: `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}` };
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return '-';
  const wallClock = parseHrWallClock(value);
  if (wallClock) {
    const formatted = formatJakartaWallClock(wallClock);
    return `${formatted.dayKey === getJakartaDayKey(new Date()) ? formatted.timeLabel : `${formatted.dateLabel}, ${formatted.timeLabel}`} WIB`;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const isToday = getJakartaDayKey(date) === getJakartaDayKey(new Date());
  return new Intl.DateTimeFormat('id-ID', isToday ? { timeZone: HR_TIME_ZONE, hour: '2-digit', minute: '2-digit' } : { timeZone: HR_TIME_ZONE, day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date) + ' WIB';
}

function formatWorkDate(value: string | null | undefined) {
  if (!value) return new Intl.DateTimeFormat('id-ID', { timeZone: HR_TIME_ZONE, day: '2-digit', month: 'short', year: 'numeric' }).format(new Date());
  const wallClock = parseHrWallClock(value);
  if (wallClock) return formatJakartaWallClock(wallClock).dateLabel;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('id-ID', { timeZone: HR_TIME_ZONE, day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

function formatMinutes(value: number | null | undefined) {
  if (typeof value !== 'number') return '-';
  return `${Math.floor(value / 60)}h ${value % 60}m`;
}

function statusTone(value: string | null | undefined) {
  switch (value) {
    case 'success': return 'bg-emerald-100 text-emerald-700';
    case 'manual_review': return 'bg-amber-100 text-amber-800';
    case 'warning': return 'bg-orange-100 text-orange-800';
    case 'rejected': return 'bg-rose-100 text-rose-700';
    default: return 'bg-slate-100 text-slate-700';
  }
}

function humanizeStatus(value: string | null | undefined) {
  switch (value) {
    case 'pending': return 'Menunggu Review';
    case 'manual_review': return 'Perlu Review';
    case 'success': return 'Berhasil';
    case 'rejected': return 'Ditolak';
    case 'approved': return 'Disetujui';
    case 'needs_clarification': return 'Perlu Klarifikasi';
    case 'warning': return 'Peringatan';
    default:
      if (!value) return '-';
      return value.split('_').map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(' ');
  }
}

export function HistoryList({
  rows,
  hasMultipleEmployees,
  meta,
  onPrevPage,
  onNextPage,
}: {
  rows: HistoryRow[];
  hasMultipleEmployees: boolean;
  meta: HistoryMeta | undefined;
  onPrevPage: () => void;
  onNextPage: () => void;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
        Belum ada riwayat absensi.
      </div>
    );
  }

  return (
    <>
      {rows.map((row) => (
        <div key={row.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">{formatWorkDate(row.work_date)}</p>
              <div className="mt-1 space-y-1">
                {hasMultipleEmployees ? <p className="text-xs font-medium text-slate-700">{row.full_name ?? row.username}</p> : null}
                <p className="text-xs text-slate-500">{row.clock_in_worksite_name ?? row.clock_out_worksite_name ?? '-'}</p>
              </div>
            </div>
            <Badge className={cn('border-0', statusTone(row.clock_out_status ?? row.clock_in_status))}>
              {humanizeStatus(row.clock_out_status ?? row.clock_in_status)}
            </Badge>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Jam Masuk</p>
              <p className="mt-1 font-medium text-slate-900">{formatDateTime(row.clock_in_at)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Jam Pulang</p>
              <p className="mt-1 font-medium text-slate-900">{formatDateTime(row.clock_out_at)}</p>
            </div>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Durasi</p>
            <p className="mt-1 text-sm font-medium text-slate-900">{formatMinutes(row.total_work_minutes)}</p>
          </div>
        </div>
      ))}

      {meta ? (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-sm text-slate-500">
            Halaman {meta.page} dari {meta.totalPages} • {meta.total} riwayat
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="h-10 rounded-xl" disabled={meta.page <= 1} onClick={onPrevPage}>
              Sebelumnya
            </Button>
            <Button type="button" variant="outline" className="h-10 rounded-xl" disabled={meta.page >= meta.totalPages} onClick={onNextPage}>
              Berikutnya
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
