'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { SlotDef } from '@/features/admin-pengaturan/api/settings.api';
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

type CellState = 'open' | 'closed';

/** Convert backend WeeklyAvailability → 6×N grid of CellState */
function toGrid(wa: WeeklyAvailability, slotCount: number): CellState[][] {
  return DAY_KEYS.map((day) => {
    const dayCfg = wa[day];
    if (!dayCfg || !dayCfg.isOpen) {
      return Array(slotCount).fill('closed') as CellState[];
    }
    if (Array.isArray(dayCfg.slotIndices)) {
      return Array.from({ length: slotCount }, (_, i) =>
        dayCfg.slotIndices!.includes(i) ? 'open' : 'closed',
      );
    }
    return Array(slotCount).fill('open') as CellState[];
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


export function AvailabilityGrid({
  initial,
  slots,
  bookedKeys = new Set(),
  onSave,
  saving,
  readOnly = false,
}: {
  /** Current weekly availability (from API) */
  initial: WeeklyAvailability;
  /** Slot operasional dari ClinicSettings.slotsOfDay */
  slots: SlotDef[];
  /** Set of "dayIdx-slotIdx" keys yang sudah ada booking (read-only) */
  bookedKeys?: Set<string>;
  /** Hanya tampilkan, tidak bisa di-edit. Sembunyikan save indicator. */
  readOnly?: boolean;
  onSave?: (next: WeeklyAvailability) => void;
  saving?: boolean;
}) {
  const slotCount = slots.length;
  const [grid, setGrid] = useState<CellState[][]>(() => toGrid(initial, slotCount));
  const userChangedRef = useRef(false);
  const onSaveRef = useRef(onSave);
  useEffect(() => { onSaveRef.current = onSave; });

  // Re-sync kalau backend data atau slots refresh
  useEffect(() => {
    setGrid(toGrid(initial, slotCount));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial, slotCount]);

  const draft = useMemo(() => fromGrid(grid), [grid]);
  // Auto-save 500ms setelah user mengubah grid (skip jika readOnly)
  useEffect(() => {
    if (readOnly || !userChangedRef.current) return;
    const timer = setTimeout(() => {
      if (!userChangedRef.current) return;
      userChangedRef.current = false;
      onSaveRef.current?.(draft);
      toast.success('Jadwal diperbarui');
    }, 500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, readOnly]);

  function toggleCell(dayIdx: number, slotIdx: number) {
    if (readOnly) return;
    const cellKey = `${dayIdx}-${slotIdx}`;
    if (bookedKeys.has(cellKey)) return;
    userChangedRef.current = true;
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[dayIdx][slotIdx] = next[dayIdx][slotIdx] === 'open' ? 'closed' : 'open';
      return next;
    });
  }

  function setRowAll(dayIdx: number, state: CellState) {
    if (readOnly) return;
    userChangedRef.current = true;
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[dayIdx] = next[dayIdx].map((cell, slotIdx) => {
        const cellKey = `${dayIdx}-${slotIdx}`;
        if (bookedKeys.has(cellKey)) return cell;
        return state;
      });
      return next;
    });
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
            {readOnly
              ? `Diatur oleh admin · ${totalOpen} slot tersedia${totalBooked > 0 ? ` · ${totalBooked} sudah di-book` : ''}`
              : `Klik sel untuk toggle tersedia/tidak. ${totalOpen} slot tersedia${totalBooked > 0 ? ` · ${totalBooked} sudah di-book` : ''}`}
          </span>
        </div>
        {!readOnly && saving && (
          <span
            className="caption"
            style={{ fontSize: 11, color: 'var(--sage-600)', alignSelf: 'center' }}
          >
            Menyimpan…
          </span>
        )}
        {readOnly && (
          <span
            className="caption"
            style={{
              fontSize: 11,
              color: 'var(--fg-muted)',
              background: 'var(--cream-100)',
              border: '1px solid var(--border)',
              borderRadius: 4,
              padding: '2px 8px',
              alignSelf: 'center',
            }}
          >
            Read-only
          </span>
        )}
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

      {/* Info + warning — hanya tampil di edit mode */}
      {!readOnly && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              background: 'var(--cream-100)',
              border: '1px solid var(--border-strong, #d8d3c3)',
              borderRadius: 6,
              padding: '8px 12px',
              fontSize: 11.5,
              color: 'var(--teal-700, #1e3a3a)',
              lineHeight: 1.6,
            }}
          >
            <strong style={{ display: 'block', marginBottom: 2 }}>Cara mengatur</strong>
            Klik sel untuk buka/tutup slot jam tertentu. Klik nama hari untuk toggle semua slot hari itu sekaligus.
            Perubahan otomatis tersimpan setelah 0,5 detik.
            <br />
            <span style={{ color: 'var(--teal-600, #2e5050)' }}>
              Grid ini adalah <strong>jadwal default mingguan</strong> — berlaku untuk semua pekan
              kecuali ada override per-tanggal yang diatur di halaman Jadwal Saya.
            </span>
          </div>
          <div
            style={{
              background: '#fff8ec',
              border: '1px solid #f0c97a',
              borderRadius: 6,
              padding: '8px 12px',
              fontSize: 11.5,
              color: '#7a5200',
              lineHeight: 1.6,
            }}
          >
            <strong>⚠ Perhatikan dampaknya:</strong> Menutup slot yang sudah ada booking aktif
            tidak membatalkan booking tersebut, tetapi slot itu tidak akan bisa dipesan lagi
            oleh klien baru. Pastikan tidak ada booking mendatang di slot yang akan ditutup
            sebelum menyimpan perubahan.
          </div>
        </div>
      )}

      {/* Grid */}
      <div style={{ overflowX: 'auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `80px repeat(${slotCount}, minmax(40px, 1fr))`,
            gap: 4,
            minWidth: 80 + slotCount * 40,
          }}
        >
          {/* Header row: blank + slot times */}
          <div />
          {slots.map((s) => (
            <div
              key={s.start}
              className="caption"
              style={{
                textAlign: 'center',
                fontSize: 10.5,
                fontWeight: 600,
              }}
            >
              {s.label ?? s.start.slice(0, 5)}
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
                slotLabels={slots.map((s) => s.label ?? s.start.slice(0, 5))}
                bookedKeys={bookedKeys}
                onToggleCell={toggleCell}
                onSetAll={(state) => setRowAll(dayIdx, state)}
                allOpen={allOpen}
                noneOpen={noneOpen}
                readOnly={readOnly}
              />
            );
          })}
        </div>
      </div>

    </div>
  );
}

