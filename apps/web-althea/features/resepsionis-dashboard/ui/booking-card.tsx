'use client';

import { MessageCircle, X } from 'lucide-react';
import type { Booking } from '@/features/admin-booking/model/types';
import { SVC_COLOR } from '@/features/admin-schedule/model/constants';
import {
  computeRelative,
  fmtTime,
  normalizeWa,
} from './resepsionis-dashboard.helpers';

export function BookingCard({
  b,
  now,
  primary,
  onCancel,
}: {
  b: Booking;
  now: Date | null;
  primary?: {
    label: string;
    icon: React.ReactNode;
    onClick: (id: number) => void;
    pending: boolean;
  };
  onCancel?: (id: number) => void;
}) {
  const color = SVC_COLOR[b.service.category] ?? SVC_COLOR.konseling;
  const rel = computeRelative(b, now);

  return (
    <li
      style={{
        background: color.fill,
        borderLeft: `4px solid ${color.bar}`,
        borderRadius: 8,
        padding: '10px 12px',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--teal-800)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {fmtTime(b.scheduledStart)}–{fmtTime(b.scheduledEnd)}
            </span>
            {rel && (
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  padding: '1px 7px',
                  borderRadius: 999,
                  background: rel.tone === 'late' ? '#fde2dc' : '#e6efe8',
                  color: rel.tone === 'late' ? '#a4452f' : 'var(--sage-700)',
                  whiteSpace: 'nowrap',
                }}
              >
                {rel.text}
              </span>
            )}
            {b.createdViaWalkIn && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: 4,
                  background: 'var(--cream-100)',
                  color: 'var(--fg-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Walk-in
              </span>
            )}
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 13.5,
              fontWeight: 600,
              color: 'var(--teal-800)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={b.client.name}
          >
            {b.client.name}
          </div>

          <div
            className="caption"
            style={{ fontSize: 11.5, marginTop: 2 }}
            title={`${b.service.name} · ${b.psikolog.fullName ?? b.psikolog.email} · ${b.room.name}`}
          >
            {b.service.name} ·{' '}
            <span style={{ color: 'var(--teal-700)' }}>
              {b.psikolog.fullName ?? b.psikolog.email}
            </span>{' '}
            · {b.room.name}
          </div>
        </div>

        {b.client.phoneWa && (
          <a
            href={`https://wa.me/${normalizeWa(b.client.phoneWa)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp ${b.client.name}`}
            title={`WhatsApp ${b.client.phoneWa}`}
            style={{
              flexShrink: 0,
              width: 28,
              height: 28,
              borderRadius: 999,
              background: 'var(--sage-100)',
              color: 'var(--sage-700)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <MessageCircle size={14} strokeWidth={2.2} />
          </a>
        )}
      </div>

      {(primary || onCancel) && (
        <div className="flex items-center gap-2" style={{ marginTop: 10 }}>
          {primary && (
            <button
              type="button"
              onClick={() => primary.onClick(b.id)}
              disabled={primary.pending}
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
            >
              {primary.icon}
              <span>{primary.label}</span>
            </button>
          )}
          {onCancel && (
            <button
              type="button"
              onClick={() => onCancel(b.id)}
              className="btn btn-ghost btn-sm"
              title="Batalkan booking"
              style={{ color: 'var(--fg-muted)' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}
    </li>
  );
}
