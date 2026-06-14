'use client';

/**
 * Detail panel kanan halaman Audit Log untuk satu event terpilih:
 *   - Severity badge + action heading + target
 *   - Actor card (avatar + nama + role)
 *   - Properties grid (Waktu/Kategori/Entity/IP/Perangkat/Catatan)
 *   - Diff before/after (kalau ada oldData & newData berbeda)
 *   - Privacy enforcement note (kalau severity danger + denied/br pattern)
 *   - Action buttons (Lihat sumber disabled, Ekspor)
 *   - Marker untuk event otomatis (system/cron)
 */
import { useMemo } from 'react';
import { Calendar, Download } from 'lucide-react';
import {
  ACTOR_COLOR_BY_ROLE,
  SEVERITY_META,
  categoryLabel,
  diff,
  entityWordFromType,
  formatRelativeTime,
  type AuditEvent,
} from '../model/types';
import { renderValue } from '../model/format';
import { exportAuditCsv } from '../model/export-csv';
import { AuditAvatar } from './audit-avatar';

export function AuditDetailPanel({ event }: { event: AuditEvent }) {
  const sev = SEVERITY_META[event.severity];
  const fields = useMemo(
    () => diff(event.raw.oldData, event.raw.newData),
    [event.raw.oldData, event.raw.newData],
  );
  const showDiff = fields.length > 0;
  const showBr04 =
    event.severity === 'danger' && /denied|br/i.test(event.actionLabel);

  return (
    <>
      <DetailHeader event={event} sevBadgeClass={sev.badgeClass} sevLabel={sev.label} />
      <ActorCard event={event} />
      <PropertiesGrid event={event} />
      {showDiff ? <DiffPreview fields={fields} /> : null}
      {showBr04 ? <Br04Note /> : null}
      <ActionButtons event={event} />
      {event.isAuto ? <SystemEventMarker /> : null}
    </>
  );
}

// =====================================================================
// Sub-sections
// =====================================================================

function DetailHeader({
  event,
  sevBadgeClass,
  sevLabel,
}: {
  event: AuditEvent;
  sevBadgeClass: string;
  sevLabel: string;
}) {
  return (
    <div className="col gap-2" style={{ marginBottom: 16 }}>
      <span
        className={`badge ${sevBadgeClass}`}
        style={{ alignSelf: 'flex-start', textTransform: 'capitalize' }}
      >
        {sevLabel}
      </span>
      <span
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: 'var(--teal-800)',
          lineHeight: 1.35,
        }}
      >
        {event.actionLabel}
      </span>
      <span className="caption" style={{ lineHeight: 1.45 }}>
        {event.target}
      </span>
    </div>
  );
}

function ActorCard({ event }: { event: AuditEvent }) {
  return (
    <div
      className="row gap-2"
      style={{
        padding: 12,
        background: 'var(--cream-100)',
        borderRadius: 8,
        marginBottom: 14,
        alignItems: 'center',
      }}
    >
      <AuditAvatar
        name={event.isAuto ? '?' : event.actor}
        color={
          ACTOR_COLOR_BY_ROLE[event.actorRole] ??
          ACTOR_COLOR_BY_ROLE.Pengguna
        }
        size="md"
      />
      <div className="col" style={{ minWidth: 0 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--teal-800)',
          }}
        >
          {event.actor}
        </span>
        <span style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>
          Role: {event.actorRole}
        </span>
      </div>
    </div>
  );
}

