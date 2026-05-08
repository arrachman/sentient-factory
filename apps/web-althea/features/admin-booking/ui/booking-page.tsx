'use client';

import { useMemo, useState } from 'react';
import {
  CalendarDays,
  CalendarPlus,
  Check,
  CheckCircle2,
  Eye,
  Play,
  RotateCw,
  Search,
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
import { BookingDetailDialog } from './booking-detail-dialog';
import { BookingWizard } from './booking-wizard';
import { RescheduleDialog } from './reschedule-dialog';

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

type QuickFilter = 'all' | 'today' | 'tomorrow' | 'week' | 'past';

function dateForQuickFilter(qf: QuickFilter): string | undefined {
  const today = new Date();
  if (qf === 'today') return today.toISOString().slice(0, 10);
  if (qf === 'tomorrow') {
    const t = new Date(today);
    t.setDate(t.getDate() + 1);
    return t.toISOString().slice(0, 10);
  }
  return undefined;
}

export function BookingPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [search, setSearch] = useState('');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [rescheduling, setRescheduling] = useState<Booking | null>(null);
  const [detailing, setDetailing] = useState<Booking | null>(null);

  const effectiveDate =
    quickFilter === 'today' || quickFilter === 'tomorrow'
      ? dateForQuickFilter(quickFilter)
      : dateFilter || undefined;

  const list = useBookingList({
    status: statusFilter || undefined,
    date: effectiveDate,
    limit: 200,
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

  const filteredItems = useMemo(() => {
    const all = list.data?.data ?? [];
    const now = new Date();
    const weekFromNow = new Date(now);
    weekFromNow.setDate(now.getDate() + 7);

    return all.filter((b: Booking) => {
      if (quickFilter === 'week') {
        const start = new Date(b.scheduledStart);
        if (start < now || start > weekFromNow) return false;
      }
      if (quickFilter === 'past') {
        const start = new Date(b.scheduledStart);
        if (start >= now) return false;
      }
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const haystack = [
          b.client?.name,
          b.client?.phoneWa,
          b.service?.name,
          b.psikolog?.fullName,
          b.room?.name,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [list.data?.data, quickFilter, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="h1">Booking</h1>
          <p className="caption mt-1">
            Kelola booking sesi: konfirmasi, check-in, mulai sesi, reschedule, payment & WA reminder.
          </p>
        </div>
        <button type="button" onClick={() => setWizardOpen(true)} className="btn btn-primary">
          <CalendarPlus className="h-4 w-4" /> Booking Baru
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: 'all', label: 'Semua' },
            { id: 'today', label: 'Hari ini' },
            { id: 'tomorrow', label: 'Besok' },
            { id: 'week', label: '7 hari ke depan' },
            { id: 'past', label: 'Lewat' },
          ] as Array<{ id: QuickFilter; label: string }>
        ).map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => {
              setQuickFilter(f.id);
              if (f.id !== 'all') setDateFilter('');
            }}
            className={`btn btn-sm ${quickFilter === f.id ? 'btn-primary' : 'btn-outline'}`}
          >
            <CalendarDays className="h-3.5 w-3.5" /> {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
          <input
            type="search"
            placeholder="Cari nama klien, no HP, layanan, psikolog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-althea pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-althea max-w-[200px]"
        >
          <option value="">Semua status</option>
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dateFilter}
          disabled={quickFilter !== 'all'}
          onChange={(e) => setDateFilter(e.target.value)}
          className="input-althea max-w-[180px] disabled:opacity-50"
        />
        <button
          type="button"
          onClick={() => {
            setStatusFilter('');
            setDateFilter('');
            setSearch('');
            setQuickFilter('all');
          }}
          className="btn btn-ghost"
        >
          Reset
        </button>
      </div>

      <div className="card-althea overflow-x-auto">
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
            {filteredItems.map((b: Booking) => (
              <tr
                key={b.id}
                className="border-b border-border last:border-b-0 hover:bg-cream-50 cursor-pointer"
                onClick={() => setDetailing(b)}
              >
                <td className="px-4 py-2">
                  <div className="font-medium">{formatDateTime(b.scheduledStart)}</div>
                  <div className="caption">
                    → {formatDateTime(b.scheduledEnd).split(' ').slice(-2).join(' ')}
                  </div>
                  {b.sessionTotal > 1 && (
                    <div className="caption text-fg-muted">
                      Sesi {b.sessionN}/{b.sessionTotal}
                    </div>
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
                <td className="px-4 py-2 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-1 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setDetailing(b)}
                      className="btn btn-sm btn-ghost"
                      title="Lihat detail"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    {!['cancelled', 'completed', 'in_progress'].includes(b.status) && (
                      <button
                        type="button"
                        onClick={() => setRescheduling(b)}
                        className="btn btn-sm btn-outline"
                        title="Reschedule"
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {nextActions(b.status).map((act) => {
                      const icon =
                        act === 'confirmed' ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : act === 'checked_in' ? (
                          <UserCheck className="h-3.5 w-3.5" />
                        ) : act === 'in_progress' ? (
                          <Play className="h-3.5 w-3.5" />
                        ) : act === 'completed' ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <X className="h-3.5 w-3.5" />
                        );
                      return (
                        <button
                          key={act}
                          type="button"
                          onClick={() => handleAction(b.id, act)}
                          className={`btn btn-sm ${act === 'cancelled' ? 'btn-ghost text-danger' : 'btn-outline'}`}
                          title={STATUS_LABEL[act]}
                        >
                          {icon}
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && !list.isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-fg-muted">
                  {search || statusFilter || dateFilter || quickFilter !== 'all'
                    ? 'Tidak ada booking sesuai filter.'
                    : 'Belum ada booking.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="caption text-right">
        Menampilkan {filteredItems.length}
        {list.data?.meta?.total !== undefined && filteredItems.length !== list.data.meta.total && (
          <> dari {list.data.meta.total}</>
        )}{' '}
        booking
      </div>

      <BookingWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />
      <RescheduleDialog booking={rescheduling} onClose={() => setRescheduling(null)} />
      <BookingDetailDialog booking={detailing} onClose={() => setDetailing(null)} />
    </div>
  );
}
