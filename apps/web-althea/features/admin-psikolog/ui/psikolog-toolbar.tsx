'use client';

import { Filter, Plus } from 'lucide-react';
import { FILTER_TABS } from '../model/page-helpers';

/**
 * Toolbar atas: filter chips kategori spesialty + Sortir + Tambah Psikolog.
 */
export function PsikologToolbar({
  filter,
  onChangeFilter,
  onCreate,
}: {
  filter: string;
  onChangeFilter: (next: string) => void;
  onCreate: () => void;
}) {
  return (
    <div
      style={{
        padding: '18px 28px 10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
      }}
    >
      <div
        className="flex items-center"
        style={{
          background: 'var(--cream-100)',
          borderRadius: 8,
          padding: 3,
          gap: 2,
        }}
      >
        {FILTER_TABS.map((t) => {
          const active = filter === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChangeFilter(t.key)}
              className="btn btn-sm"
              style={{
                padding: '0 12px',
                background: active ? 'var(--bg-elev, #fff)' : 'transparent',
                boxShadow: active
                  ? 'var(--shadow-xs, 0 1px 2px rgba(0,0,0,0.05))'
                  : 'none',
                color: active ? 'var(--teal-800)' : 'var(--fg-muted)',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <button type="button" className="btn btn-outline btn-sm">
          <Filter size={14} /> Sortir
        </button>
        <button
          type="button"
          onClick={onCreate}
          className="btn btn-primary btn-sm"
        >
          <Plus size={15} style={{ stroke: '#fff' }} /> Tambah Psikolog
        </button>
      </div>
    </div>
  );
}
