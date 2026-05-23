'use client';

/**
 * F3 Master Data — Item Category page.
 * Uses SimpleMasterPage organism for full-feature CRUD.
 * Atomic tier: Page.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
import { SearchSelect } from '@/components/molecules/search-select';
import { SimpleMasterPage } from '@/components/organisms/simple-master-page';
import {
  listItemCategories, createItemCategory, updateItemCategory, deleteItemCategory,
  bulkUpdateErpItemCategoryStatus, bulkDeleteErpItemCategories,
  type ErpItemCategory, type CreateItemCategoryPayload,
} from '@/lib/api/item-categories';
import { validateForm, type FormErrors } from '@/lib/form-validation';

interface CatForm {
  id?: string;
  code: string;
  name: string;
  isActive: boolean;
  parentId: string;
  parentLabel?: string;
}

const defaultForm = (): CatForm => ({ code: '', name: '', isActive: true, parentId: '', parentLabel: '' });

const fromRecord = (r: ErpItemCategory): CatForm => ({
  id: r.id,
  code: r.code,
  name: r.name,
  isActive: r.isActive,
  parentId: r.parentId ?? '',
  parentLabel: r.parent?.name ?? '',
});

const toPayload = (f: CatForm): CreateItemCategoryPayload => ({
  code: f.code,
  name: f.name,
  isActive: f.isActive,
  parentId: f.parentId || null,
});

const validateCategory = (form: CatForm) =>
  validateForm(form, [
    { field: 'code', label: 'Kode', required: true },
    { field: 'name', label: 'Nama', required: true },
  ]);

function FormFields({ data, onChange, errors = {} }: { data: CatForm; onChange: (d: CatForm) => void; errors?: FormErrors<CatForm> }) {
  const set = (k: keyof CatForm, v: string | boolean) => onChange({ ...data, [k]: v });

  const loadParentOptions = React.useCallback(
    async (search: string, page: number, limit: number) => {
      const res = await listItemCategories({ search: search || undefined, page, limit, isActive: true });
      return {
        data: res.data
          .filter((c) => c.id !== data.id)
          .map((c) => ({ value: c.id, label: c.name, code: c.code })),
        total: res.meta.total,
      };
    },
    [data.id],
  );

  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="cf-code" required error={errors.code}>
        <Input id="cf-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="RAW-MAT" aria-invalid={!!errors.code} />
      </FormField>
      <FormField label="Nama" htmlFor="cf-name" required error={errors.name}>
        <Input id="cf-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Bahan Baku" aria-invalid={!!errors.name} />
      </FormField>
      <FormField label="Status" htmlFor="cf-active">
        <BooleanRadio id="cf-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
      </FormField>
      <FormField label="Parent" htmlFor="cf-parent">
        <SearchSelect
          id="cf-parent"
          placeholder="Cari kategori parent…"
          value={data.parentId}
          onValueChange={(v) => set('parentId', v)}
          loadOptions={loadParentOptions}
          initialLabel={data.parentLabel}
          title="Kategori Parent"
        />
      </FormField>
    </div>
  );
}

export function ErpItemCategoriesPage() {
  return (
    <SimpleMasterPage<ErpItemCategory, CatForm>
      title="Kategori Item"
      code="ICAT"
      entityLabel="kategori"
      storageKey="item-categories"
      auditEntityName="ErpItemCategory"
      list={listItemCategories}
      create={createItemCategory}
      update={updateItemCategory}
      remove={deleteItemCategory}
      bulkStatus={bulkUpdateErpItemCategoryStatus}
      bulkDelete={bulkDeleteErpItemCategories}
      defaultForm={defaultForm}
      fromRecord={fromRecord}
      toPayload={toPayload}
      FormFields={FormFields}
      validate={validateCategory}
      extraColumns={[{ key: 'parent', label: 'Parent', render: (row) => row.parent?.name ?? '—' }]}
    />
  );
}
