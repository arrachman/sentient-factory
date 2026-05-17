'use client';

/**
 * Form edit booking terpadu. Satu surface UX, tapi setiap perubahan
 * dispatch ke endpoint backend yang sudah tervalidasi:
 *  - jadwal / ruang / psikolog → POST /booking/:id/reschedule (cek konflik + WA + history)
 *  - status                    → start / complete / cancel (state machine + WA + audit)
 *  - catatan                   → PATCH /booking/:id (notes only)
 *
 * Layanan & klien TIDAK bisa diubah di sini (efek berantai durasi/harga/paket) —
 * pakai Batal lalu buat booking baru.
 */
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import {
  useCancelBooking,
  useCompleteBooking,
  useRescheduleBooking,
  useStartBooking,
  useUpdateBooking,
} from '../hooks/use-booking';
import { usePsikologList } from '@/features/admin-psikolog/hooks/use-psikolog';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import { STATUS_BADGE_CLASS, STATUS_LABEL, type Booking } from '../model/types';

function pad(n: number) {
  return String(n).padStart(2, '0');
}
function isoToLocal(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function localToIso(local: string): string {
  return new Date(local).toISOString();
}

export function EditBookingDialog({
  booking,
  onClose,
}: {
  booking: Booking | null;
  onClose: () => void;
}) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [psikologUserId, setPsikologUserId] = useState<number | null>(null);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const roomList = useRoomList({ limit: 200, isActive: true });
  const reschedule = useRescheduleBooking();
  const updateNotes = useUpdateBooking();
  const startMut = useStartBooking();
  const completeMut = useCompleteBooking();
  const cancelMut = useCancelBooking();

  useEffect(() => {
    if (booking) {
      setStart(isoToLocal(booking.scheduledStart));
      setEnd(isoToLocal(booking.scheduledEnd));
      setPsikologUserId(booking.psikologUserId);
      setRoomId(booking.roomId);
      setReason('');
      setNotes(booking.notes ?? '');
    }
  }, [booking]);

  if (!booking) return null;

  const status = booking.status;
  // Backend: reschedule ditolak kalau in_progress/completed/cancelled.
  const canReschedule = status === 'checked_in';
  // Backend: PATCH notes ditolak kalau completed/cancelled.
  const canEditNotes = status !== 'completed' && status !== 'cancelled';
  const busy =
    reschedule.isPending ||
    updateNotes.isPending ||
    startMut.isPending ||
    completeMut.isPending ||
    cancelMut.isPending;

  const scheduleChanged =
    canReschedule &&
    !!start &&
    !!end &&
    (localToIso(start) !== new Date(booking.scheduledStart).toISOString() ||
      localToIso(end) !== new Date(booking.scheduledEnd).toISOString() ||
      psikologUserId !== booking.psikologUserId ||
      roomId !== booking.roomId);
  const notesChanged = canEditNotes && notes.trim() !== (booking.notes ?? '').trim();
  const dirty = scheduleChanged || notesChanged;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!booking || !dirty) return;
    try {
      if (scheduleChanged) {
        await reschedule.mutateAsync({
          id: booking.id,
          input: {
            scheduledStart: localToIso(start),
            scheduledEnd: localToIso(end),
            psikologUserId: psikologUserId ?? undefined,
            roomId: roomId ?? undefined,
            reason: reason.trim() || undefined,
          },
        });
      }
      if (notesChanged) {
        await updateNotes.mutateAsync({ id: booking.id, input: { notes: notes.trim() } });
      }
      onClose();
    } catch {
      // error toast sudah ditangani di masing-masing hook
    }
  }

  function doStart() {
    if (booking) startMut.mutate(booking.id, { onSuccess: onClose });
  }
  function doComplete() {
    if (booking) completeMut.mutate(booking.id, { onSuccess: onClose });
  }
  function doCancel() {
    if (!booking) return;
    const r = window.prompt('Alasan pembatalan (opsional):') ?? '';
    cancelMut.mutate({ id: booking.id, reason: r.trim() || undefined }, { onSuccess: onClose });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card-althea w-full max-w-xl max-h-[90vh] overflow-y-auto bg-card">
        <div className="flex items-start justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="h2">Edit Booking #{booking.id}</h2>
            <div className="mt-1 flex items-center gap-2">
              <span className={`badge ${STATUS_BADGE_CLASS[status]}`}>{STATUS_LABEL[status]}</span>
              <span className="caption">
                {booking.client.name} — {booking.service.name}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-icon btn-sm"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={save} className="space-y-3 px-6 py-4">
          {!canReschedule && (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
              Jadwal, ruang & psikolog hanya bisa diubah saat status{' '}
              <strong>Check-in</strong>. Booking ini <strong>{STATUS_LABEL[status]}</strong>.
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="caption mb-1 block">Mulai</label>
              <input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                disabled={!canReschedule}
                className="input-althea disabled:opacity-60"
              />
            </div>
            <div>
              <label className="caption mb-1 block">Selesai</label>
              <input
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                disabled={!canReschedule}
                className="input-althea disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="caption mb-1 block">Psikolog</label>
            <select
              value={psikologUserId ?? ''}
              onChange={(e) => setPsikologUserId(e.target.value ? Number(e.target.value) : null)}
              disabled={!canReschedule}
              className="input-althea disabled:opacity-60"
            >
              {(psikologList.data?.data ?? []).map((p) => (
                <option key={p.userId} value={p.userId}>
                  {p.fullName ?? p.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="caption mb-1 block">Ruang</label>
            <select
              value={roomId ?? ''}
              onChange={(e) => setRoomId(e.target.value ? Number(e.target.value) : null)}
              disabled={!canReschedule}
              className="input-althea disabled:opacity-60"
            >
              {(roomList.data?.data ?? []).map((r) => (
                <option key={r.id} value={r.id}>
                  [{r.type}] {r.name}
                </option>
              ))}
            </select>
          </div>

          {canReschedule && scheduleChanged && (
            <div>
              <label className="caption mb-1 block">Alasan perubahan jadwal (opsional)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                className="input-althea h-auto py-2"
              />
            </div>
          )}

          <div>
            <label className="caption mb-1 block">Catatan booking</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={!canEditNotes}
              rows={3}
              className="input-althea h-auto py-2 disabled:opacity-60"
              placeholder={canEditNotes ? 'Catatan internal booking…' : 'Tidak bisa diubah'}
            />
          </div>

          {/* Status actions — sesuai state machine backend */}
          {(status === 'checked_in' || status === 'in_progress') && (
            <div className="flex flex-wrap gap-2 border-t border-border pt-3">
              <span className="caption self-center mr-1">Ubah status:</span>
              {status === 'checked_in' && (
                <button
                  type="button"
                  onClick={doStart}
                  disabled={busy}
                  className="btn btn-outline btn-sm"
                >
                  Mulai sesi
                </button>
              )}
              {status === 'in_progress' && (
                <button
                  type="button"
                  onClick={doComplete}
                  disabled={busy}
                  className="btn btn-outline btn-sm"
                >
                  Tandai selesai
                </button>
              )}
              <button
                type="button"
                onClick={doCancel}
                disabled={busy}
                className="btn btn-outline btn-sm text-danger"
              >
                Batalkan
              </button>
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
              Tutup
            </button>
            <button
              type="submit"
              disabled={busy || !dirty}
              className="btn btn-primary btn-sm"
            >
              {busy ? 'Menyimpan…' : 'Simpan perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
