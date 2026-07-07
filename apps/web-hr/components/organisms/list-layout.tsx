'use client';

/**
 * Shared chrome for HR CRUD list pages — the §2.7 list standard ported from the
 * web-erp ErpListLayout, adapted to HR (no i18n; reuses HR Icon/Kbd/Select and
 * the Fase-1 shell CSS: .page / .page-header / .search-input / .filter-bar /
 * .filter-summary / .page-body). Provides: action bar (search/export/refresh/
 * add), filter + summary bar, loading/error states, keyboard-first nav (/ n ← →
 * j k x Enter), and a pagination footer.
 *
 * Atomic tier: Organism. The data table is passed as `children` (HR DataTable or
 * any richer grid), so this owns the surrounding chrome only.
 */

import * as React from 'react';
import { Icon } from '@/components/ui/icons';
import { Kbd } from '@/components/ui/kbd';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface FilterOption {
  label: string;
  value: string;
}
export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}
export interface SummaryConfig {
  metricLabel: string;
  metricValue?: string;
  rowCount: number;
  totalCount?: number;
}
export interface ListPagination {
  page: number;
  pageCount: number;
  totalRows: number;
  onPage: (page: number) => void;
}
/** Wires j/k/x/Enter row nav to a table rendered inside HrListLayout. */
export interface KeyboardRowConfig {
  rowCount: number;
  focusedIndex: number;
  onFocusChange: (i: number) => void;
  onToggle: (i: number) => void;
  onOpen?: (i: number) => void;
}

const ALL_VAL = '_all';
const toSel = (v: string) => v || ALL_VAL;
const fromSel = (v: string) => (v === ALL_VAL ? '' : v);

interface HrListLayoutProps {
  title: string;
  code: string;
  loading?: boolean;
  error?: string | null;
  /** Omit to hide the search box (views without a searchable field). */
  search?: string;
  onSearch?: (q: string) => void;
  onAdd?: () => void;
  onRefresh: () => void;
  onExport?: () => void;
  addLabel?: string;
  filters?: FilterConfig[];
  /** Custom filter controls (e.g. date-range inputs) rendered in the filter bar. */
  toolbar?: React.ReactNode;
  summary?: SummaryConfig;
  pagination?: ListPagination;
  keyboardRows?: KeyboardRowConfig;
  keyboardHints?: boolean;
  children: React.ReactNode;
}

