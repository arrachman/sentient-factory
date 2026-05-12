import Link from 'next/link';
import { Edit } from 'lucide-react';
import type { ReactNode } from 'react';
import { Toggle } from './toggle';

export type Recipient = { id: string; label: string; on: boolean };

/**
 * Row card untuk satu event notifikasi:
 *   [judul + hint + (template chips)]   [extra]   [recipient toggles]
 *
 * Template chip = ke `/admin/notif-wa?tpl=<id>` dengan optional label
 * (klien/psikolog/staff) ditampilkan kalau lebih dari satu template.
 */
export function NotifEventRow({
  title,
  hint,
  recipients = [],
  danger = false,
  extra,
  badge,
  templates,
}: {
  title: string;
  hint?: string;
  recipients?: Recipient[];
  danger?: boolean;
  extra?: ReactNode;
  badge?: string;
  templates?: { id: string; label?: string }[];
}) {
  return (
    <div
      className="flex items-center gap-3"
      style={{
        padding: '12px 14px',
        border: '1px solid var(--border)',
        borderRadius: 8,
        flexWrap: 'wrap',
      }}
    >
      <div className="flex flex-col" style={{ flex: 1, minWidth: 220 }}>
        <div
          className="flex items-center gap-2"
          style={{ flexWrap: 'wrap' }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: danger ? '#a14a4a' : 'var(--teal-800)',
            }}
          >
            {title}
          </span>
          {badge ? (
            <span
              className="badge badge-neutral"
              style={{ height: 18, fontSize: 10 }}
            >
              {badge}
            </span>
          ) : null}
        </div>
        {hint ? (
          <span className="caption" style={{ marginTop: 2 }}>
            {hint}
          </span>
        ) : null}
        {Array.isArray(templates) && templates.length > 0 ? (
          <div
            className="flex gap-1 flex-wrap"
            style={{ marginTop: 6 }}
          >
            {templates.map((t) => (
              <Link
                key={t.id}
                href={{ pathname: '/admin/notif-wa', query: { tpl: t.id } }}
                className="btn btn-ghost btn-sm"
                style={{
                  height: 22,
                  padding: '0 8px',
                  fontSize: 11,
                  color: 'var(--sage-700)',
                  background: 'var(--sage-50)',
                  border: '1px solid var(--sage-200)',
                  borderRadius: 999,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  textDecoration: 'none',
                }}
                title={`Buka template editor (${t.id})`}
              >
                <Edit size={10} style={{ stroke: 'var(--sage-700)' }} /> Edit
                pesan
                {t.label ? (
                  <span style={{ opacity: 0.7, marginLeft: 4 }}>
                    · {t.label}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
      {extra ? <div style={{ flexShrink: 0 }}>{extra}</div> : null}
      {recipients.length > 0 ? (
        <div
          className="flex items-center gap-3"
          style={{ flexShrink: 0 }}
        >
          {recipients.map((r) => (
            <Toggle key={r.id} on={r.on} label={r.label} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
