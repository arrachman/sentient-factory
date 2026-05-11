'use client';

/**
 * Hari view — single day timeline (1 kolom × 10 slot).
 * Untuk fokus harian, lebih besar/detail daripada Minggu mode.
 */
import type { Booking } from '@/features/admin-booking/model/types';
import { SLOTS, SLOT_HEIGHT } from '../model/constants';
import { bookingPositionInDay, formatDateLong } from '../model/format';
import { BookingBlock } from './booking-block';

export function HariView({
  date,
  bookings,
  isLoading,
}: {
  date: string;
  bookings: Booking[];
  isLoading: boolean;
}) {
  const dayDate = new Date(date);
  return (
    <div className="card-althea" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{
          padding: '12px 18px',
          background: 'var(--sage-50)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--sage-700)',
            fontFamily: 'var(--font-serif)',
          }}
        >
          {formatDateLong(date)}
        </span>
        <span className="caption" style={{ marginLeft: 8 }}>
          · {bookings.length} sesi
        </span>
      </div>

      {/* Grid */}
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
            gridTemplateColumns: '70px 1fr',
          }}
        >
          {/* Time column */}
          <div className="flex flex-col">
            {SLOTS.map((t) => (
              <div
                key={t}
                style={{
                  height: SLOT_HEIGHT,
                  padding: '6px 10px',
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

          {/* Day column */}
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
              const pos = bookingPositionInDay(b, dayDate);
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
            {bookings.length === 0 && !isLoading && (
              <div
                className="caption"
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'grid',
                  placeItems: 'center',
                  pointerEvents: 'none',
                }}
              >
                Tidak ada sesi hari ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
