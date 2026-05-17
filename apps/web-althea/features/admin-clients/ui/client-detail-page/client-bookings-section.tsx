'use client';

/**
 * Daftar SEMUA booking milik klien (termasuk selesai & batal) + filter status,
 * urut terbaru. Riwayat sesi lama (completed) ikut tampil di sini.
 * Aksi per-baris: Detail (read-only dialog) & Edit (form edit terpadu).
 */
import { useMemo, useState } from 'react';
import { CalendarClock, Eye, Pencil } from 'lucide-react';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import {
  BOOKING_STATUSES,
  STATUS_BADGE_CLASS,
  STATUS_LABEL,
  type Booking,
  type BookingStatus,
} from '@/features/admin-booking/model/types';
import { BookingDetailDialog } from '@/features/admin-booking/ui/booking-detail-dialog';
import { EditBookingDialog } from '@/features/admin-booking/ui/edit-booking-dialog';

type Filter = 'semua' | BookingStatus;

function fmt(iso: string): string {
  return new Date(iso).toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ClientBookingsSection({ clientId }: { clientId: number }) {
  const [filter, setFilter] = useState<Filter>('semua');
  const [detail, setDetail] = useState<Booking | null>(null);
  const [editing, setEditing] = useState<Booking | null>(null);

  const list = useBookingList({ clientId, includeCancelled: true, limit: 200 });

  const all = useMemo(
    () =>
      [...(list.data?.data ?? [])].sort(
        (a, b) => new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime(),
      ),
    [list.data],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { semua: all.length };
    for (const s of BOOKING_STATUSES) c[s] = all.filter((b) => b.status === s).length;
    return c;
  }, [all]);

  const items = filter === 'semua' ? all : all.filter((b) => b.status === filter);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="text-[10.5px] uppercase tracking-wider font-semibold text-fg-muted">
          Daftar booking
        </span>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            label="Semua"
            count={counts.semua}
            active={filter === 'semua'}
            onClick={() => setFilter('semua')}
          />
          {BOOKING_STATUSES.map((s) => (
            <FilterChip
              key={s}
              label={STATUS_LABEL[s]}
              count={counts[s] ?? 0}
              active={filter === s}
              onClick={() => setFilter(s)}
            />
          ))}
        </div>
      </div>

      <div className="card-althea overflow-hidden bg-card">
        {list.isLoading ? (
          <div className="px-4 py-10 text-center text-fg-muted">Memuat booking…</div>
        ) : items.length === 0 ? (
          <div className="px-4 py-12 text-center text-fg-muted flex flex-col items-center gap-2">
            <CalendarClock className="h-6 w-6 opacity-50" />
            {filter === 'semua'
              ? 'Klien ini belum punya booking.'
              : `Tidak ada booking berstatus ${STATUS_LABEL[filter as BookingStatus]}.`}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {items.map((b) => (
              <BookingRow
                key={b.id}
                booking={b}
                onDetail={() => setDetail(b)}
                onEdit={() => setEditing(b)}
              />
            ))}
          </div>
        )}
      </div>

      {detail && <BookingDetailDialog booking={detail} onClose={() => setDetail(null)} />}
      {editing && <EditBookingDialog booking={editing} onClose={() => setEditing(null)} />}
    </section>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
        active
          ? 'bg-sage-500 text-white border-sage-500'
          : 'bg-card border-border text-fg-muted hover:bg-cream-50'
      }`}
    >
      {label}
      <span className={active ? 'opacity-80' : 'text-fg-muted'}> · {count}</span>
    </button>
  );
}

function BookingRow({
  booking: b,
  onDetail,
  onEdit,
}: {
  booking: Booking;
  onDetail: () => void;
  onEdit: () => void;
}) {
  const psikolog = b.psikolog.fullName || b.psikolog.email;
  return (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-cream-50 transition-colors">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13px] font-semibold text-teal-800">#{b.id}</span>
          <span className={`badge ${STATUS_BADGE_CLASS[b.status]} text-[10px] h-[18px]`}>
            {STATUS_LABEL[b.status]}
          </span>
          {b.createdViaWalkIn && (
            <span className="badge badge-warn text-[10px] h-[18px]">Walk-in</span>
          )}
          {b.sessionTotal > 1 && (
            <span className="caption">
              Sesi {b.sessionN}/{b.sessionTotal}
            </span>
          )}
        </div>
        <div className="text-[12.5px] text-fg mt-0.5 truncate">
          {b.service.name} · {psikolog} · {b.room.name}
        </div>
        <div className="caption mt-0.5">{fmt(b.scheduledStart)}</div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          type="button"
          onClick={onDetail}
          className="btn btn-ghost btn-sm btn-icon"
          aria-label={`Detail booking #${b.id}`}
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="btn btn-outline btn-sm"
          aria-label={`Edit booking #${b.id}`}
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
      </div>
    </div>
  );
}
