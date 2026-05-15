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
import {
  CalendarPlus,
  CheckCircle2,
  MessageCircle,
  PlayCircle,
  Search,
  Users,
  X,
} from 'lucide-react';
import { useBookingStream } from '@/features/admin-booking/hooks/use-booking-stream';
import {
  useBookingList,
  useCancelBooking,
  useCompleteBooking,
  useStartBooking,
} from '@/features/admin-booking/hooks/use-booking';
import { BookingWizard } from '@/features/admin-booking/ui/booking-wizard';
import type { Booking } from '@/features/admin-booking/model/types';
import { SVC_COLOR } from '@/features/admin-schedule/model/constants';

function todayKey(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function fmtDateLong(d: Date): string {
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function normalizeWa(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  if (digits.startsWith('62')) return digits;
  return digits;
}

type ColumnKey = 'checked_in' | 'in_progress' | 'completed';

const COLUMN_META: Record<
  ColumnKey,
  { title: string; subtitle: string; accent: string; icon: React.ReactNode }
> = {
  checked_in: {
    title: 'Check-in',
    subtitle: 'Menunggu dimulai',
    accent: 'var(--sage-500)',
    icon: <Users size={14} strokeWidth={2.2} />,
  },
  in_progress: {
    title: 'Berlangsung',
    subtitle: 'Sedang sesi',
    accent: '#c97a5d',
    icon: <PlayCircle size={14} strokeWidth={2.2} />,
  },
  completed: {
    title: 'Selesai',
    subtitle: 'Sesi hari ini',
    accent: 'var(--teal-700)',
    icon: <CheckCircle2 size={14} strokeWidth={2.2} />,
  },
};

export function ResepsionisDashboardPage() {
  const [wizardOpen, setWizardOpen] = useState(false);
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
        onCreate={() => setWizardOpen(true)}
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

      <BookingWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
  );
}

function Header({
  now,
  total,
  onCreate,
  loading,
}: {
  now: Date | null;
  total: number;
  onCreate: () => void;
  loading: boolean;
}) {
  return (
    <header className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <span className="caption" suppressHydrationWarning>
          {now ? fmtDateLong(now) : ' '}
        </span>
        <div
          className="caption"
          style={{ marginTop: 2, color: 'var(--fg-muted)' }}
        >
          {loading
            ? 'Memuat jadwal…'
            : total === 0
              ? 'Belum ada booking untuk hari ini.'
              : `${total} sesi dijadwalkan hari ini`}
        </div>
      </div>
      <button
        type="button"
        onClick={onCreate}
        className="btn btn-primary btn-sm"
      >
        <CalendarPlus className="h-4 w-4" /> Booking baru / Walk-in
      </button>
    </header>
  );
}

function KpiStrip({
  total,
  waiting,
  live,
  done,
  cancelled,
}: {
  total: number;
  waiting: number;
  live: number;
  done: number;
  cancelled: number;
}) {
  const items = [
    { label: 'Total hari ini', value: total, accent: 'var(--teal-800)' },
    { label: 'Menunggu', value: waiting, accent: 'var(--sage-700)' },
    { label: 'Berlangsung', value: live, accent: '#c97a5d' },
    { label: 'Selesai', value: done, accent: 'var(--teal-700)' },
    { label: 'Batal', value: cancelled, accent: 'var(--fg-muted)' },
  ];
  return (
    <div
      className="grid gap-3"
      style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      }}
    >
      {items.map((it) => (
        <div
          key={it.label}
          className="card-althea"
          style={{ padding: '12px 14px' }}
        >
          <div className="caption" style={{ fontSize: 11 }}>
            {it.label}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 24,
              fontWeight: 500,
              color: it.accent,
              lineHeight: 1.1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {it.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function Column({
  col,
  items,
  loading,
  now,
  primary,
  onCancel,
}: {
  col: ColumnKey;
  items: Booking[];
  loading: boolean;
  now: Date | null;
  primary?: {
    label: string;
    icon: React.ReactNode;
    onClick: (id: number) => void;
    pending: boolean;
  };
  onCancel?: (id: number) => void;
}) {
  const meta = COLUMN_META[col];
  return (
    <div className="card-althea" style={{ padding: 14, minHeight: 320 }}>
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: 12 }}
      >
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            style={{
              width: 26,
              height: 26,
              borderRadius: 999,
              background: 'var(--sage-100)',
              color: meta.accent,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            {meta.icon}
          </span>
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-serif)',
                fontSize: 15,
                fontWeight: 500,
                color: 'var(--teal-800)',
              }}
            >
              {meta.title}
            </h2>
            <div className="caption" style={{ fontSize: 11 }}>
              {meta.subtitle}
            </div>
          </div>
        </div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: meta.accent,
            background: 'var(--cream-50)',
            border: '1px solid var(--border)',
            borderRadius: 999,
            padding: '2px 10px',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {items.length}
        </span>
      </div>

      {loading ? (
        <SkeletonCards />
      ) : items.length === 0 ? (
        <EmptyState col={col} />
      ) : (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {items.map((b) => (
            <BookingCard
              key={b.id}
              b={b}
              now={now}
              primary={primary}
              onCancel={onCancel}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function BookingCard({
  b,
  now,
  primary,
  onCancel,
}: {
  b: Booking;
  now: Date | null;
  primary?: {
    label: string;
    icon: React.ReactNode;
    onClick: (id: number) => void;
    pending: boolean;
  };
  onCancel?: (id: number) => void;
}) {
  const color = SVC_COLOR[b.service.category] ?? SVC_COLOR.konseling;
  const rel = computeRelative(b, now);

  return (
    <li
      style={{
        background: color.fill,
        borderLeft: `4px solid ${color.bar}`,
        borderRadius: 8,
        padding: '10px 12px',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--teal-800)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {fmtTime(b.scheduledStart)}–{fmtTime(b.scheduledEnd)}
            </span>
            {rel && (
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  padding: '1px 7px',
                  borderRadius: 999,
                  background: rel.tone === 'late' ? '#fde2dc' : '#e6efe8',
                  color: rel.tone === 'late' ? '#a4452f' : 'var(--sage-700)',
                  whiteSpace: 'nowrap',
                }}
              >
                {rel.text}
              </span>
            )}
            {b.createdViaWalkIn && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: 4,
                  background: 'var(--cream-100)',
                  color: 'var(--fg-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Walk-in
              </span>
            )}
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 13.5,
              fontWeight: 600,
              color: 'var(--teal-800)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={b.client.name}
          >
            {b.client.name}
          </div>

          <div
            className="caption"
            style={{ fontSize: 11.5, marginTop: 2 }}
            title={`${b.service.name} · ${b.psikolog.fullName ?? b.psikolog.email} · ${b.room.name}`}
          >
            {b.service.name} ·{' '}
            <span style={{ color: 'var(--teal-700)' }}>
              {b.psikolog.fullName ?? b.psikolog.email}
            </span>{' '}
            · {b.room.name}
          </div>
        </div>

        {b.client.phoneWa && (
          <a
            href={`https://wa.me/${normalizeWa(b.client.phoneWa)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp ${b.client.name}`}
            title={`WhatsApp ${b.client.phoneWa}`}
            style={{
              flexShrink: 0,
              width: 28,
              height: 28,
              borderRadius: 999,
              background: 'var(--sage-100)',
              color: 'var(--sage-700)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <MessageCircle size={14} strokeWidth={2.2} />
          </a>
        )}
      </div>

      {(primary || onCancel) && (
        <div className="flex items-center gap-2" style={{ marginTop: 10 }}>
          {primary && (
            <button
              type="button"
              onClick={() => primary.onClick(b.id)}
              disabled={primary.pending}
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
            >
              {primary.icon}
              <span>{primary.label}</span>
            </button>
          )}
          {onCancel && (
            <button
              type="button"
              onClick={() => onCancel(b.id)}
              className="btn btn-ghost btn-sm"
              title="Batalkan booking"
              style={{ color: 'var(--fg-muted)' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}
    </li>
  );
}

function EmptyState({ col }: { col: ColumnKey }) {
  const copy =
    col === 'checked_in'
      ? 'Tidak ada klien menunggu. Sip!'
      : col === 'in_progress'
        ? 'Belum ada sesi yang sedang berlangsung.'
        : 'Belum ada sesi yang diselesaikan hari ini.';
  return (
    <div
      className="caption"
      style={{
        textAlign: 'center',
        padding: '24px 8px',
        color: 'var(--fg-muted)',
        fontStyle: 'italic',
      }}
    >
      {copy}
    </div>
  );
}

function SkeletonCards() {
  return (
    <div className="flex flex-col gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            height: 76,
            borderRadius: 8,
            background: 'var(--cream-100)',
            opacity: 0.7 - i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Hitung label relatif terhadap waktu sekarang.
 *   - "X mnt lagi"   → upcoming (<= 60 mnt sebelum mulai)
 *   - "Telat X mnt"  → checked_in tapi sudah lewat waktu mulai
 *   - "X mnt sisa"   → sedang berlangsung
 * Null jika tidak relevan (terlalu jauh / sudah selesai).
 */
function computeRelative(
  b: Booking,
  now: Date | null,
): { text: string; tone: 'late' | 'soon' } | null {
  if (!now) return null;
  const start = new Date(b.scheduledStart).getTime();
  const end = new Date(b.scheduledEnd).getTime();
  const t = now.getTime();

  if (b.status === 'checked_in') {
    const diff = Math.round((start - t) / 60000);
    if (diff < 0) return { text: `Telat ${-diff} mnt`, tone: 'late' };
    if (diff <= 60) return { text: `${diff} mnt lagi`, tone: 'soon' };
    return null;
  }
  if (b.status === 'in_progress') {
    const remaining = Math.round((end - t) / 60000);
    if (remaining < 0)
      return { text: `Lewat ${-remaining} mnt`, tone: 'late' };
    return { text: `${remaining} mnt sisa`, tone: 'soon' };
  }
  return null;
}
