'use client';

/**
 * F3 Master Data — Item (produk/bahan) page.
 * Uses SimpleMasterPage organism for full-feature CRUD.
 * Atomic tier: Page.
 */

import * as React from 'react';
import { SimpleMasterPage, type ExtraColumn } from '@/components/organisms/simple-master-page';
import { Badge } from '@/components/ui/badge';
import {
  listItems, createItem, updateItem, deleteItem,
  bulkUpdateItemStatus, bulkDeleteItems,
  type ErpItem, type ErpItemType, type CreateItemPayload,
} from '@/lib/api/items';
import { listUnits, type ErpUnit } from '@/lib/api/units';
import { listItemCategories, type ErpItemCategory } from '@/lib/api/item-categories';
import { useErpList } from '@/lib/use-erp-list';
import { ItemFormFields, defaultItemForm, fromItem, toItemPayload, type ItemFormData } from './items-form';

// ─── Lookup provider ──────────────────────────────────────────────────────────

function useItemLookups() {
  const { rows: units } = useErpList(() => listUnits({ limit: 100 }), []);
  const { rows: categories } = useErpList(() => listItemCategories({ limit: 100 }), []);
  return { units, categories };
}

// ─── Extra columns ─────────────────────────────────────────────────────────────

const extraColumns: ExtraColumn<ErpItem>[] = [
  {
    key: 'itemType',
    label: 'Tipe',
    render: (r) => <span className="code">{r.itemType}</span>,
  },
  {
    key: 'unit',
    label: 'Satuan',
    render: (r) => <span className="muted">{r.unit?.code ?? r.unitId}</span>,
  },
  {
    key: 'category',
    label: 'Kategori',
    render: (r) => <span className="muted">{r.category?.name ?? r.categoryId}</span>,
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export function ErpItemsPage() {
  const { units, categories } = useItemLookups();

  const FormFields = React.useMemo(
    () =>
      function ItemsFormFields({ data, onChange }: { data: ItemFormData; onChange: (d: ItemFormData) => void }) {
        return <ItemFormFields data={data} onChange={onChange} units={units} categories={categories} />;
      },
    [units, categories],
  );

  return (
    <SimpleMasterPage<ErpItem, ItemFormData>
      title="Item"
      code="ITM"
      entityLabel="item"
      storageKey="items"
      auditEntityName="ErpItem"
      list={listItems}
      create={createItem}
      update={updateItem}
      remove={deleteItem}
      bulkStatus={bulkUpdateItemStatus}
      bulkDelete={bulkDeleteItems}
      defaultForm={defaultItemForm}
      fromRecord={fromItem}
      toPayload={toItemPayload as (f: ItemFormData) => any}
      FormFields={FormFields}
      extraColumns={extraColumns}
      defaultSortBy="code"
      defaultSortDir="asc"
    />
  );
}
