'use client';

/**
 * Spreadsheet-style cell navigation + edit state machine for the cash/bank grid.
 *
 * Default state of every cell = SELECTED (highlighted), NOT an active input.
 * Interaction model (confirmed with user, §Kas Masuk):
 * - Click selects a cell; double-click / Enter / F2 / typing → edit mode.
 * - Typing a printable char enters edit & seeds the value (Excel-style).
 * - Arrow keys move the selected cell (when not editing).
 * - While editing: Enter = commit & stay (exit edit), Tab = commit & move,
 *   Esc = cancel (revert to snapshot). Caret arrows stay inside the input.
 * - Tab at the last cell of the last row, or ArrowDown on the last row,
 *   appends a new row. Ctrl/Cmd+Delete removes the active row (keeps ≥1).
 */

import * as React from 'react';
import {
  buildCellPatch, CashLineRow, GridCol, newCashLine, rowRequiredMissing,
} from './cash-bank-line-model';

export interface CellSel { r: number; c: number }

export interface CashGridNav {
  rootRef: React.RefObject<HTMLDivElement | null>;
  sel: CellSel | null;
  editing: boolean;
  seed?: string;
  selectOnFocus: boolean;
  onRootKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  selectCell: (r: number, c: number) => void;
  editCell: (r: number, c: number) => void;
  endEdit: (focusRoot?: boolean) => void;
  patch: (key: string, p: Partial<CashLineRow>) => void;
}

const isPrintable = (e: React.KeyboardEvent) =>
  e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;

