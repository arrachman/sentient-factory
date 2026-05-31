/**
 * Shared model for the cash/bank contra-account grid (Kas Masuk/Keluar/Bank).
 * Row shape + factory + the ordered list of editable cell columns.
 * Kept separate so the cell view, keyboard hook, and organism share one source
 * without circular imports.
 */

export interface CashLineRow {
  key: string;
  accountId: string;
  accountLabel?: string;
  amount: string;
  amountFx?: string;
  notes?: string;
  costCenterId?: string;
  costCenterLabel?: string;
}

let seq = 0;
export const newCashLine = (): CashLineRow => ({
  key: `cl-${(seq += 1)}`,
  accountId: '',
  amount: '',
});

/** Editable cell columns, left→right. `amountFx` only present when showFx. */
export type CellKind = 'account' | 'amount' | 'amountFx' | 'notes' | 'costCenter';

export const cellColumns = (showFx: boolean): CellKind[] =>
  showFx
    ? ['account', 'amount', 'amountFx', 'notes', 'costCenter']
    : ['account', 'amount', 'notes', 'costCenter'];