export function HrListLayout({
  title,
  code,
  loading,
  error,
  search,
  onSearch,
  onAdd,
  onRefresh,
  onExport,
  addLabel,
  filters,
  toolbar,
  summary,
  pagination,
  keyboardRows,
  keyboardHints = true,
  children,
}: HrListLayoutProps) {
  const searchRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const kr = keyboardRows;
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const inField =
        t.tagName === 'INPUT' ||
        t.tagName === 'TEXTAREA' ||
        t.tagName === 'SELECT' ||
        t.isContentEditable ||
        !!t.closest('[role="dialog"]');

      if (e.key === '/' && !inField) {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }
      if (e.key === 'n' && !inField && !e.metaKey && !e.ctrlKey && onAdd) {
        e.preventDefault();
        onAdd();
        return;
      }
      if (e.key === 'ArrowLeft' && !inField && !e.metaKey && pagination && pagination.page > 1) {
        e.preventDefault();
        pagination.onPage(pagination.page - 1);
        return;
      }
      if (
        e.key === 'ArrowRight' &&
        !inField &&
        !e.metaKey &&
        pagination &&
        pagination.page < pagination.pageCount
      ) {
        e.preventDefault();
        pagination.onPage(pagination.page + 1);
        return;
      }
      if (!inField && kr && kr.rowCount > 0) {
        if (e.key === 'j' || e.key === 'J' || e.key === 'ArrowDown') {
          e.preventDefault();
          kr.onFocusChange(Math.min(Math.max(kr.focusedIndex, 0) + 1, kr.rowCount - 1));
          return;
        }
        if (e.key === 'k' || e.key === 'K' || e.key === 'ArrowUp') {
          e.preventDefault();
          kr.onFocusChange(Math.max(kr.focusedIndex <= 0 ? 0 : kr.focusedIndex - 1, 0));
          return;
        }
        if ((e.key === 'x' || e.key === 'X' || e.key === ' ') && kr.focusedIndex >= 0) {
          e.preventDefault();
          kr.onToggle(kr.focusedIndex);
          return;
        }
        if (e.key === 'Enter' && kr.focusedIndex >= 0 && kr.onOpen) {
          e.preventDefault();
          kr.onOpen(kr.focusedIndex);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onAdd, pagination, keyboardRows]);

  const hasActiveFilter = filters?.some((f) => f.value !== '');
  const handleReset = () => filters?.forEach((f) => f.onChange(''));
  const showSearch = onSearch !== undefined;
  const showFilterBar = (filters && filters.length > 0) || !!toolbar || !!summary;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">
          {title}
          <span className="code-tag">{code}</span>
        </h1>
        <div className="page-actions">
          {showSearch && (
            <div className="search-input">
              <Icon name="search" size={12} />
              <input
                ref={searchRef}
                placeholder="Cari…"
                value={search ?? ''}
                onChange={(e) => onSearch?.(e.target.value)}
              />
              <Kbd>/</Kbd>
            </div>
          )}
          {onExport && (
            <button className="btn" onClick={onExport} title="Export data">
              <Icon name="download" size={12} /> Export
            </button>
          )}
          <button className="btn" onClick={onRefresh} title="Muat ulang">
            <Icon name="refresh" size={12} />
          </button>
          {onAdd && (
            <button className="btn primary" onClick={onAdd}>
              <Icon name="plus" size={12} /> {addLabel ?? 'Tambah'} <Kbd>N</Kbd>
            </button>
          )}
        </div>
      </div>

      {showFilterBar && (
        <div className="filter-bar">
          {filters?.map((f) => (
            <Select key={f.key} value={toSel(f.value)} onValueChange={(v) => f.onChange(fromSel(v))}>
              <SelectTrigger style={{ width: 'auto', minWidth: '8rem' }}>
                <span style={{ color: 'var(--fg-faint)', marginRight: 2 }}>{f.label}:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {f.options.map((o) => (
                  <SelectItem key={toSel(o.value)} value={toSel(o.value)}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          {toolbar}

          <div style={{ flex: 1 }} />

          {summary && (
            <span className="filter-summary">
              {summary.metricLabel}
              {summary.metricValue && (
                <>
                  {' '}
                  <strong>{summary.metricValue}</strong>
                </>
              )}
              {' · '}
              <strong>{summary.rowCount}</strong> baris
              {summary.totalCount !== undefined && summary.totalCount !== summary.rowCount && (
                <> dari {summary.totalCount}</>
              )}
            </span>
          )}

          {hasActiveFilter && (
            <button className="btn ghost sm" onClick={handleReset}>
              <Icon name="x" size={11} /> Reset filter
            </button>
          )}
        </div>
      )}

      <div className="page-body">
        {error ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm font-medium text-danger">Gagal memuat data</p>
            <p className="max-w-sm text-xs text-muted-foreground">{error}</p>
            <button className="btn" onClick={onRefresh}>
              <Icon name="refresh" size={12} /> Coba lagi
            </button>
          </div>
        ) : loading ? (
          <div className="flex min-h-[200px] items-center justify-center text-xs text-muted-foreground">
            Memuat…
          </div>
        ) : (
          children
        )}
      </div>

      {(pagination || keyboardHints) && (
        <div className="page-footer flex items-center gap-3 border-t px-4 py-2 text-xs text-muted-foreground">
          {pagination && (
            <span>
              Halaman {pagination.page} dari {pagination.pageCount} · {pagination.totalRows} baris
            </span>
          )}
          <div style={{ flex: 1 }} />
          {keyboardHints && (
            <span className="hidden items-center gap-2 sm:flex">
              <Kbd>/</Kbd> cari <Kbd>N</Kbd> tambah <Kbd>J</Kbd>/<Kbd>K</Kbd> baris
            </span>
          )}
          {pagination && pagination.pageCount > 1 && (
            <span className="flex items-center gap-1">
              <button
                className="btn sm"
                disabled={pagination.page <= 1}
                onClick={() => pagination.onPage(pagination.page - 1)}
              >
                <Icon name="chevleft" size={12} />
              </button>
              <button
                className="btn sm"
                disabled={pagination.page >= pagination.pageCount}
                onClick={() => pagination.onPage(pagination.page + 1)}
              >
                <Icon name="chevright" size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
