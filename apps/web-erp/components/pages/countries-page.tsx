'use client';

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
import { SimpleMasterPage } from '@/components/organisms/simple-master-page';
import {
  listCountries, createErpCountry, updateErpCountry, deleteErpCountry,
  bulkUpdateErpCountryStatus, bulkDeleteErpCountries,
  type ErpCountry, type CreateErpCountryPayload,
} from '@/lib/api/countries';

interface FormData {
  code: string;
  name: string;
  isoCode: string;
  isActive: boolean;
}

const defaultForm = (): FormData => ({
  code: '',
  name: '',
  isoCode: '',
  isActive: true,
});

const fromRecord = (r: ErpCountry): FormData => ({
  code: r.code,
  name: r.name,
  isoCode: r.isoCode == null ? '' : String(r.isoCode),
  isActive: r.isActive,
});

const toPayload = (f: FormData): CreateErpCountryPayload => ({
  code: f.code,
  name: f.name,
  isoCode: f.isoCode || undefined,
  isActive: f.isActive,
});

function FormFields({ data, onChange }: { data: FormData; onChange: (d: FormData) => void }) {
  const set = (k: keyof FormData, v: string | boolean) => onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="ef-code" required>
        <Input id="ef-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="CTY-001" />
      </FormField>
      <FormField label="Nama" htmlFor="ef-name" required>
        <Input id="ef-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Country" />
      </FormField>
      <FormField label="IsoCode" htmlFor="ef-isoCode">
        <Input id="ef-isoCode" value={data.isoCode ?? ''} onChange={(e) => set('isoCode', e.target.value)} />
      </FormField>
      <FormField label="Status" htmlFor="ef-active">
        <BooleanRadio id="ef-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
      </FormField>
    </div>
  );
}

export function ErpCountriesPage() {
  return (
    <SimpleMasterPage<ErpCountry, FormData>
      title="Country"
      code="CTY"
      entityLabel="country"
      storageKey="countries"
      auditEntityName="ErpCountry"
      list={listCountries}
      create={createErpCountry}
      update={updateErpCountry}
      remove={deleteErpCountry}
      bulkStatus={bulkUpdateErpCountryStatus}
      bulkDelete={bulkDeleteErpCountries}
      defaultForm={defaultForm}
      fromRecord={fromRecord}
      toPayload={toPayload}
      FormFields={FormFields}
    />
  );
}
