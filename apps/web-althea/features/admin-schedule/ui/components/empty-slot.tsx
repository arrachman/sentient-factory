'use client';

/**
 * Sel grid tanpa booking. Tampilkan ketersediaan jadwal psikolog:
 *   - available → kartu putih + hint sage, label "+ slot", klik = mulai booking
 *   - libur     → abu netral, label "Libur" (luar jadwal mingguan / cuti)
 *   - past      → samar, tidak interaktif
 *   - undefined → kosong polos (fallback, mis. data availability belum siap)
 */
import type { SlotCellTone } from '@/features/psikolog-schedule/model/availability';

export function EmptySlot({
  tone,
  reason,
  onClick,
}: {
  tone?: SlotCellTone;
  reason?: string | null;
  onClick?: () => void;
}) {
  if (tone === 'available') {
    return (
      <button
        type="button"
        onClick={onClick}
        title="Slot tersedia — klik untuk buat booking"
        style={{
          height: '100%',
          width: '100%',
          minHeight: 36,
          borderRadius: 8,
          background: '#fafdf7',
          border: '1px dashed #c5d8c8',
          color: '#5b8a66',
          fontSize: 11.5,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        + slot
      </button>
    );
  }

  if (tone === 'libur') {
    return (
      <div
        title={reason ? `Libur: ${reason}` : 'Libur (luar jadwal mingguan / cuti)'}
        style={{
          height: '100%',
          width: '100%',
          minHeight: 36,
          borderRadius: 8,
          background: '#eeece6',
          border: '1px solid #d8d4c8',
          color: '#9a9588',
          fontSize: 11,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Libur
      </div>
    );
  }

  if (tone === 'past') {
    return (
      <div
        aria-hidden
        style={{
          height: '100%',
          width: '100%',
          borderRadius: 8,
          background: 'rgba(0,0,0,0.015)',
          border: '1px dashed rgba(0,0,0,0.06)',
        }}
      />
    );
  }

  return (
    <div
      style={{ height: '100%', width: '100%', borderRadius: 8 }}
      aria-hidden
    />
  );
}
