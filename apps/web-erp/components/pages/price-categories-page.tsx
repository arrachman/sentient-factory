'use client';

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
import { SimpleMasterPage } from '@/components/organisms/simple-master-page';
import {
  listPriceCategories, createErpPriceCategory, updateErpPriceCategory, deleteErpPriceCategory,
  bulkUpdateErpPriceCategoryStatus, bulkDeleteErpPriceCategories,
  type ErpPriceCategory, type CreateErpPriceCategoryPayload,
} from '@/lib/api/price-categories';

interface FormData {
  code: string;
  name: string;

  isActive: boolean;
}

const defaultForm = (): FormData => ({
  code: '',
  name: '',

  isActive: true,
});

const fromRecord = (r: ErpPriceCategory): FormData => ({
  code: r.code,
  name: r.name,

  isActive: r.isActive,
});

const toPayload = (f: FormData): CreateErpPriceCategoryPayload => ({
  code: f.code,
  name: f.name,

  isActive: f.isActive,
});

function FormFields({ data, onChange }: { data: FormData; onChange: (d: FormData) => void }) {
  const set = (k: keyof FormData, v: string | boolean) => onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="ef-code" required>
        <Input id="ef-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="PRC-001" />
      </FormField>
      <FormField label="Nama" htmlFor="ef-name" required>
        <Input id="ef-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Price Category" />
      </FormField>

      <FormField label="Status" htmlFor="ef-active">
        <BooleanRadio id="ef-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
      </FormField>
    </div>
  );
}

export function ErpPriceCategoriesPage() {
  return (
    <SimpleMasterPage<ErpPriceCategory, FormData>
      title="Price Category"
      code="PRC"
      entityLabel="price category"
      storageKey="price-categories"
      auditEntityName="ErpPriceCategory"
      list={listPriceCategories}
      create={createErpPriceCategory}
      update={updateErpPriceCategory}
      remove={deleteErpPriceCategory}
      bulkStatus={bulkUpdateErpPriceCategoryStatus}
      bulkDelete={bulkDeleteErpPriceCategories}
      defaultForm={defaultForm}
      fromRecord={fromRecord}
      toPayload={toPayload}
      FormFields={FormFields}
    />
  );
}
