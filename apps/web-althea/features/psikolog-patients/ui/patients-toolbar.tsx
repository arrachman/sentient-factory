'use client';

/**
 * Toolbar halaman Klien saya: status tabs (Semua/Aktif/Baru/Selesai) +
 * search + filter kategori + sort by + counter di kanan.
 */
import { Search } from 'lucide-react';
import {
  CATEGORY_OPTIONS,
  type CategoryOption,
  type SortKey,
  type StatusTab,
} from '../model/types';

const STATUS_TABS: StatusTab[] = ['Semua', 'Aktif', 'Baru', 'Selesai'];

export function PatientsToolbar({
  statusTab,
  onChangeStatusTab,
  query,
  onChangeQuery,
  katFilter,
  onChangeKat,
  sortBy,
  onChangeSort,
  counts,
  todayCount,
  totalCount,
  visibleCount,
}: {
  statusTab: StatusTab;
  onChangeStatusTab: (t: StatusTab) => void;
  query: string;
  onChangeQuery: (q: string) => void;
  katFilter: CategoryOption;
  onChangeKat: (c: CategoryOption) => void;
  sortBy: SortKey;
  onChangeSort: (s: SortKey) => void;
  counts: Record<StatusTab, number>;
  todayCount: number;
  totalCount: number;
  visibleCount: number;
}) {
  return (
    <div className="flex flex-wrap items-center" style={{ gap: 12 }}>
      <div
        className="flex items-center"
        style={{
          background: 'var(--bg-elev, #fff)',
          padding: 4,
          borderRadius: 8,
          border: '1px solid var(--border)',
          gap: 2,
        }}
      >
        {STATUS_TABS.map((t) => {
          const sel = t === statusTab;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onChangeStatusTab(t)}
              className="btn btn-sm"
              style={{
                height: 28,
                padding: '0 12px',
                background: sel ? 'var(--sage-500)' : 'transparent',
                color: sel ? '#fff' : 'var(--fg)',
                fontWeight: sel ? 600 : 500,
              }}
            >
              {t}{' '}
              <span style={{ marginLeft: 4, opacity: 0.8 }}>{counts[t]}</span>
            </button>
          );
        })}
      </div>

      <div
        style={{
          position: 'relative',
          flex: 1,
          minWidth: 200,
          maxWidth: 280,
        }}
      >
        <Search
          size={14}
          style={{
            position: 'absolute',
            left: 11,
            top: 10,
            color: 'var(--fg-muted)',
            pointerEvents: 'none',
          }}
        />
        <input
          className="input-althea"
          value={query}
          onChange={(e) => onChangeQuery(e.target.value)}
          placeholder="Cari nama klien atau layanan…"
          style={{ paddingLeft: 32, height: 34, fontSize: 13 }}
        />
      </div>

      <select
        className="input-althea"
        value={katFilter}
        onChange={(e) => onChangeKat(e.target.value as CategoryOption)}
        style={{ height: 34, fontSize: 12.5, width: 'auto', minWidth: 150 }}
      >
        {CATEGORY_OPTIONS.map((c) => (
          <option key={c} value={c}>
            {c === 'Semua' ? 'Semua kategori' : c}
          </option>
        ))}
      </select>

      <select
        className="input-althea"
        value={sortBy}
        onChange={(e) => onChangeSort(e.target.value as SortKey)}
        style={{ height: 34, fontSize: 12.5, width: 'auto', minWidth: 180 }}
      >
        <option value="next">Urut: sesi terdekat</option>
        <option value="name">Urut: nama A–Z</option>
        <option value="risk">Urut: risiko tertinggi</option>
      </select>

      <span style={{ flex: 1 }} />

      <span
        className="caption"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        <strong style={{ color: 'var(--sage-700)' }}>
          {todayCount} hari ini
        </strong>{' '}
        · {visibleCount}/{totalCount} klien
      </span>
    </div>
  );
}
