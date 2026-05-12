'use client';

/**
 * Bulan view — kalender bulanan 6×7 grid. Tiap sel = day cell:
 *   - tanggal angka
 *   - badge sage dengan total booking (kalau >0)
 *   - kategori dots (max 4) sebagai indikator service mix
 * Klik sel switch ke HariView.
 */
import type { Booking } from '@/features/admin-booking/model/types';
import {
  DAY_LABELS_SHORT,
  SVC_COLOR,
  SVC_LABEL,
} from '../../model/constants';
import {
  formatDateLong,
  monthEnd,
  monthStart,
  toDateKey,
  todayKey,
} from '../../model/format';

type Cell = {
  dateKey: string;
  inMonth: boolean;
  isToday: boolean;
  count: number;
  categories: Set<string>;
};

export function BulanView({
  monthAnchor,
  bookings,
  isLoading,
  onDayClick,
}: {
  monthAnchor: string;
  bookings: Booking[];
  isLoading: boolean;
  onDayClick: (dateKey: string) => void;
}) {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-fg-muted">
        Memuat jadwal bulan...
      </div>
    );
  }

  const cells = buildCells(monthAnchor, bookings);

  return (
    <div>
      <DayOfWeekHeader />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gridAutoRows: 'minmax(80px, 1fr)',
        }}
      >
        {cells.map((cell, i) => (
          <DayCell
            key={cell.dateKey + i}
            cell={cell}
            isLastRow={i >= 35}
            isLastCol={(i + 1) % 7 === 0}
            onClick={() => onDayClick(cell.dateKey)}
          />
        ))}
      </div>
    </div>
  );
}

function buildCells(monthAnchor: string, bookings: Booking[]): Cell[] {
  const start = new Date(monthStart(monthAnchor));
  const end = new Date(monthEnd(monthAnchor));
  const today = todayKey();

  // Monday-aligned first cell
  const firstDow = start.getDay();
  const offset = firstDow === 0 ? -6 : 1 - firstDow;
  const gridStart = new Date(start);
  gridStart.setDate(gridStart.getDate() + offset);

  const countByDate = new Map<
    string,
    { count: number; categories: Set<string> }
  >();
  for (const b of bookings) {
    const dk = toDateKey(new Date(b.scheduledStart));
    if (!countByDate.has(dk)) {
      countByDate.set(dk, { count: 0, categories: new Set() });
    }
    const entry = countByDate.get(dk)!;
    entry.count += 1;
    entry.categories.add(b.service.category);
  }

  const out: Cell[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    const dk = toDateKey(d);
    const inMonth = d >= start && d <= end;
    const stat = countByDate.get(dk) ?? {
      count: 0,
      categories: new Set<string>(),
    };
    out.push({
      dateKey: dk,
      inMonth,
      isToday: dk === today,
      count: stat.count,
      categories: stat.categories,
    });
  }
  return out;
}

function DayOfWeekHeader() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {DAY_LABELS_SHORT.map((d) => (
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
  );
}

function DayCell({
  cell,
  isLastRow,
  isLastCol,
  onClick,
}: {
  cell: Cell;
  isLastRow: boolean;
  isLastCol: boolean;
  onClick: () => void;
}) {
  const day = new Date(cell.dateKey).getDate();
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        borderRight: isLastCol ? 'none' : '1px solid var(--border)',
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
      title={`${formatDateLong(cell.dateKey)} · ${cell.count} booking`}
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
        {cell.count > 0 ? (
          <span
            className="badge badge-sage"
            style={{ height: 16, fontSize: 10, padding: '0 6px' }}
          >
            {cell.count}
          </span>
        ) : null}
      </div>
      {cell.categories.size > 0 ? <CategoryDots categories={cell.categories} /> : null}
    </button>
  );
}

function CategoryDots({ categories }: { categories: Set<string> }) {
  return (
    <div className="flex" style={{ gap: 2, marginTop: 'auto' }}>
      {Array.from(categories)
        .slice(0, 4)
        .map((cat) => {
          const c = SVC_COLOR[cat] ?? SVC_COLOR.konseling;
          return (
            <span
              key={cat}
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: c.bar,
              }}
              title={SVC_LABEL[cat]}
            />
          );
        })}
    </div>
  );
}
