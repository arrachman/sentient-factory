'use client';

/**
 * Toolbar atas Penjadwalan:
 *   [‹]  [📅 date pill]  [›]  [Hari ini]  [tab Hari/Minggu/Bulan]
 *                                              [Filter (badge)] [📅 Daftar Jadwal]
 * Date pill membuka native date picker via `dateInputRef.showPicker()`.
 */
import { useRef } from 'react';
import {
  CalendarDays,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import type { ViewMode } from '../model/types';

const VIEW_MODES: ViewMode[] = ['Hari', 'Minggu', 'Bulan'];

export function ScheduleToolbar({
  date,
  view,
  dateLabel,
  activeFilterCount,
  filterChildren,
  onShiftPrev,
  onShiftNext,
  onPickDate,
  onResetToToday,
  onChangeView,
  onToggleFilter,
  onCreate,
}: {
  date: string;
  view: ViewMode;
  dateLabel: string;
  activeFilterCount: number;
  filterChildren: React.ReactNode;
  onShiftPrev: () => void;
  onShiftNext: () => void;
  onPickDate: (next: string) => void;
  onResetToToday: () => void;
  onChangeView: (next: ViewMode) => void;
  onToggleFilter: () => void;
  onCreate: () => void;
}) {
  const dateInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      style={{
        padding: '18px 28px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
        position: 'relative',
      }}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onShiftPrev}
          className="btn btn-outline btn-sm btn-icon"
          aria-label={`${view} sebelumnya`}
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
            {dateLabel}
          </span>
          <input
            ref={dateInputRef}
            type="date"
            value={date}
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
          onClick={onShiftNext}
          className="btn btn-outline btn-sm btn-icon"
          aria-label={`${view} berikutnya`}
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

        <ViewToggle view={view} onChange={onChangeView} />
      </div>

      <div
        className="flex items-center gap-2"
        style={{ position: 'relative' }}
      >
        <button
          type="button"
          onClick={onToggleFilter}
          className="btn btn-outline btn-sm"
          style={{
            background:
              activeFilterCount > 0 ? 'var(--sage-50)' : undefined,
            borderColor:
              activeFilterCount > 0 ? 'var(--sage-300)' : undefined,
          }}
        >
          <Filter size={14} /> Filter
          {activeFilterCount > 0 ? (
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
          ) : null}
        </button>
        <button
          type="button"
          onClick={onCreate}
          className="btn btn-primary btn-sm"
        >
          <CalendarPlus className="h-4 w-4" /> Daftar Jadwal
        </button>
        {filterChildren}
      </div>
    </div>
  );
}

function ViewToggle({
  view,
  onChange,
}: {
  view: ViewMode;
  onChange: (next: ViewMode) => void;
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        background: 'var(--cream-100)',
        borderRadius: 8,
        padding: 3,
        marginLeft: 8,
      }}
    >
      {VIEW_MODES.map((v) => {
        const active = view === v;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className="btn btn-sm"
            style={{
              background: active ? 'var(--bg-elev, #fff)' : 'transparent',
              boxShadow: active
                ? 'var(--shadow-xs, 0 1px 2px rgba(0,0,0,0.05))'
                : 'none',
              color: active ? 'var(--teal-800)' : 'var(--fg-muted)',
              height: 28,
              padding: '0 12px',
            }}
          >
            {v}
          </button>
        );
      })}
    </div>
  );
}
