'use client';

import { useRef } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  ROOM_TYPES,
  ROOM_TYPE_LABEL,
  type RoomType,
} from '@/features/admin-rooms/model/types';

function formatDateLong(key: string): string {
  return new Date(key).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Toolbar Pemakaian Ruangan untuk role psikolog (read-only).
 * Tidak ada button Tambah/Atur — psikolog hanya view.
 */
export function RoomsToolbar({
  date,
  typeFilter,
  onChangeDate,
  onChangeType,
  onShiftPrev,
  onShiftNext,
  onResetToToday,
}: {
  date: string;
  typeFilter: RoomType | 'all';
  onChangeDate: (next: string) => void;
  onChangeType: (next: RoomType | 'all') => void;
  onShiftPrev: () => void;
  onShiftNext: () => void;
  onResetToToday: () => void;
}) {
  const dateInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="flex flex-wrap items-center"
      style={{ padding: '16px 28px 12px', gap: 12 }}
    >
      {/* Prev / Date / Next */}
      <div
        className="flex items-center"
        style={{
          background: 'var(--bg-elev, #fff)',
          padding: 4,
          borderRadius: 8,
          border: '1px solid var(--border)',
          gap: 4,
        }}
      >
        <button
          type="button"
          onClick={onShiftPrev}
          className="btn btn-icon btn-ghost btn-sm"
          aria-label="Hari sebelumnya"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          type="button"
          onClick={() =>
            dateInputRef.current?.showPicker?.() ??
            dateInputRef.current?.focus()
          }
          className="flex items-center gap-2"
          style={{
            padding: '0 12px',
            height: 28,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            position: 'relative',
          }}
          title="Pilih tanggal"
        >
          <CalendarDays size={13} style={{ color: 'var(--sage-600)' }} />
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--teal-800)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatDateLong(date)}
          </span>
          <input
            ref={dateInputRef}
            type="date"
            value={date}
            onChange={(e) => e.target.value && onChangeDate(e.target.value)}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              cursor: 'pointer',
              width: '100%',
              height: '100%',
            }}
            aria-label="Pilih tanggal"
          />
        </button>
        <button
          type="button"
          onClick={onShiftNext}
          className="btn btn-icon btn-ghost btn-sm"
          aria-label="Hari berikutnya"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <button
        type="button"
        onClick={onResetToToday}
        className="btn btn-ghost btn-sm"
        style={{ height: 32 }}
        title="Kembali ke hari ini"
      >
        Hari ini
      </button>

      {/* Type filter chips */}
      <div
        style={{
          display: 'inline-flex',
          background: 'var(--cream-100)',
          borderRadius: 8,
          padding: 3,
          marginLeft: 8,
          gap: 2,
        }}
      >
        {(['all', ...ROOM_TYPES] as Array<RoomType | 'all'>).map((t) => {
          const active = typeFilter === t;
          const label = t === 'all' ? 'Semua' : ROOM_TYPE_LABEL[t];
          return (
            <button
              key={t}
              type="button"
              onClick={() => onChangeType(t)}
              className="btn btn-sm"
              style={{
                height: 28,
                padding: '0 12px',
                fontSize: 12,
                background: active ? 'var(--bg-elev, #fff)' : 'transparent',
                boxShadow: active
                  ? 'var(--shadow-xs, 0 1px 2px rgba(0,0,0,0.05))'
                  : 'none',
                color: active ? 'var(--teal-800)' : 'var(--fg-muted)',
                fontWeight: active ? 600 : 500,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
