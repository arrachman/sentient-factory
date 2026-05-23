'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icons';
import { Kbd } from '@/components/ui/kbd';
import { Checkbox } from '@/components/ui/checkbox';

// ─── Public types ────────────────────────────────────────────────────────────

export interface SearchSelectOption {
  value: string;
  label: string;
  [key: string]: unknown;
}

export interface SearchSelectColumn {
  key: string;
  header: string;
  /** Fixed width, e.g. "140px" or "20%". Omit for flex fill. */
  width?: string;
}

// ─── Props — discriminated by mode ───────────────────────────────────────────

interface BaseProps {
  id?: string;
  placeholder?: string;
  loadOptions: (search: string, page: number, limit: number) => Promise<{ data: SearchSelectOption[]; total: number }>;
  debounceMs?: number;
  disabled?: boolean;
  /** Show red border when validation fails. */
  error?: boolean;
  /** Modal header title. Defaults to placeholder text (without trailing …). */
  title?: string;
  /** Column definitions. Auto-detected (always ≥ 3 cols) when omitted. */
  columns?: SearchSelectColumn[];
  /** Max rows shown in the modal. Default 10. */
  limit?: number;
  /** Pre-fill display label when value is known but may not appear in first-page results. */
  initialLabel?: string;
}

interface SingleProps extends BaseProps {
  mode?: 'single';
  value: string;
  onValueChange: (value: string) => void;
  values?: never;
  onValuesChange?: never;
}

interface MultiProps extends BaseProps {
  mode: 'multi';
  values: string[];
  onValuesChange: (values: string[]) => void;
  value?: never;
  onValueChange?: never;
}

type SearchSelectProps = SingleProps | MultiProps;

