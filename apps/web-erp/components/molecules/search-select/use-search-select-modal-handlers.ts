'use client';

import * as React from 'react';
import { SearchSelectOption } from '../search-select-types';
import { optLabel } from '../use-search-select-types';

/**
 * Context passed from the main `useSearchSelect` hook to the modal handler
 * group. All refs are the SAME ref objects owned by the main hook — never
 * mirrored/recreated — so ref identity is preserved.
 *
 * The main hook must build the modal group FIRST so `openModal` is available
 * to its own auto-open effect AND can be passed to the inline group.
 */
export interface ModalHandlersCtx {
  // Mode / props callbacks. SearchSelectProps is a discriminated union (single
  // vs multi); the main hook passes a no-op for the branch not matching `isMulti`
  // so these stay required — the no-op is never invoked because every call site
  // is guarded by `isMulti`.
  isMulti: boolean;
  value?: string;
  values: string[];
  onValueChange: (v: string) => void;
  onPick?: (o: SearchSelectOption) => void;
  onValuesChange: (v: string[]) => void;

  // Modal state values
  displayLabel: string;
  options: SearchSelectOption[];
  displayOptions: SearchSelectOption[];
  focusedIdx: number;
  tableActive: boolean;
  totalPages: number;
  localSelected: Set<string>;
  localSingle: string;
  localSingleLabel: string;
  localSingleMeta: string;

  // Modal state setters
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setDebouncedQuery: React.Dispatch<React.SetStateAction<string>>;
  setFocusedIdx: React.Dispatch<React.SetStateAction<number>>;
  setTableActive: React.Dispatch<React.SetStateAction<boolean>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLocalSelected: React.Dispatch<React.SetStateAction<Set<string>>>;
  setLocalSingle: React.Dispatch<React.SetStateAction<string>>;
  setLocalSingleLabel: React.Dispatch<React.SetStateAction<string>>;
  setLocalSingleMeta: React.Dispatch<React.SetStateAction<string>>;
  setDisplayLabel: React.Dispatch<React.SetStateAction<string>>;
  setInputFocused: React.Dispatch<React.SetStateAction<boolean>>;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Refs (shared identity with main hook)
  searchRef: React.RefObject<HTMLInputElement | null>;
  triggerRef: React.RefObject<HTMLInputElement | null>;
  skipNextFocusRef: React.MutableRefObject<boolean>;
}

/**
 * Modal handler group: open/close, trigger focus (multi), single/multi row
 * selection, select-all, confirm, and modal keyboard nav.
 *
 * Extracted from use-search-select.ts (original L129-166 + L306-392) — content
 * preserved exactly. `openModal` is the only `useCallback`-memoized handler;
 * the others are NOT memoized wholesale to preserve identity observed by effects.
 */
export function useSearchSelectModalHandlers(ctx: ModalHandlersCtx) {
  const {
    isMulti, value, values, onValueChange, onPick, onValuesChange,
    displayLabel, displayOptions, focusedIdx, tableActive, totalPages,
    localSelected, localSingle, localSingleLabel, localSingleMeta,
    setOpen, setQuery, setDebouncedQuery, setFocusedIdx, setTableActive, setPage,
    setLocalSelected, setLocalSingle, setLocalSingleLabel, setLocalSingleMeta,
    setDisplayLabel, setInputFocused, setDropdownOpen,
    searchRef, triggerRef, skipNextFocusRef,
  } = ctx;

  // ── Open / close modal ────────────────────────────────────────────────────
  const openModal = React.useCallback((initialQuery = '') => {
    setDropdownOpen(false);
    setQuery(initialQuery);
    setDebouncedQuery(initialQuery); // reset immediately so fetch effect fires on open
    setFocusedIdx(0);
    setTableActive(false);
    setPage(1);
    if (isMulti) setLocalSelected(new Set(values));
    else { setLocalSingle(value ?? ''); setLocalSingleLabel(displayLabel); setLocalSingleMeta(''); }
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

  // ── Modal selection ───────────────────────────────────────────────────────
  const selectSingle = (opt: SearchSelectOption, idx?: number) => {
    if (!isMulti) { setLocalSingle(opt.value); setLocalSingleLabel(optLabel(opt)); setLocalSingleMeta(String(opt.meta ?? '')); }
    if (idx !== undefined) { setFocusedIdx(idx); setTableActive(true); }
  };

  const toggleMulti = (val: string) =>
    setLocalSelected((prev) => { const s = new Set(prev); s.has(val) ? s.delete(val) : s.add(val); return s; });

  const confirmRow = (opt: SearchSelectOption) => {
    if (isMulti) { toggleMulti(opt.value); return; }
    onValueChange(opt.value);
    onPick?.({ ...opt, label: optLabel(opt), meta: String(opt.meta ?? '') });
    setDisplayLabel(optLabel(opt));
    closeModal(true);
  };

  const confirm = () => {
    if (isMulti) {
      onValuesChange(Array.from(localSelected));
    } else if (localSingle) {
      onValueChange(localSingle);
      onPick?.({ value: localSingle, label: localSingleLabel, meta: localSingleMeta });
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

  return {
    openModal,
    closeModal,
    handleTriggerFocus,
    selectSingle,
    confirmRow,
    toggleMulti,
    confirm,
    toggleAll,
    handleKeyDown,
    allChecked,
    someChecked,
  };
}