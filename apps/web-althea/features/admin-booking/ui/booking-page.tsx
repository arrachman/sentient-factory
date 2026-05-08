'use client';

import { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Play,
  UserCheck,
  X,
} from 'lucide-react';
import {
  useBookingList,
  useCancelBooking,
  useCheckInBooking,
  useCompleteBooking,
  useConfirmBooking,
  useStartBooking,
} from '../hooks/use-booking';
import {
  BOOKING_STATUSES,
  STATUS_BADGE_CLASS,
  STATUS_LABEL,
  type Booking,
  type BookingStatus,
} from '../model/types';

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('id-ID', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function nextActions(status: BookingStatus): BookingStatus[] {
  const map: Record<BookingStatus, BookingStatus[]> = {
    awaiting_dp: ['confirmed', 'cancelled'],
    confirmed: ['checked_in', 'cancelled'],
    checked_in: ['in_progress', 'cancelled'],
    in_progress: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
  };
  return map[status] || [];
}

export function BookingPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  const list = useBookingList({
    status: statusFilter || undefined,
    date: dateFilter || undefined,
    limit: 100,
    includeCancelled: !statusFilter,
  });

  const confirmMut = useConfirmBooking();
  const checkInMut = useCheckInBooking();
  const startMut = useStartBooking();
  const completeMut = useCompleteBooking();
  const cancelMut = useCancelBooking();

  function handleAction(id: number, action: BookingStatus) {
    if (action === 'cancelled') {
      const reason = prompt('Alasan cancel (opsional):') || undefined;
      cancelMut.mutate({ id, reason });
      return;
    }
    if (action === 'confirmed') confirmMut.mutate(id);
    else if (action === 'checked_in') checkInMut.mutate(id);
    else if (action === 'in_progress') startMut.mutate(id);
    else if (action === 'completed') completeMut.mutate(id);
  }

  const items = list.data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h1">Booking</h1>
        <p className="caption mt-1">
          Daftar booking sesi. State machine: awaiting_dp → confirmed → checked_in →
          in_progress → completed.
        </p>
        <p className="caption mt-1 text-fg-muted">
          ⚠️ Booking wizard 4-step belum di-implement di session ini. Untuk create
          booking, pakai API langsung via Swagger atau curl.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-althea max-w-[200px]">
          <option value="">Semua status</option>
          {BOOKING_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="input-althea max-w-[180px]" />
        <button type="button" onClick={() => { setStatusFilter(''); setDateFilter(''); }} className="btn btn-ghost">
          Reset filter
        </button>
      </div>

      <div className="card-althea overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 border-b border-border text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Jadwal</th>
              <th className="px-4 py-2 font-medium">Klien</th>
              <th className="px-4 py-2 font-medium">Layanan</th>
              <th className="px-4 py-2 font-medium">Psikolog</th>
              <th className="px-4 py-2 font-medium">Ruang</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b: Booking) => (
              <tr key={b.id} className="border-b border-border last:border-b-0 hover:bg-cream-50">
                <td className="px-4 py-2">
                  <div className="font-medium">{formatDateTime(b.scheduledStart)}</div>
                  <div className="caption">→ {formatDateTime(b.scheduledEnd).split(' ').slice(-2).join(' ')}</div>
                  {b.sessionTotal > 1 && (
                    <div className="caption text-fg-muted">Sesi {b.sessionN}/{b.sessionTotal}</div>
                  )}
                </td>
                <td className="px-4 py-2">
                  <div className="font-medium">{b.client.name}</div>
                  <div className="caption font-mono">{b.client.phoneWa}</div>
                </td>
                <td className="px-4 py-2">
                  <div>{b.service.name}</div>
                  <div className="caption">{b.service.category}</div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="avatar avatar-sm"
                      style={
                        b.psikolog.clinicPsikologProfile?.color
                          ? { backgroundColor: b.psikolog.clinicPsikologProfile.color, color: '#fff' }
                          : undefined
                      }
                    >
                      {(b.psikolog.fullName || b.psikolog.email).slice(0, 2).toUpperCase()}
                    </span>
                    <span>{b.psikolog.fullName || b.psikolog.email}</span>
                  </div>
                </td>
                <td className="px-4 py-2">{b.room.name}</td>
                <td className="px-4 py-2">
                  <span className={`badge ${STATUS_BADGE_CLASS[b.status]}`}>
                    {STATUS_LABEL[b.status]}
                  </span>
                  {b.createdViaWalkIn && <div className="caption mt-1">walk-in</div>}
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-1">
                    {nextActions(b.status).map((act) => {
                      const icon = act === 'confirmed' ? <Check className="h-3.5 w-3.5" />
                        : act === 'checked_in' ? <UserCheck className="h-3.5 w-3.5" />
                        : act === 'in_progress' ? <Play className="h-3.5 w-3.5" />
                        : act === 'completed' ? <CheckCircle2 className="h-3.5 w-3.5" />
                        : <X className="h-3.5 w-3.5" />;
                      return (
                        <button
                          key={act}
                          type="button"
                          onClick={() => handleAction(b.id, act)}
                          className={`btn btn-sm ${act === 'cancelled' ? 'btn-ghost text-danger' : 'btn-outline'}`}
                          title={STATUS_LABEL[act]}
                        >
                          {icon}
                          <span className="ml-1">{STATUS_LABEL[act]}</span>
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && !list.isLoading && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-fg-muted">Belum ada booking.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="caption text-right">
        Total: {list.data?.meta?.total ?? 0} booking
      </div>
    </div>
  );
}