export function useCashGridNav({
  lines,
  onChange,
  cols,
  readOnly,
  onAppendBlocked,
}: {
  lines: CashLineRow[];
  onChange: (lines: CashLineRow[]) => void;
  cols: GridCol[];
  readOnly: boolean;
  /** Called (with the missing required headers) when a row append is refused. */
  onAppendBlocked?: (missing: string[]) => void;
}): CashGridNav {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [sel, setSel] = React.useState<CellSel | null>(null);
  const [editing, setEditing] = React.useState(false);
  const [seed, setSeed] = React.useState<string | undefined>(undefined);
  const [selectOnFocus, setSelectOnFocus] = React.useState(false);
  const snapshot = React.useRef<CashLineRow | null>(null);
  const wantRoot = React.useRef(false);

  // Refocus the grid container after keyboard nav / exit-edit so keystrokes
  // keep flowing. Skipped when editing (the cell control owns focus).
  React.useLayoutEffect(() => {
    if (wantRoot.current && !editing) {
      wantRoot.current = false;
      rootRef.current?.focus();
    }
  });

  const patch = (key: string, p: Partial<CashLineRow>) =>
    onChange(lines.map((l) => (l.key === key ? { ...l, ...p } : l)));

  // Skippable columns can never be focused (Kustomisasi Grid "Skip" flag).
  const isFocusable = (c: number) => !!cols[c] && !cols[c].isSkippable;
  const firstFocusableCol = () => cols.findIndex((_, c) => isFocusable(c));
  // Nearest focusable column from `c` in `dir` (inclusive of `c`); -1 if none.
  const focusableFrom = (c: number, dir: 1 | -1) => {
    for (let i = c; i >= 0 && i < cols.length; i += dir) if (isFocusable(i)) return i;
    return -1;
  };

  const selectCell = (r: number, c: number) => {
    // Snap onto the nearest focusable column so clicks on a skipped cell no-op
    // (or land on its neighbour) instead of selecting an unfocusable cell.
    const target = isFocusable(c) ? c : (focusableFrom(c, 1) >= 0 ? focusableFrom(c, 1) : focusableFrom(c, -1));
    if (target < 0) return;
    setEditing(false);
    setSel({ r, c: target });
    wantRoot.current = true;
  };

  const beginEdit = (r: number, c: number, opts: { seed?: string; selectOnFocus?: boolean }) => {
    snapshot.current = lines[r] ? { ...lines[r] } : null;
    setSel({ r, c });
    setSeed(opts.seed);
    setSelectOnFocus(opts.selectOnFocus ?? false);
    setEditing(true);
  };

  const editCell = (r: number, c: number) => {
    if (!cols[c]?.isEditable) return;
    beginEdit(r, c, { selectOnFocus: true });
  };

  const endEdit = (focusRoot = true) => {
    setEditing(false);
    setSeed(undefined);
    if (focusRoot) wantRoot.current = true;
  };

  const cancelEdit = () => {
    const snap = snapshot.current;
    if (snap) onChange(lines.map((l) => (l.key === snap.key ? snap : l)));
    endEdit(true);
  };

  // Append a blank row — refused while any required cell of the last row is
  // empty ("Wajib" flag). Returns false when blocked so callers can stop.
  const appendRow = (focusCol: number): boolean => {
    const last = lines[lines.length - 1];
    const missing = last ? rowRequiredMissing(last, cols) : [];
    if (missing.length) { onAppendBlocked?.(missing); return false; }
    const target = isFocusable(focusCol) ? focusCol : Math.max(0, firstFocusableCol());
    setSel({ r: lines.length, c: target });
    setEditing(false);
    wantRoot.current = true;
    onChange([...lines, newCashLine()]);
    return true;
  };

  const removeRow = (idx: number) => {
    setEditing(false);
    wantRoot.current = true;
    if (lines.length <= 1) {
      setSel({ r: 0, c: 0 });
      onChange([newCashLine()]);
      return;
    }
    const next = lines.filter((_, i) => i !== idx);
    setSel({ r: Math.min(idx, next.length - 1), c: sel?.c ?? 0 });
    onChange(next);
  };

  const lastRow = lines.length - 1;
  const firstCol = firstFocusableCol();
  const lastCol = focusableFrom(cols.length - 1, -1);

  // Step horizontally to the next focusable column in a row; -1 if none remain.
  const stepCol = (c: number, dir: 1 | -1) => {
    const next = focusableFrom(c + dir, dir);
    return next;
  };

  // Move one cell forward/back, wrapping rows; appends when stepping past the end.
  const moveTab = (r: number, c: number, back: boolean) => {
    if (back) {
      const prev = stepCol(c, -1);
      if (prev >= 0) selectCell(r, prev);
      else if (r > 0) selectCell(r - 1, lastCol);
      return;
    }
    const next = stepCol(c, 1);
    if (next >= 0) selectCell(r, next);
    else if (r < lastRow) selectCell(r + 1, firstCol);
    else appendRow(firstCol);
  };

  const startCharEdit = (r: number, c: number, key: string) => {
    const col = cols[c];
    if (!col?.isEditable) return false;
    if (col.dataType === 'LOOKUP') { beginEdit(r, c, { seed: key }); return true; }
    if (col.dataType === 'DATE') { beginEdit(r, c, {}); return true; }
    if (col.dataType === 'NUMBER') {
      if (!/[0-9]/.test(key)) return false;
      patch(lines[r].key, buildCellPatch(lines[r], col, key));
      beginEdit(r, c, {});
      return true;
    }
    // TEXT
    patch(lines[r].key, buildCellPatch(lines[r], col, key));
    beginEdit(r, c, {});
    return true;
  };

  const onRootKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (readOnly || !sel) return;
    const { r, c } = sel;

    if (editing) {
      if (e.key === 'Escape') { e.preventDefault(); cancelEdit(); }
      // SearchSelect preventDefaults its own Enter (resolving a pick); only a
      // plain field's unhandled Enter should commit+exit here.
      else if (e.key === 'Enter' && !e.defaultPrevented) { e.preventDefault(); endEdit(); }
      else if (e.key === 'Tab') { e.preventDefault(); endEdit(false); moveTab(r, c, e.shiftKey); }
      return; // other keys → input handles (typing, caret arrows)
    }

    switch (e.key) {
      case 'ArrowUp': e.preventDefault(); if (r > 0) selectCell(r - 1, c); break;
      case 'ArrowDown':
        e.preventDefault();
        if (r < lastRow) selectCell(r + 1, c); else appendRow(c);
        break;
      case 'ArrowLeft': { e.preventDefault(); const p = stepCol(c, -1); if (p >= 0) selectCell(r, p); break; }
      case 'ArrowRight': { e.preventDefault(); const n = stepCol(c, 1); if (n >= 0) selectCell(r, n); break; }
      case 'Tab': e.preventDefault(); moveTab(r, c, e.shiftKey); break;
      case 'Enter':
      case 'F2': e.preventDefault(); editCell(r, c); break;
      case 'Delete':
      case 'Backspace':
        if (e.ctrlKey || e.metaKey) { e.preventDefault(); removeRow(r); }
        break;
      default:
        if (isPrintable(e) && startCharEdit(r, c, e.key)) e.preventDefault();
    }
  };

  return {
    rootRef, sel, editing, seed, selectOnFocus,
    onRootKeyDown, selectCell, editCell, endEdit, patch,
  };
}
