'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bell } from 'lucide-react';
import type { Booking } from '@/features/admin-booking/model/types';
import type { usePsikologSchedule } from '../hooks/use-psikolog-schedule';
import { DAY_LABELS } from '../model/constants';
import { toDateKey } from '../model/format';

type Page = ReturnType<typeof usePsikologSchedule>;

/**
 * Tampilan mobile "Jadwal saya" psikolog — mirror prototype 02b:
 * toggle Hari/Minggu, day pills bercount, 3 stat tile, list sesi hari terpilih,
 * footnote info. Desktop pakai grid; `lg:hidden`.
 */
function hhmm(iso: string): string {
  return new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  });
}

export function ScheduleMobile({
  page,
  onBookingClick,
  onOpenAvailability,
}: {
  page: Page;
  onBookingClick: (b: Booking) => void;
  onOpenAvailability: () => void;
}) {
  const isWeek = page.view === 'Minggu';
  const [selIdx, setSelIdx] = useState(0);

  useEffect(() => {
    if (isWeek) setSelIdx(page.todayIdx >= 0 ? page.todayIdx : 0);
    else setSelIdx(0);
  }, [isWeek, page.todayIdx, page.anchor]);

  const sorted = useMemo(() => {
    const dayList: Booking[] = page.dayBookings[selIdx] ?? [];
    return dayList
      .slice()
      .sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart));
  }, [page.dayBookings, selIdx]);

  const uniqueClients = useMemo(
    () => new Set(page.allBookings.map((b) => b.clientId)).size,
    [page.allBookings],
  );

  const selectedDate = page.days[selIdx];

  return (
    <div className="lg:hidden">
      <div className="space-y-4 p-4">
        {/* Hari / Minggu toggle */}
        <div
          className="flex rounded-xl p-1"
          style={{ background: 'var(--cream-100, #f0ede3)' }}
        >
          {(['Hari', 'Minggu'] as const).map((v) => {
            const on = page.view === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => page.setView(v)}
                className="flex-1 rounded-lg py-2 text-sm font-medium"
                style={{
                  background: on ? '#fff' : 'transparent',
                  color: on
                    ? 'var(--teal-800, #142828)'
                    : 'var(--muted-foreground, #6b7280)',
                  boxShadow: on ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {v}
              </button>
            );
          })}
        </div>

        {/* Day pills */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {page.days.map((d, i) => {
            const key = toDateKey(d);
            const active = i === selIdx;
            const count = page.dayBookings[i]?.length ?? 0;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelIdx(i);
                  if (!isWeek) page.setAnchor(key);
                }}
                className="relative flex min-w-[52px] flex-col items-center rounded-xl border px-2 py-2"
                style={{
                  borderColor: active ? 'transparent' : 'var(--border)',
                  background: active
                    ? 'var(--sage-500, #5b8a66)'
                    : 'var(--card)',
                  color: active ? '#fff' : 'var(--teal-800, #142828)',
                }}
              >
                <span className="text-[11px] font-medium opacity-80">
                  {DAY_LABELS[(d.getDay() + 6) % 7].slice(0, 2)}
                </span>
                <span className="text-base font-semibold">{d.getDate()}</span>
                {count > 0 && (
                  <span
                    className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white"
                    style={{ background: 'var(--sage-600, #4a7355)' }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Stat tiles */}
        <div className="grid grid-cols-3 gap-2">
          <StatTile value={page.totalBooked} label="sesi" />
          <StatTile value={`${page.utilisation}%`} label="kapasitas" />
          <StatTile value={uniqueClients} label="klien" />
        </div>

        {/* Session list */}
        <div>
          <p className="caption mb-2 text-[11px] font-semibold uppercase tracking-wide">
            {selectedDate
              ? selectedDate.toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                })
              : 'Sesi'}{' '}
            · {sorted.length} sesi
          </p>
          {page.isLoading ? (
            <div className="caption py-8 text-center">Memuat jadwal…</div>
          ) : sorted.length === 0 ? (
            <div className="caption py-8 text-center">
              Tidak ada sesi pada hari ini.
            </div>
          ) : (
            <ul className="space-y-2">
              {sorted.map((b) => {
                const done = b.status === 'completed';
                const now = b.status === 'in_progress';
                return (
                  <li key={b.id}>
                    <button
                      type="button"
                      onClick={() => onBookingClick(b)}
                      className="flex w-full items-stretch gap-3 rounded-xl border border-border bg-card p-3 text-left"
                      style={{ opacity: done ? 0.62 : 1 }}
                    >
                      <div className="flex w-14 flex-col">
                        <span className="brand-mark text-base text-teal-800">
                          {hhmm(b.scheduledStart)}
                        </span>
                        <span className="caption text-[10px]">WIB</span>
                      </div>
                      <div
                        className="min-w-0 flex-1 border-l pl-3"
                        style={{ borderColor: 'var(--sage-300, #b9d0bd)' }}
                      >
                        <p className="truncate text-sm font-semibold text-teal-800">
                          {b.client.name}
                        </p>
                        <p className="caption truncate text-[12px]">
                          {b.service.name}
                          {b.sessionTotal > 1
                            ? ` · ${b.sessionN}/${b.sessionTotal}`
                            : ''}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="rounded-md bg-cream-100 px-2 py-0.5 text-[11px] text-teal-800">
                            {b.room.name}
                          </span>
                          {now && (
                            <span className="badge badge-sage text-[10px]">
                              now
                            </span>
                          )}
                          {done && (
                            <span className="badge badge-neutral text-[10px]">
                              selesai
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footnote info */}
        <div
          className="flex items-start gap-2 rounded-lg border px-3 py-2.5"
          style={{
            background: 'var(--info-soft, #e6f0f7)',
            borderColor: '#cfdde8',
          }}
        >
          <Bell size={14} style={{ color: '#4a90c0', flexShrink: 0, marginTop: 2 }} />
          <span className="caption text-[12px]" style={{ color: '#2c4a60' }}>
            Untuk reschedule lintas-psikolog, hubungi admin.
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenAvailability}
          className="btn btn-outline w-full"
        >
          Cuti &amp; Override Jadwal
        </button>
      </div>
    </div>
  );
}

function StatTile({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-2 py-3 text-center">
      <div className="brand-mark text-xl text-teal-800">{value}</div>
      <div className="caption text-[11px]">{label}</div>
    </div>
  );
}
