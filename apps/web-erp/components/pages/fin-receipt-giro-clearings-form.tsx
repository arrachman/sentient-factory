'use client';

/**
 * Receipt Giro Clearing (RG) — create/edit form fields with nested journal lines.
 * Atomic tier: Organism sub-part.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import type {
  CreateReceiptGiroClearingPayload,
  ErpReceiptGiroClearing,
} from '@/lib/api/fin-receipt-giro-clearings';
import type { ErpJournalLine } from '@/lib/api/fin-journal-entries';
import { JournalLinesEditor } from './fin-shared-lines';

export interface ReceiptGiroClearingFormData {
  docNumber: string;
  branchId: string;
  giroNumber: string;
  giroDate: string;
  giroBank: string;
  dueDate: string;
  entryDate: string;
  fiscalPeriodId: string;
  partnerId: string;
  description: string;
  notes: string;
  currencyId: string;
  exchangeRate: string;
  lines: ErpJournalLine[];
}

export const defaultReceiptGiroClearingForm = (): ReceiptGiroClearingFormData => ({
  docNumber: '',
  branchId: '1',
  giroNumber: '',
  giroDate: new Date().toISOString().slice(0, 10),
  giroBank: '',
  dueDate: new Date().toISOString().slice(0, 10),
  entryDate: new Date().toISOString().slice(0, 10),
  fiscalPeriodId: '1',
  partnerId: '',
  description: '',
  notes: '',
  currencyId: '1',
  exchangeRate: '1.000000',
  lines: [],
});

export function fromReceiptGiroClearing(r: ErpReceiptGiroClearing): ReceiptGiroClearingFormData {
  return {
    docNumber: r.docNumber,
    branchId: r.branchId,
    giroNumber: r.giroNumber,
    giroDate: r.giroDate.slice(0, 10),
    giroBank: r.giroBank,
    dueDate: r.dueDate.slice(0, 10),
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

export function toReceiptGiroClearingPayload(
  f: ReceiptGiroClearingFormData,
): CreateReceiptGiroClearingPayload {
  return {
    docNumber: f.docNumber,
    branchId: f.branchId,
    giroNumber: f.giroNumber,
    giroDate: f.giroDate,
    giroBank: f.giroBank,
    dueDate: f.dueDate,
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

export function ReceiptGiroClearingFormFields({
  data,
  onChange,
}: {
  data: ReceiptGiroClearingFormData;
  onChange: (d: ReceiptGiroClearingFormData) => void;
}) {
  const set = <K extends keyof ReceiptGiroClearingFormData>(
    k: K,
    v: ReceiptGiroClearingFormData[K],
  ) => onChange({ ...data, [k]: v });

  return (
    <div className="p-4">
      <FormField label="No. Dokumen" htmlFor="rgc-doc" required>
        <Input
          id="rgc-doc"
          value={data.docNumber}
          onChange={(e) => set('docNumber', e.target.value)}
          placeholder="RGC-2026-000001"
        />
      </FormField>
      <FormField label="Tanggal Entry" htmlFor="rgc-date" required>
        <Input
          id="rgc-date"
          type="date"
          value={data.entryDate}
          onChange={(e) => set('entryDate', e.target.value)}
        />
      </FormField>
      <FormField label="No. Giro" htmlFor="rgc-gno" required>
        <Input
          id="rgc-gno"
          value={data.giroNumber}
          onChange={(e) => set('giroNumber', e.target.value)}
        />
      </FormField>
      <FormField label="Tanggal Giro" htmlFor="rgc-gdate" required>
        <Input
          id="rgc-gdate"
          type="date"
          value={data.giroDate}
          onChange={(e) => set('giroDate', e.target.value)}
        />
      </FormField>
      <FormField label="Bank Giro" htmlFor="rgc-gbank" required>
        <Input
          id="rgc-gbank"
          value={data.giroBank}
          onChange={(e) => set('giroBank', e.target.value)}
        />
      </FormField>
      <FormField label="Jatuh Tempo" htmlFor="rgc-due" required>
        <Input
          id="rgc-due"
          type="date"
          value={data.dueDate}
          onChange={(e) => set('dueDate', e.target.value)}
        />
      </FormField>
      <FormField label="Branch ID" htmlFor="rgc-branch" required>
        <Input
          id="rgc-branch"
          value={data.branchId}
          onChange={(e) => set('branchId', e.target.value)}
        />
      </FormField>
      <FormField label="Fiscal Period ID" htmlFor="rgc-fp" required>
        <Input
          id="rgc-fp"
          value={data.fiscalPeriodId}
          onChange={(e) => set('fiscalPeriodId', e.target.value)}
        />
      </FormField>
      <FormField label="Partner ID" htmlFor="rgc-partner">
        <Input
          id="rgc-partner"
          value={data.partnerId}
          onChange={(e) => set('partnerId', e.target.value)}
        />
      </FormField>
      <FormField label="Currency ID" htmlFor="rgc-cur" required>
        <Input
          id="rgc-cur"
          value={data.currencyId}
          onChange={(e) => set('currencyId', e.target.value)}
        />
      </FormField>
      <FormField label="Kurs" htmlFor="rgc-rate" required>
        <Input
          id="rgc-rate"
          value={data.exchangeRate}
          onChange={(e) => set('exchangeRate', e.target.value)}
        />
      </FormField>
      <FormField label="Deskripsi" htmlFor="rgc-desc" required>
        <Input
          id="rgc-desc"
          value={data.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </FormField>
      <FormField label="Catatan" htmlFor="rgc-notes">
        <Input
          id="rgc-notes"
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
