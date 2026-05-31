'use client';

/**
 * One cell of the cash/bank contra-account grid. Atomic tier: Organism part.
 *
 * Default = a SELECTED display cell (plain text, no input box). Only the cell
 * being edited renders its real control (SearchSelect / NumInput / Input),
 * auto-focused. Selection ring vs edit focus-ring are visually distinct.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { NumInput } from '@/components/molecules/num-input';
import { SearchSelect } from '@/components/molecules/search-select';
import { TableCell } from '@/components/organisms/table';
import { loadAccountOptionsCoded, loadCostCenterOptions } from '@/components/pages/items-form-lookups';
import { formatNumber } from '@/lib/format';
import { CashLineRow, CellKind } from './cash-bank-line-model';

const isNumeric = (k: CellKind) => k === 'amount' || k === 'amountFx';

const displayText = (kind: CellKind, row: CashLineRow): { text: string; muted: boolean } => {
  switch (kind) {
    case 'account':
      return row.accountId
        ? { text: row.accountLabel || row.accountId, muted: false }
        : { text: 'Pilih akun…', muted: true };
    case 'amount':
      return { text: formatNumber(Number(row.amount || 0), 2), muted: !row.amount };
    case 'amountFx':
      return { text: formatNumber(Number(row.amountFx || 0), 2), muted: !row.amountFx };
    case 'notes':
      return row.notes ? { text: row.notes, muted: false } : { text: '—', muted: true };
    case 'costCenter':
      return row.costCenterId
        ? { text: row.costCenterLabel || row.costCenterId, muted: false }
        : { text: '(opsional)', muted: true };
  }
};

export interface LineCellProps {
  kind: CellKind;
  row: CashLineRow;
  selected: boolean;
  editing: boolean;
  seed?: string;
  selectOnFocus: boolean;
  readOnly?: boolean;
  onPatch: (p: Partial<CashLineRow>) => void;
  onSelect: () => void;
  onEdit: () => void;
  /** Exit edit mode. `focusRoot` = return focus to the grid (pick/commit) vs
   *  leave focus where it landed (blur). */
  onEndEdit: (focusRoot: boolean) => void;
}

function EditControl({ kind, row, seed, selectOnFocus, onPatch, onEndEdit }: LineCellProps) {
  if (kind === 'account' || kind === 'costCenter') {
    const isAcct = kind === 'account';
    return (
      <SearchSelect
        autoFocus
        initialQuery={seed}
        placeholder={isAcct ? 'Pilih akun…' : '(opsional)'}
        value={isAcct ? row.accountId : row.costCenterId ?? ''}
        initialLabel={isAcct ? row.accountLabel : row.costCenterLabel}
        onValueChange={(v) => onPatch(isAcct ? { accountId: v } : { costCenterId: v })}
        onPick={(o) => {
          onPatch(isAcct
            ? { accountId: o.value, accountLabel: o.label }
            : { costCenterId: o.value, costCenterLabel: o.label });
          onEndEdit(true);
        }}
        loadOptions={isAcct ? loadAccountOptionsCoded : loadCostCenterOptions}
      />
    );
  }
  if (isNumeric(kind)) {
    return (
      <NumInput
        autoFocus
        decimals={2}
        value={(kind === 'amount' ? row.amount : row.amountFx) ?? ''}
        onFocus={(e) => { if (selectOnFocus) e.currentTarget.select(); }}
        onChange={(raw) => onPatch(kind === 'amount' ? { amount: raw } : { amountFx: raw })}
      />
    );
  }
  return (
    <Input
      autoFocus
      value={row.notes ?? ''}
      onFocus={(e) => { if (selectOnFocus) e.currentTarget.select(); }}
      onChange={(e) => onPatch({ notes: e.target.value })}
    />
  );
}

export function LineCell(props: LineCellProps) {
  const { kind, row, selected, editing, onSelect, onEdit, onEndEdit } = props;
  const numeric = isNumeric(kind);

  return (
    <TableCell
      className={cn(
        'p-0 align-middle',
        selected && !editing && 'shadow-[inset_0_0_0_2px_var(--primary)]',
      )}
    >
      {editing ? (
        <div
          className="px-[10px]"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) onEndEdit(false);
          }}
        >
          <EditControl {...props} />
        </div>
      ) : (
        <div
          role="button"
          tabIndex={-1}
          onClick={onSelect}
          onDoubleClick={onEdit}
          className={cn(
            'flex h-[var(--row-h)] w-full cursor-pointer select-none items-center truncate px-[10px]',
            numeric && 'justify-end tabular-nums',
          )}
        >
          {(() => {
            const { text, muted } = displayText(kind, row);
            return <span className={cn('truncate', muted && 'text-[var(--fg-subtle)]')}>{text}</span>;
          })()}
        </div>
      )}
    </TableCell>
  );
}
