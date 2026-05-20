'use client';

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
import { SimpleMasterPage } from '@/components/organisms/simple-master-page';
import {
  listAreas, createErpArea, updateErpArea, deleteErpArea,
  bulkUpdateErpAreaStatus, bulkDeleteErpAreas,
  type ErpArea, type CreateErpAreaPayload,
} from '@/lib/api/areas';

interface FormData {
  code: string;
  name: string;
  cityId: string;
  isActive: boolean;
}

const defaultForm = (): FormData => ({
  code: '',
  name: '',
  cityId: '',
  isActive: true,
});

const fromRecord = (r: ErpArea): FormData => ({
  code: r.code,
  name: r.name,
  cityId: r.cityId == null ? '' : String(r.cityId),
  isActive: r.isActive,
});

const toPayload = (f: FormData): CreateErpAreaPayload => ({
  code: f.code,
  name: f.name,
  cityId: f.cityId,
  isActive: f.isActive,
});

function FormFields({ data, onChange }: { data: FormData; onChange: (d: FormData) => void }) {
  const set = (k: keyof FormData, v: string | boolean) => onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="ef-code" required>
        <Input id="ef-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="AREA-001" />
      </FormField>
      <FormField label="Nama" htmlFor="ef-name" required>
        <Input id="ef-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Area" />
      </FormField>
      <FormField label="CityId" htmlFor="ef-cityId">
        <Input id="ef-cityId" value={data.cityId ?? ''} onChange={(e) => set('cityId', e.target.value)} />
      </FormField>
      <FormField label="Status" htmlFor="ef-active">
        <BooleanRadio id="ef-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
      </FormField>
    </div>
  );
}

export function ErpAreasPage() {
  return (
    <SimpleMasterPage<ErpArea, FormData>
      title="Area"
      code="AREA"
      entityLabel="area"
      storageKey="areas"
      auditEntityName="ErpArea"
      list={listAreas}
      create={createErpArea}
      update={updateErpArea}
      remove={deleteErpArea}
      bulkStatus={bulkUpdateErpAreaStatus}
      bulkDelete={bulkDeleteErpAreas}
      defaultForm={defaultForm}
      fromRecord={fromRecord}
      toPayload={toPayload}
      FormFields={FormFields}
    />
  );
}
