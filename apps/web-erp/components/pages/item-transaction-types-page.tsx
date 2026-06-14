'use client';

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
import { SimpleMasterPage } from '@/components/organisms/simple-master-page';
import {
  listItemTransactionTypes, createErpItemTransactionType, updateErpItemTransactionType, deleteErpItemTransactionType,
  bulkUpdateErpItemTransactionTypeStatus, bulkDeleteErpItemTransactionTypes,
  type ErpItemTransactionType, type CreateErpItemTransactionTypePayload,
} from '@/lib/api/item-transaction-types';
import { validateForm, type FormErrors } from '@/lib/form-validation';

interface FormData {
  code: string;
  name: string;
  direction: string;
  isActive: boolean;
}

const defaultForm = (): FormData => ({
  code: '',
  name: '',
  direction: '',
  isActive: true,
});

const fromRecord = (r: ErpItemTransactionType): FormData => ({
  code: r.code,
  name: r.name,
  direction: r.direction == null ? '' : String(r.direction),
  isActive: r.isActive,
});

const toPayload = (f: FormData): CreateErpItemTransactionTypePayload => ({
  code: f.code,
  name: f.name,
  direction: f.direction || undefined,
  isActive: f.isActive,
});

const validateItemTransactionType = (form: FormData) =>
  validateForm(form, [
    { field: 'code', label: 'Kode', required: true },
    { field: 'name', label: 'Nama', required: true },
  ]);

function FormFields({ data, onChange, errors = {} }: { data: FormData; onChange: (d: FormData) => void; errors?: FormErrors<FormData> }) {
  const set = (k: keyof FormData, v: string | boolean) => onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="ef-code" required error={errors.code}>
        <Input id="ef-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="ITT-001" aria-invalid={!!errors.code} />
      </FormField>
      <FormField label="Nama" htmlFor="ef-name" required error={errors.name}>
        <Input id="ef-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Item Transaction Type" aria-invalid={!!errors.name} />
      </FormField>
      <FormField label="Direction" htmlFor="ef-direction">
        <Input id="ef-direction" value={data.direction ?? ''} onChange={(e) => set('direction', e.target.value)} />
      </FormField>
      <FormField label="Status" htmlFor="ef-active">
        <BooleanRadio id="ef-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
      </FormField>
    </div>
  );
}

export function ErpItemTransactionTypesPage() {
  return (
    <SimpleMasterPage<ErpItemTransactionType, FormData>
      title="Item Transaction Type"
      code="ITT"
      entityLabel="item transaction type"
      storageKey="item-transaction-types"
      auditEntityName="ErpItemTransactionType"
      list={listItemTransactionTypes}
      create={createErpItemTransactionType}
      update={updateErpItemTransactionType}
      remove={deleteErpItemTransactionType}
      bulkStatus={bulkUpdateErpItemTransactionTypeStatus}
      bulkDelete={bulkDeleteErpItemTransactionTypes}
      defaultForm={defaultForm}
      fromRecord={fromRecord}
      toPayload={toPayload}
      FormFields={FormFields}
      validate={validateItemTransactionType}
    />
  );
}
