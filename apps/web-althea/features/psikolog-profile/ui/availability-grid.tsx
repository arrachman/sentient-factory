'use client';

import { useEffect, useMemo, useState } from 'react';
import type { WeeklyAvailability } from '../api/profile.api';

const DAY_KEYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;
type DayKey = (typeof DAY_KEYS)[number];

const DAY_LABEL: Record<DayKey, string> = {
  monday: 'Senin',
  tuesday: 'Selasa',
  wednesday: 'Rabu',
  thursday: 'Kamis',
  friday: 'Jumat',
  saturday: 'Sabtu',
};

// Slots 08:00 - 17:00 (10 jam — match mockup)
const SLOTS = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17'] as const;
const SLOT_COUNT = SLOTS.length;

type CellState = 'open' | 'closed';

/** Convert backend WeeklyAvailability → 6×10 grid of CellState */
function toGrid(wa: WeeklyAvailability): CellState[][] {
  return DAY_KEYS.map((day) => {
    const dayCfg = wa[day];
    if (!dayCfg || !dayCfg.isOpen) {
      // Whole day closed
      return Array(SLOT_COUNT).fill('closed') as CellState[];
    }
    // Day open: if slotIndices specified → only those slots; else all open
    if (Array.isArray(dayCfg.slotIndices)) {
      return Array.from({ length: SLOT_COUNT }, (_, i) =>
        dayCfg.slotIndices!.includes(i) ? 'open' : 'closed',
      );
    }
    return Array(SLOT_COUNT).fill('open') as CellState[];
  });
}

/** Convert grid back to WeeklyAvailability format for API */
function fromGrid(grid: CellState[][]): WeeklyAvailability {
  const out: WeeklyAvailability = {};
  DAY_KEYS.forEach((day, dayIdx) => {
    const row = grid[dayIdx];
    const openSlots: number[] = [];
    row.forEach((cell, slotIdx) => {
      if (cell === 'open') openSlots.push(slotIdx);
    });
    out[day] = {
      isOpen: openSlots.length > 0,
      slotIndices: openSlots,
    };
  });
  return out;
}

function isEqual(a: WeeklyAvailability, b: WeeklyAvailability): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function AvailabilityGrid({
  initial,
  bookedKeys = new Set(),
  onSave,
  saving,
}: {
  /** Current weekly availability (from API) */
  initial: WeeklyAvailability;
  /** Set of "dayIdx-slotIdx" keys yang sudah ada booking (read-only) */
  bookedKeys?: Set<string>;
  onSave: (next: WeeklyAvailability) => void;
  saving: boolean;
}) {
  const [grid, setGrid] = useState<CellState[][]>(() => toGrid(initial));

  // Re-sync kalau backend data refresh
  useEffect(() => {
    setGrid(toGrid(initial));
  }, [initial]);

  const draft = useMemo(() => fromGrid(grid), [grid]);
  const dirty = !isEqual(draft, initial);

  function toggleCell(dayIdx: number, slotIdx: number) {
    const cellKey = `${dayIdx}-${slotIdx}`;
    if (bookedKeys.has(cellKey)) return; // Booked: read-only
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[dayIdx][slotIdx] = next[dayIdx][slotIdx] === 'open' ? 'closed' : 'open';
      return next;
    });
  }

  function setRowAll(dayIdx: number, state: CellState) {
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[dayIdx] = next[dayIdx].map((cell, slotIdx) => {
        const cellKey = `${dayIdx}-${slotIdx}`;
        if (bookedKeys.has(cellKey)) return cell; // skip booked
        return state;
      });
      return next;
    });
  }

  function handleReset() {
    setGrid(toGrid(initial));
  }

  function handleSave() {
    onSave(draft);
  }

  const totalOpen = grid.flat().filter((c) => c === 'open').length;
  const totalBooked = bookedKeys.size;

  return (
    <div className="card-althea" style={{ padding: 22 }}>
      {/* Header */}
      <div
        className="flex items-start justify-between flex-wrap"
        style={{ gap: 12, marginBottom: 14 }}
      >
        <div className="flex flex-col">
          <span className="eyebrow">Availability mingguan</span>
          <h2
            style={{
              margin: '2px 0 0',
              fontFamily: 'var(--font-serif)',
              fontSize: 18,
              fontWeight: 500,
              color: 'var(--teal-800)',
            }}
          >
            Jam praktik default
          </h2>
          <span className="caption" style={{ marginTop: 4 }}>
            Klik sel untuk toggle tersedia/tidak. {totalOpen} slot tersedia
            {totalBooked > 0 ? ` · ${totalBooked} sudah di-book` : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {dirty && (
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="btn btn-ghost btn-sm"
            >
              Batal
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty || saving}
            className="btn btn-primary btn-sm"
          >
            {saving ? 'Menyimpan…' : 'Simpan'}
          </button>
        </div>
      </div>

      {/* Legend */}
      <div
        className="flex flex-wrap items-center"
        style={{ gap: 14, marginBottom: 12, fontSize: 11 }}
      >
        <span className="flex items-center gap-1">
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              background: 'var(--sage-300)',
            }}
          />
          Tersedia
        </span>
        <span className="flex items-center gap-1">
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              background: 'var(--sage-500)',
            }}
          />
          Sudah ada booking
        </span>
        <span className="flex items-center gap-1">
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              background: 'var(--cream-100)',
              border: '1px solid var(--border-strong, #d8d3c3)',
            }}
          />
          Tidak tersedia
        </span>
      </div>

      {/* Grid */}
      <div style={{ overflowX: 'auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `80px repeat(${SLOT_COUNT}, minmax(40px, 1fr))`,
            gap: 4,
            minWidth: 80 + SLOT_COUNT * 40,
          }}
        >
          {/* Header row: blank + slot times */}
          <div />
          {SLOTS.map((s) => (
            <div
              key={s}
              className="caption"
              style={{
                textAlign: 'center',
                fontSize: 10.5,
                fontWeight: 600,
              }}
            >
              {s}.00
            </div>
          ))}

          {/* Day rows */}
          {DAY_KEYS.map((day, dayIdx) => {
            const row = grid[dayIdx];
            const allOpen = row.every((c) => c === 'open');
            const noneOpen = row.every((c) => c === 'closed');
            return (
              <DayRow
                key={day}
                day={day}
                dayIdx={dayIdx}
                cells={row}
                bookedKeys={bookedKeys}
                onToggleCell={toggleCell}
                onSetAll={(state) => setRowAll(dayIdx, state)}
                allOpen={allOpen}
                noneOpen={noneOpen}
              />
            );
          })}
        </div>
      </div>

      {dirty && (
        <p
          className="caption"
          style={{ marginTop: 12, fontSize: 11, color: 'var(--sage-700)' }}
        >
          ⚠ Ada perubahan belum disimpan. Klik "Simpan" untuk apply.
        </p>
      )}
    </div>
  );
}

