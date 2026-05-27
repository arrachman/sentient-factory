'use client';

import { Loader2, RefreshCw } from 'lucide-react';

// Polling interval shared constant (ms)
export const STATUS_POLL_INTERVAL_MS = 4_000;

export function ScanStep({
  qrUrl,
  devicePhone,
  loading,
  onBack,
  onRefreshQr,
  refreshing,
}: {
  qrUrl: string | null;
  devicePhone: string | null;
  loading: boolean;
  onBack: () => void;
  onRefreshQr: () => void;
  refreshing: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <ol
        style={{
          paddingLeft: 18,
          fontSize: 12.5,
          color: 'var(--teal-700)',
          lineHeight: 1.6,
        }}
      >
        <li>
          Buka WhatsApp di HP nomor <strong>{devicePhone ?? '—'}</strong>.
        </li>
        <li>
          Menu (titik tiga) → <strong>Linked devices</strong> →{' '}
          <strong>Link a device</strong>.
        </li>
        <li>Arahkan kamera HP ke QR di bawah ini.</li>
      </ol>

      <div
        style={{
          padding: 16,
          border: '1px solid var(--sage-200)',
          borderRadius: 12,
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 280,
        }}
      >
        {loading || !qrUrl ? (
          <div className="flex flex-col items-center gap-2" style={{ color: 'var(--teal-500)' }}>
            <Loader2 className="animate-spin" size={28} />
            <span style={{ fontSize: 12 }}>Memuat QR Fonnte...</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qrUrl}
            alt="QR Fonnte"
            style={{ width: 240, height: 240, objectFit: 'contain' }}
          />
        )}
      </div>

      <div
        className="flex items-center gap-2"
        style={{ fontSize: 11.5, color: 'var(--teal-500)' }}
      >
        <RefreshCw size={11} className="animate-spin" />
        Auto-cek status koneksi setiap {Math.round(STATUS_POLL_INTERVAL_MS / 1000)} detik. Setelah
        scan berhasil, halaman akan lanjut ke step Aktifkan.
      </div>

      <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
        <button type="button" onClick={onBack} className="btn btn-ghost btn-sm">
          ← Kembali
        </button>
        <button
          type="button"
          onClick={onRefreshQr}
          disabled={refreshing}
          className="btn btn-ghost btn-sm"
          style={{ fontSize: 11.5 }}
        >
          <RefreshCw size={12} className={refreshing ? 'animate-spin' : undefined} />
          {refreshing ? 'Memuat ulang...' : 'Muat ulang QR'}
        </button>
      </div>
    </div>
  );
}
