'use client';

import { X } from 'lucide-react';
import { AvailabilityOverridesSection } from './availability-overrides-section';

export function AvailabilityDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
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
            <h2 className="h2">Cuti &amp; Override Jadwal</h2>
            <p className="caption mt-1">
              Override jadwal untuk tanggal spesifik — cuti, jadwal khusus, atau makeup sesi.
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
          <AvailabilityOverridesSection />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-border px-6 py-4">
          <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
