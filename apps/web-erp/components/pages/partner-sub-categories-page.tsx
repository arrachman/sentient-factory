'use client';

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
import { SimpleMasterPage } from '@/components/organisms/simple-master-page';
import {
  listPartnerSubCategories, createErpPartnerSubCategory, updateErpPartnerSubCategory, deleteErpPartnerSubCategory,
  bulkUpdateErpPartnerSubCategoryStatus, bulkDeleteErpPartnerSubCategories,
  type ErpPartnerSubCategory, type CreateErpPartnerSubCategoryPayload,
} from '@/lib/api/partner-sub-categories';
import { validateForm, type FormErrors } from '@/lib/form-validation';

type PscType = 'CUSTOMER' | 'SUPPLIER' | 'SALESMAN';

interface FormData {
  code: string;
  name: string;
  type: PscType;
  isActive: boolean;
}

const defaultForm = (): FormData => ({
  code: '',
  name: '',
  type: 'CUSTOMER',
  isActive: true,
});

const fromRecord = (r: ErpPartnerSubCategory): FormData => ({
  code: r.code,
  name: r.name,
  type: (r.type ?? 'CUSTOMER') as PscType,
  isActive: r.isActive,
});

const toPayload = (f: FormData): CreateErpPartnerSubCategoryPayload => ({
  code: f.code,
  name: f.name,
  type: f.type,
  isActive: f.isActive,
});

const validatePartnerSubCategory = (form: FormData) =>
  validateForm(form, [
    { field: 'code', label: 'Kode', required: true },
    { field: 'name', label: 'Nama', required: true },
  ]);

function FormFields({ data, onChange, errors = {} }: { data: FormData; onChange: (d: FormData) => void; errors?: FormErrors<FormData> }) {
  const set = (k: keyof FormData, v: string | boolean) => onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="ef-code" required error={errors.code}>
        <Input id="ef-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="PSC-001" aria-invalid={!!errors.code} />
      </FormField>
      <FormField label="Nama" htmlFor="ef-name" required error={errors.name}>
        <Input id="ef-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Partner Sub Category" aria-invalid={!!errors.name} />
      </FormField>
      <FormField label="Type" htmlFor="ef-type">
        <Input id="ef-type" value={data.type ?? ''} onChange={(e) => set('type', e.target.value)} />
      </FormField>
      <FormField label="Status" htmlFor="ef-active">
        <BooleanRadio id="ef-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
      </FormField>
    </div>
  );
}

export function ErpPartnerSubCategoriesPage() {
  return (
    <SimpleMasterPage<ErpPartnerSubCategory, FormData>
      title="Partner Sub Category"
      code="PSC"
      entityLabel="partner sub category"
      storageKey="partner-sub-categories"
      auditEntityName="ErpPartnerSubCategory"
      list={listPartnerSubCategories}
      create={createErpPartnerSubCategory}
      update={updateErpPartnerSubCategory}
      remove={deleteErpPartnerSubCategory}
      bulkStatus={bulkUpdateErpPartnerSubCategoryStatus}
      bulkDelete={bulkDeleteErpPartnerSubCategories}
      defaultForm={defaultForm}
      fromRecord={fromRecord}
      toPayload={toPayload}
      FormFields={FormFields}
      validate={validatePartnerSubCategory}
    />
  );
}
