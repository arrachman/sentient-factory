'use client';

/**
 * Profile aside detail psikolog (kanan grid):
 *   header (avatar + nama + sejak + rating) → bar chart sesi minggu ini
 *   → spesialisasi → layanan tersedia (stub) → tombol edit
 */
import { Check, Edit } from 'lucide-react';
import {
  HARI_SHORT,
  primarySpecialtyText,
  specialtyLabel,
  stubStats,
  weekDistribution,
  type PsikologStats,
} from '../model/page-helpers';
import type { Psikolog } from '../model/types';
import { PsikologAvatar } from './psikolog-avatar';

const STUB_SERVICES = [
  'Konseling Individu',
  'Terapi Dewasa',
  'Konseling Pasangan',
];

export function ProfileAside({
  p,
  onEdit,
}: {
  p: Psikolog;
  onEdit: () => void;
}) {
  const stats = stubStats(p);
  const week = weekDistribution(p);
  const specialtyText = primarySpecialtyText(p);

  return (
    <aside
      className="card-althea"
      style={{
        width: 320,
        flexShrink: 0,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      <AsideHeader onEdit={onEdit} />
      <ProfileHero
        p={p}
        stats={stats}
        specialtyText={specialtyText}
      />
      <Divider />
      <WeekBarChart p={p} week={week} />
      <Divider />
      {Array.isArray(p.specialty) && p.specialty.length > 0 ? (
        <SpecialtyTags specialties={p.specialty} />
      ) : null}
      <ServicesStub />
      <button
        type="button"
        onClick={onEdit}
        className="btn btn-outline btn-sm"
        style={{ marginTop: 'auto' }}
      >
        Lihat profil lengkap
      </button>
    </aside>
  );
}

// =====================================================================
// Sections
// =====================================================================

function AsideHeader({ onEdit }: { onEdit: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="eyebrow">Profil</span>
      <button
        type="button"
        onClick={onEdit}
        className="btn btn-icon btn-ghost btn-sm"
        aria-label="Edit profil"
        title="Edit"
      >
        <Edit size={14} />
      </button>
    </div>
  );
}

function ProfileHero({
  p,
  stats,
  specialtyText,
}: {
  p: Psikolog;
  stats: PsikologStats;
  specialtyText: string;
}) {
  return (
    <div
      className="flex flex-col items-center"
      style={{ textAlign: 'center', gap: 8, paddingBottom: 6 }}
    >
      <PsikologAvatar p={p} size={64} fontSize={20} />
      <div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--teal-800)',
            fontFamily: 'var(--font-serif)',
          }}
        >
          {p.fullName ?? p.email}
        </div>
        <div className="caption" style={{ marginTop: 2 }}>
          {specialtyText}
          {specialtyText ? ' · ' : ''}sejak {stats.since}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--teal-800)',
          }}
        >
          ★ {stats.rating}
        </span>
        <span className="caption">· {stats.clients} klien aktif</span>
      </div>
    </div>
  );
}

function WeekBarChart({
  p,
  week,
}: {
  p: Psikolog;
  week: number[];
}) {
  const max = 4;
  return (
    <div className="flex flex-col gap-2">
      <span className="eyebrow">Sesi minggu ini</span>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 6,
        }}
      >
        {HARI_SHORT.map((d, i) => {
          const v = week[i];
          return (
            <div
              key={d}
              className="flex flex-col items-center"
              style={{ gap: 4 }}
            >
              <div
                style={{
                  width: '100%',
                  height: 56,
                  background: 'var(--cream-100)',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'flex-end',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${(v / max) * 100}%`,
                    background: p.color ?? 'var(--sage-500)',
                    borderRadius: 4,
                    opacity: 0.85,
                  }}
                />
              </div>
              <span
                style={{ fontSize: 10.5, color: 'var(--fg-muted)' }}
              >
                {d}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--teal-800)',
                }}
              >
                {v}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SpecialtyTags({ specialties }: { specialties: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="eyebrow">Spesialisasi</span>
      <div className="flex flex-wrap" style={{ gap: 4 }}>
        {specialties.map((t) => (
          <span key={t} className="badge badge-sage">
            {specialtyLabel(t)}
          </span>
        ))}
      </div>
    </div>
  );
}

function ServicesStub() {
  return (
    <div className="flex flex-col gap-2">
      <span className="eyebrow">Layanan tersedia</span>
      <div className="flex flex-col" style={{ gap: 4 }}>
        {STUB_SERVICES.map((s) => (
          <div
            key={s}
            className="flex items-center gap-2"
            style={{ padding: '6px 0' }}
          >
            <Check
              size={13}
              style={{
                color: 'var(--success, #4f8c5b)',
                strokeWidth: 2.5,
              }}
            />
            <span style={{ fontSize: 13 }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--border)' }} />;
}
