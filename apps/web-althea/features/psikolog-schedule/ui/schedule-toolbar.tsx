'use client';

import { useRef, type ReactNode } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { type ViewMode } from '../model/constants';
import { formatDateLong, formatMonth, formatWeekLabel, weekStart, toDateKey } from '../model/format';

const VIEW_MODES: ViewMode[] = ['Hari', 'Minggu', 'Bulan'];

/**
 * Toolbar atas Jadwal Saya: prev/next pill + view toggle + filter button + stats badges.
 */
export function ScheduleToolbar({
  anchor,
  view,
  onChangeAnchor,
  onChangeView,
  onShiftPrev,
  onShiftNext,
  onResetToToday,
  onToggleFilter,
  activeFilterCount,
  totalBooked,
  utilisation,
  filterChildren,
  actionExtra,
}: {
  anchor: string;
  view: ViewMode;
  onChangeAnchor: (next: string) => void;
  onChangeView: (next: ViewMode) => void;
  onShiftPrev: () => void;
  onShiftNext: () => void;
  onResetToToday: () => void;
  onToggleFilter: () => void;
  activeFilterCount: number;
  totalBooked: number;
  utilisation: number;
  filterChildren?: ReactNode;
  /** Slot tambahan di kanan (mis. tombol "Set Jadwal Saya"). */
  actionExtra?: ReactNode;
}) {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const dateLabel =
    view === 'Hari'
      ? formatDateLong(anchor)
      : view === 'Minggu'
      ? formatWeekLabel(toDateKey(weekStart(anchor)))
      : formatMonth(anchor);

  return (
    <div
      className="flex flex-wrap items-center"
      style={{ marginBottom: 16, gap: 12, position: 'relative' }}
    >
      {/* Prev / Date pill / Next */}
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
          aria-label={`${view} sebelumnya`}
        >
          <ChevronLeft size={14} />
        </button>
        <button
          type="button"
          onClick={() =>
            dateInputRef.current?.showPicker?.() ?? dateInputRef.current?.focus()
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
            {dateLabel}
          </span>
          <input
            ref={dateInputRef}
            type="date"
            value={anchor}
            onChange={(e) => e.target.value && onChangeAnchor(e.target.value)}
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
          aria-label={`${view} berikutnya`}
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Hari ini button */}
      <button
        type="button"
        onClick={onResetToToday}
        className="btn btn-ghost btn-sm"
        style={{ height: 32 }}
        title="Kembali ke hari ini"
      >
        Hari ini
      </button>

      {/* View toggle */}
      <div
        className="flex items-center"
        style={{
          background: 'var(--bg-elev, #fff)',
          padding: 4,
          borderRadius: 8,
          border: '1px solid var(--border)',
          gap: 2,
        }}
      >
        {VIEW_MODES.map((v) => {
          const active = view === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChangeView(v)}
              className="btn btn-sm"
              style={{
                height: 28,
                padding: '0 12px',
                background: active ? 'var(--sage-500)' : 'transparent',
                color: active ? '#fff' : 'var(--fg)',
                fontWeight: active ? 600 : 500,
              }}
            >
              {v}
            </button>
          );
        })}
      </div>

      <span style={{ flex: 1 }} />

      {/* Stats badges */}
      <div className="flex items-center gap-2">
        <span
          className="badge"
          style={{
            background: 'var(--cream-200)',
            color: 'var(--fg-muted)',
            height: 24,
          }}
        >
          {totalBooked} sesi terbooking
        </span>
        <span className="badge badge-sage" style={{ height: 24 }}>
          {utilisation}% kapasitas
        </span>
      </div>

      {/* Filter button + popover */}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={onToggleFilter}
          className="btn btn-outline btn-sm"
          style={{
            height: 32,
            background:
              activeFilterCount > 0 ? 'var(--sage-50)' : undefined,
            borderColor:
              activeFilterCount > 0 ? 'var(--sage-300)' : undefined,
          }}
        >
          <Filter size={14} /> Filter
          {activeFilterCount > 0 && (
            <span
              className="badge badge-sage"
              style={{
                height: 18,
                fontSize: 10,
                marginLeft: 4,
                padding: '0 6px',
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
        {filterChildren}
      </div>

      {actionExtra}
    </div>
  );
}
