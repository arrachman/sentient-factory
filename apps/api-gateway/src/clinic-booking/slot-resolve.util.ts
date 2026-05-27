/**
 * Resolusi slot efektif untuk sebuah layanan.
 *
 * Identitas slot (jumlah, label, urutan, index) SELALU dari
 * ClinicSettings.slotsOfDay (global). `ClinicService.slotOverrides` hanya
 * menggeser start/end slot tertentu untuk layanan itu. Slot global yang tidak
 * punya override dipakai apa adanya. Index hasil tetap sejajar dengan global,
 * sehingga slotIndices availability psikolog tetap valid.
 *
 * Slot di `disabledSlotIndices` ditandai dengan `disabled: true` pada hasil —
 * panjang & posisi index tetap sama (consumer yang butuh filter render
 * tinggal `.filter(s => !s.disabled)`). Index identitas penting untuk path
 * yang mapping index lintas-layanan (mis. booking-transitions edit).
 */
export type SlotDef = { start: string; end: string; label?: string; disabled?: boolean };
export type SlotOverride = { index: number; start: string; end: string };

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