// ─── Default columns: always 3 — NO · KODE · NAMA ────────────────────────────
const DEFAULT_COLS: SearchSelectColumn[] = [
  { key: '_no',   header: 'NO',   width: '48px'  },
  { key: 'code',  header: 'KODE', width: '160px' },
  { key: 'label', header: 'NAMA'                 },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function SearchSelect(props: SearchSelectProps) {
  const {
    id, placeholder = 'Pilih…', loadOptions,
    debounceMs = 300, disabled = false, error = false,
    title, columns: columnsProp, limit = 10, initialLabel,
  } = props;

  const resolvedTitle = title ?? placeholder.replace(/…$/, '').trim();
  const isMulti = props.mode === 'multi';

  // ── Modal state ───────────────────────────────────────────────────────────
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [options, setOptions] = React.useState<SearchSelectOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [focusedIdx, setFocusedIdx] = React.useState(0);
  const [tableActive, setTableActive] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [debouncedQuery, setDebouncedQuery] = React.useState('');
  const [localSelected, setLocalSelected] = React.useState<Set<string>>(new Set());
  const [localSingle, setLocalSingle] = React.useState('');
  const [localSingleLabel, setLocalSingleLabel] = React.useState('');
  const [displayLabel, setDisplayLabel] = React.useState('');

  // ── Single inline-search state ────────────────────────────────────────────
  const [inputText, setInputText] = React.useState('');
  const [inputFocused, setInputFocused] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [dropdownOptions, setDropdownOptions] = React.useState<SearchSelectOption[]>([]);
  const [dropdownLoading, setDropdownLoading] = React.useState(false);

  const searchRef = React.useRef<HTMLInputElement>(null);
  const triggerRef = React.useRef<HTMLInputElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const skipNextFocusRef = React.useRef(false);
  const dropdownTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const ignoreNextBlurRef = React.useRef(false);

  // ── Sync inputText ← displayLabel when not focused ───────────────────────
  React.useEffect(() => {
    if (!inputFocused) setInputText(displayLabel);
  }, [displayLabel, inputFocused]);

  // ── Resolve single display label on mount ────────────────────────────────
  React.useEffect(() => {
    if (isMulti) return;
    if (initialLabel && !isMulti && props.value) setDisplayLabel(initialLabel);
    loadOptions('', 1, limit).then(({ data }) => {
      setOptions(data);
      const found = data.find((o) => o.value === props.value);
      if (found) setDisplayLabel(found.label);
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (isMulti) return;
    if (!props.value) { setDisplayLabel(''); return; }
    const found = options.find((o) => o.value === props.value);
    if (found) setDisplayLabel(found.label);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value, options]);

  // ── Modal debounced search — defers debouncedQuery update; resets page ───
  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => { setDebouncedQuery(query); setPage(1); }, debounceMs);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, open]);

  // ── Server-side fetch — fires on debouncedQuery OR page change ────────────
  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    loadOptions(debouncedQuery, page, limit)
      .then(({ data, total: t }) => {
        if (!cancelled) { setOptions(data); setTotal(t); setFocusedIdx(0); setTableActive(false); setLoading(false); }
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, open, page]);

  // ── Scroll focused row into view ─────────────────────────────────────────
  React.useEffect(() => {
    scrollRef.current?.querySelector<HTMLElement>(`[data-idx="${focusedIdx}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [focusedIdx]);

  // ── Column resolution ─────────────────────────────────────────────────────
  const columns = React.useMemo<SearchSelectColumn[]>(() => columnsProp ?? DEFAULT_COLS, [columnsProp]);

  // ── Pagination (server-driven) ────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const displayOptions = options; // server already paginates — no client-side slice

  // ── Open / close modal ────────────────────────────────────────────────────
  const openModal = React.useCallback((initialQuery = '') => {
    setDropdownOpen(false);
    setQuery(initialQuery);
    setDebouncedQuery(initialQuery); // reset immediately so fetch effect fires on open
    setFocusedIdx(0);
    setTableActive(false);
    setPage(1);
    if (isMulti) setLocalSelected(new Set(props.values));
    else { setLocalSingle(props.value ?? ''); setLocalSingleLabel(displayLabel); }
    setOpen(true);
    setTimeout(() => { searchRef.current?.focus(); searchRef.current?.select(); }, 60);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMulti, displayLabel]);

  const closeModal = (refocusTrigger = false) => {
    setOpen(false);
    setInputFocused(false);
    skipNextFocusRef.current = true;
    if (refocusTrigger) setTimeout(() => triggerRef.current?.focus(), 60);
  };

  // ── Multi trigger focus ───────────────────────────────────────────────────
  const handleTriggerFocus = () => {
    if (skipNextFocusRef.current) { skipNextFocusRef.current = false; return; }
    openModal('');
  };

  // ── Single inline-search handlers ─────────────────────────────────────────
  const handleSingleFocus = () => {
    if (skipNextFocusRef.current) { skipNextFocusRef.current = false; return; }
    setInputFocused(true);
  };

  const handleSingleBlur = async (e: React.FocusEvent) => {
    if (dropdownRef.current?.contains(e.relatedTarget as Node)) return;
    if (ignoreNextBlurRef.current) {
      ignoreNextBlurRef.current = false;
      setInputFocused(false);
      return;
    }
    setDropdownOpen(false);
    if (!inputText) {
      if (!isMulti) { props.onValueChange(''); setDisplayLabel(''); }
      setInputFocused(false);
      return;
    }
    if (inputText !== displayLabel) {
      setDropdownLoading(true);
      try {
        const { data: results } = await loadOptions(inputText, 1, limit);
        if (results.length === 1) { selectFromDropdown(results[0]); return; }
        openModal(inputText);
        return;
      } catch {
        // fall through to revert
      } finally {
        setDropdownLoading(false);
      }
    }
    setInputFocused(false);
    setInputText(displayLabel);
  };

  const handleSingleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);
    if (dropdownTimer.current) { clearTimeout(dropdownTimer.current); dropdownTimer.current = null; }
    setDropdownOpen(false);
    if (!val && !isMulti) {
      props.onValueChange('');
      setDisplayLabel('');
    }
  };

  const handleIconMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // keep input focused, avoid blur
    openModal(isMulti ? '' : inputText);
  };

  const focusNext = () => {
    if (!triggerRef.current) return;
    const focusable = Array.from(
      document.querySelectorAll<HTMLElement>(
        'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    const idx = focusable.indexOf(triggerRef.current);
    if (idx !== -1) focusable[idx + 1]?.focus();
  };

  const handleSingleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'F12' || (e.key === 'F12' && (e.metaKey || e.ctrlKey))) {
      e.preventDefault();
      openModal(inputText);
      return;
    }
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (!inputText) return;
    if (dropdownTimer.current) { clearTimeout(dropdownTimer.current); dropdownTimer.current = null; }
    ignoreNextBlurRef.current = true;
    setDropdownOpen(false);
    setDropdownLoading(true);
    try {
      const { data: results } = await loadOptions(inputText, 1, limit);
      if (results.length === 1) {
        selectFromDropdown(results[0]);
        setTimeout(focusNext, 0);
      } else {
        openModal(inputText);
      }
    } finally {
      setDropdownLoading(false);
    }
  };

  const selectFromDropdown = (opt: SearchSelectOption) => {
    if (!isMulti) {
      props.onValueChange(opt.value);
      setDisplayLabel(opt.label);
      setInputText(opt.label);
    }
    setDropdownOpen(false);
    setInputFocused(false);
  };

  // ── Modal selection ───────────────────────────────────────────────────────
  const selectSingle = (opt: SearchSelectOption, idx?: number) => {
    if (!isMulti) { setLocalSingle(opt.value); setLocalSingleLabel(opt.label); }
    if (idx !== undefined) { setFocusedIdx(idx); setTableActive(true); }
  };

  const confirmRow = (opt: SearchSelectOption) => {
    if (isMulti) { toggleMulti(opt.value); return; }
    props.onValueChange(opt.value);
    setDisplayLabel(opt.label);
    closeModal(true);
  };

  const toggleMulti = (val: string) =>
    setLocalSelected((prev) => { const s = new Set(prev); s.has(val) ? s.delete(val) : s.add(val); return s; });

  const confirm = () => {
    if (isMulti) {
      props.onValuesChange(Array.from(localSelected));
    } else if (localSingle) {
      props.onValueChange(localSingle);
      setDisplayLabel(localSingleLabel);
    }
    closeModal();
  };

  // ── Select-all for multi ──────────────────────────────────────────────────
  const allChecked = displayOptions.length > 0 && displayOptions.every((o) => localSelected.has(o.value));
  const someChecked = !allChecked && displayOptions.some((o) => localSelected.has(o.value));
  const toggleAll = () =>
    setLocalSelected((prev) => {
      const s = new Set(prev);
      if (allChecked) displayOptions.forEach((o) => s.delete(o.value));
      else displayOptions.forEach((o) => s.add(o.value));
      return s;
    });

  // ── Modal keyboard nav ────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!tableActive) {
        setTableActive(true); setFocusedIdx(0);
        if (!isMulti && displayOptions[0]) { setLocalSingle(displayOptions[0].value); setLocalSingleLabel(displayOptions[0].label); }
      } else {
        const next = Math.min(focusedIdx + 1, displayOptions.length - 1);
        setFocusedIdx(next);
        if (!isMulti && displayOptions[next]) { setLocalSingle(displayOptions[next].value); setLocalSingleLabel(displayOptions[next].label); }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (tableActive && focusedIdx === 0) { setTableActive(false); setLocalSingle(''); setLocalSingleLabel(''); searchRef.current?.focus(); }
      else if (tableActive) {
        const prev = Math.max(focusedIdx - 1, 0);
        setFocusedIdx(prev);
        if (!isMulti && displayOptions[prev]) { setLocalSingle(displayOptions[prev].value); setLocalSingleLabel(displayOptions[prev].label); }
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPage((p) => Math.max(1, p - 1));
      setFocusedIdx(0);
      setTableActive(false);
      setLocalSingle(''); setLocalSingleLabel('');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPage((p) => Math.min(totalPages, p + 1));
      setFocusedIdx(0);
      setTableActive(false);
      setLocalSingle(''); setLocalSingleLabel('');
    } else if (e.key === 'Enter') {
      if (e.target instanceof HTMLButtonElement) return;
      e.preventDefault();
      if (!tableActive || !displayOptions[focusedIdx]) return;
      if (isMulti) toggleMulti(displayOptions[focusedIdx].value);
      else confirmRow(displayOptions[focusedIdx]);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const colSpan = columns.length + (isMulti ? 1 : 0);
  const confirmCount = isMulti ? localSelected.size : 0;
  const triggerDisplay = isMulti
    ? props.values.length > 0 ? `${props.values.length} dipilih` : ''
    : displayLabel;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* Trigger */}
      <div className="relative w-full">
        {isMulti ? (
          /* Multi: readOnly, focus → modal */
          <input
            ref={triggerRef}
            id={id}
            type="text"
            readOnly
            disabled={disabled}
            value={triggerDisplay}
            placeholder={placeholder}
            onFocus={handleTriggerFocus}
            aria-invalid={error || undefined}
            className={cn(
              'flex h-[26px] w-full cursor-pointer rounded-md border border-border bg-card px-2 pr-7 text-[calc(12.5px*var(--font-scale,1))] outline-none transition-[border-color,box-shadow] duration-75',
              'focus:border-primary focus:shadow-[0_0_0_2px_color-mix(in_oklab,var(--primary)_22%,transparent)]',
              'disabled:cursor-not-allowed disabled:opacity-45',
              error && 'border-destructive focus:border-destructive focus:shadow-[0_0_0_2px_color-mix(in_oklab,var(--destructive)_22%,transparent)]',
              triggerDisplay ? 'text-foreground' : 'text-[var(--fg-subtle)]',
            )}
          />
        ) : (
          /* Single: editable, type → inline search; icon → modal */
          <input
            ref={triggerRef}
            id={id}
            type="text"
            disabled={disabled}
            value={inputText}
            placeholder={placeholder}
            onFocus={handleSingleFocus}
            onBlur={handleSingleBlur}
            onChange={handleSingleChange}
            onKeyDown={handleSingleKeyDown}
            autoComplete="off"
            aria-invalid={error || undefined}
            className={cn(
              'flex h-[26px] w-full rounded-md border border-border bg-card px-2 pr-7 text-[calc(12.5px*var(--font-scale,1))] outline-none transition-[border-color,box-shadow] duration-75',
              'focus:border-primary focus:shadow-[0_0_0_2px_color-mix(in_oklab,var(--primary)_22%,transparent)]',
              'disabled:cursor-not-allowed disabled:opacity-45',
              error && 'border-destructive focus:border-destructive focus:shadow-[0_0_0_2px_color-mix(in_oklab,var(--destructive)_22%,transparent)]',
              inputText ? 'text-foreground' : 'text-[var(--fg-subtle)]',
            )}
          />
        )}

        {/* Search icon — always opens modal */}
        <span
          onMouseDown={handleIconMouseDown}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
          style={{ fontSize: 'calc(13px * var(--font-scale, 1))' }}
        >
          <Icon name="search" className={dropdownLoading ? 'animate-pulse' : ''} />
        </span>

        {/* Inline dropdown (single mode only) */}
        {!isMulti && dropdownOpen && dropdownOptions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-flyout)]"
          >
            {dropdownOptions.map((opt) => {
              const codeStr = opt.code ? String(opt.code) : null;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); selectFromDropdown(opt); }}
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-1.5 text-left text-[calc(12.5px*var(--font-scale,1))] hover:bg-accent hover:text-accent-foreground',
                    opt.value === props.value && 'bg-accent/20',
                  )}
                >
                  {codeStr && (
                    <span className="shrink-0 font-mono text-[calc(12px*var(--font-scale,1))] text-[hsl(var(--primary))]">{codeStr}</span>
                  )}
                  {codeStr && <span className="text-muted-foreground">—</span>}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      <DialogPrimitive.Root open={open} onOpenChange={(next) => { if (!next) closeModal(); }}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[900] bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            onKeyDown={handleKeyDown}
            className="fixed left-1/2 top-1/2 z-[901] flex w-[640px] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-flyout)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            style={{ maxHeight: 'min(680px, calc(100vh - 4rem))' }}
          >
            <DialogPrimitive.Title className="sr-only">{resolvedTitle}</DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              {isMulti ? 'Pilih satu atau lebih item dari daftar' : 'Pilih satu item dari daftar'}
            </DialogPrimitive.Description>

            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-[calc(13px*var(--font-scale,1))] font-semibold text-foreground">{resolvedTitle}</span>
                {!loading && total > 0 && <span className="text-[calc(12px*var(--font-scale,1))] text-muted-foreground">· {total}</span>}
              </div>
              <DialogPrimitive.Close asChild>
                <button type="button" style={{ cursor: 'pointer' }}
                  className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[calc(12px*var(--font-scale,1))] text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                  Tutup <Kbd>ESC</Kbd>
                </button>
              </DialogPrimitive.Close>
            </div>

            {/* Search */}
            <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-2">
              <Icon name="search" className="shrink-0 text-muted-foreground" style={{ fontSize: 'calc(14px * var(--font-scale, 1))' }} />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ketik kode atau nama…"
                className="w-full bg-transparent text-[calc(13px*var(--font-scale,1))] text-foreground outline-none placeholder:text-[var(--fg-subtle)]"
              />
            </div>

            {/* Table */}
            <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto"
              style={{ minHeight: `calc(${limit} * 2.25rem)` }}>
              <table className="w-full table-fixed border-collapse text-[calc(12.5px*var(--font-scale,1))]">
                <thead className="sticky top-0 z-10 bg-card">
                  <tr className="border-b border-border">
                    {isMulti && (
                      <th className="w-10 px-4 py-2">
                        <Checkbox
                          checked={allChecked ? true : someChecked ? 'indeterminate' : false}
                          onCheckedChange={toggleAll}
                        />
                      </th>
                    )}
                    {columns.map((col) => (
                      <th key={col.key} style={col.width ? { width: col.width } : undefined}
                        className="px-4 py-2 text-left text-[calc(11px*var(--font-scale,1))] font-medium uppercase tracking-wide text-muted-foreground">
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={colSpan} className="px-4 py-4 text-[var(--fg-subtle)]">Memuat…</td></tr>
                  )}
                  {!loading && displayOptions.length === 0 && (
                    <tr><td colSpan={colSpan} className="px-4 py-4 text-[var(--fg-subtle)]">Tidak ada hasil</td></tr>
                  )}
                  {!loading && displayOptions.map((opt, i) => {
                    const isActive = isMulti ? localSelected.has(opt.value) : opt.value === localSingle;
                    const isFocused = tableActive && i === focusedIdx;
                    return (
                      <tr
                        key={opt.value}
                        data-idx={i}
                        onClick={() => (isMulti ? toggleMulti(opt.value) : selectSingle(opt, i))}
                        onDoubleClick={() => confirmRow(opt)}
                        style={{ cursor: 'pointer' }}
                        className={cn(
                          'border-b border-border/40 transition-[background-color,color] last:border-0',
                          'hover:bg-[var(--panel-hover)] hover:text-foreground',
                          isFocused && 'outline outline-2 -outline-offset-1 outline-primary bg-accent/40',
                          isActive && !isFocused && 'bg-accent/20',
                        )}
                      >
                        {isMulti && (
                          <td className="w-10 px-4 py-2" onClick={(e) => e.stopPropagation()}>
                            <Checkbox checked={localSelected.has(opt.value)} onCheckedChange={() => toggleMulti(opt.value)} />
                          </td>
                        )}
                        {columns.map((col) => {
                          if (col.key === '_no') return (
                            <td key={col.key} className="px-4 py-2">
                              <span className="text-muted-foreground">{(page - 1) * limit + i + 1}</span>
                            </td>
                          );
                          if (col.key === 'code') {
                            const codeStr = String(opt.code ?? '');
                            return (
                              <td key={col.key} className="overflow-hidden px-4 py-2" title={codeStr}>
                                <span className="block truncate font-mono text-[calc(12px*var(--font-scale,1))] text-muted-foreground">{codeStr}</span>
                              </td>
                            );
                          }
                          return (
                            <td key={col.key} className="px-4 py-2">{String(opt[col.key] ?? '')}</td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex shrink-0 items-center justify-between border-t border-border px-4 py-2">
              <div className="flex items-center gap-3 text-[calc(11px*var(--font-scale,1))] text-muted-foreground">
                <span className="flex items-center gap-1"><Kbd>↑</Kbd><Kbd>↓</Kbd> navigasi</span>
                {totalPages > 1 && (
                  <span className="flex items-center gap-1"><Kbd>←</Kbd><Kbd>→</Kbd> halaman</span>
                )}
                <span className="flex items-center gap-1"><Kbd>↵</Kbd> pilih</span>
                <span className="flex items-center gap-1"><Kbd>ESC</Kbd> tutup</span>
              </div>
              <div className="flex items-center gap-3">
                {totalPages > 1 && (
                  <span className="text-[calc(11px*var(--font-scale,1))] text-muted-foreground">
                    Hal. {page}/{totalPages}
                  </span>
                )}
                <button type="button" onClick={() => closeModal(true)} style={{ cursor: 'pointer' }}
                  className="rounded-md border border-border px-3 py-1 text-[calc(12px*var(--font-scale,1))] font-medium hover:bg-accent">
                  Batal
                </button>
                <button type="button" onClick={confirm} style={{ cursor: 'pointer' }}
                  className="rounded-md bg-primary px-3 py-1 text-[calc(12px*var(--font-scale,1))] font-medium text-primary-foreground hover:bg-primary/90">
                  Pilih{confirmCount > 0 ? ` (${confirmCount})` : ''}
                </button>
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
