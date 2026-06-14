'use client';

import { Check, Moon } from 'lucide-react';
import { Fragment } from 'react';
import {
  DAY_KEYS,
  DAY_LABEL,
  type DayAvailability,
  type DayKey,
} from '@/features/admin-psikolog/model/types';

type Slot = { start: string; end?: string; label?: string };

type Props = {
  draft: Record<DayKey, DayAvailability>;
  slots: Slot[];
  toggleSlot: (day: DayKey, slotIdx: number) => void;
  toggleDayClosed: (day: DayKey) => void;
  isSlotChecked: (day: DayKey, slotIdx: number) => boolean;
};

const DAYS = DAY_KEYS.slice(0, 6) as DayKey[];

export function AvailabilityWeeklyDesktop({
  draft,
  slots,
  toggleSlot,
  toggleDayClosed,
  isSlotChecked,
}: Props) {
  const slotCount = slots.length;

  const totalOpen = DAYS.reduce((acc, day) => {
    for (let i = 0; i < slotCount; i++) {
      if (isSlotChecked(day, i)) acc += 1;
    }
    return acc;
  }, 0);

  return (
    <div className="hidden lg:block">
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
            Klik sel untuk toggle · {totalOpen} slot tersedia
          </span>
        </div>
      </div>

      {/* Legend */}
      <div
        className="flex flex-wrap items-center"
        style={{ gap: 14, marginBottom: 14, fontSize: 11 }}
      >
        <span className="flex items-center gap-1.5">
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              background: 'var(--sage-300)',
              display: 'inline-block',
            }}
          />
          Tersedia
        </span>
        <span className="flex items-center gap-1.5">
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              background: 'var(--cream-100)',
              border: '1px solid var(--border-strong, #d8d3c3)',
              display: 'inline-block',
            }}
          />
          Tidak tersedia
        </span>
      </div>

      {/* Grid */}
      <div style={{ overflowX: 'auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `110px repeat(${slotCount}, minmax(64px, 1fr))`,
            gap: 6,
            minWidth: 110 + slotCount * 64,
          }}
        >
          {/* Header row: blank corner + slot labels */}
          <div />
          {slots.map((slot, i) => (
            <div
              key={i}
              style={{
                textAlign: 'center',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--teal-800)',
                paddingBottom: 6,
              }}
            >
              {slot.label ?? `Slot ${i + 1}`}
            </div>
          ))}

          {/* Day rows */}
          {DAYS.map((day) => {
            let openCount = 0;
            for (let i = 0; i < slotCount; i++) {
              if (isSlotChecked(day, i)) openCount += 1;
            }
            const allOpen = openCount === slotCount;
            const partial = openCount > 0 && openCount < slotCount;

            return (
              <Fragment key={day}>
                <button
                  type="button"
                  onClick={() => toggleDayClosed(day)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--teal-800)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0 0 0 2px',
                    textAlign: 'left',
                  }}
                  title={allOpen ? 'Tutup semua slot hari ini' : 'Buka semua slot hari ini'}
                >
                  {DAY_LABEL[day]}
                  {allOpen && (
                    <Check
                      size={12}
                      style={{ color: 'var(--sage-600)', strokeWidth: 2.5 }}
                    />
                  )}
                  {partial && (
                    <Moon size={12} style={{ color: 'var(--fg-muted)' }} />
                  )}
                </button>
                {slots.map((slot, slotIdx) => {
                  const active = isSlotChecked(day, slotIdx);
                  return (
                    <button
                      key={slotIdx}
                      type="button"
                      onClick={() => toggleSlot(day, slotIdx)}
                      style={{
                        height: 48,
                        borderRadius: 8,
                        cursor: 'pointer',
                        background: active ? 'var(--sage-300)' : 'var(--cream-100)',
                        border: active
                          ? '1px solid transparent'
                          : '1px solid var(--border-strong, #d8d3c3)',
                        padding: 0,
                        transition: 'background 0.12s, border-color 0.12s',
                      }}
                      aria-label={`${DAY_LABEL[day]} ${slot.label ?? `Slot ${slotIdx + 1}`} — ${active ? 'tersedia' : 'tidak tersedia'}`}
                    />
                  );
                })}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
