'use client';

import { useState } from 'react';
import { CalendarPlus, UserCheck } from 'lucide-react';
import {
  useBookingList,
  useCheckInBooking,
} from '@/features/admin-booking/hooks/use-booking';
import { useBookingStream } from '@/features/admin-booking/hooks/use-booking-stream';
import { BookingWizard } from '@/features/admin-booking/ui/booking-wizard';
import {
  STATUS_BADGE_CLASS,
  STATUS_LABEL,
  type Booking,
} from '@/features/admin-booking/model/types';

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function ResepsionisDashboardPage() {
  const [wizardOpen, setWizardOpen] = useState(false);
  useBookingStream();
  const list = useBookingList({ date: todayKey(), limit: 100 });
  const checkInMut = useCheckInBooking();

  const items = list.data?.data ?? [];
  const grouped: Record<string, Booking[]> = {
    awaiting_dp: [],
    confirmed: [],
    checked_in: [],
    in_progress: [],
    completed: [],
    cancelled: [],
  };
  for (const b of items) {
    if (grouped[b.status]) grouped[b.status].push(b);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1">Resepsionis Dashboard</h1>
          <p className="caption mt-1">Status check-in hari ini. Walk-in booking via tombol Booking Baru.</p>
        </div>
        <button type="button" onClick={() => setWizardOpen(true)} className="btn btn-primary">
          <CalendarPlus className="h-4 w-4" /> Booking Baru / Walk-in
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashboardColumn
          title="Menunggu Check-in"
          status="confirmed"
          items={grouped.confirmed}
          loading={list.isLoading}
          actionLabel="Check-in"
          actionIcon={<UserCheck className="h-3.5 w-3.5" />}
          onAction={(id) => checkInMut.mutate(id)}
        />
        <DashboardColumn title="Sudah Check-in" status="checked_in" items={grouped.checked_in} loading={list.isLoading} />
        <DashboardColumn title="Berlangsung" status="in_progress" items={grouped.in_progress} loading={list.isLoading} />
        <DashboardColumn title="Selesai" status="completed" items={grouped.completed} loading={list.isLoading} />
      </div>

      <BookingWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
  );
}

function DashboardColumn({
  title,
  status,
  items,
  loading,
  actionLabel,
  actionIcon,
  onAction,
}: {
  title: string;
  status: string;
  items: Booking[];
  loading?: boolean;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onAction?: (id: number) => void;
}) {
  return (
    <div className="card-althea p-3 min-h-[300px]">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-medium">{title}</h2>
        <span className={`badge ${STATUS_BADGE_CLASS[status as keyof typeof STATUS_BADGE_CLASS]}`}>
          {items.length}
        </span>
      </div>
      {loading ? (
        <div className="caption text-fg-muted">Memuat...</div>
      ) : items.length === 0 ? (
        <div className="caption text-fg-muted">Tidak ada</div>
      ) : (
        <div className="space-y-2">
          {items.map((b) => (
            <div key={b.id} className="card-althea-flat p-2 text-xs">
              <div className="font-medium text-teal-800">{b.client.name}</div>
              <div className="caption">
                {new Date(b.scheduledStart).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                {' '}— {b.psikolog.fullName ?? b.psikolog.email}
              </div>
              <div className="caption text-fg-muted">{b.room.name}</div>
              {actionLabel && onAction && (
                <button
                  type="button"
                  onClick={() => onAction(b.id)}
                  className="btn btn-primary btn-sm w-full mt-2"
                >
                  {actionIcon}
                  <span className="ml-1">{actionLabel}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
