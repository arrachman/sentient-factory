'use client';

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
import { SimpleMasterPage } from '@/components/organisms/simple-master-page';
import {
  listProvinces, createErpProvince, updateErpProvince, deleteErpProvince,
  bulkUpdateErpProvinceStatus, bulkDeleteErpProvinces,
  type ErpProvince, type CreateErpProvincePayload,
} from '@/lib/api/provinces';

interface FormData {
  code: string;
  name: string;
  countryId: string;
  isActive: boolean;
}

const defaultForm = (): FormData => ({
  code: '',
  name: '',
  countryId: '',
  isActive: true,
});

const fromRecord = (r: ErpProvince): FormData => ({
  code: r.code,
  name: r.name,
  countryId: r.countryId == null ? '' : String(r.countryId),
  isActive: r.isActive,
});

const toPayload = (f: FormData): CreateErpProvincePayload => ({
  code: f.code,
  name: f.name,
  countryId: f.countryId,
  isActive: f.isActive,
});

function FormFields({ data, onChange }: { data: FormData; onChange: (d: FormData) => void }) {
  const set = (k: keyof FormData, v: string | boolean) => onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="ef-code" required>
        <Input id="ef-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="PRV-001" />
      </FormField>
      <FormField label="Nama" htmlFor="ef-name" required>
        <Input id="ef-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Province" />
      </FormField>
      <FormField label="CountryId" htmlFor="ef-countryId">
        <Input id="ef-countryId" value={data.countryId ?? ''} onChange={(e) => set('countryId', e.target.value)} />
      </FormField>
      <FormField label="Status" htmlFor="ef-active">
        <BooleanRadio id="ef-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
      </FormField>
    </div>
  );
}

export function ErpProvincesPage() {
  return (
    <SimpleMasterPage<ErpProvince, FormData>
      title="Province"
      code="PRV"
      entityLabel="province"
      storageKey="provinces"
      auditEntityName="ErpProvince"
      list={listProvinces}
      create={createErpProvince}
      update={updateErpProvince}
      remove={deleteErpProvince}
      bulkStatus={bulkUpdateErpProvinceStatus}
      bulkDelete={bulkDeleteErpProvinces}
      defaultForm={defaultForm}
      fromRecord={fromRecord}
      toPayload={toPayload}
      FormFields={FormFields}
    />
  );
}
