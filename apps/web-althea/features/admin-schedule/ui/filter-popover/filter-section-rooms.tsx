import { toggleSet } from '../../model/filters';
import type { Filters } from '../../model/types';

/**
 * Filter section: ruangan (chip toggle horizontal).
 */
export function RoomsFilterSection({
  filters,
  rooms,
  onChange,
}: {
  filters: Filters;
  rooms: Array<{ id: number; name: string; type: string }>;
  onChange: (next: Filters) => void;
}) {
  if (rooms.length === 0) return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <span
        className="caption"
        style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}
      >
        Ruangan ({filters.roomIds.size}/{rooms.length})
      </span>
      <div className="flex flex-wrap" style={{ gap: 6 }}>
        {rooms.map((r) => {
          const active = filters.roomIds.has(r.id);
          return (
            <button
              key={r.id}
              type="button"
              onClick={() =>
                onChange({
                  ...filters,
                  roomIds: toggleSet(filters.roomIds, r.id),
                })
              }
              className="btn btn-sm"
              style={{
                height: 22,
                padding: '0 8px',
                fontSize: 11,
                background: active ? 'var(--teal-700)' : 'var(--cream-100)',
                color: active ? '#fff' : 'var(--fg)',
                border:
                  '1px solid ' +
                  (active ? 'var(--teal-700)' : 'var(--border)'),
              }}
            >
              {r.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
