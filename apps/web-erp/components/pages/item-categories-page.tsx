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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SimpleMasterPage } from '@/components/organisms/simple-master-page';
import {
  listItemCategories, createItemCategory, updateItemCategory, deleteItemCategory,
  bulkUpdateErpItemCategoryStatus, bulkDeleteErpItemCategories,
  type ErpItemCategory, type CreateItemCategoryPayload,
} from '@/lib/api/item-categories';

interface CatForm {
  id?: string;
  code: string;
  name: string;
  isActive: boolean;
  parentId: string;
}

const defaultForm = (): CatForm => ({ code: '', name: '', isActive: true, parentId: '' });

const fromRecord = (r: ErpItemCategory): CatForm => ({
  id: r.id,
  code: r.code,
  name: r.name,
  isActive: r.isActive,
  parentId: r.parentId ?? '',
});

const toPayload = (f: CatForm): CreateItemCategoryPayload => ({
  code: f.code,
  name: f.name,
  isActive: f.isActive,
  parentId: f.parentId || null,
});

function FormFields({ data, onChange }: { data: CatForm; onChange: (d: CatForm) => void }) {
  const set = (k: keyof CatForm, v: string | boolean) => onChange({ ...data, [k]: v });

  const [allCategories, setAllCategories] = React.useState<ErpItemCategory[]>([]);
  React.useEffect(() => {
    listItemCategories({ limit: 200 }).then((res) => setAllCategories(res.data)).catch(() => {});
  }, []);

  const parents = allCategories.filter((r) => r.id !== data.id);

  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="cf-code" required>
        <Input id="cf-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="RAW-MAT" />
      </FormField>
      <FormField label="Nama" htmlFor="cf-name" required>
        <Input id="cf-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Bahan Baku" />
      </FormField>
      <FormField label="Status" htmlFor="cf-active">
        <BooleanRadio id="cf-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
      </FormField>
      <FormField label="Parent" htmlFor="cf-parent">
        <Select
          value={data.parentId || '__none__'}
          onValueChange={(v) => set('parentId', v === '__none__' ? '' : v)}
        >
          <SelectTrigger id="cf-parent">
            <SelectValue placeholder="— Root —" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">— Root —</SelectItem>
            {parents.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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
      extraColumns={[{ key: 'parent', label: 'Parent', render: (row) => row.parent?.name ?? '—' }]}
    />
  );
}
