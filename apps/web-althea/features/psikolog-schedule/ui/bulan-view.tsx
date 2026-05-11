'use client';

/**
 * Bulan view — kalender bulanan dengan count booking per hari.
 * Click day-cell → switch ke view Hari di tanggal tsb.
 */
import type { Booking } from '@/features/admin-booking/model/types';
import { DAY_LABELS_FULL } from '../model/constants';
import {
  formatDateLong,
  monthEnd,
  monthStart,
  toDateKey,
  todayKey,
} from '../model/format';

const CATEGORY_COLOR: Record<string, string> = {
  konseling: 'var(--sage-500)',
  terapi: '#be8c5a',
  anak: '#daa520',
  tes: '#896db3',
};

export function BulanView({
  anchor,
  bookings,
  isLoading,
  onDayClick,
}: {
  anchor: string;
  bookings: Booking[];
  isLoading: boolean;
  onDayClick: (dateKey: string) => void;
}) {
  const start = new Date(monthStart(anchor));
  const end = new Date(monthEnd(anchor));
  const today = todayKey();

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
    dateKey: string;
    inMonth: boolean;
    isToday: boolean;
    count: number;
    categories: Set<string>;
  }> = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    const dk = toDateKey(d);
    const inMonth = d >= start && d <= end;
    const stat = stats.get(dk) ?? { count: 0, categories: new Set<string>() };
    cells.push({
      dateKey: dk,
      inMonth,
      isToday: dk === today,
      count: stat.count,
      categories: stat.categories,
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
          gridAutoRows: 'minmax(80px, 1fr)',
        }}
      >
        {cells.map((cell, i) => {
          const day = new Date(cell.dateKey).getDate();
          const isLastRow = i >= 35;
          return (
            <button
              type="button"
              key={cell.dateKey + i}
              onClick={() => onDayClick(cell.dateKey)}
              style={{
                borderRight: (i + 1) % 7 === 0 ? 'none' : '1px solid var(--border)',
                borderBottom: isLastRow ? 'none' : '1px solid var(--border)',
                background: cell.isToday
                  ? 'var(--sage-50)'
                  : cell.inMonth
                  ? 'transparent'
                  : 'var(--cream-50)',
                opacity: cell.inMonth ? 1 : 0.5,
                padding: 8,
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
              title={`${formatDateLong(cell.dateKey)} · ${cell.count} sesi`}
            >
              <div className="flex items-center justify-between">
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: cell.isToday ? 700 : 500,
                    color: cell.isToday ? 'var(--sage-700)' : 'var(--teal-800)',
                    fontFamily: 'var(--font-serif)',
                  }}
                >
                  {day}
                </span>
                {cell.count > 0 && (
                  <span
                    className="badge badge-sage"
                    style={{
                      height: 16,
                      fontSize: 10,
                      padding: '0 6px',
                    }}
                  >
                    {cell.count}
                  </span>
                )}
              </div>
              {cell.categories.size > 0 && (
                <div className="flex" style={{ gap: 2, marginTop: 'auto' }}>
                  {Array.from(cell.categories)
                    .slice(0, 4)
                    .map((cat) => (
                      <span
                        key={cat}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 999,
                          background:
                            CATEGORY_COLOR[cat] ?? 'var(--sage-500)',
                        }}
                      />
                    ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
