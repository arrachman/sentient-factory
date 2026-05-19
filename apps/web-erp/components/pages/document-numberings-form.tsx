'use client';

/**
 * F2 Admin — Document Numbering form fields (molecule split from page).
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  NUMBERING_RESET_OPTIONS,
  type ErpDocumentNumbering,
  type ErpNumberingReset,
  type CreateDocumentNumberingPayload,
} from '@/lib/api/document-numberings';

export interface NumberingForm {
  documentCode: string;
  name: string;
  prefix: string;
  digitCount: string;
  resetPolicy: ErpNumberingReset;
  nextNumber: string;
  affectsLedger: boolean;
  affectsInventory: boolean;
  affectsCost: boolean;
  notes: string;
}

const RESET_LABEL: Record<ErpNumberingReset, string> = {
  NEVER: 'Tidak pernah reset',
  YEARLY: 'Reset tiap tahun',
  MONTHLY: 'Reset tiap bulan',
};

export const defaultNumberingForm = (): NumberingForm => ({
  documentCode: '',
  name: '',
  prefix: '',
  digitCount: '6',
  resetPolicy: 'YEARLY',
  nextNumber: '1',
  affectsLedger: false,
  affectsInventory: false,
  affectsCost: false,
  notes: '',
});

export function fromNumbering(n: ErpDocumentNumbering): NumberingForm {
  return {
    documentCode: n.documentCode,
    name: n.name,
    prefix: n.prefix,
    digitCount: String(n.digitCount),
    resetPolicy: n.resetPolicy,
    nextNumber: String(n.nextNumber),
    affectsLedger: n.affectsLedger,
    affectsInventory: n.affectsInventory,
    affectsCost: n.affectsCost,
    notes: n.notes ?? '',
  };
}

export function toNumberingPayload(
  f: NumberingForm,
): CreateDocumentNumberingPayload {
  return {
    documentCode: f.documentCode,
    name: f.name,
    prefix: f.prefix,
    digitCount: Number(f.digitCount),
    resetPolicy: f.resetPolicy,
    nextNumber: Number(f.nextNumber),
    affectsLedger: f.affectsLedger,
    affectsInventory: f.affectsInventory,
    affectsCost: f.affectsCost,
    notes: f.notes || undefined,
  };
}

export function NumberingFormFields({
  data,
  onChange,
}: {
  data: NumberingForm;
  onChange: (d: NumberingForm) => void;
}) {
  const set = (k: keyof NumberingForm, v: string | boolean) =>
    onChange({ ...data, [k]: v });

  const flag = (
    key: 'affectsLedger' | 'affectsInventory' | 'affectsCost',
    label: string,
  ) => (
    <FormField label={label} htmlFor={`dn-${key}`}>
      <Select
        value={data[key] ? 'yes' : 'no'}
        onValueChange={(v) => set(key, v === 'yes')}
      >
        <SelectTrigger id={`dn-${key}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="yes">Ya</SelectItem>
          <SelectItem value="no">Tidak</SelectItem>
        </SelectContent>
      </Select>
    </FormField>
  );

  return (
    <div className="p-4">
      <FormField label="Kode Dokumen" htmlFor="dn-code" required>
        <Input
          id="dn-code"
          value={data.documentCode}
          onChange={(e) => set('documentCode', e.target.value)}
          placeholder="INV-OUT"
        />
      </FormField>
      <FormField label="Nama" htmlFor="dn-name" required>
        <Input
          id="dn-name"
          value={data.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Sales Invoice"
        />
      </FormField>
      <FormField label="Prefix" htmlFor="dn-prefix" required>
        <Input
          id="dn-prefix"
          value={data.prefix}
          onChange={(e) => set('prefix', e.target.value)}
          placeholder="INV"
        />
      </FormField>
      <FormField label="Jumlah Digit" htmlFor="dn-digits" required>
        <Input
          id="dn-digits"
          type="number"
          value={data.digitCount}
          onChange={(e) => set('digitCount', e.target.value)}
          placeholder="6"
        />
      </FormField>
      <FormField label="Kebijakan Reset" htmlFor="dn-reset" required>
        <Select
          value={data.resetPolicy}
          onValueChange={(v) => set('resetPolicy', v as ErpNumberingReset)}
        >
          <SelectTrigger id="dn-reset">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NUMBERING_RESET_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {RESET_LABEL[opt]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Nomor Berikutnya" htmlFor="dn-next" required>
        <Input
          id="dn-next"
          type="number"
          value={data.nextNumber}
          onChange={(e) => set('nextNumber', e.target.value)}
          placeholder="1"
        />
      </FormField>
      {flag('affectsLedger', 'Pengaruhi Buku Besar')}
      {flag('affectsInventory', 'Pengaruhi Persediaan')}
      {flag('affectsCost', 'Pengaruhi Biaya')}
      <FormField label="Catatan" htmlFor="dn-notes">
        <Input
          id="dn-notes"
          value={data.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Opsional"
        />
      </FormField>
    </div>
  );
}
