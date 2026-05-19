'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Booking } from '@/features/admin-booking/model/types';
import { ROOM_TYPE_LABEL, type Room } from '../model/types';
import { RoomDetailSheetMobile } from './room-detail-sheet-mobile';

/**
 * Tampilan mobile halaman Ruangan — mirror prototype "Ruangan · status sekarang":
 * 2 stat tile (dipakai / kosong), section status, card per ruangan dengan dot.
 * Desktop pakai grid Slot×Ruangan; komponen ini hanya render di `lg:hidden`.
 */
function hhmm(iso: string): string {
  return new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  });
}

function clockOf(ms: number): string {
  return new Date(ms).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  });
}

export function RoomsMobile({
  rooms,
  bookings,
  isLoading,
}: {
  rooms: Room[];
  bookings: Booking[];
  isLoading: boolean;
}) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  // Defer ke effect supaya tidak ada SSR hydration mismatch + lolos
  // react-hooks/purity (Date.now() tidak boleh di render/useMemo).
  const [nowMs, setNowMs] = useState(0);
  useEffect(() => {
    setNowMs(Date.now());
  }, []);

  const perRoom = useMemo(() => {
    const now = nowMs;
    return rooms.map((r) => {
      const roomBookings = bookings
        .filter((b) => b.room.id === r.id)
        .sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart));
      const current = roomBookings.find((b) => {
        const s = new Date(b.scheduledStart).getTime();
        const e = new Date(b.scheduledEnd).getTime();
        return s <= now && now < e;
      });
      const next = roomBookings.find(
        (b) => new Date(b.scheduledStart).getTime() > now,
      );
      return { room: r, current, next };
    });
  }, [rooms, bookings, nowMs]);

  const usedCount = perRoom.filter((p) => p.current).length;
  const freeCount = rooms.length - usedCount;

  return (
    <div className="lg:hidden">
      <div className="space-y-3 p-4">
        {/* Stat tiles */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-border bg-card px-3 py-4 text-center">
            <div className="brand-mark text-2xl text-teal-800">{usedCount}</div>
            <div className="caption text-[11px]">dipakai</div>
          </div>
          <div className="rounded-xl border border-border bg-card px-3 py-4 text-center">
            <div className="brand-mark text-2xl text-teal-800">{freeCount}</div>
            <div className="caption text-[11px]">kosong</div>
          </div>
        </div>

        <div className="caption pt-1 text-[11px] font-semibold uppercase tracking-wide">
          Status sekarang{nowMs ? ` · ${clockOf(nowMs)}` : ''}
        </div>

        {isLoading ? (
          <div className="caption py-8 text-center">Memuat ruangan…</div>
        ) : rooms.length === 0 ? (
          <div className="caption py-8 text-center">Belum ada ruangan.</div>
        ) : (
          <ul className="space-y-2">
            {perRoom.map(({ room, current, next }) => {
              const used = Boolean(current);
              return (
                <li key={room.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedRoom(room)}
                    className="flex w-full items-start gap-3 rounded-xl border border-border bg-card p-3 text-left"
                  >
                    <span
                      className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        background: used
                          ? 'var(--sage-500, #5b8a66)'
                          : 'var(--border, #d6d3c8)',
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-teal-800">
                          {room.name}
                        </span>
                        <span className="caption shrink-0 text-[11px]">
                          {used ? 'dipakai' : 'kosong'}
                        </span>
                      </div>
                      <p className="caption truncate text-[12px]">
                        {ROOM_TYPE_LABEL[room.type]} · {room.capacity} orang
                      </p>
                      {current ? (
                        <p className="caption truncate text-[12px] text-teal-800">
                          {current.psikolog.fullName ?? current.psikolog.email}
                          {' · '}
                          {hhmm(current.scheduledStart)}–
                          {hhmm(current.scheduledEnd)}
                        </p>
                      ) : next ? (
                        <p className="caption truncate text-[11px] opacity-80">
                          Tersedia · sesi berikutnya {hhmm(next.scheduledStart)}
                        </p>
                      ) : (
                        <p className="caption truncate text-[11px] opacity-80">
                          Tersedia · tidak ada booking
                        </p>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {selectedRoom && (
        <RoomDetailSheetMobile
          room={selectedRoom}
          bookings={bookings}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
}
