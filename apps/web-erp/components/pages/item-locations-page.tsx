'use client';

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
import { SimpleMasterPage } from '@/components/organisms/simple-master-page';
import {
  listItemLocations, createErpItemLocation, updateErpItemLocation, deleteErpItemLocation,
  bulkUpdateErpItemLocationStatus, bulkDeleteErpItemLocations,
  type ErpItemLocation, type CreateErpItemLocationPayload,
} from '@/lib/api/item-locations';
import { validateForm, type FormErrors } from '@/lib/form-validation';

interface FormData {
  code: string;
  name: string;
  warehouseId: string;
  isActive: boolean;
}

const defaultForm = (): FormData => ({
  code: '',
  name: '',
  warehouseId: '',
  isActive: true,
});

const fromRecord = (r: ErpItemLocation): FormData => ({
  code: r.code,
  name: r.name,
  warehouseId: r.warehouseId == null ? '' : String(r.warehouseId),
  isActive: r.isActive,
});

const toPayload = (f: FormData): CreateErpItemLocationPayload => ({
  code: f.code,
  name: f.name,
  warehouseId: f.warehouseId || undefined,
  isActive: f.isActive,
});

const validateItemLocation = (form: FormData) =>
  validateForm(form, [
    { field: 'code', label: 'Kode', required: true },
    { field: 'name', label: 'Nama', required: true },
  ]);

function FormFields({ data, onChange, errors = {} }: { data: FormData; onChange: (d: FormData) => void; errors?: FormErrors<FormData> }) {
  const set = (k: keyof FormData, v: string | boolean) => onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="ef-code" required error={errors.code}>
        <Input id="ef-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="ILC-001" aria-invalid={!!errors.code} />
      </FormField>
      <FormField label="Nama" htmlFor="ef-name" required error={errors.name}>
        <Input id="ef-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Item Location" aria-invalid={!!errors.name} />
      </FormField>
      <FormField label="Gudang" htmlFor="ef-warehouseId">
        <Input id="ef-warehouseId" value={data.warehouseId ?? ''} onChange={(e) => set('warehouseId', e.target.value)} />
      </FormField>
      <FormField label="Status" htmlFor="ef-active">
        <BooleanRadio id="ef-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
      </FormField>
    </div>
  );
}

export function ErpItemLocationsPage() {
  return (
    <SimpleMasterPage<ErpItemLocation, FormData>
      title="Item Location"
      code="ILC"
      entityLabel="item location"
      storageKey="item-locations"
      auditEntityName="ErpItemLocation"
      list={listItemLocations}
      create={createErpItemLocation}
      update={updateErpItemLocation}
      remove={deleteErpItemLocation}
      bulkStatus={bulkUpdateErpItemLocationStatus}
      bulkDelete={bulkDeleteErpItemLocations}
      defaultForm={defaultForm}
      fromRecord={fromRecord}
      toPayload={toPayload}
      FormFields={FormFields}
      validate={validateItemLocation}
    />
  );
}
