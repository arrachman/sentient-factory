'use client';

/**
 * Toolbar atas Owner Dashboard / Analitik.
 *   [‹] [📅 date pill (range label)] [›] [Hari ini]   [Harian|Mingguan|Bulanan]
 */
import { useRef } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { PeriodMode } from '../model/period';

const MODES: PeriodMode[] = ['Harian', 'Mingguan', 'Bulanan'];

export function OwnerPeriodToolbar({
  anchor,
  mode,
  rangeLabel,
  onShiftPrev,
  onShiftNext,
  onPickDate,
  onResetToToday,
  onChangeMode,
}: {
  anchor: string;
  mode: PeriodMode;
  rangeLabel: string;
  onShiftPrev: () => void;
  onShiftNext: () => void;
  onPickDate: (next: string) => void;
  onResetToToday: () => void;
  onChangeMode: (next: PeriodMode) => void;
}) {
  const dateInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="flex items-center justify-between gap-3 flex-wrap"
      style={{ position: 'relative' }}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          aria-label="Periode sebelumnya"
          onClick={onShiftPrev}
          className="btn btn-outline btn-sm btn-icon"
        >
          <ChevronLeft size={15} />
        </button>
        <button
          type="button"
          onClick={() =>
            dateInputRef.current?.showPicker?.() ??
            dateInputRef.current?.focus()
          }
          className="flex items-center gap-2"
          style={{
            background: 'var(--bg-elev, var(--cream-50))',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '6px 14px',
            height: 36,
            cursor: 'pointer',
            position: 'relative',
          }}
          title="Pilih tanggal"
        >
          <CalendarDays size={15} style={{ color: 'var(--sage-600)' }} />
          <span
            style={{
              fontSize: 13.5,
              fontWeight: 500,
              color: 'var(--teal-800)',
            }}
          >
            {rangeLabel || '—'}
          </span>
          <input
            ref={dateInputRef}
            type="date"
            value={anchor}
            onChange={(e) => e.target.value && onPickDate(e.target.value)}
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
          aria-label="Periode berikutnya"
          onClick={onShiftNext}
          className="btn btn-outline btn-sm btn-icon"
        >
          <ChevronRight size={15} />
        </button>
        <button
          type="button"
          onClick={onResetToToday}
          className="btn btn-ghost btn-sm"
          style={{ marginLeft: 4 }}
          title="Kembali ke hari ini"
        >
          Hari ini
        </button>
      </div>

      <div
        role="tablist"
        aria-label="Periode"
        className="flex items-center"
        style={{
          background: 'var(--cream-100)',
          borderRadius: 999,
          padding: 3,
          gap: 2,
        }}
      >
        {MODES.map((m) => {
          const active = m === mode;
          return (
            <button
              key={m}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => onChangeMode(m)}
              style={{
                padding: '6px 14px',
                borderRadius: 999,
                fontSize: 12.5,
                fontWeight: 600,
                color: active ? '#fff' : 'var(--teal-800)',
                background: active ? 'var(--sage-500)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background .15s ease',
              }}
            >
              {m}
            </button>
          );
        })}
      </div>
    </div>
  );
}
