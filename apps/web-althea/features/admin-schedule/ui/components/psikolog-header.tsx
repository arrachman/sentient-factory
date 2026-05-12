/**
 * Header kolom psikolog di HariView grid — avatar + nama + specialty.
 */
import {
  SPECIALTY_LABEL,
  type Psikolog,
} from '@/features/admin-psikolog/model/types';

export function PsikologHeader({ p }: { p: Psikolog }) {
  const initial = (p.fullName ?? p.email).slice(0, 2).toUpperCase();
  const rawSpecialty =
    Array.isArray(p.specialty) && p.specialty.length > 0
      ? p.specialty[0]
      : null;
  const specialty = rawSpecialty
    ? (SPECIALTY_LABEL[rawSpecialty] ?? rawSpecialty)
    : p.title;
  return (
    <div className="flex items-center gap-2" style={{ minWidth: 0 }}>
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          background: p.color ?? 'var(--sage-500)',
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
      <div
        className="flex flex-col leading-tight"
        style={{ minWidth: 0 }}
      >
        <span
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: 'var(--teal-800)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={p.fullName ?? p.email}
        >
          {p.fullName ?? p.email}
        </span>
        {specialty ? (
          <span
            style={{ fontSize: 10.5, color: 'var(--fg-muted)' }}
            title={specialty}
          >
            {specialty}
          </span>
        ) : null}
      </div>
    </div>
  );
}
