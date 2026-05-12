'use client';

/**
 * Card psikolog di grid utama:
 *   - Top-right: badges quota harian + opsional "slot baru terbuka" (BR-01)
 *   - Avatar + nama + spesialty
 *   - Specialty tags (max 4)
 *   - Stats grid (Klien / Minggu ini / Utilisasi)
 *   - Utilization bar (warna danger kalau >90%)
 */
import {
  primarySpecialtyText,
  specialtyLabel,
  stubStats,
} from '../model/page-helpers';
import type { Psikolog } from '../model/types';
import { PsikologAvatar } from './psikolog-avatar';

export function PsikologCard({
  p,
  selected,
  onClick,
}: {
  p: Psikolog;
  selected: boolean;
  onClick: () => void;
}) {
  const stats = stubStats(p);
  const dayFull = stats.todayClients >= stats.todayMax;
  const utilColor =
    stats.utilization > 90
      ? 'var(--danger, #b54141)'
      : (p.color ?? 'var(--sage-500)');
  const specialtyText = primarySpecialtyText(p);

  return (
    <button
      type="button"
      onClick={onClick}
      className="card-althea text-left"
      style={{
        padding: 16,
        cursor: 'pointer',
        position: 'relative',
        borderColor: selected
          ? (p.color ?? 'var(--sage-500)')
          : 'var(--border)',
        boxShadow: selected
          ? `0 0 0 2px ${p.color ?? 'var(--sage-500)'}33`
          : 'none',
        transition: 'all .15s var(--ease, ease)',
      }}
    >
      <QuotaBadges
        recentlyFreed={stats.recentlyFreed}
        dayFull={dayFull}
        todayClients={stats.todayClients}
        todayMax={stats.todayMax}
      />

      <div
        className="flex items-center gap-3"
        style={{ marginBottom: 12, paddingRight: 90 }}
      >
        <PsikologAvatar p={p} size={48} fontSize={16} />
        <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontSize: 14,
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
          {specialtyText ? (
            <span className="caption" style={{ marginTop: 2 }}>
              {specialtyText}
            </span>
          ) : null}
        </div>
      </div>

      {Array.isArray(p.specialty) && p.specialty.length > 0 ? (
        <div
          className="flex flex-wrap"
          style={{ gap: 4, marginBottom: 12 }}
        >
          {p.specialty.slice(0, 4).map((t) => (
            <span
              key={t}
              className="badge badge-neutral"
              style={{ height: 20 }}
            >
              {specialtyLabel(t)}
            </span>
          ))}
        </div>
      ) : null}

      <div
        style={{
          height: 1,
          background: 'var(--border)',
          margin: '0 -16px 12px',
        }}
      />

      <StatsGrid
        clients={stats.clients}
        weekSessions={stats.weekSessions}
        utilization={stats.utilization}
      />

      <UtilizationBar
        utilization={stats.utilization}
        color={utilColor}
      />
    </button>
  );
}

// =====================================================================
// Sub-blocks
// =====================================================================

function QuotaBadges({
  recentlyFreed,
  dayFull,
  todayClients,
  todayMax,
}: {
  recentlyFreed: boolean;
  dayFull: boolean;
  todayClients: number;
  todayMax: number;
}) {
  return (
    <div
      className="flex items-center gap-1"
      style={{ position: 'absolute', top: 12, right: 12 }}
    >
      {recentlyFreed ? (
        <span
          className="badge badge-success"
          style={{ height: 20, fontSize: 10 }}
          title="Slot baru terbuka karena reschedule/cancel"
        >
          slot baru terbuka
        </span>
      ) : null}
      <span
        className="badge"
        style={{
          height: 20,
          fontSize: 10,
          background: dayFull
            ? 'var(--danger-soft, #fce4e4)'
            : 'var(--cream-100)',
          color: dayFull ? 'var(--danger, #b54141)' : 'var(--fg-muted)',
          fontWeight: 600,
        }}
      >
        hari ini {todayClients}/{todayMax}
      </span>
    </div>
  );
}

function StatsGrid({
  clients,
  weekSessions,
  utilization,
}: {
  clients: number;
  weekSessions: number;
  utilization: number;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 8,
      }}
    >
      <StatBlock label="Klien" value={clients} />
      <StatBlock label="Minggu ini" value={weekSessions} />
      <StatBlock
        label="Utilisasi"
        value={`${utilization}%`}
        color={
          utilization > 90 ? 'var(--danger, #b54141)' : 'var(--teal-800)'
        }
      />
    </div>
  );
}

function StatBlock({
  label,
  value,
  color = 'var(--teal-800)',
}: {
  label: string;
  value: number | string;
  color?: string;
}) {
  return (
    <div>
      <div className="caption">{label}</div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          color,
          fontFamily: 'var(--font-serif)',
        }}
      >
        {value}
      </div>
    </div>
  );
}

function UtilizationBar({
  utilization,
  color,
}: {
  utilization: number;
  color: string;
}) {
  return (
    <div
      style={{
        height: 4,
        background: 'var(--cream-200)',
        borderRadius: 999,
        marginTop: 10,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${Math.min(100, utilization)}%`,
          height: '100%',
          background: color,
          borderRadius: 999,
          transition: 'width .2s ease',
        }}
      />
    </div>
  );
}
