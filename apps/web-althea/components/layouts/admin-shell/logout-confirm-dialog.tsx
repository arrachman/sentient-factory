'use client';

import { LogOut } from 'lucide-react';

/**
 * Modal konfirmasi logout — sebut nama user + role, peringatkan data
 * yang belum disimpan. Tombol "Ya, keluar" pakai warna danger.
 */
export function LogoutConfirmDialog({
  userName,
  userRole,
  loggingOut,
  onCancel,
  onConfirm,
}: {
  userName: string;
  userRole: string;
  loggingOut: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-confirm-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loggingOut) onCancel();
      }}
    >
      <div
        className="card-althea bg-card"
        style={{ width: '100%', maxWidth: 420 }}
      >
        <div
          className="flex items-start gap-3"
          style={{ padding: '20px 22px 4px' }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              background: 'var(--cream-100)',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            <LogOut size={18} style={{ color: 'var(--teal-800)' }} />
          </div>
          <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
            <h2
              id="logout-confirm-title"
              className="h2"
              style={{ margin: 0, fontSize: 17 }}
            >
              Keluar dari akun?
            </h2>
            <p className="caption" style={{ marginTop: 6, lineHeight: 1.5 }}>
              Anda akan keluar dari sesi <strong>{userName}</strong> ({userRole}).
              Data yang belum disimpan bisa hilang.
            </p>
          </div>
        </div>
        <div
          className="flex items-center justify-end gap-2"
          style={{ padding: '14px 22px 18px' }}
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={loggingOut}
            className="btn btn-outline btn-sm"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loggingOut}
            className="btn btn-primary btn-sm"
            style={{
              background: loggingOut ? undefined : 'var(--danger, #b54141)',
              borderColor: loggingOut ? undefined : 'var(--danger, #b54141)',
            }}
          >
            <LogOut size={14} style={{ stroke: '#fff' }} />
            {loggingOut ? 'Keluar...' : 'Ya, keluar'}
          </button>
        </div>
      </div>
    </div>
  );
}
