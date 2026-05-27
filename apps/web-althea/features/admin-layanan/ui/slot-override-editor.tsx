'use client';

/**
 * Editor slot per-layanan.
 *
 * Identitas slot (jumlah, label, urutan, index) READ-ONLY dari
 * ClinicSettings.slotsOfDay global. Admin bisa:
 *   - Geser start/end tiap slot via input time → simpan ke `slotOverrides`
 *   - Nonaktifkan slot via checkbox → index masuk ke `disabledSlotIndices`
 *
 * Slot yang dinonaktifkan tidak akan muncul di booking wizard & ditolak oleh
 * backend `assertSlotMatch`. Slot tanpa override mewarisi waktu global apa
 * adanya (tidak disimpan ke slotOverrides).
 */
import { RotateCcw } from 'lucide-react';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';
import type { SlotOverride } from '../model/types';

type Props = {
  overrides: SlotOverride[] | undefined;
  onChangeOverrides: (next: SlotOverride[]) => void;
  disabledIndices: number[] | undefined;
  onChangeDisabled: (next: number[]) => void;
};

export function SlotOverrideEditor({
  overrides: overridesProp,
  onChangeOverrides,
  disabledIndices: disabledProp,
  onChangeDisabled,
}: Props) {
  const settings = useSettings();
  const globalSlots = settings.data?.data.slotsOfDay ?? [];
  const overrides = overridesProp ?? [];
  const disabledIndices = disabledProp ?? [];
  const byIndex = new Map(overrides.map((o) => [o.index, o]));
  const disabledSet = new Set(disabledIndices);

  function setOverride(index: number, partial: Partial<Pick<SlotOverride, 'start' | 'end'>>) {
    const base = byIndex.get(index) ?? {
      index,
      start: globalSlots[index]?.start ?? '08:00',
      end: globalSlots[index]?.end ?? '09:00',
    };
    const next = overrides.filter((o) => o.index !== index);
    next.push({ ...base, ...partial });
    next.sort((a, b) => a.index - b.index);
    onChangeOverrides(next);
  }

  function resetSlot(index: number) {
    onChangeOverrides(overrides.filter((o) => o.index !== index));
  }

  function toggleEnabled(index: number, enabled: boolean) {
    if (enabled) {
      onChangeDisabled(disabledIndices.filter((i) => i !== index));
    } else {
      if (disabledSet.has(index)) return;
      onChangeDisabled([...disabledIndices, index].sort((a, b) => a - b));
    }
  }

  if (settings.isLoading) {
    return <p className="caption text-fg-muted">Memuat slot global…</p>;
  }
  if (globalSlots.length === 0) {
    return (
      <p className="caption italic text-fg-muted px-3 py-3 rounded-md bg-amber-50 border border-amber-200">
        Belum ada slot global. Set dulu di Pengaturan → Slot Operasional.
      </p>
    );
  }

  const enabledCount = globalSlots.length - disabledSet.size;

  return (
    <div className="flex flex-col gap-2">
      <p className="caption text-fg-muted">
        Centang slot yang dipakai layanan ini ({enabledCount} dari {globalSlots.length} aktif).
        Kosongkan centang untuk menonaktifkan slot. Bisa juga geser <strong>range waktu</strong>{' '}
        per slot — kosongkan (Reset) untuk ikut waktu global.
      </p>
      {globalSlots.map((slot, i) => {
        const ov = byIndex.get(i);
        const custom = !!ov;
        const isEnabled = !disabledSet.has(i);
        return (
          <div
            key={i}
            className={`grid items-center gap-2 px-3 py-2 rounded-md border ${
              isEnabled
                ? 'bg-cream-50 border-border'
                : 'bg-cream-100 border-cream-200 opacity-70'
            }`}
            style={{ gridTemplateColumns: '24px 1.5fr 1fr 1fr 32px' }}
          >
            <label className="flex items-center justify-center cursor-pointer">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => toggleEnabled(i, e.target.checked)}
                className="h-4 w-4 cursor-pointer"
                aria-label={`Aktifkan ${slot.label || `Slot ${i + 1}`}`}
                title={isEnabled ? 'Klik untuk nonaktifkan slot ini' : 'Klik untuk aktifkan slot ini'}
              />
            </label>
            <div className="min-w-0">
              <div
                className={`text-[13px] font-semibold truncate ${
                  isEnabled ? 'text-teal-800' : 'text-fg-muted line-through'
                }`}
              >
                {slot.label || `Slot ${i + 1}`}
              </div>
              <div className="caption text-fg-muted">
                {!isEnabled ? (
                  <span className="text-danger">tidak dipakai layanan ini</span>
                ) : custom ? (
                  <span className="text-sage-700">waktu khusus layanan</span>
                ) : (
                  `ikut global · ${slot.start}–${slot.end}`
                )}
              </div>
            </div>
            <input
              type="time"
              value={ov?.start ?? slot.start}
              onChange={(e) => setOverride(i, { start: e.target.value })}
              disabled={!isEnabled}
              className={`input-althea h-9 py-0 text-[13px] ${custom ? '' : 'text-fg-muted'} disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            <input
              type="time"
              value={ov?.end ?? slot.end}
              onChange={(e) => setOverride(i, { end: e.target.value })}
              disabled={!isEnabled}
              className={`input-althea h-9 py-0 text-[13px] ${custom ? '' : 'text-fg-muted'} disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            <button
              type="button"
              onClick={() => resetSlot(i)}
              disabled={!custom || !isEnabled}
              className="btn btn-ghost btn-icon btn-sm w-[28px] disabled:opacity-30"
              aria-label="Reset ke waktu global"
              title="Reset ke waktu global"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
