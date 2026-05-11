import type { Booking } from '@/features/admin-booking/model/types';
import { SLOT_HEIGHT } from '../model/constants';
import { bookingTone } from '../model/format';

/**
 * Booking block (absolute) di kolom hari — warna sesuai tone:
 *   now   → sage solid (white text)
 *   next  → sage soft
 *   done  → cream (faded)
 */
export function BookingBlock({
  b,
  slotIdx,
  span,
}: {
  b: Booking;
  slotIdx: number;
  span: number;
}) {
  const tone = bookingTone(b);
  const isNow = tone === 'now';
  const isDone = tone === 'done';
  return (
    <div
      style={{
        position: 'absolute',
        top: slotIdx * SLOT_HEIGHT + 2,
        left: 4,
        right: 4,
        height: span * SLOT_HEIGHT - 4,
        padding: '8px 10px',
        borderRadius: 6,
        background: isNow
          ? 'var(--sage-500)'
          : isDone
            ? 'var(--cream-200)'
            : 'var(--sage-100)',
        border:
          '1px solid ' +
          (isNow
            ? 'var(--sage-700)'
            : isDone
              ? 'var(--border-strong)'
              : 'var(--sage-300)'),
        color: isNow
          ? '#fff'
          : isDone
            ? 'var(--fg-muted)'
            : 'var(--sage-800)',
        opacity: isDone ? 0.7 : 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        fontSize: 11,
        lineHeight: 1.3,
        cursor: 'pointer',
        overflow: 'hidden',
      }}
      title={`${b.client.name} · ${b.service.name}`}
    >
      <span
        style={{
          fontWeight: 600,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {b.client.name}
      </span>
      <span style={{ fontSize: 10, opacity: 0.85 }}>
        {b.room.name}
        {b.sessionTotal > 1
          ? ` · sesi ${b.sessionN}/${b.sessionTotal}`
          : ''}
      </span>
      {isNow ? (
        <span
          style={{ fontSize: 10, fontWeight: 600, marginTop: 'auto' }}
        >
          ● Berlangsung
        </span>
      ) : null}
    </div>
  );
}
