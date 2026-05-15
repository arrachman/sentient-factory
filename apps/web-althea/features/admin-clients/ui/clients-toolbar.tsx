'use client';

import { Plus, Search } from 'lucide-react';
import {
  CATEGORY_LABEL,
  CLIENT_CATEGORIES,
  STATUS_LABEL,
  type ClientCategory,
} from '../model/types';
import type { Filter } from '../model/page-helpers';

const FILTERS: Filter[] = ['semua', 'aktif', 'baru', 'selesai'];

/**
 * Toolbar atas halaman Klien:
 *   [tab pills: Semua/Aktif/Baru/Selesai]   [search] [kategori dropdown] [+ Klien Baru]
 */
export function ClientsToolbar({
  filter,
  counts,
  search,
  categoryFilter,
  onChangeFilter,
  onChangeSearch,
  onChangeCategory,
  onCreate,
}: {
  filter: Filter;
  counts: Record<Filter, number>;
  search: string;
  categoryFilter: ClientCategory | '';
  onChangeFilter: (next: Filter) => void;
  onChangeSearch: (next: string) => void;
  onChangeCategory: (next: ClientCategory | '') => void;
  onCreate: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <div className="inline-flex gap-1 bg-cream-100 rounded-lg p-[3px]">
        {FILTERS.map((f) => {
          const active = filter === f;
          const label = f === 'semua' ? 'Semua' : STATUS_LABEL[f];
          const count = counts[f];
          return (
            <button
              key={f}
              type="button"
              onClick={() => onChangeFilter(f)}
              className={`px-3 h-[30px] rounded-md text-sm font-medium transition-colors ${
                active
                  ? 'bg-card text-teal-800 shadow-sm'
                  : 'text-fg-muted hover:text-teal-800'
              }`}
            >
              {label}{' '}
              <span className="ml-1 text-[11px] opacity-70">{count}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
          <input
            type="search"
            placeholder="Cari nama, WA, MRN..."
            value={search}
            onChange={(e) => onChangeSearch(e.target.value)}
            className="input-althea pl-9 w-[260px] h-9 py-0"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) =>
            onChangeCategory(e.target.value as ClientCategory | '')
          }
          className="input-althea h-9 py-0 max-w-[150px]"
          aria-label="Filter kategori"
        >
          <option value="">Semua kategori</option>
          {CLIENT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABEL[c]}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onCreate}
          className="btn btn-primary btn-sm"
        >
          <Plus className="h-4 w-4" /> Klien Baru
        </button>
      </div>
    </div>
  );
}
