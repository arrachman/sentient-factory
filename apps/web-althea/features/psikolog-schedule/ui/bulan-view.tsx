'use client';

/**
 * Bulan view — kalender bulanan dengan visual state per cell.
 *
 * Color cell sesuai availability + bookings:
 *   - Past empty / out-of-month → faded
 *   - Kosong (psikolog tutup hari itu) → gray disabled
 *   - Tersedia (open, no booking) → almost-white sage tint
 *   - Booked (1-N sesi) → sage saturated, intensity scale by count
 *   - Today → outline sage-500 ring
 *
 * Click day → switch ke Hari view di tanggal tsb.
 */
import type { Booking } from '@/features/admin-booking/model/types';
import type { ClinicSettings } from '@/features/admin-pengaturan/api/settings.api';
import { DAY_LABELS_FULL } from '../model/constants';
import {
  formatDateLong,
  monthEnd,
  monthStart,
  toDateKey,
  todayKey,
} from '../model/format';
import { resolveDayAvailability } from '../model/availability';

const CATEGORY_COLOR: Record<string, string> = {
  konseling: 'var(--sage-500)',
  terapi: '#be8c5a',
  anak: '#daa520',
  tes: '#896db3',
};

type Override = {
  date: string;
  isOpen: boolean;
  slotIndices: number[] | null;
  reason: string | null;
};

export function BulanView({
  anchor,
  bookings,
  isLoading,
  weeklyAvailability,
  overrides,
  slotsOfDay,
  onDayClick,
}: {
  anchor: string;
  bookings: Booking[];
  isLoading: boolean;
  weeklyAvailability: Record<string, { isOpen: boolean; slotIndices?: number[] }> | null;
  overrides: Override[];
  slotsOfDay: ClinicSettings['slotsOfDay'];
  onDayClick: (dateKey: string) => void;
}) {
  const start = new Date(monthStart(anchor));
  const end = new Date(monthEnd(anchor));
  const today = todayKey();
  const totalSlotsPerDay = slotsOfDay.length || 6;

  // First Monday-aligned cell
  const firstDow = start.getDay();
  const offset = firstDow === 0 ? -6 : 1 - firstDow;
  const gridStart = new Date(start);
  gridStart.setDate(gridStart.getDate() + offset);

  // Aggregate count + categories per date
  const stats = new Map<string, { count: number; categories: Set<string> }>();
  for (const b of bookings) {
    const dk = toDateKey(new Date(b.scheduledStart));
    if (!stats.has(dk)) stats.set(dk, { count: 0, categories: new Set() });
    const s = stats.get(dk)!;
    s.count += 1;
    s.categories.add(b.service.category);
  }

  // 6 × 7 = 42 cells
  const cells: Array<{
    date: Date;
    dateKey: string;
    inMonth: boolean;
    isToday: boolean;
    isPast: boolean;
    count: number;
    categories: Set<string>;
    isOpen: boolean;
    availableSlots: number;
  }> = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    const dk = toDateKey(d);
    const inMonth = d >= start && d <= end;
    const stat = stats.get(dk) ?? { count: 0, categories: new Set<string>() };
    const av = resolveDayAvailability(d, weeklyAvailability, overrides);
    const availableSlots = av.isOpen
      ? av.slotIndices?.length ?? totalSlotsPerDay
      : 0;
    cells.push({
      date: d,
      dateKey: dk,
      inMonth,
      isToday: dk === today,
      isPast: dk < today,
      count: stat.count,
      categories: stat.categories,
      isOpen: av.isOpen,
      availableSlots,
    });
  }

  return (
    <div className="card-althea" style={{ overflow: 'hidden', position: 'relative' }}>
      {isLoading ? (
        <div
          className="caption"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(255,255,255,0.6)',
            zIndex: 5,
          }}
        >
          Memuat jadwal bulan...
        </div>
      ) : null}

      {/* Day-of-week header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {DAY_LABELS_FULL.map((d) => (
          <div
            key={d}
            style={{
              padding: '10px 8px',
              textAlign: 'center',
              fontSize: 11.5,
              fontWeight: 600,
              color: 'var(--fg-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              background: 'var(--cream-50)',
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gridAutoRows: 'minmax(82px, 1fr)',
        }}
      >
        {cells.map((cell, i) => {
          const day = cell.date.getDate();
          const isLastRow = i >= 35;
          const visual = computeCellVisual(cell, totalSlotsPerDay);
          return (
            <button
              type="button"
              key={cell.dateKey + i}
              onClick={() => onDayClick(cell.dateKey)}
              style={{
                borderRight: (i + 1) % 7 === 0 ? 'none' : '1px solid var(--border)',
                borderBottom: isLastRow ? 'none' : '1px solid var(--border)',
                background: visual.bg,
                opacity: cell.inMonth ? (cell.isPast && cell.count === 0 ? 0.55 : 1) : 0.4,
                padding: 8,
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                position: 'relative',
                outline: cell.isToday ? '2px solid var(--sage-500)' : 'none',
                outlineOffset: cell.isToday ? -2 : 0,
              }}
              title={`${formatDateLong(cell.dateKey)} · ${visual.tooltip}`}
            >
              <div className="flex items-center justify-between">
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: cell.isToday ? 700 : 500,
                    color: visual.numColor,
                    fontFamily: 'var(--font-serif)',
                  }}
                >
                  {day}
                </span>
                {cell.count > 0 && (
                  <span
                    style={{
                      height: 18,
                      minWidth: 18,
                      padding: '0 6px',
                      borderRadius: 999,
                      background: '#5b8a66',
                      color: '#fff',
                      fontSize: 10.5,
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {cell.count}
                  </span>
                )}
              </div>

              {/* Status text + category dots */}
              {cell.inMonth && (
                <div style={{ marginTop: 'auto' }}>
                  {cell.count > 0 ? (
                    <div className="flex items-center" style={{ gap: 4 }}>
                      {Array.from(cell.categories)
                        .slice(0, 4)
                        .map((cat) => (
                          <span
                            key={cat}
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: 999,
                              background: CATEGORY_COLOR[cat] ?? 'var(--sage-500)',
                            }}
                          />
                        ))}
                      <span
                        style={{
                          fontSize: 10,
                          color: visual.numColor,
                          opacity: 0.7,
                          marginLeft: 'auto',
                        }}
                      >
                        {cell.count} sesi
                      </span>
                    </div>
                  ) : visual.statusLabel ? (
                    <span
                      style={{
                        fontSize: 10,
                        color: visual.numColor,
                        opacity: 0.65,
                        fontWeight: 500,
                      }}
                    >
                      {visual.statusLabel}
                    </span>
                  ) : null}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Color resolver per cell:
 *  - Booked (1+ sesi)        → sage saturated, intensity scale by count
 *  - Tersedia (open + 0 sesi) → almost-white sage tint
 *  - Kosong (closed/cuti)     → gray disabled
 */
