'use client';

import { Loader2 } from 'lucide-react';

export function FormStep({
  name,
  phone,
  activeDevice,
  onChangeName,
  onChangePhone,
  onSubmit,
  submitting,
  onCancel,
}: {
  name: string;
  phone: string;
  activeDevice: { name?: string; device?: string } | null;
  onChangeName: (v: string) => void;
  onChangePhone: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  onCancel: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      {activeDevice && (
        <div
          style={{
            padding: '10px 14px',
            background: 'var(--cream-100, #f3f0e8)',
            border: '1px solid var(--sage-200)',
            borderRadius: 8,
            fontSize: 12,
            color: 'var(--teal-700)',
            lineHeight: 1.5,
          }}
        >
          <strong>Device aktif sekarang:</strong> {activeDevice.name ?? '—'} ·{' '}
          {activeDevice.device ?? '—'}
          <div style={{ marginTop: 4, fontSize: 11, color: 'var(--teal-500)' }}>
            Paket Fonnte Free hanya boleh 1 device terhubung. Pairing device baru akan
            men-disconnect dan menghapus device lama dari akun Fonnte secara otomatis.
          </div>
        </div>
      )}

      <label className="flex flex-col gap-1">
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal-700)' }}>
          Nama device
        </span>
        <input
          required
          maxLength={60}
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="Mis. Althea Klinik"
          className="input-althea"
          style={{ padding: '8px 12px', fontSize: 13 }}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal-700)' }}>
          Nomor WhatsApp
        </span>
        <input
          required
          maxLength={20}
          value={phone}
          onChange={(e) => onChangePhone(e.target.value)}
          placeholder="Mis. 6282211008899"
          className="input-althea"
          style={{ padding: '8px 12px', fontSize: 13 }}
        />
        <span style={{ fontSize: 11, color: 'var(--teal-500)' }}>
          Format bebas (62xxx / +62xxx / 08xxx) — sebaiknya pakai 62xxx.
        </span>
      </label>

      <div className="flex items-center justify-end gap-2" style={{ marginTop: 8 }}>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost btn-sm"
          disabled={submitting}
        >
          Batal
        </button>
        <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
          {submitting && <Loader2 size={14} className="animate-spin" />}
          {submitting ? 'Membuat device...' : 'Lanjut → Scan QR'}
        </button>
      </div>
    </form>
  );
}
