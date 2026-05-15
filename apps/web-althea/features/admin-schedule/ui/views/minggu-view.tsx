'use client';

/**
 * Minggu view — 7 hari (Senin-aligned) × 6 slot. Cell stacks up to 2
 * booking; sisanya jadi "+N lagi" indicator.
 */
import type { Booking } from '@/features/admin-booking/model/types';
import { DAY_LABELS_SHORT, SLOTS, SVC_COLOR } from '../../model/constants';
import { addDays, pad2, toDateKey, todayKey } from '../../model/format';
import { EmptySlot } from '../components/empty-slot';

export function MingguView({
  weekStart,
  bookings,
  isLoading,
  onBookingClick,
}: {
  weekStart: string;
  bookings: Booking[];
  isLoading: boolean;
  onBookingClick: (b: Booking) => void;
}) {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-fg-muted">
        Memuat jadwal minggu...
      </div>
    );
  }

  const days: string[] = [];
  for (let i = 0; i < 7; i++) days.push(addDays(weekStart, i));
  const today = todayKey();
  const byCell = groupByCell(bookings);
  const colTpl = '110px repeat(7, minmax(120px, 1fr))';
  const minWidth = 110 + 7 * 120;

  return (
    <div style={{ overflowX: 'auto' }}>
      <DayHeaderRow
        days={days}
        today={today}
        colTpl={colTpl}
        minWidth={minWidth}
      />
      {SLOTS.map((slot, slotIdx) => (
        <div
          key={slot.start}
          style={{
            display: 'grid',
            gridTemplateColumns: colTpl,
            borderBottom:
              slotIdx === SLOTS.length - 1
                ? 'none'
                : '1px solid var(--border)',
            minWidth,
            background: slotIdx % 2 === 1 ? 'rgba(247, 244, 237, 0.55)' : 'transparent',
          }}
        >
          <SlotLabel start={slot.start} end={slot.end} />
          {days.map((d) => {
            const cellKey = `${d}#${slotIdx}`;
            const cellBookings = byCell.get(cellKey) ?? [];
            return (
              <DayCell
                key={d}
                bookings={cellBookings}
                isToday={d === today}
                onBookingClick={onBookingClick}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function groupByCell(bookings: Booking[]): Map<string, Booking[]> {
  const out = new Map<string, Booking[]>();
  for (const b of bookings) {
    const start = new Date(b.scheduledStart);
    const dateKey = toDateKey(start);
    const hour = start.getHours();
    const slotIdx = SLOTS.findIndex(
      (s) =>
        parseInt(s.start.split(':')[0], 10) === hour ||
        (parseInt(s.start.split(':')[0], 10) <= hour &&
          parseInt(s.end.split(':')[0], 10) > hour),
    );
    if (slotIdx === -1) continue;
    const key = `${dateKey}#${slotIdx}`;
    if (!out.has(key)) out.set(key, []);
    out.get(key)!.push(b);
  }
  return out;
}

function DayHeaderRow({
  days,
  today,
  colTpl,
  minWidth,
}: {
  days: string[];
  today: string;
  colTpl: string;
  minWidth: number;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: colTpl,
        borderBottom: '1px solid var(--border)',
        minWidth,
      }}
    >
      <div
        style={{
          padding: '12px 14px',
          fontSize: 11.5,
          fontWeight: 600,
          color: 'var(--fg-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        Slot
      </div>
      {days.map((d, i) => {
        const isToday = d === today;
        const dateObj = new Date(d);
        return (
          <div
            key={d}
            style={{
              padding: '12px 10px',
              borderLeft: '1px solid var(--border)',
              background: isToday ? 'var(--sage-50)' : 'transparent',
              textAlign: 'center',
            }}
          >
            <span
              className="caption"
              style={{ fontSize: 10.5, display: 'block' }}
            >
              {DAY_LABELS_SHORT[i]}
            </span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: isToday ? 'var(--sage-700)' : 'var(--teal-800)',
                fontFamily: 'var(--font-serif)',
              }}
            >
              {pad2(dateObj.getDate())}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function SlotLabel({ start, end }: { start: string; end: string }) {
  return (
    <div
      style={{
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRight: '1px solid var(--border)',
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--teal-800)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {start}
      </span>
      <span
        style={{
          fontSize: 10.5,
          color: 'var(--fg-muted)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {end}
      </span>
    </div>
  );
}

function DayCell({
  bookings,
  isToday,
  onBookingClick,
}: {
  bookings: Booking[];
  isToday: boolean;
  onBookingClick: (b: Booking) => void;
}) {
  return (
    <div
      style={{
        padding: 4,
        borderLeft: '1px solid var(--border)',
        minHeight: 72,
        background: isToday ? 'rgba(91,138,102,0.04)' : 'transparent',
      }}
    >
      {bookings.length === 0 ? (
        <EmptySlot />
      ) : (
        <div className="flex flex-col" style={{ gap: 3, height: '100%' }}>
          {bookings.slice(0, 2).map((b) => (
            <MiniBookingChip key={b.id} b={b} onClick={() => onBookingClick(b)} />
          ))}
          {bookings.length > 2 ? (
            <span className="caption" style={{ fontSize: 10, paddingLeft: 4 }}>
              +{bookings.length - 2} lagi
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}

function MiniBookingChip({ b, onClick }: { b: Booking; onClick: () => void }) {
  const c = SVC_COLOR[b.service.category] ?? SVC_COLOR.konseling;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: c.fill,
        borderLeft: `2px solid ${c.bar}`,
        borderRadius: 4,
        padding: '3px 6px',
        fontSize: 10.5,
        color: c.text,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        cursor: 'pointer',
        border: 'none',
        textAlign: 'left',
        width: '100%',
      }}
      title={`#${b.id} · ${b.client.name} · ${b.room.name}`}
    >
      {b.client.name}
    </button>
  );
}
