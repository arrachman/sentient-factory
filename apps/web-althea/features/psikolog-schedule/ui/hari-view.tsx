'use client';

/**
 * Hari view — single day timeline (1 kolom × N slot dari ClinicSettings).
 * Lebih besar/detail daripada Minggu mode.
 */
import type { Booking } from '@/features/admin-booking/model/types';
import type { ClinicSettings } from '@/features/admin-pengaturan/api/settings.api';
import { formatDateLong } from '../model/format';
import { bookingForSlot, type DayAvailability } from '../model/availability';
import { SlotCell } from './slot-cell';

const CELL_HEIGHT = 88;

export function HariView({
  date,
  bookings,
  isLoading,
  slotsOfDay,
  availability,
  onBookingClick,
}: {
  date: string;
  bookings: Booking[];
  isLoading: boolean;
  slotsOfDay: ClinicSettings['slotsOfDay'];
  availability: DayAvailability;
  onBookingClick?: (b: Booking) => void;
}) {
  const dayDate = new Date(date);

  if (slotsOfDay.length === 0) {
    return (
      <div className="card-althea p-8 text-center text-fg-muted">
        Slot operasional klinik belum di-set. Hubungi admin.
      </div>
    );
  }

  return (
    <div className="card-althea overflow-hidden" style={{ padding: 0 }}>
      <div
        className="flex items-baseline gap-2"
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
        <span className="caption">· {bookings.length} sesi</span>
        {!availability.isOpen && (
          <span
            className="ml-auto px-2 py-0.5 rounded text-[10.5px] font-semibold uppercase tracking-wider"
            style={{ background: '#f7d9b7', color: '#8a4a00' }}
          >
            {availability.source === 'override' ? 'Cuti override' : 'Libur'}
          </span>
        )}
        {availability.isOpen && availability.source === 'override' && (
          <span
            className="ml-auto px-2 py-0.5 rounded text-[10.5px] font-semibold uppercase tracking-wider"
            style={{ background: '#dde9d8', color: '#3a5b3f' }}
          >
            Jadwal khusus
          </span>
        )}
      </div>

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

        {slotsOfDay.map((slot, slotIdx) => {
          const booking = bookingForSlot(bookings, dayDate, slot.start, slot.end);
          return (
            <div
              key={slotIdx}
              style={{
                display: 'grid',
                gridTemplateColumns: '90px 1fr',
                borderTop: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  background: 'var(--cream-50)',
                  padding: '8px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  borderRight: '1px solid var(--border)',
                }}
              >
                <span
                  className="font-mono"
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: 'var(--teal-800)',
                  }}
                >
                  {slot.start}
                </span>
                <span style={{ fontSize: 10.5, color: 'var(--fg-muted)' }}>
                  {slot.end}
                </span>
                {slot.label && (
                  <span
                    style={{
                      fontSize: 10,
                      color: 'var(--fg-muted)',
                      marginTop: 2,
                    }}
                  >
                    {slot.label}
                  </span>
                )}
              </div>
              <div>
                <SlotCell
                  date={dayDate}
                  slotIdx={slotIdx}
                  slotStart={slot.start}
                  slotEnd={slot.end}
                  booking={booking}
                  availability={availability}
                  cellHeight={CELL_HEIGHT}
                  onBookingClick={onBookingClick}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
