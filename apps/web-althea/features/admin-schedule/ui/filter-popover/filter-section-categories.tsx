import {
  SVC_CATEGORIES,
  SVC_COLOR,
  SVC_LABEL,
} from '../../model/constants';
import { toggleSet } from '../../model/filters';
import type { Filters } from '../../model/types';

/**
 * Filter section: kategori layanan (4 chip toggle dengan warna kategori).
 */
export function CategoriesFilterSection({
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
        Kategori layanan
      </span>
      <div className="flex flex-wrap" style={{ gap: 6 }}>
        {SVC_CATEGORIES.map((cat) => {
          const active = filters.categories.has(cat);
          const c = SVC_COLOR[cat];
          return (
            <button
              key={cat}
              type="button"
              onClick={() =>
                onChange({
                  ...filters,
                  categories: toggleSet(filters.categories, cat),
                })
              }
              className="btn btn-sm"
              style={{
                height: 24,
                padding: '0 10px',
                fontSize: 11.5,
                background: active ? c.bar : 'var(--cream-100)',
                color: active ? '#fff' : 'var(--fg)',
                border:
                  '1px solid ' + (active ? c.bar : 'var(--border)'),
              }}
            >
              {SVC_LABEL[cat]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
