'use client';

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
import { SimpleMasterPage } from '@/components/organisms/simple-master-page';
import {
  listTaxes, createTax, updateTax, deleteTax,
  bulkUpdateErpTaxStatus, bulkDeleteErpTaxes,
  type ErpTax, type CreateTaxPayload,
} from '@/lib/api/taxes';

interface FormData {
  code: string;
  name: string;
  rate: string;
  isActive: boolean;
}

const defaultForm = (): FormData => ({
  code: '',
  name: '',
  rate: '',
  isActive: true,
});

const fromRecord = (r: ErpTax): FormData => ({
  code: r.code,
  name: r.name,
  rate: r.rate,
  isActive: r.isActive,
});

const toPayload = (f: FormData): CreateTaxPayload => ({
  code: f.code,
  name: f.name,
  rate: f.rate,
  isActive: f.isActive,
});

function FormFields({ data, onChange }: { data: FormData; onChange: (d: FormData) => void }) {
  const set = (k: keyof FormData, v: string | boolean) => onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="tf-code" required>
        <Input id="tf-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="VAT11" />
      </FormField>
      <FormField label="Nama" htmlFor="tf-name" required>
        <Input id="tf-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="VAT 11%" />
      </FormField>
      <FormField label="Tarif (%)" htmlFor="tf-rate" required>
        <Input id="tf-rate" value={data.rate} onChange={(e) => set('rate', e.target.value)} placeholder="11.00" />
      </FormField>
      <FormField label="Status" htmlFor="tf-active">
        <BooleanRadio id="tf-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
      </FormField>
    </div>
  );
}

export function ErpTaxesPage() {
  return (
    <SimpleMasterPage<ErpTax, FormData>
      title="Pajak"
      code="TAX"
      entityLabel="pajak"
      storageKey="taxes"
      auditEntityName="ErpTax"
      list={listTaxes}
      create={createTax}
      update={updateTax}
      remove={deleteTax}
      bulkStatus={bulkUpdateErpTaxStatus}
      bulkDelete={bulkDeleteErpTaxes}
      defaultForm={defaultForm}
      fromRecord={fromRecord}
      toPayload={toPayload}
      FormFields={FormFields}
      extraColumns={[
        { key: 'rate', label: 'Tarif (%)', sortable: true, render: (row) => `${row.rate}%` },
      ]}
      defaultSortBy="code"
      defaultSortDir="asc"
    />
  );
}
