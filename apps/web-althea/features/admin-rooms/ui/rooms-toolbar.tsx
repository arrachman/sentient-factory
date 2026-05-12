'use client';

/**
 * Toolbar atas halaman Pemakaian Ruangan:
 *   [‹]  [📅 Senin, 18 Mei 2026]  [›]  [Hari ini]   ····  [⚙ Atur Ruangan] [+ Tambah Ruangan]
 */
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Settings } from 'lucide-react';
import { formatDateLong, shiftDate, todayKey } from '../model/utils';

export function RoomsToolbar({
  date,
  onChangeDate,
  onOpenCrud,
  onCreate,
}: {
  date: string;
  onChangeDate: (next: string) => void;
  onOpenCrud: () => void;
  onCreate: () => void;
}) {
  const today = todayKey();
  return (
    <div className="px-7 pt-2 pb-3 flex items-center justify-between flex-wrap gap-3">
      <div className="row gap-2">
        <button
          type="button"
          onClick={() => onChangeDate(shiftDate(date, -1))}
          className="btn btn-outline btn-sm btn-icon"
          aria-label="Hari sebelumnya"
        >
          <ChevronLeft size={15} />
        </button>
        <div
          className="row gap-2"
          style={{
            background: 'var(--bg-elev)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '6px 14px',
            height: 36,
          }}
        >
          <CalendarDays size={15} style={{ color: 'var(--sage-600)' }} />
          <span
            style={{
              fontSize: 13.5,
              fontWeight: 500,
              color: 'var(--teal-800)',
            }}
          >
            {formatDateLong(date)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onChangeDate(shiftDate(date, 1))}
          className="btn btn-outline btn-sm btn-icon"
          aria-label="Hari berikutnya"
        >
          <ChevronRight size={15} />
        </button>
        {date !== today ? (
          <button
            type="button"
            onClick={() => onChangeDate(today)}
            className="btn btn-ghost btn-sm"
          >
            Hari ini
          </button>
        ) : null}
      </div>
      <div className="row gap-2">
        <button
          type="button"
          onClick={onOpenCrud}
          className="btn btn-outline btn-sm"
        >
          <Settings size={14} /> Atur Ruangan
        </button>
        <button
          type="button"
          onClick={onCreate}
          className="btn btn-primary btn-sm"
        >
          <Plus size={15} /> Tambah Ruangan
        </button>
      </div>
    </div>
  );
}
