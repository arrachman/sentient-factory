'use client';

import { Loader2 } from 'lucide-react';

export function DoneStep({
  devicePhone,
  connected,
  onActivate,
  activating,
}: {
  devicePhone: string | null;
  connected: boolean;
  onActivate: () => void;
  activating: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div
        style={{
          padding: '14px 16px',
          background: 'var(--success-soft, #e8f1ea)',
          border: '1px solid #c8e0ce',
          borderRadius: 10,
          color: 'var(--success, #4f8c5b)',
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        ✓ Device {devicePhone ?? '—'} berhasil terhubung ke Fonnte.
      </div>

      <p
        style={{ fontSize: 12.5, color: 'var(--teal-700)', lineHeight: 1.6 }}
      >
        Klik <strong>Aktifkan</strong> untuk menjadikan device ini sebagai pengirim WA
        di Althea. Device lama (jika ada) otomatis dihapus dari akun Fonnte.
      </p>

      {!connected && (
        <div
          style={{
            padding: 10,
            border: '1px dashed var(--sage-200)',
            borderRadius: 8,
            fontSize: 11.5,
            color: 'var(--teal-500)',
          }}
        >
          Catatan: status belum confirm `connect` — kalau setelah aktivasi WA gagal kirim,
          coba scan ulang QR.
        </div>
      )}

      <div className="flex items-center justify-end gap-2" style={{ marginTop: 6 }}>
        <button
          type="button"
          onClick={onActivate}
          disabled={activating}
          className="btn btn-primary btn-sm"
        >
          {activating && <Loader2 size={14} className="animate-spin" />}
          {activating ? 'Mengaktifkan...' : 'Aktifkan device ini'}
        </button>
      </div>
    </div>
  );
}
