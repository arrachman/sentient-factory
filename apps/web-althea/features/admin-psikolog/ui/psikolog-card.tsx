'use client';

import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { SPECIALTY_LABEL, type Psikolog } from '../model/types';

function initial(p: Psikolog) {
  return (p.fullName ?? p.email).slice(0, 2).toUpperCase();
}

function specialtyLabel(s: string) {
  return SPECIALTY_LABEL[s] ?? s;
}

function deriveStats(p: Psikolog) {
  const todayMax = p.defaultSlots > 0 ? p.defaultSlots : 4;
  const weekCapacity = Math.max(1, todayMax * 5);
  return {
    clients: p.clientCount,
    weekSessions: p.weekCount,
    utilization: Math.min(100, Math.round((p.weekCount / weekCapacity) * 100)),
    todayClients: p.todayCount,
    todayMax,
    recentlyFreed: false,
  };
}

function Avatar({ p, size = 44, fontSize = 14 }: { p: Psikolog; size?: number; fontSize?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: p.color ?? 'var(--sage-500)',
        color: '#fff',
        display: 'grid',
        placeItems: 'center',
        fontSize,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {initial(p)}
    </span>
  );
}

export { Avatar as PsikologAvatarSimple };

export function PsikologCard({
  p,
  selected,
  onClick,
}: {
  p: Psikolog;
  selected: boolean;
  onClick: () => void;
}) {
  const stats = deriveStats(p);
  const dayFull = stats.todayClients >= stats.todayMax;
  const utilColor =
    stats.utilization > 90 ? 'var(--danger, #b54141)' : (p.color ?? 'var(--sage-500)');
  const specialtyText =
    Array.isArray(p.specialty) && p.specialty.length > 0
      ? specialtyLabel(p.specialty[0])
      : (p.title ?? '');

  return (
    <button
      type="button"
      onClick={onClick}
      className="card-althea text-left"
      style={{
        padding: 16,
        cursor: 'pointer',
        position: 'relative',
        borderColor: selected ? (p.color ?? 'var(--sage-500)') : 'var(--border)',
        boxShadow: selected ? `0 0 0 2px ${p.color ?? 'var(--sage-500)'}33` : 'none',
        transition: 'all .15s var(--ease, ease)',
      }}
    >
      <div className="flex items-center gap-1" style={{ position: 'absolute', top: 12, right: 12 }}>
        {stats.recentlyFreed && (
          <span
            className="badge badge-success"
            style={{ height: 20, fontSize: 10 }}
            title="Slot baru terbuka karena reschedule/cancel"
          >
            slot baru terbuka
          </span>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className="badge"
              style={{
                height: 20,
                fontSize: 10,
                background: dayFull ? 'var(--danger-soft, #fce4e4)' : 'var(--cream-100)',
                color: dayFull ? 'var(--danger, #b54141)' : 'var(--fg-muted)',
                fontWeight: 600,
                cursor: 'default',
              }}
            >
              hari ini {stats.todayClients}/{stats.todayMax}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            Sesi hari ini yang sudah dikonfirmasi / kapasitas harian psikolog ini
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-3" style={{ marginBottom: 12, paddingRight: 90 }}>
        <Avatar p={p} size={48} fontSize={16} />
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
          {specialtyText && (
            <span className="caption" style={{ marginTop: 2 }}>{specialtyText}</span>
          )}
        </div>
      </div>

      {Array.isArray(p.specialty) && p.specialty.length > 0 && (
        <div className="flex flex-wrap" style={{ gap: 4, marginBottom: 12 }}>
          {p.specialty.slice(0, 4).map((t) => (
            <span key={t} className="badge badge-neutral" style={{ height: 20 }}>
              {specialtyLabel(t)}
            </span>
          ))}
        </div>
      )}

      <div style={{ height: 1, background: 'var(--border)', margin: '0 -16px 12px' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {([
          {
            label: 'Klien',
            value: stats.clients,
            tip: 'Jumlah klien unik yang pernah ditangani dalam 90 hari terakhir',
          },
          {
            label: 'Minggu ini',
            value: stats.weekSessions,
            tip: 'Total sesi (non-batal) yang dijadwalkan minggu ini (Senin–Minggu)',
          },
          {
            label: 'Utilisasi',
            value: `${stats.utilization}%`,
            tip: `Persentase kepadatan jadwal minggu ini — sesi minggu ini dibagi kapasitas (${stats.todayMax} slot/hari × 5 hari)`,
          },
        ] as const).map(({ label, value, tip }) => (
          <div key={label}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="caption inline-flex items-center gap-0.5 cursor-default"
                  style={{ userSelect: 'none' }}
                >
                  {label}
                  <Info size={11} style={{ opacity: 0.45, flexShrink: 0 }} />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" style={{ maxWidth: 220 }}>
                {tip}
              </TooltipContent>
            </Tooltip>
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color:
                  label === 'Utilisasi' && stats.utilization > 90
                    ? 'var(--danger, #b54141)'
                    : 'var(--teal-800)',
                fontFamily: 'var(--font-serif)',
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

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
            width: `${Math.min(100, stats.utilization)}%`,
            height: '100%',
            background: utilColor,
            borderRadius: 999,
            transition: 'width .2s ease',
          }}
        />
      </div>
    </button>
  );
}