function DayRow({
  day,
  dayIdx,
  cells,
  slotLabels,
  bookedKeys,
  onToggleCell,
  onSetAll,
  allOpen,
  noneOpen,
  readOnly,
}: {
  day: DayKey;
  dayIdx: number;
  cells: CellState[];
  slotLabels: string[];
  bookedKeys: Set<string>;
  onToggleCell: (dayIdx: number, slotIdx: number) => void;
  onSetAll: (state: CellState) => void;
  allOpen: boolean;
  noneOpen: boolean;
  readOnly?: boolean;
}) {
  return (
    <>
      <button
        type="button"
        onClick={() => !readOnly && onSetAll(allOpen ? 'closed' : 'open')}
        className="text-left"
        style={{
          fontSize: 12.5,
          fontWeight: 600,
          color: 'var(--teal-800)',
          display: 'flex',
          alignItems: 'center',
          background: 'transparent',
          border: 'none',
          cursor: readOnly ? 'default' : 'pointer',
          padding: 0,
        }}
        title={readOnly ? undefined : allOpen ? 'Tutup semua slot hari ini' : 'Buka semua slot hari ini'}
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
            onClick={() => !readOnly && onToggleCell(dayIdx, slotIdx)}
            disabled={isBooked || readOnly}
            style={{
              height: 36,
              borderRadius: 4,
              cursor: readOnly ? 'default' : isBooked ? 'not-allowed' : 'pointer',
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
            aria-label={`${DAY_LABEL[day]} jam ${slotLabels[slotIdx]} — ${display}`}
          />
        );
      })}
    </>
  );
}
