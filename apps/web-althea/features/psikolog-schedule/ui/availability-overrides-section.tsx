'use client';

/**
 * Section: Override per-tanggal di AvailabilityDialog.
 *
 * Konsep: psikolog set jadwal per-tanggal spesifik yang OVERRIDE
 * weeklyAvailability untuk tanggal tsb.
 *
 * Use case:
 *  - Cuti/leave (isOpen=false di tanggal yang biasanya kerja)
 *  - Makeup session (isOpen=true di tanggal yang biasanya libur)
 *  - Reduced availability (slotIndices subset)
 *
 * Backend: PRIORITAS override > weekly. Lihat assertPsikologAvailable.
 */
import { useMemo, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import {
  useDeleteMyDateOverride,
  useMyDateOverrides,
  useUpsertMyDateOverride,
} from '@/features/admin-psikolog/hooks/use-psikolog';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';

function todayDateStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function AvailabilityOverridesSection() {
  const settingsQuery = useSettings();
  const slots = settingsQuery.data?.data.slotsOfDay ?? [];
  const overrides = useMyDateOverrides();
  const upsertMut = useUpsertMyDateOverride();
  const deleteMut = useDeleteMyDateOverride();

  // Form state untuk add/edit
  const [formDate, setFormDate] = useState<string>(todayDateStr());
  const [formIsOpen, setFormIsOpen] = useState<boolean>(true);
  const [formSlots, setFormSlots] = useState<Set<number>>(new Set());
  const [formReason, setFormReason] = useState<string>('');
  const [allSlots, setAllSlots] = useState<boolean>(true); // true = pakai semua slot (slotIndices null)

  function resetForm() {
    setFormDate(todayDateStr());
    setFormIsOpen(true);
    setFormSlots(new Set());
    setFormReason('');
    setAllSlots(true);
  }

  function toggleFormSlot(idx: number) {
    setFormSlots((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  function loadExisting(o: { date: string; isOpen: boolean; slotIndices: number[] | null; reason: string | null }) {
    setFormDate(o.date.slice(0, 10));
    setFormIsOpen(o.isOpen);
    if (o.slotIndices && Array.isArray(o.slotIndices)) {
      setAllSlots(false);
      setFormSlots(new Set(o.slotIndices));
    } else {
      setAllSlots(true);
      setFormSlots(new Set());
    }
    setFormReason(o.reason ?? '');
  }

  function save() {
    upsertMut.mutate(
      {
        date: formDate,
        isOpen: formIsOpen,
        slotIndices:
          formIsOpen && !allSlots
            ? Array.from(formSlots).sort((a, b) => a - b)
            : null,
        reason: formReason.trim() || null,
      },
      { onSuccess: resetForm },
    );
  }

  function handleDelete(date: string) {
    if (!confirm(`Hapus override tanggal ${formatDateLabel(date)}? Akan kembali ke jadwal mingguan.`)) return;
    deleteMut.mutate(date.slice(0, 10));
  }

  const items = overrides.data?.data ?? [];
  // Sort: future first, past after
  const sorted = useMemo(() => {
    const today = todayDateStr();
    return [...items].sort((a, b) => {
      const aF = a.date.slice(0, 10) >= today;
      const bF = b.date.slice(0, 10) >= today;
      if (aF !== bF) return aF ? -1 : 1;
      return a.date.localeCompare(b.date);
    });
  }, [items]);

  if (settingsQuery.isLoading) {
    return <div className="caption text-fg-muted py-6">Memuat slot operasional…</div>;
  }
  if (slots.length === 0) {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800">
        Klinik belum mengatur slot operasional. Override per-tanggal tidak bisa di-set sampai
        admin set slot di Pengaturan → Slot Operasional.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Form add/edit */}
      <div className="rounded-md border border-border bg-cream-50 p-4">
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="text-[13px] font-semibold text-teal-800 uppercase tracking-wider">
            Tambah / Edit Override
          </h3>
          <span className="caption">Override jadwal mingguan untuk 1 tanggal spesifik</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="caption mb-1 block">Tanggal</label>
            <input
              type="date"
              value={formDate}
              min={todayDateStr()}
              onChange={(e) => setFormDate(e.target.value)}
              className="input-althea h-9 py-0 text-[13px]"
            />
          </div>
          <div>
            <label className="caption mb-1 block">Tipe</label>
            <div className="inline-flex gap-1 bg-card rounded-md p-[3px] border border-border">
              <button
                type="button"
                onClick={() => setFormIsOpen(true)}
                className={`px-3 h-7 rounded text-[12px] font-medium transition-colors ${
                  formIsOpen ? 'bg-sage-500 text-white' : 'text-fg-muted hover:text-teal-800'
                }`}
              >
                Buka
              </button>
              <button
                type="button"
                onClick={() => setFormIsOpen(false)}
                className={`px-3 h-7 rounded text-[12px] font-medium transition-colors ${
                  !formIsOpen ? 'bg-amber-500 text-white' : 'text-fg-muted hover:text-teal-800'
                }`}
              >
                Tutup (cuti)
              </button>
            </div>
          </div>
        </div>

        {formIsOpen && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <label className="caption">Slot tersedia</label>
              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={allSlots}
                  onChange={(e) => setAllSlots(e.target.checked)}
                  className="h-3.5 w-3.5"
                />
                <span className={allSlots ? 'text-teal-800 font-medium' : 'text-fg-muted'}>
                  Pakai semua slot
                </span>
              </label>
            </div>
            {allSlots ? (
              <p className="caption italic text-fg-muted">
                Semua {slots.length} slot di tanggal ini akan tersedia.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot, i) => {
                  const active = formSlots.has(i);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleFormSlot(i)}
                      className={`px-2 py-1.5 rounded border text-[12px] font-medium text-left transition-colors ${
                        active
                          ? 'bg-sage-50 border-sage-500 text-teal-800'
                          : 'bg-card border-border text-fg hover:border-sage-300'
                      }`}
                    >
                      <div className="font-mono">
                        {slot.start} – {slot.end}
                      </div>
                      {slot.label && <div className="caption text-[10px]">{slot.label}</div>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="mb-3">
          <label className="caption mb-1 block">Catatan (opsional)</label>
          <input
            type="text"
            value={formReason}
            onChange={(e) => setFormReason(e.target.value)}
            placeholder={formIsOpen ? 'Mis. makeup session, tambah jadwal Sabtu' : 'Mis. cuti tahunan, sakit, training'}
            className="input-althea h-9 py-0 text-[13px]"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={resetForm}
            className="btn btn-ghost btn-sm"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={save}
            disabled={upsertMut.isPending || !formDate || (formIsOpen && !allSlots && formSlots.size === 0)}
            className="btn btn-primary btn-sm disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />{' '}
            {upsertMut.isPending ? 'Menyimpan…' : 'Simpan Override'}
          </button>
        </div>
      </div>

      {/* List existing overrides */}
      <div>
        <h3 className="text-[13px] font-semibold text-teal-800 uppercase tracking-wider mb-2">
          Override Tersimpan ({sorted.length})
        </h3>
        {overrides.isLoading ? (
          <div className="caption text-fg-muted py-4">Memuat override…</div>
        ) : sorted.length === 0 ? (
          <p className="caption italic text-fg-muted py-4">
            Belum ada override. Tambah lewat form di atas — mis. cuti hari Senin depan, atau
            buka makeup di Sabtu.
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {sorted.map((o) => {
              const dateOnly = o.date.slice(0, 10);
              const isPast = dateOnly < todayDateStr();
              const slotsLabel = o.slotIndices
                ? `${o.slotIndices.length}/${slots.length} slot`
                : 'semua slot';
              return (
                <div
                  key={o.id}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md border ${
                    isPast
                      ? 'bg-cream-50 border-border opacity-70'
                      : 'bg-card border-border'
                  }`}
                >
                  <div
                    className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
                    style={
                      o.isOpen
                        ? { background: '#dde9d8', color: '#3a5b3f' }
                        : { background: '#f7d9b7', color: '#8a4a00' }
                    }
                  >
                    {o.isOpen ? 'Buka' : 'Tutup'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-teal-800 truncate">
                      {formatDateLabel(o.date)}
                    </div>
                    <div className="caption truncate">
                      {o.isOpen ? slotsLabel : 'libur'}
                      {o.reason ? ` · ${o.reason}` : ''}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => loadExisting(o)}
                    className="btn btn-ghost btn-sm text-[11px]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(o.date)}
                    className="btn btn-ghost btn-icon btn-sm text-danger"
                    aria-label="Hapus override"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="caption text-fg-muted">
        💡 <strong>Cara kerja:</strong> Saat admin booking kamu di tanggal yang punya override,
        sistem ikut override (bukan jadwal mingguan). Hapus override → kembali ke jadwal mingguan.
      </p>
    </div>
  );
}
