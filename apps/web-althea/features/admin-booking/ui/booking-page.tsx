'use client';

import { useMemo, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Eye,
  Play,
  Plus,
  Replace,
  RotateCw,
  Search,
  X,
} from 'lucide-react';
import {
  useBookingList,
  useCancelBooking,
  useCompleteBooking,
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
    checked_in: ['in_progress', 'cancelled'],
    in_progress: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
  };
  return map[status] || [];
}

const ACTION_LABEL: Record<BookingStatus, string> = {
  checked_in: 'Check-in',
  in_progress: 'Mulai',
  completed: 'Selesai',
  cancelled: 'Batal',
};

const ACTION_TOOLTIP: Record<BookingStatus, string> = {
  checked_in: 'Tandai klien sudah check-in',
  in_progress: 'Mulai sesi — status berubah jadi Berlangsung',
  completed: 'Tandai sesi selesai — memicu notifikasi WA selesai',
  cancelled: 'Batalkan booking — bisa isi alasan, memicu WA pembatalan',
};

type QuickFilter = 'all' | 'today' | 'tomorrow' | 'week' | 'past';

function toLocalDateKey(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function dateForQuickFilter(qf: QuickFilter): string | undefined {
  const today = new Date();
  if (qf === 'today') return toLocalDateKey(today);
  if (qf === 'tomorrow') {
    const t = new Date(today);
    t.setDate(t.getDate() + 1);
    return toLocalDateKey(t);
  }
  return undefined;
}

export function BookingPage({ canCreate = true }: { canCreate?: boolean } = {}) {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('today');
  const [search, setSearch] = useState('');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [rescheduling, setRescheduling] = useState<Booking | null>(null);
  const [detailing, setDetailing] = useState<Booking | null>(null);
  const [editing, setEditing] = useState<Booking | null>(null);

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

  const startMut = useStartBooking();
  const completeMut = useCompleteBooking();
  const cancelMut = useCancelBooking();

  function handleAction(id: number, action: BookingStatus) {
    if (action === 'cancelled') {
      const reason = prompt('Alasan cancel (opsional):') || undefined;
      cancelMut.mutate({ id, reason });
      return;
    }
    if (action === 'in_progress') startMut.mutate(id);
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
    <div className="space-y-6 p-6">

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
        {canCreate && (
          <div className="ml-auto flex items-center gap-2">
            <button type="button" onClick={() => setWizardOpen(true)} className="btn btn-primary btn-sm">
              <Plus className="h-4 w-4" /> Jadwal Baru
            </button>
          </div>
        )}
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
          className="btn btn-ghost btn-sm"
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
                        b.psikolog.avatarUrl
                          ? { padding: 0, overflow: 'hidden' }
                          : b.psikolog.clinicPsikologProfile?.color
                            ? { backgroundColor: b.psikolog.clinicPsikologProfile.color, color: '#fff' }
                            : undefined
                      }
                    >
                      {b.psikolog.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={b.psikolog.avatarUrl}
                          alt={b.psikolog.fullName || b.psikolog.email}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        (b.psikolog.fullName || b.psikolog.email).slice(0, 2).toUpperCase()
                      )}
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
                      title="Lihat info lengkap booking (klien, layanan, pembayaran, catatan, riwayat)"
                    >
                      <Eye className="h-3.5 w-3.5" /> Detail
                    </button>
                    {!['cancelled', 'completed', 'in_progress'].includes(b.status) && (
                      <button
                        type="button"
                        onClick={() => setRescheduling(b)}
                        className="btn btn-sm btn-outline"
                        title="Ganti tanggal/jam booking ini"
                      >
                        <RotateCw className="h-3.5 w-3.5" /> Reschedule
                      </button>
                    )}
                    {b.status === 'checked_in' && (
                      <button
                        type="button"
                        onClick={() => setEditing(b)}
                        className="btn btn-sm btn-outline"
                        title="Ubah layanan booking — psikolog & jadwal tetap, pembayaran recompute otomatis"
                      >
                        <Replace className="h-3.5 w-3.5" /> Ubah Layanan
                      </button>
                    )}
                    {nextActions(b.status).map((act) => {
                      const icon =
                        act === 'in_progress' ? (
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
                          title={ACTION_TOOLTIP[act]}
                        >
                          {icon} {ACTION_LABEL[act]}
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
      <BookingWizard
        open={!!editing}
        editingBooking={editing}
        onClose={() => setEditing(null)}
      />
      <RescheduleDialog booking={rescheduling} onClose={() => setRescheduling(null)} />
      <BookingDetailDialog booking={detailing} onClose={() => setDetailing(null)} />
    </div>
  );
}
