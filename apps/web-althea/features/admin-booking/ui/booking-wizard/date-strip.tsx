'use client';

/**
 * Week-strip date picker dengan color-coded status:
 *   - available, klinik-closed, holiday, psikolog-off, psikolog-unset
 * Navigasi prev/next minggu. Dipakai single-session (Step4) & multi-session (SessionRow).
 */
import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Psikolog } from '@/features/admin-psikolog/model/types';

const DAY_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const DAY_KEY = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];
const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

type DateStatus =
  | 'available'
  | 'klinik-closed'
  | 'holiday'
  | 'psikolog-off'
  | 'psikolog-unset';

const STATUS_INFO: Record<
  DateStatus,
  { label: string; bg: string; border: string; fg: string }
> = {
  available:        { label: '',          bg: 'bg-card',      border: 'border-border',    fg: 'text-fg' },
  'klinik-closed':  { label: 'Tutup',     bg: 'bg-cream-100', border: 'border-cream-200', fg: 'text-fg-muted' },
  holiday:          { label: 'Libur',     bg: 'bg-amber-50',  border: 'border-amber-200', fg: 'text-amber-800' },
  'psikolog-off':   { label: 'Libur',     bg: 'bg-rose-50',   border: 'border-rose-200',  fg: 'text-rose-700' },
  'psikolog-unset': { label: 'Belum set', bg: 'bg-cream-100', border: 'border-cream-200', fg: 'text-fg-muted' },
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function statusFor(
  d: Date,
  psikolog: Psikolog | null,
  closedDayOfWeek: number[],
  holidays: string[],
): DateStatus {
  const dateStr = toDateKey(d);
  const dow = d.getDay();
  if (holidays.includes(dateStr)) return 'holiday';
  if (closedDayOfWeek.includes(dow)) return 'klinik-closed';
  if (psikolog) {
    const wa = psikolog.weeklyAvailability ?? {};
    if (Object.keys(wa).length === 0) return 'psikolog-unset';
    const dayCfg = wa[DAY_KEY[dow]];
    if (!dayCfg || !dayCfg.isOpen) return 'psikolog-off';
  }
  return 'available';
}

export function DateStrip({
  selectedDate,
  psikolog,
  closedDayOfWeek,
  holidays,
  onChangeDate,
}: {
  selectedDate: string;
  psikolog: Psikolog | null;
  closedDayOfWeek: number[];
  holidays: string[];
  onChangeDate: (date: string) => void;
}) {
  const [weekOffset, setWeekOffset] = useState(0);

  // Sinkronkan anchor minggu agar minggu yang ditampilkan memuat selectedDate.
  // Saat user pakai per-sesi (multi-session) dengan tanggal H+7 / H+14 / dst,
  // strip otomatis loncat ke minggu yang berisi tanggal sesi tsb.
  useEffect(() => {
    if (!selectedDate) return;
    const sel = new Date(`${selectedDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dow = today.getDay();
    const mondayOffset = dow === 0 ? -6 : 1 - dow;
    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() + mondayOffset);
    const diffDays = Math.floor(
      (sel.getTime() - thisMonday.getTime()) / (1000 * 60 * 60 * 24),
    );
    const targetOffset = Math.floor(diffDays / 7);
    setWeekOffset((curr) => (curr === targetOffset ? curr : targetOffset));
  }, [selectedDate]);

  const week = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dow = today.getDay();
    const mondayOffset = dow === 0 ? -6 : 1 - dow;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset + weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, [weekOffset]);

  const todayKey = toDateKey(new Date());
  const weekLabel = useMemo(() => {
    const first = week[0];
    const last = week[6];
    return `${first.getDate()} ${MONTH_SHORT[first.getMonth()]} – ${last.getDate()} ${MONTH_SHORT[last.getMonth()]} ${last.getFullYear()}`;
  }, [week]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="caption">Tanggal</label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setWeekOffset((o) => o - 1)}
            className="btn btn-ghost btn-icon h-7 w-7"
            aria-label="Minggu sebelumnya"
            title="Minggu sebelumnya"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="caption text-teal-800 font-medium tabular-nums px-1.5 min-w-[140px] text-center">
            {weekLabel}
          </span>
          <button
            type="button"
            onClick={() => setWeekOffset((o) => o + 1)}
            className="btn btn-ghost btn-icon h-7 w-7"
            aria-label="Minggu berikutnya"
            title="Minggu berikutnya"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {week.map((d) => {
          const key = toDateKey(d);
          const status = statusFor(d, psikolog, closedDayOfWeek, holidays);
          const info = STATUS_INFO[status];
          const selected = key === selectedDate;
          const isToday = key === todayKey;
          const dow = d.getDay();
          const unbookable = status !== 'available';
          return (
            <button
              key={key}
              type="button"
              onClick={() => !unbookable && onChangeDate(key)}
              disabled={unbookable}
              className={`flex flex-col items-center px-1 py-2 rounded-md border text-xs transition-colors ${
                selected
                  ? 'bg-sage-500 border-sage-500 text-white shadow-sm'
                  : unbookable
                    ? `${info.bg} ${info.border} ${info.fg} cursor-not-allowed`
                    : `${info.bg} ${info.border} ${info.fg} hover:border-sage-300 cursor-pointer`
              } ${isToday && !selected ? 'ring-1 ring-sage-300' : ''}`}
              title={
                status === 'available'
                  ? 'Tersedia'
                  : status === 'klinik-closed'
                    ? 'Klinik tutup — tidak bisa dipilih'
                    : status === 'holiday'
                      ? 'Tanggal libur — tidak bisa dipilih'
                      : status === 'psikolog-off'
                        ? `${psikolog?.fullName ?? 'Psikolog'} tidak praktik — tidak bisa dipilih`
                        : 'Psikolog belum set jadwal — tidak bisa dipilih'
              }
            >
              <span className="text-[10px] uppercase tracking-wider opacity-80">
                {DAY_SHORT[dow]}
              </span>
              <span className="text-base font-semibold leading-tight tabular-nums">
                {d.getDate()}
              </span>
              {info.label ? (
                <span className="text-[9.5px] mt-0.5 leading-none">{info.label}</span>
              ) : isToday ? (
                <span className="text-[9.5px] mt-0.5 leading-none opacity-80">hari ini</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
