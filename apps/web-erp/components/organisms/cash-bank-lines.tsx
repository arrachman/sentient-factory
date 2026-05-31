'use client';

/**
 * Editable contra-account grid for cash/bank transactions (Kas Masuk/Keluar).
 * Atomic tier: Organism. Reusable across CR/CD/BD forms.
 *
 * Unlike a general journal, a cash/bank doc has ONE cash account in the header
 * (the debit/credit side) — these lines are the opposite-side CoA accounts, each
 * with a single Total (no per-line debit/credit). Mirrors `fin_cash_bank_lines`
 * + the legacy MyERP+ "Detail" tab (No Akun · Nama Akun · Total · Total Valas ·
 * Catatan · Cost Center).
 *
 * Spreadsheet-style grid: cells default to SELECTED (not active inputs). Click
 * to select, type / Enter / F2 / double-click to edit. Navigation + row add/
 * remove live in `useCashGridNav`; per-cell display/edit in `LineCell`.
 */

import * as React from 'react';
import { Kbd } from '@/components/ui/kbd';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/organisms/table';
import { formatNumber } from '@/lib/format';
import { CashLineRow, cellColumns } from './cash-bank-line-model';
import { LineCell } from './cash-bank-line-cell';
import { useCashGridNav } from './use-cash-grid-nav';

export type { CashLineRow } from './cash-bank-line-model';
export { newCashLine } from './cash-bank-line-model';

export function CashBankLinesEditor({
  lines,
  onChange,
  readOnly = false,
  showFx = false,
}: {
  lines: CashLineRow[];
  onChange: (lines: CashLineRow[]) => void;
  readOnly?: boolean;
  showFx?: boolean;
}) {
  const cols = React.useMemo(() => cellColumns(showFx), [showFx]);
  const {
    rootRef, sel, editing, seed, selectOnFocus,
    onRootKeyDown, selectCell, editCell, endEdit, patch,
  } = useCashGridNav({ lines, onChange, cols, readOnly });

  const handleRootFocus = () => {
    if (!readOnly && !sel && !editing) selectCell(0, 0);
  };

  const total = lines.reduce((s, l) => s + Number(l.amount || 0), 0);
  const totalFx = lines.reduce((s, l) => s + Number(l.amountFx || 0), 0);
  const colSpan = cols.length + 1;

  return (
    <div
      className="cashbank-lines outline-none"
      ref={rootRef}
      tabIndex={readOnly ? -1 : 0}
      onKeyDown={onRootKeyDown}
      onFocus={handleRootFocus}
    >
      {!readOnly && (
        <div className="mb-2 flex flex-wrap items-center justify-end gap-1 text-[11px] text-muted-foreground">
          Klik cell lalu ketik / <Kbd>Enter</Kbd> untuk edit · <Kbd>↑↓←→</Kbd> pindah ·{' '}
          <Kbd>Tab</Kbd>/<Kbd>↓</Kbd> di akhir = baris baru · <Kbd>Ctrl</Kbd>+<Kbd>Del</Kbd> hapus baris
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: 44 }}>No</TableHead>
            <TableHead>Akun (No · Nama)</TableHead>
            <TableHead style={{ width: 160, textAlign: 'right' }}>Total</TableHead>
            {showFx && <TableHead style={{ width: 140, textAlign: 'right' }}>Total Valas</TableHead>}
            <TableHead>Catatan</TableHead>
            <TableHead style={{ width: 220 }}>Cost Center</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.length === 0 ? (
            <TableRow>
              <TableCell colSpan={colSpan} className="text-center text-muted-foreground py-4">
                Belum ada baris akun.
              </TableCell>
            </TableRow>
          ) : (
            lines.map((l, i) => (
              <TableRow key={l.key} data-row={i}>
                <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                {cols.map((kind, c) => {
                  const isSel = sel?.r === i && sel?.c === c;
                  const isEdit = editing && isSel;
                  return (
                    <LineCell
                      key={kind}
                      kind={kind}
                      row={l}
                      selected={!readOnly && !!isSel}
                      editing={isEdit}
                      seed={isEdit ? seed : undefined}
                      selectOnFocus={selectOnFocus}
                      readOnly={readOnly}
                      onPatch={(p) => patch(l.key, p)}
                      onSelect={() => { if (!readOnly) selectCell(i, c); }}
                      onEdit={() => { if (!readOnly) editCell(i, c); }}
                      onEndEdit={(focus) => endEdit(focus)}
                    />
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex justify-end gap-6 pt-3 pr-2 text-sm">
        {showFx && (
          <span className="text-muted-foreground">
            Total Valas <strong className="tabular-nums ml-2">{formatNumber(totalFx, 2)}</strong>
          </span>
        )}
        <span>
          Total <strong className="tabular-nums ml-2">{formatNumber(total, 2)}</strong>
        </span>
      </div>
    </div>
  );
}
