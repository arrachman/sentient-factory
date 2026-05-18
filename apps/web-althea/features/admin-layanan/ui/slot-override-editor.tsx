'use client';

/**
 * Editor override range waktu slot per-layanan.
 *
 * Identitas slot (jumlah, label, urutan, index) READ-ONLY dari
 * ClinicSettings.slotsOfDay global. Admin hanya bisa menggeser start/end
 * tiap slot untuk layanan ini. Slot tanpa "waktu khusus" mewarisi waktu
 * global apa adanya (tidak disimpan ke slotOverrides).
 */
import { RotateCcw } from 'lucide-react';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';
import type { SlotOverride } from '../model/types';

type Props = {
  value: SlotOverride[] | undefined;
  onChange: (next: SlotOverride[]) => void;
};

export function SlotOverrideEditor({ value, onChange }: Props) {
  const settings = useSettings();
  const globalSlots = settings.data?.data.slotsOfDay ?? [];
  const overrides = value ?? [];
  const byIndex = new Map(overrides.map((o) => [o.index, o]));

  function setOverride(index: number, partial: Partial<Pick<SlotOverride, 'start' | 'end'>>) {
    const base = byIndex.get(index) ?? {
      index,
      start: globalSlots[index]?.start ?? '08:00',
      end: globalSlots[index]?.end ?? '09:00',
    };
    const next = overrides.filter((o) => o.index !== index);
    next.push({ ...base, ...partial });
    next.sort((a, b) => a.index - b.index);
    onChange(next);
  }

  function resetSlot(index: number) {
    onChange(overrides.filter((o) => o.index !== index));
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

  return (
    <div className="flex flex-col gap-2">
      <p className="caption text-fg-muted">
        Nama & jumlah slot mengikuti slot global. Layanan ini hanya bisa menggeser{' '}
        <strong>range waktu</strong>-nya. Kosongkan (Reset) untuk ikut waktu global.
      </p>
      {globalSlots.map((slot, i) => {
        const ov = byIndex.get(i);
        const custom = !!ov;
        return (
          <div
            key={i}
            className="grid items-center gap-2 px-3 py-2 rounded-md bg-cream-50 border border-border"
            style={{ gridTemplateColumns: '1.6fr 1fr 1fr 32px' }}
          >
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-teal-800 truncate">
                {slot.label || `Slot ${i + 1}`}
              </div>
              <div className="caption text-fg-muted">
                {custom ? (
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
              className={`input-althea h-9 py-0 text-[13px] ${custom ? '' : 'text-fg-muted'}`}
            />
            <input
              type="time"
              value={ov?.end ?? slot.end}
              onChange={(e) => setOverride(i, { end: e.target.value })}
              className={`input-althea h-9 py-0 text-[13px] ${custom ? '' : 'text-fg-muted'}`}
            />
            <button
              type="button"
              onClick={() => resetSlot(i)}
              disabled={!custom}
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
