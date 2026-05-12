import type { Psikolog } from '@/features/admin-psikolog/model/types';
import { toggleSet } from '../../model/filters';
import type { Filters } from '../../model/types';

/**
 * Filter section: psikolog (checkbox list, scrollable max-h 140px).
 */
export function PsikologFilterSection({
  filters,
  psikologs,
  onChange,
}: {
  filters: Filters;
  psikologs: Psikolog[];
  onChange: (next: Filters) => void;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <span
        className="caption"
        style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}
      >
        Psikolog ({filters.psikologIds.size}/{psikologs.length})
      </span>
      <div
        className="flex flex-col"
        style={{ gap: 4, maxHeight: 140, overflowY: 'auto' }}
      >
        {psikologs.map((p) => {
          const active = filters.psikologIds.has(p.userId);
          return (
            <label
              key={p.userId}
              className="flex items-center gap-2 cursor-pointer"
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                fontSize: 12.5,
                background: active ? 'var(--sage-50)' : 'transparent',
              }}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() =>
                  onChange({
                    ...filters,
                    psikologIds: toggleSet(filters.psikologIds, p.userId),
                  })
                }
                className="h-3.5 w-3.5"
              />
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {p.fullName ?? p.email}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