function PropertiesGrid({ event }: { event: AuditEvent }) {
  const entityLabel = entityWordFromType(event.raw.entityType) ?? event.raw.entityType;
  const timeDisplay = event.timeRelative
    ? `${event.date} · ${event.time} WIB (${formatRelativeTime(event.iso)})`
    : `${event.date} · ${event.time} WIB`;

  const rows: [string, string, boolean?][] = [
    ['Waktu', timeDisplay],
    ['Kategori', categoryLabel(event.category)],
    ['Entitas', event.raw.entityId ? `${entityLabel} #${event.raw.entityId}` : entityLabel],
    ['Aksi', event.actionLabel],
    ['IP Akses', event.ipLabel],
    ['Perangkat', event.device],
    ['Catatan', event.meta],
  ];
  return (
    <div className="col" style={{ gap: 0 }}>
      {rows.map(([k, v, mono]) => (
        <div
          key={k}
          style={{
            padding: '10px 0',
            borderTop: '1px solid var(--border)',
            display: 'grid',
            gridTemplateColumns: '90px 1fr',
            gap: 10,
          }}
        >
          <span className="caption" style={{ paddingTop: 1 }}>
            {k}
          </span>
          <span
            style={{
              fontSize: 12.5,
              color: 'var(--teal-800)',
              lineHeight: 1.45,
              fontFamily: mono ? 'var(--font-mono, monospace)' : 'inherit',
              wordBreak: 'break-word',
            }}
          >
            {v}
          </span>
        </div>
      ))}
    </div>
  );
}

function DiffPreview({
  fields,
}: {
  fields: { key: string; before: unknown; after: unknown }[];
}) {
  const visible = fields.slice(0, 6);
  const overflow = fields.length - visible.length;
  return (
    <div className="col gap-2" style={{ marginTop: 16 }}>
      <span className="eyebrow">Perubahan data</span>
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 6,
          overflow: 'hidden',
          fontSize: 11.5,
          fontFamily: 'var(--font-mono, monospace)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            padding: '6px 10px',
            background: 'var(--cream-100)',
            borderBottom: '1px solid var(--border)',
            fontSize: 10,
            fontWeight: 700,
            color: 'var(--fg-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          <span>Field</span>
          <span>Sebelum</span>
          <span>Sesudah</span>
        </div>
        {visible.map((f, i) => (
          <div
            key={f.key}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              padding: '7px 10px',
              borderBottom: i < visible.length - 1 ? '1px solid var(--border)' : 'none',
              alignItems: 'start',
              gap: 4,
            }}
          >
            <span style={{ color: 'var(--fg-muted)', fontWeight: 600 }}>{f.key}</span>
            <span style={{ color: '#7a3328', textDecoration: 'line-through', opacity: 0.75 }}>
              {renderValue(f.before)}
            </span>
            <span style={{ color: '#2e5a37' }}>{renderValue(f.after)}</span>
          </div>
        ))}
      </div>
      {overflow > 0 ? (
        <span className="caption" style={{ fontSize: 11 }}>
          + {overflow} field lain disembunyikan
        </span>
      ) : null}
    </div>
  );
}

function Br04Note() {
  return (
    <div
      className="col gap-1"
      style={{
        marginTop: 16,
        padding: 12,
        background: 'var(--danger-soft)',
        border: '1px solid #e6c8c0',
        borderRadius: 8,
      }}
    >
      <span style={{ fontSize: 12.5, fontWeight: 600, color: '#7a3328' }}>
        Privasi antar psikolog
      </span>
      <span
        className="caption"
        style={{
          color: '#7a3328',
          fontSize: 11.5,
          lineHeight: 1.45,
        }}
      >
        Akses ke data klien yang bukan miliknya diblokir oleh sistem. Event ini
        tercatat untuk audit dan tidak memerlukan tindakan kecuali pola
        berulang.
      </span>
    </div>
  );
}

function ActionButtons({ event }: { event: AuditEvent }) {
  return (
    <div className="row gap-2" style={{ marginTop: 18 }}>
      <button
        type="button"
        className="btn btn-outline btn-sm"
        style={{ flex: 1 }}
        onClick={() => exportAuditCsv([event])}
      >
        <Download size={13} /> Ekspor event ini
      </button>
    </div>
  );
}

function SystemEventMarker() {
  return (
    <div
      className="row gap-2"
      style={{
        marginTop: 14,
        padding: 10,
        background: 'var(--bg-muted)',
        borderRadius: 6,
        alignItems: 'center',
      }}
    >
      <Calendar size={13} style={{ color: 'var(--fg-muted)' }} />
      <span className="caption" style={{ fontSize: 11.5 }}>
        Event otomatis · sistem/cron worker
      </span>
    </div>
  );
}
