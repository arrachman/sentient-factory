'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { Booking } from '@/features/admin-booking/model/types';
import type { usePsikologDashboard } from '../hooks/use-psikolog-dashboard';
import { formatDayLong, formatTime, shortService } from '../model/format';

type Page = ReturnType<typeof usePsikologDashboard>;

/**
 * Tampilan mobile "Hari ini · landing" psikolog — mirror prototype:
 * tanggal serif, hero "sesi berikutnya · N menit lagi", list sesi hari ini,
 * prompt atur availability. Desktop pakai grid; `lg:hidden`.
 */
export function DashboardMobile({ page }: { page: Page }) {
  const [nowMs, setNowMs] = useState(0);
  useEffect(() => {
    setNowMs(Date.now());
  }, []);

  const sorted = useMemo(
    () =>
      page.todayBookings
        .slice()
        .sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart)),
    [page.todayBookings],
  );

  const next: Booking | undefined = useMemo(() => {
    if (!nowMs) return undefined;
    return sorted.find(
      (b) =>
        b.status !== 'completed' &&
        new Date(b.scheduledEnd).getTime() > nowMs,
    );
  }, [sorted, nowMs]);

  const minutesUntil =
    next && nowMs
      ? Math.round(
          (new Date(next.scheduledStart).getTime() - nowMs) / 60000,
        )
      : null;

  const untilLabel =
    minutesUntil === null
      ? ''
      : minutesUntil <= 0
        ? 'sedang berlangsung'
        : minutesUntil < 60
          ? `${minutesUntil} menit lagi`
          : `${Math.floor(minutesUntil / 60)} jam lagi`;

  return (
    <div className="lg:hidden">
      <div className="space-y-4 p-4">
        <div>
          <h1 className="brand-mark text-2xl text-teal-800">
            {formatDayLong(page.today)}
          </h1>
          <p className="caption mt-0.5 text-[12px]">
            {page.todayTotal} sesi terjadwal
          </p>
        </div>

        {next && (
          <div
            className="rounded-2xl p-4 text-white"
            style={{ background: 'var(--sage-600, #4a7355)' }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">
              ● Sesi berikutnya{untilLabel ? ` · ${untilLabel}` : ''}
            </p>
            <p className="mt-2 text-lg font-semibold">{next.client.name}</p>
            <p className="text-[13px] opacity-90">{next.service.name}</p>
            <div className="mt-3 flex items-center gap-2 text-[12px]">
              <span className="rounded-md bg-white/15 px-2 py-1">
                {formatTime(next.scheduledStart)} –{' '}
                {formatTime(next.scheduledEnd)}
              </span>
              <span className="rounded-md bg-white/15 px-2 py-1">
                {next.room.name}
              </span>
            </div>
          </div>
        )}

        <div>
          <p className="caption mb-2 text-[11px] font-semibold uppercase tracking-wide">
            Sesi hari ini
          </p>
          {page.isTodayLoading ? (
            <div className="caption py-8 text-center">Memuat sesi…</div>
          ) : sorted.length === 0 ? (
            <div className="caption py-8 text-center">
              Tidak ada sesi hari ini.
            </div>
          ) : (
            <ul className="space-y-2">
              {sorted.map((b) => {
                const done = b.status === 'completed';
                const now = b.status === 'in_progress';
                return (
                  <li
                    key={b.id}
                    className="flex items-stretch gap-3 rounded-xl border border-border bg-card p-3"
                    style={{ opacity: done ? 0.62 : 1 }}
                  >
                    <div className="flex w-14 flex-col">
                      <span className="brand-mark text-base text-teal-800">
                        {formatTime(b.scheduledStart)}
                      </span>
                      <span className="caption text-[10px]">WIB</span>
                    </div>
                    <div
                      className="min-w-0 flex-1 border-l pl-3"
                      style={{ borderColor: 'var(--sage-300, #b9d0bd)' }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-teal-800">
                          {b.client.name}
                        </span>
                        {now && (
                          <span className="badge badge-sage shrink-0 text-[10px]">
                            now
                          </span>
                        )}
                      </div>
                      <p className="caption truncate text-[12px]">
                        {shortService(
                          b.service.name,
                          b.sessionN,
                          b.sessionTotal,
                        )}
                      </p>
                      <span className="mt-1 inline-block rounded-md bg-cream-100 px-2 py-0.5 text-[11px] text-teal-800">
                        {b.room.name}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <Link
          href="/psikolog/schedule"
          className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-card p-3"
        >
          <CalendarClock className="h-5 w-5 text-sage-600" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-teal-800">
              Atur availability minggu depan
            </p>
            <p className="caption text-[11px]">
              Pola minggu ini akan dipakai bila belum diset
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}
