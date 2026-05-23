'use client';

import type { Booking } from '@/features/admin-booking/model/types';
import type { Psikolog } from '@/features/admin-psikolog/model/types';
import type { Room } from '@/features/admin-rooms/model/types';
import type { PeriodRange } from '../model/period';
import { RoomUsageSection } from './room-usage-section';

const WIB_FMT = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Jakarta',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function wibDateKey(iso: string): string {
  return WIB_FMT.format(new Date(iso));
}

function dayLabel(key: string): { short: string; date: string } {
  const d = new Date(key);
  return {
    short: d.toLocaleDateString('id-ID', { weekday: 'short' }),
    date: String(d.getDate()),
  };
}

export function RoomUsageWeekly({
  rooms,
  allBookings,
  psikologs,
  range,
  selectedDay,
  onSelectDay,
}: {
  rooms: Room[];
  allBookings: Booking[];
  psikologs: Psikolog[];
  range: PeriodRange;
  selectedDay: string;
  onSelectDay: (day: string) => void;
}) {
  const countByDay = new Map<string, number>();
  for (const b of allBookings) {
    const k = wibDateKey(b.scheduledStart);
    countByDay.set(k, (countByDay.get(k) ?? 0) + 1);
  }

  const dayBookings = allBookings.filter(
    (b) => wibDateKey(b.scheduledStart) === selectedDay,
  );

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex gap-2 overflow-x-auto pb-0.5"
        style={{ scrollbarWidth: 'none' }}
      >
        {range.days.map((day) => {
          const { short, date } = dayLabel(day);
          const count = countByDay.get(day) ?? 0;
          const isSelected = day === selectedDay;
          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDay(day)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 10px',
                borderRadius: 10,
                border: isSelected
                  ? '2px solid var(--sage-500)'
                  : '1px solid var(--border)',
                background: isSelected ? 'var(--sage-500)' : 'var(--cream-50)',
                color: isSelected ? '#fff' : 'var(--teal-800)',
                cursor: 'pointer',
                flex: '1 1 0',
                minWidth: 48,
                height: 76,
                gap: 2,
                transition: 'all .15s ease',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.8 }}>
                {short}
              </span>
              <span style={{ fontSize: 16, fontWeight: 700 }}>{date}</span>
              {/* Always render badge area to keep consistent height across all pills */}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  background: count > 0
                    ? (isSelected ? 'rgba(255,255,255,0.25)' : 'var(--sage-100)')
                    : 'transparent',
                  color: isSelected ? '#fff' : 'var(--sage-700)',
                  borderRadius: 999,
                  padding: '1px 7px',
                  marginTop: 2,
                  visibility: count > 0 ? 'visible' : 'hidden',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <RoomUsageSection
        rooms={rooms}
        todayBookings={dayBookings}
        psikologs={psikologs}
        dateKey={selectedDay}
      />
    </div>
  );
}
