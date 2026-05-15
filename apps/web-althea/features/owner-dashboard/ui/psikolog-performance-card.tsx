import { Users } from 'lucide-react';
import {
  SPECIALTY_LABEL,
  type Psikolog,
} from '@/features/admin-psikolog/model/types';
import type { PsikologRowData } from '../model/aggregate';
import { DEFAULT_PSIKOLOG_COLOR } from '../model/constants';

/**
 * Card "Performa psikolog · hari ini" — list psikolog dengan progress bar
 * todayCount / slotsPerDay + total klien aktif.
 */
export function PsikologPerformanceCard({
  isLoading,
  rows,
  totalCount,
  slotsPerDay,
}: {
  isLoading: boolean;
  rows: PsikologRowData[];
  totalCount: number;
  slotsPerDay: number;
}) {
  return (
    <div className="card-althea flex flex-col" style={{ padding: 20 }}>
      <div
        className="flex items-start justify-between gap-3"
        style={{ marginBottom: 14 }}
      >
        <div className="flex flex-col">
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-serif)',
              fontSize: 17,
              fontWeight: 500,
              color: 'var(--teal-800)',
            }}
          >
            Performa psikolog · hari ini
          </h2>
          <span className="caption" style={{ marginTop: 2 }}>
            {totalCount} psikolog aktif · target {slotsPerDay} slot/orang
          </span>
        </div>
        <span
          aria-hidden
          style={{
            width: 28,
            height: 28,
            borderRadius: 999,
            background: 'var(--info-soft)',
            color: 'var(--info)',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <Users size={14} strokeWidth={2.2} />
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <span className="caption text-fg-muted">
            Memuat data psikolog...
          </span>
        ) : rows.length === 0 ? (
          <span className="caption text-fg-muted">
            Belum ada psikolog aktif.
          </span>
        ) : (
          rows.map((row) => (
            <PsikologRow
              key={row.p.id}
              p={row.p}
              todayCount={row.todayCount}
              totalActive={row.totalActive}
              slotsPerDay={slotsPerDay}
            />
          ))
        )}
      </div>
    </div>
  );
}

function PsikologRow({
  p,
  todayCount,
  totalActive,
  slotsPerDay,
}: {
  p: Psikolog;
  todayCount: number;
  totalActive: number;
  slotsPerDay: number;
}) {
  const max = slotsPerDay;
  const pct = Math.min(100, (todayCount / max) * 100);
  const color = p.color ?? DEFAULT_PSIKOLOG_COLOR;
  const initial = (p.fullName ?? p.email).slice(0, 2).toUpperCase();
  const rawSpecialty =
    Array.isArray(p.specialty) && p.specialty.length > 0
      ? p.specialty[0]
      : null;
  const specialty = rawSpecialty
    ? (SPECIALTY_LABEL[rawSpecialty] ?? rawSpecialty)
    : p.title;
  return (
    <div
      className="flex items-center gap-3"
      style={{
        padding: '10px 12px',
        background: 'var(--cream-50)',
        borderRadius: 8,
      }}
    >
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          background: color,
          color: '#fff',
          display: 'grid',
          placeItems: 'center',
          fontSize: 11,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {initial}
      </span>
      <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
        <div className="flex items-center justify-between gap-2">
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--teal-800)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {p.fullName ?? p.email}
          </span>
          <span
            style={{
              fontSize: 12,
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--fg-muted)',
              flexShrink: 0,
            }}
          >
            {todayCount}/{max} · {totalActive} klien
          </span>
        </div>
        <div
          style={{
            height: 4,
            background: 'var(--cream-200)',
            borderRadius: 999,
            marginTop: 5,
            overflow: 'hidden',
          }}
          aria-hidden
        >
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              background: pct >= 100 ? 'var(--danger, #b54141)' : color,
              transition: 'width .2s ease',
            }}
          />
        </div>
        {specialty ? (
          <span
            className="caption"
            style={{ fontSize: 10.5, marginTop: 3 }}
          >
            {specialty}
          </span>
        ) : null}
      </div>
    </div>
  );
}
