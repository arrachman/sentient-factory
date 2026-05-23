'use client';

import { useMemo } from 'react';
import type { Booking } from '@/features/admin-booking/model/types';
import type { Room } from '@/features/admin-rooms/model/types';
import { ROOM_TYPE_STYLE } from '@/features/admin-rooms/model/constants';
import type { PeriodRange } from '../model/period';

const WIB_FMT = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Jakarta',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function wibDateKey(iso: string): string {
  return WIB_FMT.format(new Date(iso));
}

function formatDateShort(key: string): string {
  return new Date(key).toLocaleDateString('id-ID', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
}

type RoomSummary = {
  room: Room;
  total: number;
  busiestDay: string | null;
  busiestCount: number;
  activeDays: number;
};

export function RoomUsageMonthly({
  rooms,
  allBookings,
  range,
}: {
  rooms: Room[];
  allBookings: Booking[];
  range: PeriodRange;
}) {
  const summaries = useMemo<RoomSummary[]>(() => {
    return rooms.map((room) => {
      const roomBookings = allBookings.filter((b) => b.room.id === room.id);
      const byDay = new Map<string, number>();
      for (const b of roomBookings) {
        const k = wibDateKey(b.scheduledStart);
        byDay.set(k, (byDay.get(k) ?? 0) + 1);
      }
      let busiestDay: string | null = null;
      let busiestCount = 0;
      for (const [k, c] of byDay) {
        if (c > busiestCount) {
          busiestCount = c;
          busiestDay = k;
        }
      }
      return {
        room,
        total: roomBookings.length,
        busiestDay,
        busiestCount,
        activeDays: byDay.size,
      };
    });
  }, [rooms, allBookings]);

  const totalDays = range.days.length;
  const totalPossible = Math.max(totalDays, 1);

  if (rooms.length === 0) {
    return (
      <div className="py-12 text-center text-fg-muted text-sm">
        Belum ada ruangan terdaftar.
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <header className="flex flex-col gap-1">
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-serif)',
            fontSize: 19,
            fontWeight: 500,
            color: 'var(--teal-800)',
          }}
        >
          Pemakaian ruangan · Ringkasan bulanan
        </h2>
        <span className="caption">
          Total sesi per ruangan untuk periode ini ({totalDays} hari). Klik baris
          untuk melihat detail hari tersibuk.
        </span>
      </header>

      <div className="card-althea" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr
              style={{
                background: 'var(--cream-50)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {['Ruangan', 'Tipe', 'Total Sesi', 'Hari Aktif', 'Hari Tersibuk'].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: '10px 16px',
                      fontSize: 11,
                      fontWeight: 600,
                      color: 'var(--fg-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      textAlign: 'left',
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {summaries
              .sort((a, b) => b.total - a.total)
              .map((s, idx) => {
                const style = ROOM_TYPE_STYLE[s.room.type];
                const util = Math.round((s.activeDays / totalPossible) * 100);
                return (
                  <tr
                    key={s.room.id}
                    style={{
                      borderBottom:
                        idx < summaries.length - 1
                          ? '1px solid var(--border)'
                          : 'none',
                      background: idx % 2 === 1 ? 'rgba(247,244,237,0.5)' : 'transparent',
                    }}
                  >
                    <td
                      style={{
                        padding: '12px 16px',
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: 'var(--teal-800)',
                      }}
                    >
                      {s.room.name}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: style.fg,
                          background: style.bg,
                          borderRadius: 4,
                          padding: '2px 8px',
                        }}
                      >
                        {s.room.type}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color:
                            s.total > 0 ? 'var(--sage-600)' : 'var(--fg-muted)',
                        }}
                      >
                        {s.total}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          fontSize: 13.5,
                          fontWeight: 500,
                          color: 'var(--teal-800)',
                        }}
                      >
                        {s.activeDays}
                        <span
                          style={{
                            fontSize: 11,
                            color: 'var(--fg-muted)',
                            marginLeft: 4,
                          }}
                        >
                          ({util}%)
                        </span>
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        fontSize: 13,
                        color: 'var(--fg-muted)',
                      }}
                    >
                      {s.busiestDay
                        ? `${formatDateShort(s.busiestDay)} · ${s.busiestCount} sesi`
                        : '—'}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
