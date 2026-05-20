'use client';

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
import { SimpleMasterPage } from '@/components/organisms/simple-master-page';
import {
  listCities, createErpCity, updateErpCity, deleteErpCity,
  bulkUpdateErpCityStatus, bulkDeleteErpCities,
  type ErpCity, type CreateErpCityPayload,
} from '@/lib/api/cities';

interface FormData {
  code: string;
  name: string;
  provinceId: string;
  isActive: boolean;
}

const defaultForm = (): FormData => ({
  code: '',
  name: '',
  provinceId: '',
  isActive: true,
});

const fromRecord = (r: ErpCity): FormData => ({
  code: r.code,
  name: r.name,
  provinceId: r.provinceId == null ? '' : String(r.provinceId),
  isActive: r.isActive,
});

const toPayload = (f: FormData): CreateErpCityPayload => ({
  code: f.code,
  name: f.name,
  provinceId: f.provinceId,
  isActive: f.isActive,
});

function FormFields({ data, onChange }: { data: FormData; onChange: (d: FormData) => void }) {
  const set = (k: keyof FormData, v: string | boolean) => onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="ef-code" required>
        <Input id="ef-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="CTYC-001" />
      </FormField>
      <FormField label="Nama" htmlFor="ef-name" required>
        <Input id="ef-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="City" />
      </FormField>
      <FormField label="ProvinceId" htmlFor="ef-provinceId">
        <Input id="ef-provinceId" value={data.provinceId ?? ''} onChange={(e) => set('provinceId', e.target.value)} />
      </FormField>
      <FormField label="Status" htmlFor="ef-active">
        <BooleanRadio id="ef-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
      </FormField>
    </div>
  );
}

export function ErpCitiesPage() {
  return (
    <SimpleMasterPage<ErpCity, FormData>
      title="City"
      code="CTYC"
      entityLabel="city"
      storageKey="cities"
      auditEntityName="ErpCity"
      list={listCities}
      create={createErpCity}
      update={updateErpCity}
      remove={deleteErpCity}
      bulkStatus={bulkUpdateErpCityStatus}
      bulkDelete={bulkDeleteErpCities}
      defaultForm={defaultForm}
      fromRecord={fromRecord}
      toPayload={toPayload}
      FormFields={FormFields}
    />
  );
}
