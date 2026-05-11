'use client';

/**
 * Dialog "Pindahkan booking ke ruangan lain".
 *
 * Beda dengan tombol "Edit master ruangan" (yang ngubah metadata ruangan
 * itu sendiri), dialog ini cuma pindah **booking ini** ke ruangan lain
 * dengan slot waktu yang sama. Backend pakai endpoint reschedule dengan
 * `scheduledStart`/`scheduledEnd` lama + `roomId` baru → conflict
 * detection otomatis di service.
 *
 * UX:
 *   - Tampilkan info booking yang dipindah (read-only, biar admin yakin)
 *   - Dropdown ruangan target (exclude ruangan sekarang)
 *   - Filter default ke type yang sama, tapi admin bisa override (kadang
 *     darurat butuh ruangan tipe lain)
 *   - Tombol Pindahkan → konfirmasi → POST /booking/:id/reschedule
 */
import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import type { Booking } from '@/features/admin-booking/model/types';
import { ROOM_TYPE_LABEL, type Room } from '../model/types';

export function RoomReassignDialog({
  booking,
  currentRoom,
  rooms,
  submitting,
  onClose,
  onSubmit,
}: {
  booking: Booking;
  currentRoom: Room;
  rooms: Room[];
  submitting: boolean;
  onClose: () => void;
  onSubmit: (newRoomId: number, reason?: string) => void;
}) {
  // Default filter: cuma tampilin ruangan dengan type yang sama supaya
  // admin tidak salah pindah konseling ke ruangan tes psikologi.
  const [filterSameType, setFilterSameType] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [reason, setReason] = useState('');

  const candidates = useMemo(() => {
    return rooms
      .filter((r) => r.id !== currentRoom.id && r.isActive)
      .filter((r) => (filterSameType ? r.type === currentRoom.type : true));
  }, [rooms, currentRoom.id, currentRoom.type, filterSameType]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRoomId) return;
    onSubmit(selectedRoomId, reason.trim() || undefined);
  }

  const startTime = new Date(booking.scheduledStart).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  });
  const endTime = new Date(booking.scheduledEnd).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="card-althea flex flex-col"
        style={{ width: 'min(100%, 480px)', maxHeight: '90vh', overflow: 'hidden' }}
      >
        <div
          className="row"
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border)',
            justifyContent: 'space-between',
          }}
        >
          <h3 className="text-base font-medium" style={{ margin: 0 }}>
            Pindahkan booking ke ruangan lain
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-icon btn-ghost btn-sm"
            aria-label="Tutup"
          >
            <X size={14} />
          </button>
        </div>

        <div
          style={{
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            overflowY: 'auto',
          }}
        >
          {/* Read-only summary */}
          <div
            className="card-althea-flat"
            style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}
          >
            <span className="caption" style={{ fontSize: 11, opacity: 0.7 }}>
              Booking yang dipindah
            </span>
            <span style={{ fontSize: 13, color: 'var(--teal-800)', fontWeight: 600 }}>
              {booking.client.name} — {booking.service.name}
            </span>
            <span className="caption" style={{ fontSize: 12 }}>
              {startTime}–{endTime} · Psikolog:{' '}
              {booking.psikolog.fullName ?? booking.psikolog.email}
            </span>
            <span className="caption" style={{ fontSize: 12 }}>
              Dari: <strong>{currentRoom.name}</strong> (
              {ROOM_TYPE_LABEL[currentRoom.type]})
            </span>
          </div>

          <div>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="caption mb-1 block">Ruangan tujuan *</label>
              <label className="caption flex items-center gap-1" style={{ fontSize: 11 }}>
                <input
                  type="checkbox"
                  checked={filterSameType}
                  onChange={(e) => {
                    setFilterSameType(e.target.checked);
                    setSelectedRoomId(null);
                  }}
                  className="h-3.5 w-3.5"
                />
                Hanya tipe {ROOM_TYPE_LABEL[currentRoom.type].toLowerCase()}
              </label>
            </div>
            <select
              value={selectedRoomId ?? ''}
              onChange={(e) =>
                setSelectedRoomId(e.target.value ? Number(e.target.value) : null)
              }
              required
              className="input-althea"
            >
              <option value="" disabled>
                Pilih ruangan baru…
              </option>
              {candidates.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} · {ROOM_TYPE_LABEL[r.type]} · kap. {r.capacity}
                </option>
              ))}
            </select>
            {candidates.length === 0 ? (
              <p className="caption mt-1" style={{ fontSize: 11, color: 'var(--danger)' }}>
                Tidak ada ruangan kandidat. Uncheck filter di atas untuk lihat semua tipe.
              </p>
            ) : null}
          </div>

          <div>
            <label className="caption mb-1 block">Alasan pindah (opsional)</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              className="input-althea"
              placeholder="Mis. AC rusak, ruangan dipakai untuk darurat"
            />
            <p className="caption mt-1" style={{ fontSize: 11 }}>
              Tersimpan di history reschedule (audit trail).
            </p>
          </div>

          <p className="caption" style={{ fontSize: 11, opacity: 0.7 }}>
            Catatan: kalau ruangan tujuan sudah ada booking di jam yang sama,
            sistem otomatis tolak (conflict detection).
          </p>
        </div>

        <div
          className="row gap-2"
          style={{
            padding: '12px 18px',
            borderTop: '1px solid var(--border)',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline btn-sm"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting || !selectedRoomId}
            className="btn btn-primary btn-sm"
          >
            {submitting ? 'Memindahkan…' : 'Pindahkan'}
          </button>
        </div>
      </form>
    </div>
  );
}
