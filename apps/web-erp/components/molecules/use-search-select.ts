'use client';

import * as React from 'react';
import { DEFAULT_COLS, SearchSelectColumn, SearchSelectOption, SearchSelectProps } from './search-select-types';

export interface SearchSelectState {
  // Modal state
  open: boolean;
  query: string;
  options: SearchSelectOption[];
  loading: boolean;
  focusedIdx: number;
  tableActive: boolean;
  page: number;
  total: number;
  localSelected: Set<string>;
  localSingle: string;
  localSingleLabel: string;
  displayLabel: string;
  // Single inline-search state
  inputText: string;
  inputFocused: boolean;
  dropdownOpen: boolean;
  dropdownOptions: SearchSelectOption[];
  dropdownLoading: boolean;
  // Computed
  columns: SearchSelectColumn[];
  totalPages: number;
  displayOptions: SearchSelectOption[];
  colSpan: number;
  confirmCount: number;
  triggerDisplay: string;
  allChecked: boolean;
  someChecked: boolean;
  isMulti: boolean;
  resolvedTitle: string;
  // Refs
  searchRef: React.RefObject<HTMLInputElement | null>;
  triggerRef: React.RefObject<HTMLInputElement | null>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export interface SearchSelectHandlers {
  openModal: (initialQuery?: string) => void;
  closeModal: (refocusTrigger?: boolean) => void;
  handleTriggerFocus: () => void;
  handleSingleFocus: () => void;
  handleSingleBlur: (e: React.FocusEvent) => void;
  handleSingleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleIconMouseDown: (e: React.MouseEvent) => void;
  handleSingleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  selectFromDropdown: (opt: SearchSelectOption) => void;
  selectSingle: (opt: SearchSelectOption, idx?: number) => void;
  confirmRow: (opt: SearchSelectOption) => void;
  toggleMulti: (val: string) => void;
  confirm: () => void;
  toggleAll: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export function useSearchSelect(props: SearchSelectProps): SearchSelectState & SearchSelectHandlers {
  const {
    placeholder = 'Pilih…', loadOptions,
    debounceMs = 300, columns: columnsProp, limit = 10, initialLabel,
  } = props;

  const resolvedTitle = (props.title ?? placeholder.replace(/…$/, '').trim());
  const isMulti = props.mode === 'multi';

  // ── Display label builder — "{code} - {label}" when code is present ─────────
  const optLabel = (opt: SearchSelectOption): string =>
    opt.code ? `${opt.code} - ${opt.label}` : opt.label;

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
      if (found) setDisplayLabel(optLabel(found));
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (isMulti) return;
    if (!props.value) { setDisplayLabel(''); return; }
    const found = options.find((o) => o.value === props.value);
    if (found) setDisplayLabel(optLabel(found));
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
        if (results.length === 0) {
          // Tidak ditemukan → kosongkan lalu buka modal dengan teks pencarian
          if (!isMulti) props.onValueChange('');
          setDisplayLabel('');
          setInputText('');
          setInputFocused(false);
          openModal(inputText);
          return;
        }
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
    // Buka dengan query kosong kecuali user sudah mengetik sesuatu yang berbeda dari display
    const typedQuery = !isMulti && inputText !== displayLabel ? inputText : '';
    openModal(isMulti ? '' : typedQuery);
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
      // Buka dengan query kosong kecuali user sudah mengetik sesuatu yang berbeda dari display
      openModal(inputText !== displayLabel ? inputText : '');
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
      if (results.length === 0) {
        // Tidak ditemukan → kosongkan lalu buka modal dengan teks pencarian
        if (!isMulti) props.onValueChange('');
        setDisplayLabel('');
        setInputText('');
        ignoreNextBlurRef.current = false;
        openModal(inputText);
      } else if (results.length === 1) {
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
      setDisplayLabel(optLabel(opt));
      setInputText(optLabel(opt));
    }
    setDropdownOpen(false);
    setInputFocused(false);
  };

  // ── Modal selection ───────────────────────────────────────────────────────
  const selectSingle = (opt: SearchSelectOption, idx?: number) => {
    if (!isMulti) { setLocalSingle(opt.value); setLocalSingleLabel(optLabel(opt)); }
    if (idx !== undefined) { setFocusedIdx(idx); setTableActive(true); }
  };

  const confirmRow = (opt: SearchSelectOption) => {
    if (isMulti) { toggleMulti(opt.value); return; }
    props.onValueChange(opt.value);
    setDisplayLabel(optLabel(opt));
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
        if (!isMulti && displayOptions[0]) { setLocalSingle(displayOptions[0].value); setLocalSingleLabel(optLabel(displayOptions[0])); }
      } else {
        const next = Math.min(focusedIdx + 1, displayOptions.length - 1);
        setFocusedIdx(next);
        if (!isMulti && displayOptions[next]) { setLocalSingle(displayOptions[next].value); setLocalSingleLabel(optLabel(displayOptions[next])); }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (tableActive && focusedIdx === 0) { setTableActive(false); setLocalSingle(''); setLocalSingleLabel(''); searchRef.current?.focus(); }
      else if (tableActive) {
        const prev = Math.max(focusedIdx - 1, 0);
        setFocusedIdx(prev);
        if (!isMulti && displayOptions[prev]) { setLocalSingle(displayOptions[prev].value); setLocalSingleLabel(optLabel(displayOptions[prev])); }
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

  // ── Computed helpers ──────────────────────────────────────────────────────
  const colSpan = columns.length + (isMulti ? 1 : 0);
  const confirmCount = isMulti ? localSelected.size : 0;
  const triggerDisplay = isMulti
    ? props.values.length > 0 ? `${props.values.length} dipilih` : ''
    : displayLabel;

  return {
    // State
    open, query, options, loading, focusedIdx, tableActive, page, total,
    localSelected, localSingle, localSingleLabel, displayLabel,
    inputText, inputFocused, dropdownOpen, dropdownOptions, dropdownLoading,
    // Computed
    columns, totalPages, displayOptions, colSpan, confirmCount, triggerDisplay,
    allChecked, someChecked, isMulti, resolvedTitle,
    // Refs
    searchRef, triggerRef, scrollRef, dropdownRef,
    // Handlers
    openModal, closeModal,
    handleTriggerFocus, handleSingleFocus, handleSingleBlur,
    handleSingleChange, handleIconMouseDown, handleSingleKeyDown,
    selectFromDropdown, selectSingle, confirmRow, toggleMulti, confirm, toggleAll,
    handleKeyDown, setQuery, setPage,
  };
}
