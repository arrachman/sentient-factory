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
import { CashLineRow, CellKind, newCashLine } from './cash-bank-line-model';

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
}: {
  lines: CashLineRow[];
  onChange: (lines: CashLineRow[]) => void;
  cols: CellKind[];
  readOnly: boolean;
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

  const selectCell = (r: number, c: number) => {
    setEditing(false);
    setSel({ r, c });
    wantRoot.current = true;
  };

  const beginEdit = (r: number, c: number, opts: { seed?: string; selectOnFocus?: boolean }) => {
    snapshot.current = lines[r] ? { ...lines[r] } : null;
    setSel({ r, c });
    setSeed(opts.seed);
    setSelectOnFocus(opts.selectOnFocus ?? false);
    setEditing(true);
  };

  const editCell = (r: number, c: number) => beginEdit(r, c, { selectOnFocus: true });

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

  const appendRow = (focusCol: number) => {
    setSel({ r: lines.length, c: focusCol });
    setEditing(false);
    wantRoot.current = true;
    onChange([...lines, newCashLine()]);
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

  const lastCol = cols.length - 1;
  const lastRow = lines.length - 1;

  // Move one cell forward/back, wrapping rows; appends when stepping past the end.
  const moveTab = (r: number, c: number, back: boolean) => {
    if (back) {
      if (c > 0) selectCell(r, c - 1);
      else if (r > 0) selectCell(r - 1, lastCol);
      return;
    }
    if (c < lastCol) selectCell(r, c + 1);
    else if (r < lastRow) selectCell(r + 1, 0);
    else appendRow(0);
  };

  const startCharEdit = (r: number, c: number, key: string) => {
    const kind = cols[c];
    if (kind === 'account' || kind === 'costCenter') {
      beginEdit(r, c, { seed: key });
      return true;
    }
    if (kind === 'notes') {
      patch(lines[r].key, { notes: key });
      beginEdit(r, c, {});
      return true;
    }
    if (/[0-9]/.test(key)) {
      patch(lines[r].key, { [kind === 'amount' ? 'amount' : 'amountFx']: key });
      beginEdit(r, c, {});
      return true;
    }
    return false;
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
      case 'ArrowLeft': e.preventDefault(); if (c > 0) selectCell(r, c - 1); break;
      case 'ArrowRight': e.preventDefault(); if (c < lastCol) selectCell(r, c + 1); break;
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
