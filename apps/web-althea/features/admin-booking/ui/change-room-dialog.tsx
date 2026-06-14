'use client';

import { useMemo, useState } from 'react';
import { X, DoorOpen } from 'lucide-react';
import { useEditBooking, useBookingList } from '../hooks/use-booking';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import type { Booking } from '../model/types';

function formatDateTimeRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const dateStr = s.toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
  const startTime = s.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const endTime = e.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  return `${dateStr}, ${startTime}–${endTime}`;
}

function toLocalDateKey(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function ChangeRoomDialog({
  booking,
  onClose,
}: {
  booking: Booking | null;
  onClose: () => void;
}) {
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  useMemo(() => {
    if (booking) setSelectedRoomId(booking.roomId);
  }, [booking?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const roomList = useRoomList({ limit: 200, isActive: true });

  const date = booking ? toLocalDateKey(new Date(booking.scheduledStart)) : undefined;
  const dayBookings = useBookingList({
    date,
    limit: 100,
    includeCancelled: false,
  });

  const occupiedRoomIds = useMemo(() => {
    if (!booking || !dayBookings.data?.data) return new Set<number>();
    const bStart = new Date(booking.scheduledStart).getTime();
    const bEnd = new Date(booking.scheduledEnd).getTime();
    const occ = new Set<number>();
    for (const b of dayBookings.data.data) {
      if (b.id === booking.id) continue;
      const s = new Date(b.scheduledStart).getTime();
      const e = new Date(b.scheduledEnd).getTime();
      if (s < bEnd && e > bStart) occ.add(b.roomId);
    }
    return occ;
  }, [dayBookings.data, booking]);

  const editMut = useEditBooking();

  if (!booking) return null;

  const changed = selectedRoomId !== null && selectedRoomId !== booking.roomId;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!changed || selectedRoomId === null) return;
    editMut.mutate(
      { id: booking!.id, input: { roomId: selectedRoomId } },
      { onSuccess: onClose },
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="card-althea w-full max-w-md bg-card">
        <div className="flex items-start justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="h2 flex items-center gap-2">
              <DoorOpen className="h-4 w-4 text-sage-600" />
              Ubah Ruangan — Booking #{booking.id}
            </h2>
            <p className="caption mt-1">{booking.client.name} — {booking.service.name}</p>
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

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
          <div className="rounded-md border border-border bg-cream-50 px-3 py-2.5 text-sm">
            <div className="caption mb-0.5">Jadwal sesi</div>
            <div className="font-medium text-teal-800">
              {formatDateTimeRange(booking.scheduledStart, booking.scheduledEnd)}
            </div>
            <div className="caption mt-1">Psikolog: {booking.psikolog.fullName ?? booking.psikolog.email}</div>
          </div>

          <div>
            <label className="caption mb-1 block">Ruangan</label>
            <select
              value={selectedRoomId ?? ''}
              onChange={(e) => setSelectedRoomId(e.target.value ? Number(e.target.value) : null)}
              className="input-althea"
              disabled={roomList.isLoading}
            >
              <option value="">-- pilih ruangan --</option>
              {(roomList.data?.data ?? []).map((r) => {
                const occupied = occupiedRoomIds.has(r.id) && r.id !== booking.roomId;
                return (
                  <option key={r.id} value={r.id} disabled={occupied}>
                    {occupied ? '🔴 ' : r.id === booking.roomId ? '✓ ' : ''}
                    [{r.type}] {r.name}
                    {occupied ? ' — terpakai' : r.id === booking.roomId ? ' (saat ini)' : ''}
                  </option>
                );
              })}
            </select>
            {occupiedRoomIds.size > 0 && (
              <p className="caption mt-1 text-rose-700">
                ⚠ Ruangan 🔴 sudah terpakai di slot waktu ini.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
              Batal
            </button>
            <button
              type="submit"
              disabled={!changed || editMut.isPending}
              className="btn btn-primary btn-sm disabled:opacity-50"
            >
              {editMut.isPending ? 'Menyimpan…' : 'Simpan Ruangan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
