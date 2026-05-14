'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient, ApiError } from '@/lib/api-client';
import { usePsikologList } from '@/features/admin-psikolog/hooks/use-psikolog';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import type { Booking } from '../model/types';

function pad(n: number) { return String(n).padStart(2, '0'); }
function isoToLocal(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function localToIso(local: string): string { return new Date(local).toISOString(); }

export function RescheduleDialog({
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

  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const roomList = useRoomList({ limit: 200, isActive: true });
  const qc = useQueryClient();

  useEffect(() => {
    if (booking) {
      setStart(isoToLocal(booking.scheduledStart));
      setEnd(isoToLocal(booking.scheduledEnd));
      setPsikologUserId(booking.psikologUserId);
      setRoomId(booking.roomId);
      setReason('');
    }
  }, [booking]);

  const mut = useMutation({
    mutationFn: async (payload: object) => {
      if (!booking) throw new Error('No booking selected');
      return apiClient.post(`/booking/${booking.id}/reschedule`, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clinic', 'booking'] });
      toast.success('Booking di-reschedule');
      onClose();
    },
    onError: (err: Error) => {
      if (err instanceof ApiError && err.status === 409) {
        const body = err.body as { conflictType?: string; conflictBookingId?: number };
        toast.error(`Conflict ${body?.conflictType}`, {
          description: `Bertabrakan dengan booking #${body?.conflictBookingId}.`,
        });
        return;
      }
      toast.error('Gagal reschedule', { description: err.message });
    },
  });

  if (!booking) return null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!start || !end) return;
    mut.mutate({
      scheduledStart: localToIso(start),
      scheduledEnd: localToIso(end),
      psikologUserId: psikologUserId ?? undefined,
      roomId: roomId ?? undefined,
      reason: reason.trim() || undefined,
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="card-althea w-full max-w-xl bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="h2">Reschedule Booking #{booking.id}</h2>
            <p className="caption mt-1">{booking.client.name} — {booking.service.name}</p>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-icon btn-sm" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3 px-6 py-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="caption mb-1 block">Mulai baru *</label>
              <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required className="input-althea" />
            </div>
            <div>
              <label className="caption mb-1 block">Selesai baru *</label>
              <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required className="input-althea" />
            </div>
          </div>

          <div>
            <label className="caption mb-1 block">Psikolog (opsional ganti)</label>
            <select value={psikologUserId ?? ''} onChange={(e) => setPsikologUserId(e.target.value ? Number(e.target.value) : null)} className="input-althea">
              <option value="">-- tetap pakai psikolog saat ini --</option>
              {(psikologList.data?.data ?? []).map((p) => (
                <option key={p.userId} value={p.userId}>{p.fullName ?? p.email}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="caption mb-1 block">Ruang (opsional ganti)</label>
            <select value={roomId ?? ''} onChange={(e) => setRoomId(e.target.value ? Number(e.target.value) : null)} className="input-althea">
              <option value="">-- tetap pakai ruang saat ini --</option>
              {(roomList.data?.data ?? []).map((r) => (
                <option key={r.id} value={r.id}>[{r.type}] {r.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="caption mb-1 block">Alasan reschedule (opsional)</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} className="input-althea h-auto py-2" />
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <button type="button" onClick={onClose} className="btn btn-outline btn-sm">Batal</button>
            <button type="submit" disabled={mut.isPending} className="btn btn-primary btn-sm">
              {mut.isPending ? 'Menyimpan...' : 'Reschedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
