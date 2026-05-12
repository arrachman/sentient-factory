import {
  BOOKING_STATUSES,
  STATUS_LABEL,
} from '@/features/admin-booking/model/types';
import { toggleSet } from '../../model/filters';
import type { Filters } from '../../model/types';

/**
 * Filter section: status booking (multi-select chips).
 * Cancelled di-skip karena `includeCancelled: false` di query.
 */
export function StatusFilterSection({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <span
        className="caption"
        style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}
      >
        Status booking
      </span>
      <div className="flex flex-wrap" style={{ gap: 6 }}>
        {BOOKING_STATUSES.filter((s) => s !== 'cancelled').map((status) => {
          const active = filters.statuses.has(status);
          return (
            <button
              key={status}
              type="button"
              onClick={() =>
                onChange({
                  ...filters,
                  statuses: toggleSet(filters.statuses, status),
                })
              }
              className="btn btn-sm"
              style={{
                height: 24,
                padding: '0 10px',
                fontSize: 11.5,
                background: active ? 'var(--sage-500)' : 'var(--cream-100)',
                color: active ? '#fff' : 'var(--fg)',
                border:
                  '1px solid ' +
                  (active ? 'var(--sage-500)' : 'var(--border)'),
              }}
            >
              {STATUS_LABEL[status]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
