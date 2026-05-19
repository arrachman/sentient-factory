'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Booking } from '@/features/admin-booking/model/types';
import { DEFAULT_FACILITIES, ROOM_TYPE_STYLE } from '../model/constants';
import { ROOM_TYPE_LABEL, type Room } from '../model/types';

/**
 * Bottom-sheet detail ruangan untuk mobile admin (`lg:hidden` context).
 * Info ruangan + status pemakaian sekarang + sesi hari ini + aksi
 * (edit master / nonaktif / hapus). Reassign booking tidak ada di mobile
 * (butuh konteks slot grid yang hanya ada di desktop).
 */
function hhmm(iso: string): string {
  return new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  });
}

export function RoomDetailSheetMobile({
  room,
  bookings,
  onClose,
}: {
  room: Room;
  bookings: Booking[];
  onClose: () => void;
}) {
  const style = ROOM_TYPE_STYLE[room.type];
  const Icon = style.icon;

  const facilities =
    room.facilities && room.facilities.length > 0
      ? room.facilities
      : room.description && room.description.includes(',')
        ? room.description
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : DEFAULT_FACILITIES[room.type];

  const sorted = bookings
    .filter((b) => b.room.id === room.id)
    .sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart));

  const [nowMs, setNowMs] = useState(0);
  useEffect(() => {
    setNowMs(Date.now());
  }, []);
  const current = nowMs
    ? sorted.find((b) => {
        const s = new Date(b.scheduledStart).getTime();
        const e = new Date(b.scheduledEnd).getTime();
        return s <= nowMs && nowMs < e;
      })
    : undefined;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end bg-black/40 lg:hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[88vh] w-full overflow-y-auto rounded-t-2xl bg-card p-4">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />

        <div className="flex items-start gap-3">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ background: style.bg }}
          >
            <Icon size={22} style={{ color: style.fg }} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="brand-mark text-lg text-teal-800">{room.name}</h2>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <span
                className="badge capitalize"
                style={{ background: style.bg, color: style.fg }}
              >
                {ROOM_TYPE_LABEL[room.type]}
              </span>
              <span className="badge badge-neutral">
                kap. {room.capacity} orang
              </span>
              {!room.isActive && (
                <span className="badge badge-warn">Nonaktif</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-icon btn-sm"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status sekarang */}
        <div className="mt-4">
          <p className="caption mb-1.5 text-[11px] font-semibold uppercase tracking-wide">
            Status sekarang
          </p>
          {current ? (
            <div
              className="rounded-xl p-3"
              style={{ background: 'var(--sage-50, #f0f5f0)' }}
            >
              <p className="text-sm font-semibold text-teal-800">
                {current.client.name}
              </p>
              <p className="caption text-[12px]">
                {current.psikolog.fullName ?? current.psikolog.email} ·{' '}
                {hhmm(current.scheduledStart)}–{hhmm(current.scheduledEnd)}
              </p>
            </div>
          ) : (
            <p className="caption rounded-xl bg-cream-50 p-3 text-[12px]">
              Tidak ada sesi berlangsung saat ini.
            </p>
          )}
        </div>

        {/* Sesi hari ini */}
        <div className="mt-4">
          <p className="caption mb-1.5 text-[11px] font-semibold uppercase tracking-wide">
            Sesi hari ini · {sorted.length}
          </p>
          {sorted.length === 0 ? (
            <p className="caption text-[12px]">Belum ada booking hari ini.</p>
          ) : (
            <ul className="space-y-2">
              {sorted.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center gap-3 rounded-xl border border-border p-2.5"
                >
                  <span className="brand-mark w-12 text-sm text-teal-800">
                    {hhmm(b.scheduledStart)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-teal-800">
                      {b.client.name}
                    </p>
                    <p className="caption truncate text-[11px]">
                      {b.service.name}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Fasilitas */}
        <div className="mt-4">
          <p className="caption mb-1.5 text-[11px] font-semibold uppercase tracking-wide">
            Fasilitas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {facilities.length === 0 ? (
              <span className="caption">—</span>
            ) : (
              facilities.map((f) => (
                <span key={f} className="badge badge-neutral">
                  {f}
                </span>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
