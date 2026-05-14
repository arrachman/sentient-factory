import { SPECIALTY_LABEL, type Psikolog } from '@/features/admin-psikolog/model/types';
import { DEFAULT_PSIKOLOG_COLOR, SVC_DOT } from '../_lib/dashboard-utils';

export function KpiCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="card-althea" style={{ padding: 18 }}>
      <span className="caption">{label}</span>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 500, color: 'var(--teal-800)', marginTop: 4 }}>
        {value}
      </div>
      {sub && (
        <span className="caption" style={{ marginTop: 4, color: 'var(--sage-700)', fontSize: 11, display: 'block' }}>
          {sub}
        </span>
      )}
    </div>
  );
}

export function PsikologRow({
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
  const rawSpecialty = Array.isArray(p.specialty) && p.specialty.length > 0 ? p.specialty[0] : null;
  const specialty = rawSpecialty ? SPECIALTY_LABEL[rawSpecialty] ?? rawSpecialty : p.title;

  return (
    <div className="flex items-center gap-3" style={{ padding: '10px 12px', background: 'var(--cream-50)', borderRadius: 8 }}>
      <span
        style={{
          width: 32, height: 32, borderRadius: 999,
          background: color, color: '#fff',
          display: 'grid', placeItems: 'center',
          fontSize: 11, fontWeight: 700, flexShrink: 0,
        }}
      >
        {initial}
      </span>
      <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>
            {p.fullName ?? p.email}
          </span>
          <span style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', color: 'var(--fg-muted)' }}>
            {todayCount}/{max} hari ini · {totalActive} klien aktif
          </span>
        </div>
        <div style={{ height: 4, background: 'var(--cream-200)', borderRadius: 999, marginTop: 5, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: pct >= 100 ? 'var(--danger, #b54141)' : color, transition: 'width .2s ease' }} />
        </div>
        {specialty && <span className="caption" style={{ fontSize: 10.5, marginTop: 3 }}>{specialty}</span>}
      </div>
    </div>
  );
}

export function RoomUtilizationRow({
  label,
  used,
  max,
  color,
}: {
  label: string;
  used: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? Math.min(100, (used / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span style={{ fontSize: 12.5, color: 'var(--fg)', flex: 1 }}>{label}</span>
      <div style={{ flex: 2, height: 6, background: 'var(--cream-200)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color }} />
      </div>
      <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontVariantNumeric: 'tabular-nums', width: 56, textAlign: 'right' }}>
        {used}/{max} slot
      </span>
    </div>
  );
}

export function ServiceRow({ name, count, category }: { name: string; count: number; category: string }) {
  return (
    <div className="flex items-center justify-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2">
        <span style={{ width: 8, height: 8, borderRadius: 2, background: SVC_DOT[category] ?? SVC_DOT.konseling, flexShrink: 0 }} />
        <span style={{ fontSize: 12.5, color: 'var(--fg)' }}>{name}</span>
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)', fontVariantNumeric: 'tabular-nums' }}>{count}</span>
    </div>
  );
}
