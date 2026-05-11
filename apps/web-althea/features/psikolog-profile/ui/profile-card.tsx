'use client';

import type { Psikolog } from '@/features/admin-psikolog/model/types';
import { SPECIALTY_LABEL } from '@/features/admin-psikolog/model/types';

function initial(p: Psikolog): string {
  const name = p.fullName || p.email || 'P';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function formatJoined(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function ProfileCard({
  p,
  onEdit,
}: {
  p: Psikolog;
  onEdit?: () => void;
}) {
  const specialtyLabel =
    Array.isArray(p.specialty) && p.specialty.length > 0
      ? (SPECIALTY_LABEL[p.specialty[0]] ?? p.specialty[0])
      : (p.title ?? 'Psikolog');

  return (
    <div className="card-althea" style={{ padding: 22 }}>
      {/* Avatar block */}
      <div
        className="flex flex-col items-center"
        style={{ textAlign: 'center', marginBottom: 18 }}
      >
        <div
          className="relative overflow-hidden"
          style={{
            width: 88,
            height: 88,
            borderRadius: 999,
            background: p.color ?? 'var(--sage-300)',
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
            fontFamily: 'var(--font-serif)',
            fontSize: 32,
            fontWeight: 500,
            marginBottom: 12,
          }}
        >
          {p.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.avatarUrl}
              alt={p.fullName ?? 'Foto profil'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : (
            initial(p)
          )}
        </div>
        <span
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--teal-800)',
            fontFamily: 'var(--font-serif)',
          }}
        >
          {p.fullName ?? p.email}
        </span>
        <span className="caption" style={{ marginTop: 4 }}>
          {p.title ? `${p.title} · ` : ''}
          {specialtyLabel}
        </span>
        <button
          type="button"
          onClick={onEdit}
          disabled={!onEdit}
          className="btn btn-outline btn-sm"
          style={{ marginTop: 10 }}
          title="Edit nama, title, bio, & warna avatar"
        >
          Edit profil
        </button>
      </div>

      {/* Contact */}
      <div
        className="flex flex-col"
        style={{
          gap: 8,
          paddingTop: 14,
          borderTop: '1px solid var(--border)',
        }}
      >
        {[
          ['Email', p.email],
          ['Username', p.username],
          ['SIPP', p.license ?? '—'],
          ['Bergabung', p.createdAt ? formatJoined(p.createdAt) : '—'],
        ].map(([k, v]) => (
          <div
            key={k}
            className="flex items-center justify-between"
            style={{ gap: 12 }}
          >
            <span className="caption">{k}</span>
            <span
              style={{
                fontSize: 12.5,
                color: 'var(--fg)',
                fontWeight: 500,
                textAlign: 'right',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '60%',
              }}
              title={String(v ?? '')}
            >
              {v ?? '—'}
            </span>
          </div>
        ))}
      </div>

      {/* Specialty */}
      {Array.isArray(p.specialty) && p.specialty.length > 0 && (
        <div
          style={{
            marginTop: 14,
            paddingTop: 14,
            borderTop: '1px solid var(--border)',
          }}
        >
          <span
            className="eyebrow"
            style={{ display: 'block', marginBottom: 8 }}
          >
            Spesialisasi
          </span>
          <div className="flex flex-wrap" style={{ gap: 8 }}>
            {p.specialty.map((t) => (
              <span
                key={t}
                className="badge badge-sage"
                style={{ height: 24 }}
              >
                {SPECIALTY_LABEL[t] ?? t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
