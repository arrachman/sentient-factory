'use client';

import * as React from 'react';
import { Icon } from '@/components/ui/icons';
import { Kbd } from '@/components/ui/kbd';
import {
  genKasMasuk,
  STATUSES,
  CABANGS,
  LOKASIS,
  USERS,
  type KasMasukRow,
  type Translator,
} from '@/lib/mock';
import {
  FilterChip,
  DateRangeChip,
  AddFilterChip,
} from '@/components/organisms/filter-chips';
import { useTabKey } from '@/lib/tab-context';
import { notify, bulkAction } from '@/lib/feedback';
import {
  KasMasukTable,
  KasMasukPager,
  KasMasukBulkBar,
} from '@/components/pages/kas-masuk-list-parts';

interface KasMasukListProps {
  t: Translator;
  lang?: 'id' | 'en';
  onNavigate: (r: string) => void;
  onOpenTab?: (r: string) => void;
}

interface FilterState {
  status: string;
  from: string;
  to: string;
  lokasi: string;
  cabang: string;
  user: string;
}

interface SortState {
  col: keyof KasMasukRow;
  dir: 'asc' | 'desc';
}

const PAGE_SIZE = 24;

const DEFAULT_FILTERS: FilterState = {
  status: 'Semua',
  from: '01/05/2026',
  to: '12/05/2026',
  lokasi: 'Semua',
  cabang: 'PCI',
  user: 'Semua',
};

