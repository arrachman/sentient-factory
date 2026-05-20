'use client';

/**
 * Shared layout shell for ERP CRUD list pages.
 * Provides: action bar (search/export/refresh/add), filter bar, summary,
 * content area, pagination footer, and keyboard hints footer.
 *
 * Atomic tier: Organism.
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
import { TablePagination } from '@/components/molecules/table-pagination';
import { ErrorState } from '@/components/molecules/error-state';
import { tGlobal } from '@/lib/mock';

// ─── Public types ─────────────────────────────────────────────────────────────

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

export interface ListPaginationConfig {
  page: number;
  pageCount: number;
  pageSize: number;
  totalRows: number;
  onPage: (page: number) => void;
  /** When provided, the limit selector is rendered in the footer. */
  onPageSize?: (size: number) => void;
  pageSizeOptions?: readonly number[];
}

/** Wires J/K/X/Enter/Space keyboard nav to a table rendered inside ErpListLayout. */
export interface KeyboardRowConfig {
  rowCount: number;
  focusedIndex: number;
  onFocusChange: (i: number) => void;
  onToggle: (i: number) => void;
  onOpen?: (i: number) => void;
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function ListFooter({
  pagination,
  keyboardHints,
  onAdd,
}: {
  pagination?: ListPaginationConfig;
  keyboardHints?: boolean;
  onAdd?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 border-t border-border bg-card px-4 py-[5px] text-[11px] text-muted-foreground">
      {pagination && (
        <TablePagination
          page={pagination.page}
          pageCount={pagination.pageCount}
          pageSize={pagination.pageSize}
          totalRows={pagination.totalRows}
          rowCount={Math.min(
            pagination.pageSize,
            Math.max(pagination.totalRows - (pagination.page - 1) * pagination.pageSize, 0),
          )}
          onPage={pagination.onPage}
          onPageSize={pagination.onPageSize}
          pageSizeOptions={pagination.pageSizeOptions}
        />
      )}

      <div className="flex-1" />

      {keyboardHints && (
        <span className="flex items-center gap-[3px]">
          {tGlobal('Pintasan')}:&nbsp;
          <Kbd>J</Kbd>↓/<Kbd>K</Kbd>↑
          <span className="mx-1 opacity-40">·</span>
          <Kbd>X</Kbd>&nbsp;{tGlobal('pilih')}
          {onAdd && (
            <>
              <span className="mx-1 opacity-40">·</span>
              <Kbd>N</Kbd>&nbsp;{tGlobal('baru')}
            </>
          )}
        </span>
      )}
    </div>
  );
}

// ─── Sentinel for empty-string Select value ───────────────────────────────────
const ALL_VAL = '_all';
const toSel = (v: string) => v || ALL_VAL;
const fromSel = (v: string) => (v === ALL_VAL ? '' : v);

// ─── Component ────────────────────────────────────────────────────────────────

interface ErpListLayoutProps {
  title: string;
  code: string;
  loading?: boolean;
  error?: string | null;
  search: string;
  onSearch: (q: string) => void;
  onAdd?: () => void;
  onRefresh: () => void;
  onExport?: () => void;
  addLabel?: string;
  toolbar?: React.ReactNode;
  filters?: FilterConfig[];
  summary?: SummaryConfig;
  pagination?: ListPaginationConfig;
  keyboardRows?: KeyboardRowConfig;
  keyboardHints?: boolean;
  children: React.ReactNode;
}

export function ErpListLayout({
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
  toolbar,
  filters,
  summary,
  pagination,
  keyboardRows,
  keyboardHints = true,
  children,
}: ErpListLayoutProps) {
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
      // Row navigation
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
  const showFilterBar = (filters && filters.length > 0) || !!summary;


  return (
    <div className="page">
      {/* Action bar */}
      <div className="page-header">
        <h1 className="page-title">
          {tGlobal(title)}
          <span className="code-tag">{code}</span>
        </h1>
        <div className="page-actions">
          <div className="search-input">
            <Icon name="search" size={12} />
            <input
              ref={searchRef}
              placeholder={tGlobal('Cari semua...')}
              value={search}
              onChange={(e) => onSearch(e.target.value)}
            />
            <Kbd>/</Kbd>
          </div>
          {onExport && (
            <button className="btn" onClick={onExport} title={tGlobal('Export data')}>
              <Icon name="download" size={12} />
              {tGlobal('Export')}
            </button>
          )}
          <button className="btn" onClick={onRefresh} title={tGlobal('Muat ulang')}>
            <Icon name="refresh" size={12} />
          </button>
          {onAdd && (
            <button className="btn primary" onClick={onAdd}>
              <Icon name="plus" size={12} />
              {tGlobal(addLabel ?? 'Tambah')}
              <Kbd>N</Kbd>
            </button>
          )}
        </div>
      </div>

      {/* Filter bar */}
      {showFilterBar && (
        <div className="filter-bar">
          <button
            className="iconbtn"
            title={tGlobal('Filter')}
            style={{ opacity: hasActiveFilter ? 1 : 0.5 }}
          >
            <Icon name="filter" size={13} />
          </button>

          {filters?.map((f) => (
            <Select
              key={f.key}
              value={toSel(f.value)}
              onValueChange={(v) => f.onChange(fromSel(v))}
            >
              <SelectTrigger style={{ width: 'auto', minWidth: '8rem' }}>
                <span style={{ color: 'var(--fg-faint)', fontSize: 'calc(11px * var(--font-scale, 1))', marginRight: 2 }}>
                  {tGlobal(f.label)}:
                </span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {f.options.map((o) => (
                  <SelectItem key={toSel(o.value)} value={toSel(o.value)}>
                    {tGlobal(o.label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          <div style={{ flex: 1 }} />

          {summary && (
            <span className="filter-summary">
              {tGlobal(summary.metricLabel)}
              {summary.metricValue && (
                <> <strong>{summary.metricValue}</strong></>
              )}
              {' · '}
              <strong>{summary.rowCount}</strong> {tGlobal('baris')}
              {summary.totalCount !== undefined &&
                summary.totalCount !== summary.rowCount && (
                  <> {tGlobal('dari')} {summary.totalCount}</>
                )}
            </span>
          )}

          {hasActiveFilter && (
            <button className="btn ghost sm" onClick={handleReset}>
              <Icon name="x" size={11} />
              {tGlobal('Reset filter')}
            </button>
          )}
        </div>
      )}

      {toolbar && <div className="toolbar">{toolbar}</div>}

      {error && (
        <ErrorState
          message={error}
          onRetry={onRefresh}
          retrying={loading}
        />
      )}

      {loading && !error && (
        <div className="p-8 text-center text-xs text-muted-foreground">{tGlobal('Memuat...')}</div>
      )}

      {!loading && !error && children}

      {(pagination || keyboardHints) && (
        <ListFooter
          pagination={pagination}
          keyboardHints={keyboardHints}
          onAdd={onAdd}
        />
      )}
    </div>
  );
}
