/**
 * Card booking di sel grid HariView — color-coded by service category,
 * 3px left bar, nama klien + service + room badge + sesi N/total badge.
 */
import type { Booking } from '@/features/admin-booking/model/types';
import { SVC_COLOR } from '../../model/constants';

export function BookingCard({ b }: { b: Booking }) {
  const c = SVC_COLOR[b.service.category] ?? SVC_COLOR.konseling;
  return (
    <div
      style={{
        background: c.fill,
        borderRadius: 8,
        borderLeft: `3px solid ${c.bar}`,
        padding: '8px 9px',
        height: '100%',
        cursor: 'pointer',
      }}
      title={`#${b.id} · ${b.client.name}`}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: c.text,
          marginBottom: 3,
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {b.client.name}
      </div>
      <div
        style={{
          fontSize: 10.5,
          color: c.text,
          opacity: 0.8,
          lineHeight: 1.3,
          marginBottom: 5,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {b.service.name}
      </div>
      <div className="flex flex-wrap" style={{ gap: 4 }}>
        <Badge text={b.room.name} color={c.text} />
        {b.sessionTotal > 1 ? (
          <Badge
            text={`sesi ${b.sessionN}/${b.sessionTotal}`}
            color={c.text}
          />
        ) : null}
      </div>
    </div>
  );
}

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span
      style={{
        fontSize: 10,
        padding: '1px 6px',
        background: 'rgba(255,255,255,0.6)',
        borderRadius: 4,
        color,
        fontWeight: 500,
      }}
    >
      {text}
    </span>
  );
}
