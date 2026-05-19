'use client';

/**
 * Dialog: Psikolog set jadwal availability sendiri.
 *
 * Layout: 7 baris hari (Sen-Min) × N kolom slot (dari ClinicSettings.slotsOfDay).
 * - Cell checkbox: centang = slot ini available di hari ini
 * - Toggle row "Tutup hari ini" → uncheck semua slot di row tsb (isOpen=false)
 * - Save → PATCH /clinic/psikolog/me/availability
 *
 * Format payload (sesuai backend):
 *   {
 *     monday:    { isOpen: true, slotIndices: [0, 1, 2, 3] },
 *     ...
 *     sunday:    { isOpen: false }
 *   }
 *
 * isOpen=false → admin tidak bisa booking di hari itu
 * isOpen=true tanpa slotIndices → semua slot tersedia
 * isOpen=true dengan slotIndices → hanya slot di list yang tersedia
 */
import { useEffect, useMemo, useState } from 'react';
import { Calendar, CalendarDays, Save, X } from 'lucide-react';
import { useUpdateMyAvailability } from '@/features/admin-psikolog/hooks/use-psikolog';
import {
  DAY_KEYS,
  DAY_LABEL,
  type DayAvailability,
  type DayKey,
} from '@/features/admin-psikolog/model/types';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';
import { AvailabilityOverridesSection } from './availability-overrides-section';

type TabKey = 'weekly' | 'overrides';

type Props = {
  open: boolean;
  onClose: () => void;
  /** Current weeklyAvailability dari psikolog (untuk pre-populate). */
  initial: Record<string, DayAvailability> | null;
};

const DEFAULT_FALLBACK: Record<DayKey, DayAvailability> = {
  monday: { isOpen: true },
  tuesday: { isOpen: true },
  wednesday: { isOpen: true },
  thursday: { isOpen: true },
  friday: { isOpen: true },
  saturday: { isOpen: false },
  sunday: { isOpen: false },
};

export function AvailabilityDialog({ open, onClose, initial }: Props) {
  const settingsQuery = useSettings();
  const updateMut = useUpdateMyAvailability();
  const slots = settingsQuery.data?.data.slotsOfDay ?? [];

  const [tab, setTab] = useState<TabKey>('weekly');
  const [mDay, setMDay] = useState<DayKey>('monday');
  const [draft, setDraft] = useState<Record<DayKey, DayAvailability>>(DEFAULT_FALLBACK);

  // Reset tab tiap dialog dibuka
  useEffect(() => {
    if (open) setTab('weekly');
  }, [open]);

  // Hydrate draft saat dialog dibuka / initial berubah
  useEffect(() => {
    if (!open) return;
    if (initial && Object.keys(initial).length > 0) {
      // Pastikan semua DAY_KEYS ada (kalau kosong, fallback to {isOpen: false})
      const filled: Record<DayKey, DayAvailability> = {} as Record<DayKey, DayAvailability>;
      for (const day of DAY_KEYS) {
        filled[day] = (initial[day] as DayAvailability) ?? { isOpen: false };
      }
      setDraft(filled);
    } else {
      setDraft(DEFAULT_FALLBACK);
    }
  }, [open, initial]);

  const totalActiveSlots = useMemo(() => {
    let n = 0;
    for (const day of DAY_KEYS) {
      const cfg = draft[day];
      if (!cfg.isOpen) continue;
      // isOpen + slotIndices undefined = semua slot
      n += Array.isArray(cfg.slotIndices) ? cfg.slotIndices.length : slots.length;
    }
    return n;
  }, [draft, slots.length]);

  function toggleSlot(day: DayKey, slotIdx: number) {
    setDraft((prev) => {
      const cfg = prev[day];
      const current: number[] = Array.isArray(cfg.slotIndices)
        ? cfg.slotIndices
        : cfg.isOpen
          ? slots.map((_, i) => i) // implicit all → make explicit before edit
          : [];
      const next = current.includes(slotIdx)
        ? current.filter((i) => i !== slotIdx)
        : [...current, slotIdx].sort((a, b) => a - b);
      return {
        ...prev,
        [day]: {
          isOpen: next.length > 0,
          slotIndices: next.length === slots.length ? undefined : next,
        },
      };
    });
  }

  function toggleDayClosed(day: DayKey) {
    setDraft((prev) => {
      const isClosed = !prev[day].isOpen;
      return {
        ...prev,
        [day]: isClosed
          ? { isOpen: true } // open all default
          : { isOpen: false },
      };
    });
  }

  function isSlotChecked(day: DayKey, slotIdx: number): boolean {
    const cfg = draft[day];
    if (!cfg.isOpen) return false;
    if (!Array.isArray(cfg.slotIndices)) return true; // all open
    return cfg.slotIndices.includes(slotIdx);
  }

  function save() {
    updateMut.mutate(draft, { onSuccess: () => onClose() });
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/40 lg:items-center lg:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card-althea flex w-full flex-col overflow-y-auto bg-card lg:max-h-[92vh] lg:max-w-3xl lg:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="h2">Atur Jadwal Saya</h2>
            <p className="caption mt-1">
              {tab === 'weekly'
                ? <>Centang slot mana di hari mana kamu siap menerima sesi. Total: <strong>{totalActiveSlots} slot/minggu</strong>.</>
                : <>Override jadwal mingguan untuk tanggal spesifik (cuti, makeup, jadwal khusus).</>}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-icon btn-sm"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab nav */}
        <div className="flex border-b border-border px-6">
          <button
            type="button"
            onClick={() => setTab('weekly')}
            className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors ${
              tab === 'weekly'
                ? 'border-sage-500 text-teal-800'
                : 'border-transparent text-fg-muted hover:text-teal-800'
            }`}
          >
            <CalendarDays className="h-4 w-4" /> Jadwal Mingguan
          </button>
          <button
            type="button"
            onClick={() => setTab('overrides')}
            className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors ${
              tab === 'overrides'
                ? 'border-sage-500 text-teal-800'
                : 'border-transparent text-fg-muted hover:text-teal-800'
            }`}
          >
            <Calendar className="h-4 w-4" /> Override per Tanggal
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {tab === 'overrides' ? (
            <AvailabilityOverridesSection />
          ) : settingsQuery.isLoading ? (
            <div className="caption text-fg-muted py-6">Memuat slot operasional…</div>
          ) : slots.length === 0 ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800">
              Klinik belum mengatur slot operasional. Hubungi admin untuk set di Pengaturan →
              Slot Operasional sebelum kamu bisa atur jadwal.
            </div>
          ) : (
            <>
            {/* Mobile weekly editor — day pills + slot checklist (prototype 04) */}
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
            </>
          )}

          <p className="caption mt-3 text-fg-muted">
            💡 Hari tanpa slot tercentang = libur (admin tidak bisa booking). Centang
            <em> Buka</em> di kolom kanan untuk reset hari ke "semua slot tersedia".
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
            Batal
          </button>
          <button
            type="button"
            onClick={save}
            disabled={updateMut.isPending || slots.length === 0}
            className="btn btn-primary btn-sm disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {updateMut.isPending ? 'Menyimpan…' : 'Simpan Jadwal'}
          </button>
        </div>
      </div>
    </div>
  );
}
