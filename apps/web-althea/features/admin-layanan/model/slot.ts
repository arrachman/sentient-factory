/**
 * Resolusi slot efektif untuk sebuah layanan (mirror backend
 * `slot-resolve.util.ts`).
 *
 * Identitas slot (jumlah, label, urutan, index) SELALU dari
 * ClinicSettings.slotsOfDay global. `service.slotOverrides` hanya menggeser
 * start/end slot tertentu. Index hasil tetap sejajar dengan global sehingga
 * slotIndices availability psikolog tetap valid.
 */
import type { SlotOverride } from './types';

export type SlotDef = { start: string; end: string; label?: string };

export function resolveServiceSlots(
  globalSlots: SlotDef[],
  overrides: SlotOverride[] | null | undefined,
): SlotDef[] {
  if (!overrides || overrides.length === 0) return globalSlots;
  const byIndex = new Map<number, SlotOverride>();
  for (const o of overrides) byIndex.set(o.index, o);
  return globalSlots.map((slot, i) => {
    const ov = byIndex.get(i);
    return ov ? { start: ov.start, end: ov.end, label: slot.label } : slot;
  });
}
