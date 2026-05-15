'use client';

import { Plus, Settings } from 'lucide-react';

/**
 * Header halaman Notifikasi WA — title + connection status pill + tombol
 * "Pengaturan WA" (disabled, link ke settings) + "Template Baru".
 */
export function WaPageHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <ConnectionStatus />
        <button type="button" className="btn btn-outline btn-sm" disabled>
          <Settings className="h-3.5 w-3.5" />
          Pengaturan WA
        </button>
        <button
          type="button"
          onClick={onCreate}
          className="btn btn-primary btn-sm"
        >
          <Plus className="h-4 w-4" />
          Template Baru
        </button>
      </div>
    </div>
  );
}

function ConnectionStatus() {
  // TODO: actual probe ke /api/clinic/wa/health (kalau ada) atau cek setting.
  // Placeholder: tampil "active" karena Fonnte/Mock provider always responds.
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
      style={{
        background: 'var(--success-soft)',
        color: 'var(--success)',
        border: '1px solid #c8e0ce',
      }}
    >
      <span
        className="block rounded-full"
        style={{
          width: 8,
          height: 8,
          background: 'var(--success)',
          boxShadow: '0 0 0 4px rgba(79,140,91,0.18)',
        }}
      />
      WA Provider Active
    </div>
  );
}
