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
import { useEffect, useState } from 'react';
import { Calendar, CalendarDays, Save, X } from 'lucide-react';
import { useUpdateMyAvailability } from '@/features/admin-psikolog/hooks/use-psikolog';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';
import { AvailabilityOverridesSection } from './availability-overrides-section';
import { useAvailabilityDraft } from './use-availability-draft';
import { AvailabilityWeeklyDesktop } from './availability-weekly-desktop';
import { AvailabilityWeeklyMobile } from './availability-weekly-mobile';
import type { AvailabilityDialogProps, TabKey } from './availability-dialog.types';
import type { DayKey } from '@/features/admin-psikolog/model/types';

export function AvailabilityDialog({ open, onClose, initial }: AvailabilityDialogProps) {
  const settingsQuery = useSettings();
  const updateMut = useUpdateMyAvailability();
  const slots = settingsQuery.data?.data.slotsOfDay ?? [];

  const [tab, setTab] = useState<TabKey>('weekly');
  const [mDay, setMDay] = useState<DayKey>('monday');

  const { draft, toggleSlot, toggleDayClosed, isSlotChecked, totalActiveSlots } =
    useAvailabilityDraft({ open, initial, slots });

  // Reset tab tiap dialog dibuka
  useEffect(() => {
    if (open) setTab('weekly');
  }, [open]);

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
              <AvailabilityWeeklyMobile
                draft={draft}
                slots={slots}
                toggleSlot={toggleSlot}
                toggleDayClosed={toggleDayClosed}
                isSlotChecked={isSlotChecked}
                mDay={mDay}
                setMDay={setMDay}
              />
              <AvailabilityWeeklyDesktop
                draft={draft}
                slots={slots}
                toggleSlot={toggleSlot}
                toggleDayClosed={toggleDayClosed}
                isSlotChecked={isSlotChecked}
              />
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
