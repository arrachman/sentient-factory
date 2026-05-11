'use client';

/**
 * Week grid 6 hari × 10 jam slot. Time column kiri 60px, day columns flex.
 * BookingBlock di-render absolute di atas grid lines.
 */
import type { Booking } from '@/features/admin-booking/model/types';
import { DAY_LABELS, SLOTS, SLOT_HEIGHT } from '../model/constants';
import { bookingPositionInDay, padDay, toDateKey } from '../model/format';
import { BookingBlock } from './booking-block';

export function WeekGrid({
  days,
  todayIdx,
  dayBookings,
  isLoading,
}: {
  days: Date[];
  todayIdx: number;
  dayBookings: Booking[][];
  isLoading: boolean;
}) {
  return (
    <div className="card-althea" style={{ padding: 0, overflow: 'hidden' }}>
      <DayHeaderRow days={days} todayIdx={todayIdx} />
      <div style={{ position: 'relative' }}>
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
            Memuat jadwal...
          </div>
        ) : null}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '60px repeat(6, 1fr)',
          }}
        >
          <TimeColumn />
          {days.map((d, dayIdx) => (
            <DayColumn
              key={toDateKey(d)}
              day={d}
              bookings={dayBookings[dayIdx]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DayHeaderRow({
  days,
  todayIdx,
}: {
  days: Date[];
  todayIdx: number;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '60px repeat(6, 1fr)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{ padding: '12px 8px', background: 'var(--cream-50)' }} />
      {days.map((d, i) => {
        const isToday = i === todayIdx;
        return (
          <div
            key={toDateKey(d)}
            style={{
              padding: '12px 12px',
              textAlign: 'center',
              background: isToday ? 'var(--sage-50)' : 'var(--cream-50)',
              borderLeft: '1px solid var(--border)',
            }}
          >
            <span className="caption" style={{ fontSize: 11 }}>
              {DAY_LABELS[i]}
            </span>
            <div
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: isToday ? 'var(--sage-700)' : 'var(--teal-800)',
                fontFamily: 'var(--font-serif)',
              }}
            >
              {padDay(d.getDate())}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TimeColumn() {
  return (
    <div className="flex flex-col">
      {SLOTS.map((t) => (
        <div
          key={t}
          style={{
            height: SLOT_HEIGHT,
            padding: '6px 8px',
            borderTop: '1px solid var(--border)',
            textAlign: 'right',
          }}
        >
          <span
            className="caption"
            style={{ fontSize: 11, fontVariantNumeric: 'tabular-nums' }}
          >
            {t}
          </span>
        </div>
      ))}
    </div>
  );
}

function DayColumn({ day, bookings }: { day: Date; bookings: Booking[] }) {
  return (
    <div
      style={{
        position: 'relative',
        borderLeft: '1px solid var(--border)',
      }}
    >
      {SLOTS.map((_, si) => (
        <div
          key={si}
          style={{
            height: SLOT_HEIGHT,
            borderTop: '1px solid var(--border)',
          }}
        />
      ))}
      {bookings.map((b) => {
        const pos = bookingPositionInDay(b, day);
        if (!pos) return null;
        return (
          <BookingBlock
            key={b.id}
            b={b}
            slotIdx={pos.slotIdx}
            span={pos.span}
          />
        );
      })}
    </div>
  );
}
