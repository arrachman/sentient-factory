'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { ClinicSettings } from '@/features/admin-pengaturan/api/settings.api';

export type Override = {
  id: number;
  date: string;
  isOpen: boolean;
  slotIndices: number[] | null;
  reason: string | null;
};

function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function CellEditPopover({
  dateKey,
  existing,
  slots,
  defaultReason,
  presetMode,
  onClose,
  onSave,
  onDelete,
}: {
  dateKey: string;
  existing: Override | null;
  slots: ClinicSettings['slotsOfDay'];
  defaultReason: string;
  presetMode: 'buka' | null;
  onClose: () => void;
  onSave: (input: {
    date: string;
    isOpen: boolean;
    slotIndices: number[] | null;
    reason: string | null;
  }) => void;
  onDelete: (date: string) => void;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(existing ? existing.isOpen : true);
  const [slotSet, setSlotSet] = useState<Set<number>>(() => {
    if (existing) {
      return existing.slotIndices
        ? new Set(existing.slotIndices)
        : new Set(slots.map((_, i) => i));
    }
    if (presetMode === 'buka') return new Set();
    return new Set(slots.map((_, i) => i));
  });
  const [reason, setReason] = useState<string>(existing?.reason ?? defaultReason);

  const allChecked = slotSet.size === slots.length;
  const noneChecked = slotSet.size === 0;

  function toggleSlot(idx: number) {
    setSlotSet((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  function save() {
    onSave({
      date: dateKey,
      isOpen,
      slotIndices: isOpen && !allChecked ? Array.from(slotSet).sort((a, b) => a - b) : null,
      reason: reason.trim() || null,
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="card-althea w-full max-w-md bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div>
            <h3 className="text-[15px] font-semibold text-teal-800 font-serif">
              {formatDateLong(dateKey)}
            </h3>
            <p className="caption mt-0.5">
              {existing ? 'Edit override yang sudah ada' : 'Buat override baru untuk tanggal ini'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-icon" aria-label="Tutup">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          <div>
            <label className="caption mb-1 block">Tipe</label>
            <div className="inline-flex gap-1 bg-cream-50 rounded-md p-[3px] border border-border">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={`px-3 h-7 rounded text-[12px] font-medium transition-colors ${isOpen ? 'bg-sage-500 text-white' : 'text-fg-muted'}`}
              >
                Buka
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`px-3 h-7 rounded text-[12px] font-medium transition-colors ${!isOpen ? 'bg-amber-500 text-white' : 'text-fg-muted'}`}
              >
                Tutup (cuti)
              </button>
            </div>
          </div>

          {isOpen && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="caption">
                  Slot tersedia ·{' '}
                  <span className={`font-semibold ${noneChecked ? 'text-amber-700' : 'text-teal-800'}`}>
                    {slotSet.size}/{slots.length}
                  </span>{' '}
                  dipilih
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSlotSet(new Set(slots.map((_, i) => i)))}
                    disabled={allChecked}
                    className="text-[11px] font-medium text-sage-700 hover:underline disabled:text-fg-muted disabled:no-underline"
                  >
                    Centang semua
                  </button>
                  <span className="text-fg-muted text-[11px]">·</span>
                  <button
                    type="button"
                    onClick={() => setSlotSet(new Set())}
                    disabled={noneChecked}
                    className="text-[11px] font-medium text-sage-700 hover:underline disabled:text-fg-muted disabled:no-underline"
                  >
                    Bersihkan
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {slots.map((slot, i) => {
                  const active = slotSet.has(i);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleSlot(i)}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded border text-[11.5px] font-medium text-left transition-colors ${
                        active
                          ? 'bg-sage-50 border-sage-500 text-teal-800'
                          : 'bg-card border-border text-fg-muted hover:border-sage-300'
                      }`}
                    >
                      <span
                        style={{
                          width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                          border: `1.5px solid ${active ? '#5b8a66' : 'var(--border)'}`,
                          background: active ? '#5b8a66' : 'transparent',
                          color: '#fff', fontSize: 10, lineHeight: 1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        {active ? '✓' : ''}
                      </span>
                      <span className="flex flex-col min-w-0 flex-1">
                        <span className="font-mono">{slot.start} – {slot.end}</span>
                        {slot.label && <span className="caption text-[9.5px]">{slot.label}</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
              {noneChecked && (
                <p className="caption mt-1.5 text-amber-700">
                  ⚠ Belum ada slot tercentang. Centang minimal 1 slot, atau ubah Tipe ke "Tutup (cuti)".
                </p>
              )}
            </div>
          )}

          <div>
            <label className="caption mb-1 block">Catatan (opsional)</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={isOpen ? 'mis. makeup session' : 'mis. cuti tahunan'}
              className="input-althea h-9 py-0 text-[13px]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border px-5 py-3">
          {existing ? (
            <button
              type="button"
              onClick={() => {
                if (confirm('Hapus override ini? Akan kembali ke jadwal mingguan.')) {
                  onDelete(dateKey);
                }
              }}
              className="btn btn-ghost btn-sm text-danger text-[12px]"
            >
              Hapus override
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="btn btn-outline btn-sm">Batal</button>
            <button
              type="button"
              onClick={save}
              disabled={isOpen && noneChecked}
              className="btn btn-primary btn-sm disabled:opacity-50"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
