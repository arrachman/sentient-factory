'use client';

/**
 * Adjustment Journal (AJ) — create/edit form fields with nested journal lines.
 * Atomic tier: Organism sub-part.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import type {
  CreateAdjustmentJournalPayload,
  ErpAdjustmentJournal,
} from '@/lib/api/fin-adjustment-journals';
import type { ErpJournalLine } from '@/lib/api/fin-journal-entries';
import { JournalLinesEditor } from './fin-shared-lines';

export interface AdjustmentJournalFormData {
  docNumber: string;
  branchId: string;
  entryDate: string;
  fiscalPeriodId: string;
  partnerId: string;
  description: string;
  notes: string;
  currencyId: string;
  exchangeRate: string;
  lines: ErpJournalLine[];
}

export const defaultAdjustmentJournalForm = (): AdjustmentJournalFormData => ({
  docNumber: '',
  branchId: '1',
  entryDate: new Date().toISOString().slice(0, 10),
  fiscalPeriodId: '1',
  partnerId: '',
  description: '',
  notes: '',
  currencyId: '1',
  exchangeRate: '1.000000',
  lines: [],
});

export function fromAdjustmentJournal(
  r: ErpAdjustmentJournal,
): AdjustmentJournalFormData {
  return {
    docNumber: r.docNumber,
    branchId: r.branchId,
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

export function toAdjustmentJournalPayload(
  f: AdjustmentJournalFormData,
): CreateAdjustmentJournalPayload {
  return {
    docNumber: f.docNumber,
    branchId: f.branchId,
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

export function AdjustmentJournalFormFields({
  data,
  onChange,
}: {
  data: AdjustmentJournalFormData;
  onChange: (d: AdjustmentJournalFormData) => void;
}) {
  const set = <K extends keyof AdjustmentJournalFormData>(
    k: K,
    v: AdjustmentJournalFormData[K],
  ) => onChange({ ...data, [k]: v });

  return (
    <div className="p-4">
      <FormField label="No. Dokumen" htmlFor="aj-doc" required>
        <Input
          id="aj-doc"
          value={data.docNumber}
          onChange={(e) => set('docNumber', e.target.value)}
          placeholder="AJ-2026-000001"
        />
      </FormField>
      <FormField label="Tanggal" htmlFor="aj-date" required>
        <Input
          id="aj-date"
          type="date"
          value={data.entryDate}
          onChange={(e) => set('entryDate', e.target.value)}
        />
      </FormField>
      <FormField label="Branch ID" htmlFor="aj-branch" required>
        <Input
          id="aj-branch"
          value={data.branchId}
          onChange={(e) => set('branchId', e.target.value)}
        />
      </FormField>
      <FormField label="Fiscal Period ID" htmlFor="aj-fp" required>
        <Input
          id="aj-fp"
          value={data.fiscalPeriodId}
          onChange={(e) => set('fiscalPeriodId', e.target.value)}
        />
      </FormField>
      <FormField label="Partner ID" htmlFor="aj-partner">
        <Input
          id="aj-partner"
          value={data.partnerId}
          onChange={(e) => set('partnerId', e.target.value)}
        />
      </FormField>
      <FormField label="Currency ID" htmlFor="aj-cur" required>
        <Input
          id="aj-cur"
          value={data.currencyId}
          onChange={(e) => set('currencyId', e.target.value)}
        />
      </FormField>
      <FormField label="Kurs" htmlFor="aj-rate" required>
        <Input
          id="aj-rate"
          value={data.exchangeRate}
          onChange={(e) => set('exchangeRate', e.target.value)}
        />
      </FormField>
      <FormField label="Deskripsi" htmlFor="aj-desc" required>
        <Input
          id="aj-desc"
          value={data.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </FormField>
      <FormField label="Catatan" htmlFor="aj-notes">
        <Input
          id="aj-notes"
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
