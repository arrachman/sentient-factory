'use client';

/**
 * Kas Masuk (CR) form — thin direction wrapper over the shared cash/bank
 * transaction form (RECEIPT: "Terima Dari" + "Akun Kas [D]"). Model + layout
 * live in cash-bank-form-model.ts / cash-bank-transaction-form.tsx (§3 reuse).
 */

import * as React from 'react';
import {
  CashBankTransactionForm,
  type CashBankFormLabels,
} from './cash-bank-transaction-form';
import {
  defaultCashBankForm,
  fromCashBankTransaction,
  toCashBankPayload,
  type CashBankFormData,
} from './cash-bank-form-model';
import type {
  CreateCashReceiptPayload,
  ErpCashReceipt,
} from '@/lib/api/fin-cash-receipts';

export type CashReceiptFormData = CashBankFormData;

export const defaultCashReceiptForm = defaultCashBankForm;
export const fromCashReceipt = (r: ErpCashReceipt): CashReceiptFormData =>
  fromCashBankTransaction(r);
export const toCashReceiptPayload = (d: CashReceiptFormData): CreateCashReceiptPayload =>
  toCashBankPayload(d, 'RECEIPT');

const CR_LABELS: CashBankFormLabels = { partner: 'Terima Dari', account: 'Akun Kas [D]' };

export function CashReceiptForm(props: {
  data: CashReceiptFormData;
  onChange: (d: CashReceiptFormData) => void;
  saving?: boolean;
  onSave: () => void;
  onSaveNew: () => void;
  onReset: () => void;
}) {
  return <CashBankTransactionForm {...props} labels={CR_LABELS} transactionCode="FIN.CR" />;
}