function DayRow({
  day,
  dayIdx,
  cells,
  bookedKeys,
  onToggleCell,
  onSetAll,
  allOpen,
  noneOpen,
}: {
  day: DayKey;
  dayIdx: number;
  cells: CellState[];
  bookedKeys: Set<string>;
  onToggleCell: (dayIdx: number, slotIdx: number) => void;
  onSetAll: (state: CellState) => void;
  allOpen: boolean;
  noneOpen: boolean;
}) {
  return (
    <>
      <button
        type="button"
        onClick={() => onSetAll(allOpen ? 'closed' : 'open')}
        className="text-left"
        style={{
          fontSize: 12.5,
          fontWeight: 600,
          color: 'var(--teal-800)',
          display: 'flex',
          alignItems: 'center',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
        title={allOpen ? 'Tutup semua slot hari ini' : 'Buka semua slot hari ini'}
      >
        {DAY_LABEL[day]}
        <span className="caption" style={{ marginLeft: 6, fontSize: 9.5 }}>
          {allOpen ? '✓' : noneOpen ? '✗' : '◐'}
        </span>
      </button>
      {cells.map((cell, slotIdx) => {
        const cellKey = `${dayIdx}-${slotIdx}`;
        const isBooked = bookedKeys.has(cellKey);
        const display = isBooked ? 'booked' : cell;
        return (
          <button
            type="button"
            key={slotIdx}
            onClick={() => onToggleCell(dayIdx, slotIdx)}
            disabled={isBooked}
            style={{
              height: 38,
              borderRadius: 4,
              cursor: isBooked ? 'not-allowed' : 'pointer',
              background:
                display === 'booked'
                  ? 'var(--sage-500)'
                  : display === 'open'
                    ? 'var(--sage-300)'
                    : 'var(--cream-100)',
              border:
                '1px solid ' +
                (display === 'closed' ? 'var(--border-strong, #d8d3c3)' : 'transparent'),
              padding: 0,
            }}
            title={
              isBooked
                ? 'Sudah ada booking di slot ini — tidak bisa diubah'
                : display === 'open'
                  ? 'Klik untuk tutup'
                  : 'Klik untuk buka'
            }
            aria-label={`${DAY_LABEL[day]} jam ${SLOTS[slotIdx]}:00 — ${display}`}
          />
        );
      })}
    </>
  );
}
