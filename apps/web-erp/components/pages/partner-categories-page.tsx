'use client';

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
import { BooleanRadio } from '@/components/ui/radio-group';
import { SimpleMasterPage } from '@/components/organisms/simple-master-page';
import {
  listPartnerCategories,
  createPartnerCategory,
  updatePartnerCategory,
  deletePartnerCategory,
  bulkUpdateErpPartnerCategoryStatus,
  bulkDeleteErpPartnerCategories,
  PARTNER_CATEGORY_KINDS,
  type ErpPartnerCategory,
  type ErpPartnerCategoryKind,
  type CreatePartnerCategoryPayload,
} from '@/lib/api/partner-categories';

interface FormData {
  code: string;
  name: string;
  kind: ErpPartnerCategoryKind;
  isActive: boolean;
}

const defaultForm = (): FormData => ({
  code: '',
  name: '',
  kind: 'CUSTOMER',
  isActive: true,
});

const fromRecord = (r: ErpPartnerCategory): FormData => ({
  code: r.code,
  name: r.name,
  kind: r.kind,
  isActive: r.isActive,
});

const toPayload = (f: FormData): CreatePartnerCategoryPayload => ({
  code: f.code,
  name: f.name,
  kind: f.kind,
  isActive: f.isActive,
});

function FormFields({ data, onChange }: { data: FormData; onChange: (d: FormData) => void }) {
  const set = (k: keyof FormData, v: string | boolean) => onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="pc-code" required>
        <Input id="pc-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="CUST-RETAIL" />
      </FormField>
      <FormField label="Nama" htmlFor="pc-name" required>
        <Input id="pc-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Retail Customer" />
      </FormField>
      <FormField label="Jenis" htmlFor="pc-kind" required>
        <Select value={data.kind} onValueChange={(v) => set('kind', v as ErpPartnerCategoryKind)}>
          <SelectTrigger id="pc-kind">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PARTNER_CATEGORY_KINDS.map((k) => (
              <SelectItem key={k} value={k}>{k}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Status" htmlFor="pc-active">
        <BooleanRadio id="pc-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
      </FormField>
    </div>
  );
}

export function ErpPartnerCategoriesPage() {
  return (
    <SimpleMasterPage<ErpPartnerCategory, FormData>
      title="Kategori Partner"
      code="PCAT"
      entityLabel="kategori partner"
      storageKey="partner-categories"
      auditEntityName="ErpPartnerCategory"
      list={listPartnerCategories}
      create={createPartnerCategory}
      update={updatePartnerCategory}
      remove={deletePartnerCategory}
      bulkStatus={bulkUpdateErpPartnerCategoryStatus}
      bulkDelete={bulkDeleteErpPartnerCategories}
      defaultForm={defaultForm}
      fromRecord={fromRecord}
      toPayload={toPayload}
      FormFields={FormFields}
      extraColumns={[{ key: 'kind', label: 'Jenis', render: (row) => row.kind }]}
    />
  );
}
