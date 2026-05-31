'use client';

/**
 * Editable contra-account grid for cash/bank transactions (Kas Masuk/Keluar).
 * Atomic tier: Organism. Reusable across CR/CD/BD forms.
 *
 * Columns are config-driven (Kustomisasi Grid): pass `columns` (visible GridCol[])
 * to control which fields render, their order/width/header/editability + custom
 * columns. Falls back to `defaultGridCols(showFx)` when no config is supplied.
 *
 * Spreadsheet-style: cells default to SELECTED (not active inputs). Navigation +
 * row add/remove live in `useCashGridNav`; per-cell display/edit in `LineCell`.
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
import { getGridColumns, type ErpGridColumn } from '@/lib/api/transaction-grids';
import {
  buildCellPatch,
  CashLineRow,
  defaultGridCols,
  getCellRaw,
  type GridCol,
} from './cash-bank-line-model';
import { LineCell } from './cash-bank-line-cell';
import { useCashGridNav } from './use-cash-grid-nav';

const toGridCols = (cols: ErpGridColumn[]): GridCol[] =>
  cols
    .filter((c) => c.isVisible)
    .map((c) => ({
      dataField: c.dataField,
      headerText: c.headerText,
      width: c.width,
      dataType: c.dataType,
      lookupSource: c.lookupSource,
      kind: c.kind,
      isEditable: c.isEditable,
      isRequired: c.isRequired,
    }));

export type { CashLineRow } from './cash-bank-line-model';
export { newCashLine } from './cash-bank-line-model';

const lookupLabel = (row: CashLineRow, col: GridCol): string | undefined => {
  if (row.labels?.[col.dataField]) return row.labels[col.dataField];
  if (col.dataField === 'accountId') return row.accountLabel;
  if (col.dataField === 'costCenterId') return row.costCenterLabel;
  return undefined;
};

export function CashBankLinesEditor({
  lines,
  onChange,
  readOnly = false,
  showFx = false,
  columns,
  transactionCode,
}: {
  lines: CashLineRow[];
  onChange: (lines: CashLineRow[]) => void;
  readOnly?: boolean;
  showFx?: boolean;
  /** Explicit column config (wins over self-fetch). */
  columns?: GridCol[];
  /** When set (e.g. "FIN.CR"), the editor fetches its Kustomisasi Grid config. */
  transactionCode?: string;
}) {
  const [fetched, setFetched] = React.useState<GridCol[] | undefined>();

  React.useEffect(() => {
    if (columns || !transactionCode) return;
    let alive = true;
    getGridColumns(transactionCode)
      .then((r) => { if (alive) setFetched(toGridCols(r.columns)); })
      .catch(() => { /* fall back to default columns */ });
    return () => { alive = false; };
  }, [columns, transactionCode]);

  const cols = React.useMemo(() => {
    if (columns && columns.length) return columns;
    if (fetched && fetched.length) return fetched;
    return defaultGridCols(showFx);
  }, [columns, fetched, showFx]);
  const {
    rootRef, sel, editing, seed, selectOnFocus,
    onRootKeyDown, selectCell, editCell, endEdit, patch,
  } = useCashGridNav({ lines, onChange, cols, readOnly });

  const handleRootFocus = () => {
    if (!readOnly && !sel && !editing) selectCell(0, 0);
  };

  const total = lines.reduce((s, l) => s + Number(l.amount || 0), 0);
  const totalFx = lines.reduce((s, l) => s + Number(l.amountFx || 0), 0);
  const hasFx = cols.some((c) => c.dataField === 'amountFx');
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
            {cols.map((c) => (
              <TableHead
                key={c.dataField}
                style={{ width: c.width, textAlign: c.dataType === 'NUMBER' ? 'right' : 'left' }}
              >
                {c.headerText}
              </TableHead>
            ))}
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
                {cols.map((c, ci) => {
                  const isSel = sel?.r === i && sel?.c === ci;
                  const isEdit = editing && isSel;
                  return (
                    <LineCell
                      key={c.dataField}
                      col={c}
                      value={getCellRaw(l, c)}
                      label={lookupLabel(l, c)}
                      selected={!readOnly && !!isSel}
                      editing={isEdit}
                      seed={isEdit ? seed : undefined}
                      selectOnFocus={selectOnFocus}
                      onSet={(value, label) => patch(l.key, buildCellPatch(l, c, value, label))}
                      onSelect={() => { if (!readOnly) selectCell(i, ci); }}
                      onEdit={() => { if (!readOnly) editCell(i, ci); }}
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
        {hasFx && (
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
