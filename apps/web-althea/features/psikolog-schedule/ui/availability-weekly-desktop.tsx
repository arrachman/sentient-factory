'use client';

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

export function AvailabilityWeeklyDesktop({
  draft,
  slots,
  toggleSlot,
  toggleDayClosed,
  isSlotChecked,
}: Props) {
  return (
    <div className="hidden overflow-x-auto lg:block">
      <table
        className="w-full text-sm"
        style={{ borderCollapse: 'separate', borderSpacing: 0 }}
      >
        <thead>
          <tr>
            <th
              className="text-left text-[11px] font-semibold text-fg-muted uppercase tracking-wider"
              style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)' }}
            >
              Hari
            </th>
            {slots.map((slot, i) => (
              <th
                key={i}
                className="text-center text-[11px] font-semibold text-fg-muted"
                style={{
                  padding: '8px 8px',
                  borderBottom: '1px solid var(--border)',
                  borderLeft: '1px solid var(--border)',
                }}
              >
                <div className="font-mono text-teal-800 text-[12px]">
                  {slot.start}
                </div>
                <div className="text-[10px] mt-0.5 normal-case font-medium">
                  {slot.label || `Slot ${i + 1}`}
                </div>
              </th>
            ))}
            <th
              style={{
                padding: '8px 8px',
                borderBottom: '1px solid var(--border)',
                borderLeft: '1px solid var(--border)',
                width: 70,
              }}
            />
          </tr>
        </thead>
        <tbody>
          {DAY_KEYS.map((day) => {
            const cfg = draft[day];
            const isClosed = !cfg.isOpen;
            return (
              <tr key={day}>
                <td
                  style={{
                    padding: '10px 12px',
                    borderBottom: '1px solid var(--border)',
                    background: isClosed ? 'var(--cream-50)' : 'transparent',
                  }}
                >
                  <div
                    className={`font-medium ${isClosed ? 'text-fg-muted' : 'text-teal-800'}`}
                  >
                    {DAY_LABEL[day]}
                  </div>
                  {isClosed && <div className="caption">libur</div>}
                </td>
                {slots.map((_slot, slotIdx) => {
                  const checked = isSlotChecked(day, slotIdx);
                  return (
                    <td
                      key={slotIdx}
                      style={{
                        padding: '10px 8px',
                        borderBottom: '1px solid var(--border)',
                        borderLeft: '1px solid var(--border)',
                        textAlign: 'center',
                        background: isClosed ? 'var(--cream-50)' : 'transparent',
                        cursor: isClosed ? 'not-allowed' : 'pointer',
                      }}
                      onClick={() => !isClosed && toggleSlot(day, slotIdx)}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={isClosed}
                        onChange={() => toggleSlot(day, slotIdx)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 cursor-pointer"
                        aria-label={`${DAY_LABEL[day]} slot ${slotIdx + 1}`}
                      />
                    </td>
                  );
                })}
                <td
                  style={{
                    padding: '10px 8px',
                    borderBottom: '1px solid var(--border)',
                    borderLeft: '1px solid var(--border)',
                    textAlign: 'center',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleDayClosed(day)}
                    className="text-[11px] font-medium text-sage-700 hover:underline"
                    title={isClosed ? 'Buka hari ini' : 'Tutup hari ini (uncheck semua)'}
                  >
                    {isClosed ? 'Buka' : 'Tutup'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
