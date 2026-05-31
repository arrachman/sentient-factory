'use client';

/**
 * Cash Disbursement (CR) — create/edit form fields with nested journal lines.
 * Atomic tier: Organism sub-part.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { DateInput } from '@/components/ui/date-input';
import type {
  CreateCashDisbursementPayload,
  ErpCashDisbursement,
} from '@/lib/api/fin-cash-disbursements';
import type { ErpJournalLine } from '@/lib/api/fin-journal-entries';
import { JournalLinesEditor } from './fin-shared-lines';

export interface CashDisbursementFormData {
  docNumber: string;
  branchId: string;
  cashAccountId: string;
  entryDate: string;
  fiscalPeriodId: string;
  partnerId: string;
  description: string;
  notes: string;
  currencyId: string;
  exchangeRate: string;
  lines: ErpJournalLine[];
}

export const defaultCashDisbursementForm = (): CashDisbursementFormData => ({
  docNumber: '',
  branchId: '1',
  cashAccountId: '',
  entryDate: new Date().toISOString().slice(0, 10),
  fiscalPeriodId: '1',
  partnerId: '',
  description: '',
  notes: '',
  currencyId: '1',
  exchangeRate: '1.000000',
  lines: [],
});

export function fromCashDisbursement(r: ErpCashDisbursement): CashDisbursementFormData {
  return {
    docNumber: r.docNumber,
    branchId: r.branchId,
    cashAccountId: r.cashAccountId,
    entryDate: r.entryDate.slice(0, 10),
    fiscalPeriodId: r.fiscalPeriodId,
    partnerId: r.partnerId ?? '',
    description: r.description,
    notes: r.notes ?? '',
    currencyId: r.currencyId,
    exchangeRate: r.exchangeRate,
    lines: r.lines.map((l) => ({ ...l })),
  };
}

export function toCashDisbursementPayload(
  f: CashDisbursementFormData,
): CreateCashDisbursementPayload {
  return {
    docNumber: f.docNumber,
    branchId: f.branchId,
    cashAccountId: f.cashAccountId,
    entryDate: f.entryDate,
    fiscalPeriodId: f.fiscalPeriodId,
    description: f.description,
    currencyId: f.currencyId,
    exchangeRate: f.exchangeRate,
    notes: f.notes || undefined,
    partnerId: f.partnerId || undefined,
    lines: f.lines.map((l, i) => ({ ...l, lineNo: i + 1 })),
  };
}

export function CashDisbursementFormFields({
  data,
  onChange,
}: {
  data: CashDisbursementFormData;
  onChange: (d: CashDisbursementFormData) => void;
}) {
  const set = <K extends keyof CashDisbursementFormData>(
    k: K,
    v: CashDisbursementFormData[K],
  ) => onChange({ ...data, [k]: v });

  return (
    <div className="p-4">
      <FormField label="No. Dokumen" htmlFor="cd-doc" required>
        <Input
          id="cd-doc"
          value={data.docNumber}
          onChange={(e) => set('docNumber', e.target.value)}
          placeholder="CD-2026-000001"
        />
      </FormField>
      <FormField label="Tanggal" htmlFor="cd-date" required>
        <DateInput
          id="cd-date"
          value={data.entryDate}
          onChange={(v) => set('entryDate', v)}
        />
      </FormField>
      <FormField label="Cash Account ID" htmlFor="cd-cash" required>
        <Input
          id="cd-cash"
          value={data.cashAccountId}
          onChange={(e) => set('cashAccountId', e.target.value)}
          placeholder="ID rekening kas/bank"
        />
      </FormField>
      <FormField label="Branch ID" htmlFor="cd-branch" required>
        <Input
          id="cd-branch"
          value={data.branchId}
          onChange={(e) => set('branchId', e.target.value)}
        />
      </FormField>
      <FormField label="Fiscal Period ID" htmlFor="cd-fp" required>
        <Input
          id="cd-fp"
          value={data.fiscalPeriodId}
          onChange={(e) => set('fiscalPeriodId', e.target.value)}
        />
      </FormField>
      <FormField label="Partner ID" htmlFor="cd-partner">
        <Input
          id="cd-partner"
          value={data.partnerId}
          onChange={(e) => set('partnerId', e.target.value)}
        />
      </FormField>
      <FormField label="Currency ID" htmlFor="cd-cur" required>
        <Input
          id="cd-cur"
          value={data.currencyId}
          onChange={(e) => set('currencyId', e.target.value)}
        />
      </FormField>
      <FormField label="Kurs" htmlFor="cd-rate" required>
        <Input
          id="cd-rate"
          value={data.exchangeRate}
          onChange={(e) => set('exchangeRate', e.target.value)}
        />
      </FormField>
      <FormField label="Deskripsi" htmlFor="cd-desc" required>
        <Input
          id="cd-desc"
          value={data.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </FormField>
      <FormField label="Catatan" htmlFor="cd-notes">
        <Input
          id="cd-notes"
          value={data.notes}
          onChange={(e) => set('notes', e.target.value)}
        />
      </FormField>
      <JournalLinesEditor
        lines={data.lines}
        onChange={(lines) => onChange({ ...data, lines })}
      />
    </div>
  );
}
