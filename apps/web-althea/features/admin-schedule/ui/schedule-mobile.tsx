'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, SlidersHorizontal } from 'lucide-react';
import type { Booking } from '@/features/admin-booking/model/types';
import { DAY_LABELS_SHORT, SVC_COLOR } from '../model/constants';
import { addDays, todayKey } from '../model/format';

/**
 * Tampilan mobile halaman Jadwal — mirror prototype "Penjadwalan · hari ini":
 * date pills, 3 stat tile, list sesi (waktu kiri + meta + badge now), FAB.
 * Desktop pakai grid (`SchedulePage`), komponen ini hanya render di `lg:hidden`.
 */
function dowShort(key: string): string {
  const d = new Date(`${key}T00:00:00`);
  return DAY_LABELS_SHORT[(d.getDay() + 6) % 7].slice(0, 2);
}

function dayNum(key: string): string {
  return String(new Date(`${key}T00:00:00`).getDate());
}

function hhmm(iso: string): string {
  return new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  });
}

function svcKey(category: string): keyof typeof SVC_COLOR {
  if (category in SVC_COLOR) return category as keyof typeof SVC_COLOR;
  return 'konseling';
}

export function ScheduleMobile({
  date,
  onPickDate,
  bookings,
  psikologCount,
  roomCount,
  isLoading,
  onCreate,
  onBookingClick,
  onToggleFilter,
}: {
  date: string;
  onPickDate: (key: string) => void;
  bookings: Booking[];
  psikologCount: number;
  roomCount: number;
  isLoading: boolean;
  onCreate: () => void;
  onBookingClick: (b: Booking) => void;
  onToggleFilter: () => void;
}) {
  // Derive day pills client-side only. `todayKey()` pakai `new Date()` yang
  // berbeda antara server (UTC) dan browser (WIB) di sekitar tengah malam →
  // hydration mismatch (server render "15", client "16"). Init [] supaya SSR +
  // first client render konsisten, isi setelah mount.
  const [days, setDays] = useState<string[]>([]);
  useEffect(() => {
    const start = todayKey();
    setDays(Array.from({ length: 14 }, (_, i) => addDays(start, i)));
  }, []);

  const daySessions = useMemo(() => {
    return bookings
      .filter((b) => b.scheduledStart.slice(0, 10) === date)
      .sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart));
  }, [bookings, date]);

  const usedRooms = new Set(daySessions.map((b) => b.room.id)).size;
  const fillPct =
    roomCount > 0 ? Math.round((usedRooms / roomCount) * 100) : 0;

  return (
    <div className="lg:hidden">
      <div className="space-y-3 p-4">
        {/* Date pills */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {days.map((d) => {
            const active = d === date;
            return (
              <button
                key={d}
                type="button"
                onClick={() => onPickDate(d)}
                className="flex min-w-[52px] flex-col items-center rounded-xl border px-2 py-2"
                style={{
                  borderColor: active ? 'transparent' : 'var(--border)',
                  background: active ? 'var(--sage-500, #5b8a66)' : 'var(--card)',
                  color: active ? '#fff' : 'var(--teal-800, #142828)',
                }}
              >
                <span className="text-[11px] font-medium opacity-80">
                  {dowShort(d)}
                </span>
                <span className="text-base font-semibold">{dayNum(d)}</span>
              </button>
            );
          })}
        </div>

        {/* Stat tiles */}
        <div className="grid grid-cols-3 gap-2">
          <StatTile value={daySessions.length} label="sesi" />
          <StatTile value={psikologCount} label="psikolog" />
          <StatTile value={`${fillPct}%`} label="terisi" />
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between pt-1">
          <span className="caption text-[11px] font-semibold uppercase tracking-wide">
            Sesi hari ini
          </span>
          <button
            type="button"
            onClick={onToggleFilter}
            className="flex items-center gap-1 text-[12px] text-teal-800"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filter
          </button>
        </div>

        {/* Session list */}
        {isLoading ? (
          <div className="caption py-8 text-center">Memuat sesi…</div>
        ) : daySessions.length === 0 ? (
          <div className="caption py-8 text-center">
            Tidak ada sesi pada tanggal ini.
          </div>
        ) : (
          <ul className="space-y-2">
            {daySessions.map((b) => {
              const c = SVC_COLOR[svcKey(b.service.category)];
              const now = b.status === 'in_progress';
              const psiName = b.psikolog.fullName ?? b.psikolog.email;
              return (
                <li key={b.id}>
                  <button
                    type="button"
                    onClick={() => onBookingClick(b)}
                    className="flex w-full items-stretch gap-3 rounded-xl border border-border bg-card p-3 text-left"
                    style={{ borderLeft: `4px solid ${c.bar}` }}
                  >
                    <div className="flex w-14 flex-col">
                      <span className="text-sm font-semibold text-teal-800">
                        {hhmm(b.scheduledStart)}
                      </span>
                      <span className="caption text-[11px]">
                        {hhmm(b.scheduledEnd)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
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
                        {psiName} · {b.room.name}
                      </p>
                      <p className="caption truncate text-[11px] opacity-80">
                        {b.service.name}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* FAB */}
      <button
        type="button"
        onClick={onCreate}
        aria-label="Jadwal baru"
        className="fixed bottom-20 right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
        style={{ background: 'var(--sage-500, #5b8a66)' }}
      >
        <Plus className="h-6 w-6" />
      </button>
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
