'use client';

import { CalendarCheck, Clock, LogIn, ScanFace } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type { Coords } from '@/lib/use-geo';

export type TodaySession = {
  clock_in_at?: string | null;
  clock_out_at?: string | null;
  clock_in_worksite_name?: string | null;
  clock_out_worksite_name?: string | null;
  total_work_minutes?: number | null;
};

export const HM_FMT = new Intl.DateTimeFormat('id-ID', {
  hour: '2-digit',
  minute: '2-digit',
});
const TIME_FMT = new Intl.DateTimeFormat('id-ID', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});
const DATE_FMT = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function toDate(v?: string | null): Date | null {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDuration(ms: number): string {
  if (ms <= 0) return '0m';
  const totalMinutes = Math.floor(ms / 60_000);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return h > 0 ? `${h}j ${m}m` : `${m}m`;
}

type StatusTone = 'live' | 'done' | 'idle';

function statusOf(
  isClockedIn: boolean,
  isDone: boolean,
): { tone: StatusTone; Icon: typeof Clock; title: string } {
  if (isClockedIn) return { tone: 'live', Icon: Clock, title: 'Sedang bekerja' };
  if (isDone) return { tone: 'done', Icon: CalendarCheck, title: 'Sesi selesai' };
  return { tone: 'idle', Icon: LogIn, title: 'Belum clock in' };
}

// ─── Top overlay: status pill (left) + live clock (right) ───────────────────

export function StageTopBar({
  now,
  isClockedIn,
  isDone,
  elapsed,
  clockInAt,
  onEnroll,
}: {
  now: Date;
  isClockedIn: boolean;
  isDone: boolean;
  elapsed: string | null;
  clockInAt: Date | null;
  onEnroll: () => void;
}) {
  const { tone, Icon, title } = statusOf(isClockedIn, isDone);
  const dot = {
    live: 'bg-emerald-400',
    done: 'bg-sky-400',
    idle: 'bg-white/50',
  }[tone];
  const subtitle = isClockedIn
    ? `Sejak ${clockInAt ? HM_FMT.format(clockInAt) : '—'}${elapsed ? ` · ${elapsed}` : ''}`
    : isDone
      ? 'Kerja hari ini sudah tercatat'
      : 'Posisikan wajah, lalu clock in';

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-4 sm:p-5">
      <div className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-black/45 px-4 py-2.5 text-white shadow-lg ring-1 ring-white/10 backdrop-blur-md">
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
          <Icon className="h-4.5 w-4.5" />
          <span
            className={`absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ${dot} ${tone === 'live' ? 'animate-pulse' : ''} ring-2 ring-black/50`}
          />
        </span>
        <div className="leading-tight">
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-[11px] text-white/65">{subtitle}</div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="pointer-events-auto rounded-2xl bg-black/45 px-4 py-2 text-right text-white shadow-lg ring-1 ring-white/10 backdrop-blur-md">
          <div className="font-mono text-2xl font-semibold tabular-nums leading-none tracking-tight sm:text-3xl">
            {TIME_FMT.format(now)}
          </div>
          <div className="mt-1 text-[11px] capitalize text-white/65">
            {DATE_FMT.format(now)}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEnroll}
          className="pointer-events-auto h-8 gap-1.5 rounded-full bg-black/45 px-3 text-xs text-white ring-1 ring-white/10 backdrop-blur-md hover:bg-black/60 hover:text-white"
        >
          <ScanFace className="h-3.5 w-3.5" /> Daftarkan Wajah
        </Button>
      </div>
    </div>
  );
}
