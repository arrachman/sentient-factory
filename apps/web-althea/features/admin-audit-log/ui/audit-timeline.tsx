'use client';

/**
 * Timeline list event audit, di-group per hari dengan divider tanggal.
 *
 * Tiap row: time prefix (38px) · circle ikon kategori (28px sev-colored) ·
 * action title + target + meta · severity badge + actor avatar (atau "sistem").
 */
import { useMemo } from 'react';
import {
  ACTOR_COLOR_BY_ROLE,
  AUDIT_CATEGORIES,
  SEVERITY_META,
  type AuditCategory,
  type AuditEvent,
} from '../model/types';
import { formatDateGroup } from '../model/format';
import { AuditAvatar } from './audit-avatar';

export function AuditTimeline({
  events,
  selectedId,
  onSelect,
}: {
  events: AuditEvent[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const groups = useMemo(() => {
    const map = new Map<string, AuditEvent[]>();
    for (const e of events) {
      const d = new Date(e.iso);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const arr = map.get(key) ?? [];
      arr.push(e);
      map.set(key, arr);
    }
    return Array.from(map.values()).map((arr) => ({
      label: formatDateGroup(arr[0].iso),
      events: arr,
    }));
  }, [events]);

  return (
    <>
      {groups.map((g) => (
        <div key={g.label}>
          <DayDivider label={g.label} />
          {g.events.map((e, i) => (
            <TimelineRow
              key={e.id}
              event={e}
              isSelected={e.id === selectedId}
              isLast={i === g.events.length - 1}
              onSelect={onSelect}
            />
          ))}
        </div>
      ))}
    </>
  );
}

function DayDivider({ label }: { label: string }) {
  return (
    <div
      className="row"
      style={{
        padding: '10px 18px',
        background: 'var(--cream-100)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <span className="eyebrow">{label}</span>
    </div>
  );
}

function TimelineRow({
  event: e,
  isSelected,
  isLast,
  onSelect,
}: {
  event: AuditEvent;
  isSelected: boolean;
  isLast: boolean;
  onSelect: (id: number) => void;
}) {
  const sev = SEVERITY_META[e.severity];
  return (
    <button
      type="button"
      onClick={() => onSelect(e.id)}
      className="row gap-3"
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '12px 18px',
        borderBottom: isLast ? 'none' : '1px solid var(--border)',
        alignItems: 'flex-start',
        cursor: 'pointer',
        background: isSelected ? 'var(--sage-50)' : 'transparent',
        borderLeft: isSelected
          ? '3px solid var(--sage-500)'
          : '3px solid transparent',
        paddingLeft: isSelected ? 15 : 18,
        border: 'none',
        borderTop: 0,
        borderRight: 0,
      }}
    >
      <span
        style={{
          fontSize: 11.5,
          fontWeight: 600,
          color: 'var(--fg-muted)',
          fontVariantNumeric: 'tabular-nums',
          width: 38,
          flexShrink: 0,
          paddingTop: 2,
        }}
      >
        {e.time}
      </span>
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: 999,
          background: sev.iconBg,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        <CategoryDot category={e.category} color={sev.iconFg} />
      </span>
      <div className="col grow" style={{ minWidth: 0, gap: 3 }}>
        <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--teal-800)',
            }}
          >
            {e.actionLabel}
          </span>
          <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
            · {e.target}
          </span>
        </div>
        <span className="caption" style={{ fontSize: 11.5 }}>
          {e.meta}
        </span>
      </div>
      <div
        className="col"
        style={{
          alignItems: 'flex-end',
          gap: 4,
          flexShrink: 0,
        }}
      >
        <span
          className={`badge ${sev.badgeClass}`}
          style={{
            height: 18,
            fontSize: 10,
            textTransform: 'capitalize',
          }}
        >
          {sev.label}
        </span>
        {!e.isAuto ? (
          <div className="row gap-1" style={{ alignItems: 'center' }}>
            <AuditAvatar
              name={e.actor}
              color={
                ACTOR_COLOR_BY_ROLE[e.actorRole] ??
                ACTOR_COLOR_BY_ROLE.Pengguna
              }
              size="sm"
            />
            <span
              style={{
                fontSize: 11,
                color: 'var(--fg-muted)',
              }}
            >
              {e.actor}
            </span>
          </div>
        ) : (
          <span
            style={{
              fontSize: 11,
              color: 'var(--fg-muted)',
              fontStyle: 'italic',
            }}
          >
            sistem
          </span>
        )}
      </div>
    </button>
  );
}

function CategoryDot({
  category,
  color,
}: {
  category: AuditCategory;
  color: string;
}) {
  const meta = AUDIT_CATEGORIES.find((c) => c.k === category);
  const Icon = meta?.icon;
  if (!Icon) {
    return (
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: color,
          display: 'inline-block',
        }}
      />
    );
  }
  return <Icon size={13} style={{ color }} />;
}
