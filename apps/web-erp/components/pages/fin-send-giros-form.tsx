'use client';

/**
 * Send Giro (RG) — create/edit form fields with nested journal lines.
 * Atomic tier: Organism sub-part.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { DateInput } from '@/components/ui/date-input';
import type {
  CreateSendGiroPayload,
  ErpSendGiro,
} from '@/lib/api/fin-send-giros';
import type { ErpJournalLine } from '@/lib/api/fin-journal-entries';
import { JournalLinesEditor } from './fin-shared-lines';

export interface SendGiroFormData {
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

export const defaultSendGiroForm = (): SendGiroFormData => ({
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

export function fromSendGiro(r: ErpSendGiro): SendGiroFormData {
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

export function toSendGiroPayload(
  f: SendGiroFormData,
): CreateSendGiroPayload {
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

export function SendGiroFormFields({
  data,
  onChange,
}: {
  data: SendGiroFormData;
  onChange: (d: SendGiroFormData) => void;
}) {
  const set = <K extends keyof SendGiroFormData>(
    k: K,
    v: SendGiroFormData[K],
  ) => onChange({ ...data, [k]: v });

  return (
    <div className="p-4">
      <FormField label="No. Dokumen" htmlFor="sg-doc" required>
        <Input
          id="sg-doc"
          value={data.docNumber}
          onChange={(e) => set('docNumber', e.target.value)}
          placeholder="SG-2026-000001"
        />
      </FormField>
      <FormField label="Tanggal Entry" htmlFor="sg-date" required>
        <DateInput
          id="sg-date"
          value={data.entryDate}
          onChange={(v) => set('entryDate', v)}
        />
      </FormField>
      <FormField label="No. Giro" htmlFor="sg-gno" required>
        <Input
          id="sg-gno"
          value={data.giroNumber}
          onChange={(e) => set('giroNumber', e.target.value)}
        />
      </FormField>
      <FormField label="Tanggal Giro" htmlFor="sg-gdate" required>
        <DateInput
          id="sg-gdate"
          value={data.giroDate}
          onChange={(v) => set('giroDate', v)}
        />
      </FormField>
      <FormField label="Bank Giro" htmlFor="sg-gbank" required>
        <Input
          id="sg-gbank"
          value={data.giroBank}
          onChange={(e) => set('giroBank', e.target.value)}
        />
      </FormField>
      <FormField label="Jatuh Tempo" htmlFor="sg-due" required>
        <DateInput
          id="sg-due"
          value={data.dueDate}
          onChange={(v) => set('dueDate', v)}
        />
      </FormField>
      <FormField label="Branch ID" htmlFor="sg-branch" required>
        <Input
          id="sg-branch"
          value={data.branchId}
          onChange={(e) => set('branchId', e.target.value)}
        />
      </FormField>
      <FormField label="Fiscal Period ID" htmlFor="sg-fp" required>
        <Input
          id="sg-fp"
          value={data.fiscalPeriodId}
          onChange={(e) => set('fiscalPeriodId', e.target.value)}
        />
      </FormField>
      <FormField label="Partner ID" htmlFor="sg-partner">
        <Input
          id="sg-partner"
          value={data.partnerId}
          onChange={(e) => set('partnerId', e.target.value)}
        />
      </FormField>
      <FormField label="Currency ID" htmlFor="sg-cur" required>
        <Input
          id="sg-cur"
          value={data.currencyId}
          onChange={(e) => set('currencyId', e.target.value)}
        />
      </FormField>
      <FormField label="Kurs" htmlFor="sg-rate" required>
        <Input
          id="sg-rate"
          value={data.exchangeRate}
          onChange={(e) => set('exchangeRate', e.target.value)}
        />
      </FormField>
      <FormField label="Deskripsi" htmlFor="sg-desc" required>
        <Input
          id="sg-desc"
          value={data.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </FormField>
      <FormField label="Catatan" htmlFor="sg-notes">
        <Input
          id="sg-notes"
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
