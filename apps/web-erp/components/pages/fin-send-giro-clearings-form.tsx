'use client';

/**
 * Send Giro Clearing (RG) — create/edit form fields with nested journal lines.
 * Atomic tier: Organism sub-part.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import type {
  CreateSendGiroClearingPayload,
  ErpSendGiroClearing,
} from '@/lib/api/fin-send-giro-clearings';
import type { ErpJournalLine } from '@/lib/api/fin-journal-entries';
import { JournalLinesEditor } from './fin-shared-lines';

export interface SendGiroClearingFormData {
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

export const defaultSendGiroClearingForm = (): SendGiroClearingFormData => ({
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

export function fromSendGiroClearing(r: ErpSendGiroClearing): SendGiroClearingFormData {
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

export function toSendGiroClearingPayload(
  f: SendGiroClearingFormData,
): CreateSendGiroClearingPayload {
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

export function SendGiroClearingFormFields({
  data,
  onChange,
}: {
  data: SendGiroClearingFormData;
  onChange: (d: SendGiroClearingFormData) => void;
}) {
  const set = <K extends keyof SendGiroClearingFormData>(
    k: K,
    v: SendGiroClearingFormData[K],
  ) => onChange({ ...data, [k]: v });

  return (
    <div className="p-4">
      <FormField label="No. Dokumen" htmlFor="sgc-doc" required>
        <Input
          id="sgc-doc"
          value={data.docNumber}
          onChange={(e) => set('docNumber', e.target.value)}
          placeholder="SGC-2026-000001"
        />
      </FormField>
      <FormField label="Tanggal Entry" htmlFor="sgc-date" required>
        <Input
          id="sgc-date"
          type="date"
          value={data.entryDate}
          onChange={(e) => set('entryDate', e.target.value)}
        />
      </FormField>
      <FormField label="No. Giro" htmlFor="sgc-gno" required>
        <Input
          id="sgc-gno"
          value={data.giroNumber}
          onChange={(e) => set('giroNumber', e.target.value)}
        />
      </FormField>
      <FormField label="Tanggal Giro" htmlFor="sgc-gdate" required>
        <Input
          id="sgc-gdate"
          type="date"
          value={data.giroDate}
          onChange={(e) => set('giroDate', e.target.value)}
        />
      </FormField>
      <FormField label="Bank Giro" htmlFor="sgc-gbank" required>
        <Input
          id="sgc-gbank"
          value={data.giroBank}
          onChange={(e) => set('giroBank', e.target.value)}
        />
      </FormField>
      <FormField label="Jatuh Tempo" htmlFor="sgc-due" required>
        <Input
          id="sgc-due"
          type="date"
          value={data.dueDate}
          onChange={(e) => set('dueDate', e.target.value)}
        />
      </FormField>
      <FormField label="Branch ID" htmlFor="sgc-branch" required>
        <Input
          id="sgc-branch"
          value={data.branchId}
          onChange={(e) => set('branchId', e.target.value)}
        />
      </FormField>
      <FormField label="Fiscal Period ID" htmlFor="sgc-fp" required>
        <Input
          id="sgc-fp"
          value={data.fiscalPeriodId}
          onChange={(e) => set('fiscalPeriodId', e.target.value)}
        />
      </FormField>
      <FormField label="Partner ID" htmlFor="sgc-partner">
        <Input
          id="sgc-partner"
          value={data.partnerId}
          onChange={(e) => set('partnerId', e.target.value)}
        />
      </FormField>
      <FormField label="Currency ID" htmlFor="sgc-cur" required>
        <Input
          id="sgc-cur"
          value={data.currencyId}
          onChange={(e) => set('currencyId', e.target.value)}
        />
      </FormField>
      <FormField label="Kurs" htmlFor="sgc-rate" required>
        <Input
          id="sgc-rate"
          value={data.exchangeRate}
          onChange={(e) => set('exchangeRate', e.target.value)}
        />
      </FormField>
      <FormField label="Deskripsi" htmlFor="sgc-desc" required>
        <Input
          id="sgc-desc"
          value={data.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </FormField>
      <FormField label="Catatan" htmlFor="sgc-notes">
        <Input
          id="sgc-notes"
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
