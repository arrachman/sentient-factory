'use client';

/**
 * Receipt Giro (RG) — create/edit form fields with nested journal lines.
 * Atomic tier: Organism sub-part.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { DateInput } from '@/components/ui/date-input';
import type {
  CreateReceiptGiroPayload,
  ErpReceiptGiro,
} from '@/lib/api/fin-receipt-giros';
import type { ErpJournalLine } from '@/lib/api/fin-journal-entries';
import { JournalLinesEditor } from './fin-shared-lines';

export interface ReceiptGiroFormData {
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

export const defaultReceiptGiroForm = (): ReceiptGiroFormData => ({
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

export function fromReceiptGiro(r: ErpReceiptGiro): ReceiptGiroFormData {
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

export function toReceiptGiroPayload(
  f: ReceiptGiroFormData,
): CreateReceiptGiroPayload {
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

export function ReceiptGiroFormFields({
  data,
  onChange,
}: {
  data: ReceiptGiroFormData;
  onChange: (d: ReceiptGiroFormData) => void;
}) {
  const set = <K extends keyof ReceiptGiroFormData>(
    k: K,
    v: ReceiptGiroFormData[K],
  ) => onChange({ ...data, [k]: v });

  return (
    <div className="p-4">
      <FormField label="No. Dokumen" htmlFor="rg-doc" required>
        <Input
          id="rg-doc"
          value={data.docNumber}
          onChange={(e) => set('docNumber', e.target.value)}
          placeholder="RG-2026-000001"
        />
      </FormField>
      <FormField label="Tanggal Entry" htmlFor="rg-date" required>
        <DateInput
          id="rg-date"
          value={data.entryDate}
          onChange={(v) => set('entryDate', v)}
        />
      </FormField>
      <FormField label="No. Giro" htmlFor="rg-gno" required>
        <Input
          id="rg-gno"
          value={data.giroNumber}
          onChange={(e) => set('giroNumber', e.target.value)}
        />
      </FormField>
      <FormField label="Tanggal Giro" htmlFor="rg-gdate" required>
        <DateInput
          id="rg-gdate"
          value={data.giroDate}
          onChange={(v) => set('giroDate', v)}
        />
      </FormField>
      <FormField label="Bank Giro" htmlFor="rg-gbank" required>
        <Input
          id="rg-gbank"
          value={data.giroBank}
          onChange={(e) => set('giroBank', e.target.value)}
        />
      </FormField>
      <FormField label="Jatuh Tempo" htmlFor="rg-due" required>
        <DateInput
          id="rg-due"
          value={data.dueDate}
          onChange={(v) => set('dueDate', v)}
        />
      </FormField>
      <FormField label="Branch ID" htmlFor="rg-branch" required>
        <Input
          id="rg-branch"
          value={data.branchId}
          onChange={(e) => set('branchId', e.target.value)}
        />
      </FormField>
      <FormField label="Fiscal Period ID" htmlFor="rg-fp" required>
        <Input
          id="rg-fp"
          value={data.fiscalPeriodId}
          onChange={(e) => set('fiscalPeriodId', e.target.value)}
        />
      </FormField>
      <FormField label="Partner ID" htmlFor="rg-partner">
        <Input
          id="rg-partner"
          value={data.partnerId}
          onChange={(e) => set('partnerId', e.target.value)}
        />
      </FormField>
      <FormField label="Currency ID" htmlFor="rg-cur" required>
        <Input
          id="rg-cur"
          value={data.currencyId}
          onChange={(e) => set('currencyId', e.target.value)}
        />
      </FormField>
      <FormField label="Kurs" htmlFor="rg-rate" required>
        <Input
          id="rg-rate"
          value={data.exchangeRate}
          onChange={(e) => set('exchangeRate', e.target.value)}
        />
      </FormField>
      <FormField label="Deskripsi" htmlFor="rg-desc" required>
        <Input
          id="rg-desc"
          value={data.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </FormField>
      <FormField label="Catatan" htmlFor="rg-notes">
        <Input
          id="rg-notes"
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
