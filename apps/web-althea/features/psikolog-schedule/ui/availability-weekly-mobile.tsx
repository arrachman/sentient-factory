'use client';

import { CalendarDays } from 'lucide-react';
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
  mDay: DayKey;
  setMDay: (day: DayKey) => void;
};

export function AvailabilityWeeklyMobile({
  draft,
  slots,
  toggleSlot,
  toggleDayClosed,
  isSlotChecked,
  mDay,
  setMDay,
}: Props) {
  return (
    <div className="lg:hidden">
      <div
        className="mb-3 flex items-start gap-2 rounded-lg px-3 py-2.5 text-[12px]"
        style={{ background: 'var(--info-soft, #e6f0f7)', color: '#2c4a60' }}
      >
        <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Pilih slot di mana kamu tersedia menerima klien. Pola
          berulang tiap minggu — bisa diedit per hari.
        </span>
      </div>

      <p className="caption mb-1.5 text-[11px] font-semibold uppercase tracking-wide">
        Hari
      </p>
      <div className="-mx-6 mb-4 flex gap-2 overflow-x-auto px-6 pb-1">
        {DAY_KEYS.map((day) => {
          const cfg = draft[day];
          const sel = !cfg.isOpen
            ? 0
            : Array.isArray(cfg.slotIndices)
              ? cfg.slotIndices.length
              : slots.length;
          const active = day === mDay;
          return (
            <button
              key={day}
              type="button"
              onClick={() => setMDay(day)}
              className="flex min-w-[58px] flex-col items-center rounded-xl border px-2 py-2"
              style={{
                borderColor: active ? 'transparent' : 'var(--border)',
                background: active
                  ? 'var(--sage-500, #5b8a66)'
                  : 'var(--card)',
                color: active ? '#fff' : 'var(--teal-800, #142828)',
              }}
            >
              <span className="text-[12px] font-semibold">
                {DAY_LABEL[day]}
              </span>
              <span className="text-[10px] opacity-80">
                {sel}/{slots.length}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <p className="caption text-[11px] font-semibold uppercase tracking-wide">
          Slot tersedia
        </p>
        <button
          type="button"
          onClick={() => toggleDayClosed(mDay)}
          className="text-[12px] font-medium text-sage-700"
        >
          {draft[mDay].isOpen ? 'Tutup hari ini' : 'Buka hari ini'}
        </button>
      </div>

      <ul className="space-y-2">
        {slots.map((slot, slotIdx) => {
          const checked = isSlotChecked(mDay, slotIdx);
          return (
            <li key={slotIdx}>
              <button
                type="button"
                onClick={() => toggleSlot(mDay, slotIdx)}
                className="flex w-full items-center gap-3 rounded-xl border p-3 text-left"
                style={{
                  borderColor: checked
                    ? 'var(--sage-500, #5b8a66)'
                    : 'var(--border)',
                  background: checked
                    ? 'var(--sage-50, #f0f5f0)'
                    : 'var(--card)',
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="h-4 w-4"
                  aria-label={`${DAY_LABEL[mDay]} slot ${slotIdx + 1}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-teal-800">
                    {slot.start}
                    {slot.end ? ` – ${slot.end}` : ''}
                  </p>
                  {slot.label && (
                    <p className="caption text-[11px]">{slot.label}</p>
                  )}
                </div>
                {checked && (
                  <span className="badge badge-sage text-[10px]">
                    tersedia
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
