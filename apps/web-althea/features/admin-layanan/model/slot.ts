/**
 * Resolusi slot efektif untuk sebuah layanan (mirror backend
 * `slot-resolve.util.ts`).
 *
 * Identitas slot (jumlah, label, urutan, index) SELALU dari
 * ClinicSettings.slotsOfDay global. `service.slotOverrides` hanya menggeser
 * start/end slot tertentu. Index hasil tetap sejajar dengan global sehingga
 * slotIndices availability psikolog tetap valid.
 *
 * Slot di `disabledSlotIndices` ditandai `disabled: true` — panjang & posisi
 * index tetap sama. Consumer yang butuh filter render tinggal
 * `.filter(s => !s.disabled)`.
 */
import type { SlotOverride } from './types';

export type SlotDef = { start: string; end: string; label?: string; disabled?: boolean };

export function resolveServiceSlots(
  globalSlots: SlotDef[],
  overrides: SlotOverride[] | null | undefined,
  disabledIndices?: number[] | null,
): SlotDef[] {
  const byIndex = new Map<number, SlotOverride>();
  if (overrides) for (const o of overrides) byIndex.set(o.index, o);
  const disabled = new Set<number>(disabledIndices ?? []);
  return globalSlots.map((slot, i) => {
    const ov = byIndex.get(i);
    const base = ov ? { start: ov.start, end: ov.end, label: slot.label } : slot;
    return disabled.has(i) ? { ...base, disabled: true } : base;
  });
}
