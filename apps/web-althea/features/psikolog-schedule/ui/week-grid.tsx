'use client';

/**
 * Week grid 6 hari × N slot (dari ClinicSettings.slotsOfDay).
 *
 * Setiap cell render salah satu state:
 *   Berlangsung | Booked | Selesai | Tersedia | Libur | Past-empty
 *
 * Lihat SlotCell untuk detail visual masing-masing.
 */
import type { Booking } from '@/features/admin-booking/model/types';
import type { ClinicSettings } from '@/features/admin-pengaturan/api/settings.api';
import { DAY_LABELS } from '../model/constants';
import { padDay, toDateKey } from '../model/format';
import { bookingForSlot, type DayAvailability } from '../model/availability';
import { SlotCell } from './slot-cell';

const CELL_HEIGHT = 70;

export function WeekGrid({
  days,
  todayIdx,
  dayBookings,
  isLoading,
  slotsOfDay,
  dayAvailability,
}: {
  days: Date[];
  todayIdx: number;
  dayBookings: Booking[][];
  isLoading: boolean;
  slotsOfDay: ClinicSettings['slotsOfDay'];
  dayAvailability: DayAvailability[];
}) {
  // Fallback kalau settings belum loaded
  if (slotsOfDay.length === 0) {
    return (
      <div className="card-althea p-8 text-center text-fg-muted">
        Slot operasional klinik belum di-set. Hubungi admin.
      </div>
    );
  }

  return (
    <div className="card-althea overflow-hidden" style={{ padding: 0 }}>
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
        {slotsOfDay.map((slot, slotIdx) => (
          <div
            key={slotIdx}
            style={{
              display: 'grid',
              gridTemplateColumns: '70px repeat(7, 1fr)',
              borderTop: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                background: 'var(--cream-50)',
                padding: '6px 8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderRight: '1px solid var(--border)',
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: 'var(--teal-800)',
                }}
              >
                {slot.start}
              </span>
              <span style={{ fontSize: 10, color: 'var(--fg-muted)' }}>
                {slot.end}
              </span>
            </div>
            {days.map((d, dayIdx) => {
              const booking = bookingForSlot(
                dayBookings[dayIdx] ?? [],
                d,
                slot.start,
                slot.end,
              );
              return (
                <div
                  key={`${slotIdx}-${dayIdx}`}
                  style={{
                    borderLeft: dayIdx === 0 ? 'none' : '1px solid var(--border)',
                    background:
                      dayIdx === todayIdx ? 'rgba(91,138,102,0.04)' : 'transparent',
                  }}
                >
                  <SlotCell
                    date={d}
                    slotIdx={slotIdx}
                    slotStart={slot.start}
                    slotEnd={slot.end}
                    booking={booking}
                    availability={
                      dayAvailability[dayIdx] ?? {
                        isOpen: false,
                        slotIndices: null,
                        source: 'unset',
                      }
                    }
                    cellHeight={CELL_HEIGHT}
                  />
                </div>
              );
            })}
          </div>
        ))}
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
        gridTemplateColumns: '70px repeat(7, 1fr)',
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
              padding: '10px 12px',
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
