'use client';

import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';
import { useAvailabilityDraft } from '@/features/psikolog-schedule/ui/use-availability-draft';
import { AvailabilityWeeklyDesktop } from '@/features/psikolog-schedule/ui/availability-weekly-desktop';
import { AvailabilityWeeklyMobile } from '@/features/psikolog-schedule/ui/availability-weekly-mobile';
import { useUpdatePsikolog } from '../hooks/use-psikolog';
import type { DayKey, Psikolog } from '../model/types';

type Props = {
  open: boolean;
  psikolog: Psikolog | null;
  onClose: () => void;
};

export function AdminScheduleDialog({ open, psikolog, onClose }: Props) {
  const settingsQuery = useSettings();
  const updateMut = useUpdatePsikolog();
  const slots = settingsQuery.data?.data.slotsOfDay ?? [];

  const [mDay, setMDay] = useState<DayKey>('monday');

  const { draft, toggleSlot, toggleDayClosed, isSlotChecked, totalActiveSlots } =
    useAvailabilityDraft({
      open,
      initial: psikolog?.weeklyAvailability ?? null,
      slots,
    });

  function save() {
    if (!psikolog) return;
    updateMut.mutate(
      { id: psikolog.id, input: { weeklyAvailability: draft } },
      { onSuccess: () => onClose() },
    );
  }

  if (!open || !psikolog) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card-althea flex w-full max-w-3xl flex-col max-h-[92vh] overflow-y-auto bg-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="h2">Jadwal Default Psikolog</h2>
            <p className="caption mt-0.5">
              {psikolog.fullName ?? psikolog.email}
              {' '}— Total:{' '}
              <strong>{totalActiveSlots} slot/minggu</strong>
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

        {/* Body */}
        <div className="px-6 py-4">
          {settingsQuery.isLoading ? (
            <div className="caption text-fg-muted py-6">Memuat slot operasional…</div>
          ) : slots.length === 0 ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800">
              Klinik belum mengatur slot operasional. Set di{' '}
              <strong>Pengaturan → Slot Operasional</strong> terlebih dahulu.
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
            💡 Klik nama hari untuk toggle semua slot sekaligus. Hari tanpa slot aktif = libur.
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
            <Save className="h-4 w-4" />
            {updateMut.isPending ? 'Menyimpan…' : 'Simpan Jadwal'}
          </button>
        </div>
      </div>
    </div>
  );
}
