'use client';

import * as React from 'react';
import { DEFAULT_COLS, SearchSelectColumn, SearchSelectOption, SearchSelectProps } from './search-select-types';
import {
  SearchSelectHandlers,
  SearchSelectState,
  optLabel,
  pickExactCodeMatch,
} from './use-search-select-types';

export type { SearchSelectHandlers, SearchSelectState } from './use-search-select-types';

export function useSearchSelect(props: SearchSelectProps): SearchSelectState & SearchSelectHandlers {
  const {
    placeholder = 'Pilih…', loadOptions,
    debounceMs = 300, columns: columnsProp, limit = 10, initialLabel,
  } = props;

  const resolvedTitle = (props.title ?? placeholder.replace(/…$/, '').trim());
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
  const [localSingleMeta, setLocalSingleMeta] = React.useState('');
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

  // ── Grid cell edit-mode: seed inline query + focus on mount ──────────────
  React.useEffect(() => {
    if (isMulti) return;
    const seed = props.initialQuery;
    if (seed) { setInputText(seed); setInputFocused(true); }
    if ((props.autoFocus || seed) && !props.autoOpenModal) {
      setTimeout(() => { triggerRef.current?.focus(); }, 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // Value set async (e.g. form default) after mount, and not on the first
    // options page → fall back to the caller-provided label so it isn't blank.
    else if (initialLabel) setDisplayLabel(initialLabel);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value, options, initialLabel]);

  // ── Modal debounced search — defers debouncedQuery update; resets page ───
  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => { setDebouncedQuery(query); setPage(1); }, debounceMs);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, open]);

  // ── Server-side fetch — fires on debouncedQuery OR page change ────────────
  // Tidak reset `tableActive` di sini — biarkan persist saat user nav ←/→ (§2.28).
  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    loadOptions(debouncedQuery, page, limit)
      .then(({ data, total: t }) => {
        if (!cancelled) { setOptions(data); setTotal(t); setFocusedIdx(0); setLoading(false); }
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
    else { setLocalSingle(props.value ?? ''); setLocalSingleLabel(displayLabel); setLocalSingleMeta(''); }
    setOpen(true);
    setTimeout(() => { searchRef.current?.focus(); searchRef.current?.select(); }, 60);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMulti, displayLabel]);

  // ── Auto-open the modal on mount when requested (grid search-icon click) ──
  // Deferred a tick so the originating click finishes first — otherwise Radix's
  // dismissable layer treats that same interaction as an outside-click and the
  // dialog opens then immediately closes.
  React.useEffect(() => {
    if (!props.autoOpenModal) return;
    const t = setTimeout(() => openModal(''), 0);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // Simpan sebelum await — relatedTarget hilang setelah event loop tick
    const blurTarget = e.relatedTarget as HTMLElement | null;
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
          // Tidak ditemukan → revert (jangan buka modal saat blur)
          if (!isMulti) props.onValueChange('');
          setDisplayLabel('');
          setInputText('');
          setInputFocused(false);
          return;
        }
        const exact = pickExactCodeMatch(results, inputText);
        if (exact) {
          selectFromDropdown(exact);
          blurTarget?.focus(); // kembalikan fokus ke field tujuan user
          return;
        }
        if (results.length === 1) {
          selectFromDropdown(results[0]);
          blurTarget?.focus(); // kembalikan fokus ke field tujuan user
          return;
        }
        // Banyak hasil, tidak ada exact match → revert (jangan buka modal saat blur)
        setInputFocused(false);
        setInputText(displayLabel);
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
        return;
      }
      const exact = pickExactCodeMatch(results, inputText);
      if (exact) {
        selectFromDropdown(exact);
        setTimeout(focusNext, 0);
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
      props.onPick?.({ value: opt.value, label: optLabel(opt), meta: String(opt.meta ?? '') });
      setDisplayLabel(optLabel(opt));
      setInputText(optLabel(opt));
    }
    setDropdownOpen(false);
    setInputFocused(false);
  };

  // ── Modal selection ───────────────────────────────────────────────────────
  const selectSingle = (opt: SearchSelectOption, idx?: number) => {
    if (!isMulti) { setLocalSingle(opt.value); setLocalSingleLabel(optLabel(opt)); setLocalSingleMeta(String(opt.meta ?? '')); }
    if (idx !== undefined) { setFocusedIdx(idx); setTableActive(true); }
  };

  const confirmRow = (opt: SearchSelectOption) => {
    if (isMulti) { toggleMulti(opt.value); return; }
    props.onValueChange(opt.value);
    props.onPick?.({ value: opt.value, label: optLabel(opt), meta: String(opt.meta ?? '') });
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
      props.onPick?.({ value: localSingle, label: localSingleLabel, meta: localSingleMeta });
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
        if (!isMulti && displayOptions[0]) { setLocalSingle(displayOptions[0].value); setLocalSingleLabel(optLabel(displayOptions[0])); setLocalSingleMeta(String(displayOptions[0].meta ?? '')); }
      } else {
        const next = Math.min(focusedIdx + 1, displayOptions.length - 1);
        setFocusedIdx(next);
        if (!isMulti && displayOptions[next]) { setLocalSingle(displayOptions[next].value); setLocalSingleLabel(optLabel(displayOptions[next])); setLocalSingleMeta(String(displayOptions[next].meta ?? '')); }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (tableActive && focusedIdx === 0) { setTableActive(false); setLocalSingle(''); setLocalSingleLabel(''); setLocalSingleMeta(''); searchRef.current?.focus(); }
      else if (tableActive) {
        const prev = Math.max(focusedIdx - 1, 0);
        setFocusedIdx(prev);
        if (!isMulti && displayOptions[prev]) { setLocalSingle(displayOptions[prev].value); setLocalSingleLabel(optLabel(displayOptions[prev])); setLocalSingleMeta(String(displayOptions[prev].meta ?? '')); }
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPage((p) => Math.max(1, p - 1));
      setFocusedIdx(0);
      setLocalSingle(''); setLocalSingleLabel(''); setLocalSingleMeta('');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPage((p) => Math.min(totalPages, p + 1));
      setFocusedIdx(0);
      setLocalSingle(''); setLocalSingleLabel(''); setLocalSingleMeta('');
    } else if (e.key === 'Enter') {
      if (e.target instanceof HTMLButtonElement) return;
      e.preventDefault();
      if (e.metaKey || e.ctrlKey) {
        confirm();
      } else if (isMulti) {
        if (!tableActive || !displayOptions[focusedIdx]) return;
        toggleMulti(displayOptions[focusedIdx].value);
      } else {
        if (!tableActive || !displayOptions[focusedIdx]) return;
        confirmRow(displayOptions[focusedIdx]);
      }
    } else if (e.key === ' ') {
      if (!isMulti || !tableActive || !displayOptions[focusedIdx]) return;
      e.preventDefault();
      toggleMulti(displayOptions[focusedIdx].value);
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
    localSelected, localSingle, localSingleLabel, localSingleMeta, displayLabel,
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
