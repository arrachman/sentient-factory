'use client';

/**
 * Receptionist status board — admin-driven booking ops untuk hari ini.
 *
 * Aksi tiap kolom:
 *   - Check-in   → "Mulai sesi"  (useStartBooking)
 *   - Berlangsung → "Selesaikan" (useCompleteBooking)
 *   - Selesai    → read-only
 *   - Cancel     → tersedia di Check-in / Berlangsung (prompt reason)
 *
 * Realtime: useBookingStream (SSE). Sort ascending by scheduledStart.
 */
import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, PlayCircle, Search, X } from 'lucide-react';
import { useBookingStream } from '@/features/admin-booking/hooks/use-booking-stream';
import {
  useBookingList,
  useCancelBooking,
  useCompleteBooking,
  useStartBooking,
} from '@/features/admin-booking/hooks/use-booking';
import type { Booking } from '@/features/admin-booking/model/types';
import { todayKey } from './resepsionis-dashboard.helpers';
import { type ColumnKey } from './resepsionis-dashboard.constants';
import { Header } from './header';
import { KpiStrip } from './kpi-strip';
import { Column } from './column';

export function ResepsionisDashboardPage() {
  const [query, setQuery] = useState('');
  const [now, setNow] = useState<Date | null>(null);

  useBookingStream();
  const list = useBookingList({ date: todayKey(), limit: 200 });
  const startMut = useStartBooking();
  const completeMut = useCompleteBooking();
  const cancelMut = useCancelBooking();

  // Tick setiap 30 detik untuk update relative-time tanpa SSR mismatch.
  useEffect(() => {
    const first = setTimeout(() => setNow(new Date()), 0);
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const items = useMemo(() => list.data?.data ?? [], [list.data?.data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((b) =>
      [
        b.client.name,
        b.psikolog.fullName ?? b.psikolog.email,
        b.service.name,
        b.room.name,
      ]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [items, query]);

  const grouped = useMemo(() => {
    const g: Record<ColumnKey, Booking[]> = {
      checked_in: [],
      in_progress: [],
      completed: [],
    };
    for (const b of filtered) {
      if (b.status in g) g[b.status as ColumnKey].push(b);
    }
    for (const k of Object.keys(g) as ColumnKey[]) {
      g[k].sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart));
    }
    return g;
  }, [filtered]);

  const total = items.length;
  const cancelled = items.filter((b) => b.status === 'cancelled').length;

  const handleStart = (id: number) => {
    if (!confirm('Mulai sesi sekarang?')) return;
    startMut.mutate(id);
  };
  const handleComplete = (id: number) => {
    if (!confirm('Tandai sesi selesai?')) return;
    completeMut.mutate(id);
  };
  const handleCancel = (id: number) => {
    const reason = prompt('Alasan pembatalan (opsional):') ?? '';
    if (reason === null) return;
    if (!confirm('Batalkan booking ini? Aksi tidak bisa di-undo.')) return;
    cancelMut.mutate({ id, reason: reason.trim() || undefined });
  };

  return (
    <div className="flex flex-col p-6 gap-5">
      <Header
        now={now}
        total={total}
        loading={list.isLoading}
      />

      <KpiStrip
        total={total}
        waiting={grouped.checked_in.length}
        live={grouped.in_progress.length}
        done={grouped.completed.length}
        cancelled={cancelled}
      />

      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-2"
          style={{
            flex: 1,
            maxWidth: 360,
            background: 'var(--cream-50)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '6px 10px',
          }}
        >
          <Search size={14} className="text-fg-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari klien, psikolog, layanan, ruangan…"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 13,
              color: 'var(--teal-800)',
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Bersihkan"
              className="text-fg-muted hover:text-teal-800"
            >
              <X size={14} />
            </button>
          )}
        </div>
        {list.isFetching && !list.isLoading && (
          <span className="caption" style={{ color: 'var(--sage-700)' }}>
            Memperbarui…
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Column
          col="checked_in"
          items={grouped.checked_in}
          loading={list.isLoading}
          now={now}
          primary={{
            label: 'Mulai sesi',
            icon: <PlayCircle size={14} />,
            onClick: handleStart,
            pending: startMut.isPending,
          }}
          onCancel={handleCancel}
        />
        <Column
          col="in_progress"
          items={grouped.in_progress}
          loading={list.isLoading}
          now={now}
          primary={{
            label: 'Selesaikan',
            icon: <CheckCircle2 size={14} />,
            onClick: handleComplete,
            pending: completeMut.isPending,
          }}
          onCancel={handleCancel}
        />
        <Column
          col="completed"
          items={grouped.completed}
          loading={list.isLoading}
          now={now}
        />
      </div>

    </div>
  );
}