function computeCellVisual(
  cell: { count: number; isOpen: boolean; isPast: boolean },
  totalSlotsPerDay: number,
): { bg: string; numColor: string; statusLabel: string | null; tooltip: string } {
  if (cell.count > 0) {
    // Intensity scale: 1 booking = ringan, max booking = pekat
    const ratio = Math.min(1, cell.count / totalSlotsPerDay);
    // Lerp from sage tint #cfdfd1 → sage saturated #7aa382
    const a = 207 - Math.round(60 * ratio); // 207 → 147
    const g1 = 223 - Math.round(60 * ratio); // 223 → 163
    const b1 = 209 - Math.round(70 * ratio); // 209 → 139
    return {
      bg: `rgb(${a}, ${g1}, ${b1})`,
      numColor: 'var(--sage-900, #1f3a25)',
      statusLabel: null,
      tooltip: `${cell.count} sesi`,
    };
  }
  if (!cell.isOpen) {
    // Kosong / libur
    return {
      bg: '#eeece6',
      numColor: '#9a9588',
      statusLabel: 'Kosong',
      tooltip: 'Kosong',
    };
  }
  // Tersedia (open, no booking)
  return {
    bg: '#fafdf7',
    numColor: 'var(--teal-800)',
    statusLabel: 'Tersedia',
    tooltip: 'Tersedia · belum ada booking',
  };
}
