'use client';

import type { Booking } from '@/features/admin-booking/model/types';
import { BookingCard } from './booking-card';
import {
  type ColumnKey,
  COLUMN_META,
} from './resepsionis-dashboard.constants';

export function Column({
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