/** Kas Masuk list view — ported from prototype `pages/kas-masuk-list.jsx`. */
export function KasMasukList({
  t,
  onNavigate,
  onOpenTab,
}: KasMasukListProps) {
  const openForm = () => (onOpenTab || onNavigate)('kas-masuk-new');
  const [rows] = React.useState<KasMasukRow[]>(() => genKasMasuk(64));
  const [q, setQ] = React.useState('');
  const [filters, setFilters] = React.useState<FilterState>(DEFAULT_FILTERS);
  const [activeFilters, setActiveFilters] = React.useState<string[]>([
    'status',
    'tanggal',
    'cabang',
  ]);
  const [selected, setSelected] = React.useState<Set<number>>(new Set());
  const [sort, setSort] = React.useState<SortState>({
    col: 'tanggal',
    dir: 'desc',
  });
  const [page, setPage] = React.useState(1);
  const [focused, setFocused] = React.useState(0);
  const tblRef = React.useRef<HTMLDivElement>(null);

  const filtered = React.useMemo(() => {
    let arr = rows.filter((r) => {
      if (filters.status !== 'Semua' && r.status !== filters.status)
        return false;
      if (filters.cabang !== 'Semua' && r.cabang !== filters.cabang)
        return false;
      if (filters.lokasi !== 'Semua' && r.lokasi !== filters.lokasi)
        return false;
      if (filters.user !== 'Semua' && r.user !== filters.user) return false;
      if (q) {
        const ql = q.toLowerCase();
        if (
          ![r.no, r.terimaDari, r.uraian, r.status, r.cabang, r.user].some(
            (v) => String(v).toLowerCase().includes(ql),
          )
        )
          return false;
      }
      return true;
    });
    arr = [...arr].sort((a, b) => {
      let av: string | number = a[sort.col];
      let bv: string | number = b[sort.col];
      if (sort.col === 'total') {
        av = Number(av);
        bv = Number(bv);
      }
      if (av < bv) return sort.dir === 'asc' ? -1 : 1;
      if (av > bv) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [rows, q, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const view = filtered.slice(start, start + PAGE_SIZE);

  const toggle = (id: number) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const toggleAll = () =>
    setSelected((s) =>
      view.every((r) => s.has(r.id))
        ? new Set([...s].filter((id) => !view.find((r) => r.id === id)))
        : new Set([...s, ...view.map((r) => r.id)]),
    );
  const allSelected = view.length > 0 && view.every((r) => selected.has(r.id));
  const someSelected =
    view.some((r) => selected.has(r.id)) && !allSelected;
  const clearSel = () => setSelected(new Set());

  useTabKey((e) => {
    if (
      ['INPUT', 'TEXTAREA', 'SELECT'].includes(
        (e.target as HTMLElement).tagName,
      )
    )
      return;
    if (e.key === 'j' || e.key === 'ArrowDown') {
      e.preventDefault();
      setFocused((f) => Math.min(view.length - 1, f + 1));
    } else if (e.key === 'k' || e.key === 'ArrowUp') {
      e.preventDefault();
      setFocused((f) => Math.max(0, f - 1));
    } else if (e.key === 'x' || e.key === ' ') {
      e.preventDefault();
      if (view[focused]) toggle(view[focused].id);
    } else if (e.key.toLowerCase() === 'n') {
      e.preventDefault();
      openForm();
    } else if (e.key === 'Enter' && view[focused]) {
      e.preventDefault();
      openForm();
    }
  });

  const setSortCol = (col: keyof KasMasukRow) =>
    setSort((s) => ({
      col,
      dir: s.col === col && s.dir === 'asc' ? 'desc' : 'asc',
    }));
  const sortInd = (col: keyof KasMasukRow) =>
    sort.col !== col ? null : (
      <span className="sort-ind">
        <Icon name={sort.dir === 'asc' ? 'chevup' : 'chevdown'} size={10} />
      </span>
    );
  const setF = (k: keyof FilterState, v: string) => {
    setFilters((f) => ({ ...f, [k]: v }));
    setPage(1);
  };
  const removeF = (id: string) =>
    setActiveFilters((a) => a.filter((x) => x !== id));
  const bulk = (kind: string) =>
    bulkAction(kind, selected.size, clearSel);

  const availFilters = [
    { id: 'status', label: t('Status') },
    { id: 'tanggal', label: t('Tanggal') },
    { id: 'cabang', label: t('Cabang') },
    { id: 'lokasi', label: t('Lokasi') },
    { id: 'user', label: t('User') },
  ].filter((f) => !activeFilters.includes(f.id));

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">
          {t('Kas Masuk')}
          <span className="code-tag">CR</span>
        </h1>
        <div className="page-actions">
          <div className="search-input">
            <Icon name="search" size={12} />
            <input
              placeholder={t('Cari semua...')}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
            <Kbd>/</Kbd>
          </div>
          <button
            className="btn"
            onClick={() =>
              notify(`${filtered.length} baris diekspor (.xlsx)`, 'success')
            }
          >
            <Icon name="download" size={12} /> {t('Export')}
          </button>
          <button
            className="btn"
            onClick={() => notify('Data dimuat ulang', 'info')}
          >
            <Icon name="refresh" size={12} />
          </button>
          <div className="btn-split">
            <button className="btn primary" onClick={() => openForm()}>
              <Icon name="plus" size={12} /> {t('Tambah')} <Kbd>N</Kbd>
            </button>
            <button className="btn primary">
              <Icon name="chevdown" size={12} />
            </button>
          </div>
        </div>
      </div>

      <div className="toolbar">
        <Icon name="filter" size={13} className="muted" />
        {activeFilters.includes('status') && (
          <FilterChip
            label={t('Status')}
            val={filters.status}
            options={['Semua', ...STATUSES]}
            onChange={(v) => setF('status', v)}
            onRemove={() => removeF('status')}
          />
        )}
        {activeFilters.includes('tanggal') && (
          <DateRangeChip
            from={filters.from}
            to={filters.to}
            onChange={(f, to) => {
              setFilters((s) => ({ ...s, from: f, to }));
              setPage(1);
            }}
            onRemove={() => removeF('tanggal')}
          />
        )}
        {activeFilters.includes('cabang') && (
          <FilterChip
            label={t('Cabang')}
            val={filters.cabang}
            options={['Semua', ...CABANGS]}
            onChange={(v) => setF('cabang', v)}
            onRemove={() => removeF('cabang')}
          />
        )}
        {activeFilters.includes('lokasi') && (
          <FilterChip
            label={t('Lokasi')}
            val={filters.lokasi}
            options={['Semua', ...LOKASIS]}
            onChange={(v) => setF('lokasi', v)}
            onRemove={() => removeF('lokasi')}
          />
        )}
        {activeFilters.includes('user') && (
          <FilterChip
            label={t('User')}
            val={filters.user}
            options={['Semua', ...USERS]}
            onChange={(v) => setF('user', v)}
            onRemove={() => removeF('user')}
          />
        )}
        <AddFilterChip
          available={availFilters}
          onAdd={(id) => setActiveFilters((a) => [...a, id])}
          t={t}
        />
        <div style={{ flex: 1 }} />
        <span className="muted" style={{ fontSize: 11.5 }}>
          {filtered.length} {t('baris')}
        </span>
        <span className="muted" style={{ fontSize: 11.5 }}>
          ·
        </span>
        <button
          className="btn ghost sm"
          onClick={() => {
            setFilters(DEFAULT_FILTERS);
            setQ('');
            setPage(1);
          }}
        >
          {t('Reset')}
        </button>
      </div>

      <KasMasukTable
        t={t}
        tblRef={tblRef}
        view={view}
        selected={selected}
        focused={focused}
        allSelected={allSelected}
        someSelected={someSelected}
        toggle={toggle}
        toggleAll={toggleAll}
        setFocused={setFocused}
        setSortCol={setSortCol}
        sortInd={sortInd}
        openForm={openForm}
      />

      <KasMasukPager
        t={t}
        safePage={safePage}
        totalPages={totalPages}
        viewLen={view.length}
        filteredLen={filtered.length}
        setPage={setPage}
      />

      {selected.size > 0 && (
        <KasMasukBulkBar
          t={t}
          count={selected.size}
          bulk={bulk}
          clearSel={clearSel}
        />
      )}
    </div>
  );
}
