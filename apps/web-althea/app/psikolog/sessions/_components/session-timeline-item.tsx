import type { Booking } from '@/features/admin-booking/model/types';
import { formatSessionShort, formatTimeOnly } from '../_lib/sessions-utils';

export function SessionTimelineItem({
  b,
  selected,
  onClick,
}: {
  b: Booking;
  selected: boolean;
  onClick: () => void;
}) {
  const isCompleted = b.status === 'completed';
  const isInProgress = b.status === 'in_progress';
  return (
    <button
      type="button"
      onClick={onClick}
      className="card-althea-flat text-left"
      style={{
        padding: 12,
        background: selected ? 'var(--sage-50)' : 'var(--bg-elev, #fff)',
        border: '1px solid ' + (selected ? 'var(--sage-300)' : 'var(--border)'),
        cursor: 'pointer',
        width: '100%',
      }}
    >
      <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--teal-800)' }}>
        Sesi #{b.id} · {formatSessionShort(b.scheduledStart)}
      </span>
      <div className="caption" style={{ fontSize: 11, marginTop: 2 }}>
        {formatTimeOnly(b.scheduledStart)} · {b.room.name}
      </div>
      <div
        className="caption"
        style={{
          fontSize: 10.5,
          marginTop: 4,
          color: isCompleted
            ? 'var(--sage-700)'
            : isInProgress
              ? 'var(--success, #4f8c5b)'
              : 'var(--fg-muted)',
        }}
      >
        ●{' '}
        {isCompleted
          ? 'Selesai'
          : isInProgress
            ? 'Berlangsung'
            : b.status === 'checked_in'
              ? 'Check-in'
              : 'Akan datang'}
      </div>
    </button>
  );
}
