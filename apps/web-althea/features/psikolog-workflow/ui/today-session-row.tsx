import type { Booking } from '@/features/admin-booking/model/types';
import { bookingTone, formatTime, shortService } from '../model/format';

/**
 * Row sesi hari ini — time prefix + nama klien + service+room. Status badge
 * berbeda per tone (Selesai/Berlangsung/Buka button).
 */
export function TodaySessionRow({ b }: { b: Booking }) {
  const tone = bookingTone(b);
  return (
    <div
      className="flex items-center gap-3"
      style={{
        padding: 14,
        borderRadius: 10,
        background:
          tone === 'now' ? 'var(--sage-50)' : 'var(--cream-50)',
        border:
          '1px solid ' +
          (tone === 'now' ? 'var(--sage-300)' : 'transparent'),
        opacity: tone === 'done' ? 0.62 : 1,
      }}
    >
      <div
        className="flex flex-col"
        style={{ width: 60, flexShrink: 0 }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--teal-800)',
            fontFamily: 'var(--font-serif)',
          }}
        >
          {formatTime(b.scheduledStart)}
        </span>
      </div>
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
          title={b.client.name}
        >
          {b.client.name}
        </span>
        <span className="caption" style={{ marginTop: 2 }}>
          {shortService(b.service.name, b.sessionN, b.sessionTotal)} ·{' '}
          {b.room.name}
        </span>
      </div>
      {tone === 'done' ? (
        <span
          className="badge"
          style={{
            background: 'var(--cream-200)',
            color: 'var(--fg-muted)',
            height: 22,
          }}
        >
          Selesai
        </span>
      ) : null}
      {tone === 'now' ? (
        <span className="badge badge-sage" style={{ height: 22 }}>
          Berlangsung
        </span>
      ) : null}
      {tone === 'next' ? (
        <button type="button" className="btn btn-ghost btn-sm">
          Buka
        </button>
      ) : null}
    </div>
  );
}
