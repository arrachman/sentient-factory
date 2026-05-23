'use client';

/**
 * Item create/edit form — used inside a Modal.
 * References unit and category lookups from the parent page.
 * Atomic tier: Molecule/Organism sub-part.
 */

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
import { SearchSelect } from '@/components/molecules/search-select';
import type { ErpItem, ErpItemType, CreateItemPayload } from '@/lib/api/items';
import { listItemCategories } from '@/lib/api/item-categories';
import { listUnits } from '@/lib/api/units';
import { validateForm, type FormErrors } from '@/lib/form-validation';

const ITEM_TYPES: ErpItemType[] = [
  'INVENTORY',
  'SERVICE',
  'CONSUMABLE',
  'ASSET',
  'NON_INVENTORY',
];

async function loadCategoryOptions(search: string, page: number, limit: number) {
  const res = await listItemCategories({ search: search || undefined, page, limit, isActive: true });
  return { data: res.data.map((c) => ({ value: c.id, label: c.name, code: c.code })), total: res.meta.total };
}

async function loadUnitOptions(search: string, page: number, limit: number) {
  const res = await listUnits({ search: search || undefined, page, limit, isActive: true });
  return { data: res.data.map((u) => ({ value: u.id, label: u.name, code: u.code })), total: res.meta.total };
}

export interface ItemFormData {
  code: string;
  name: string;
  itemType: ErpItemType;
  categoryId: string;
  categoryLabel?: string;
  unitId: string;
  unitLabel?: string;
  description: string;
  isActive: boolean;
}

export const defaultItemForm = (): ItemFormData => ({
  code: '',
  name: '',
  itemType: 'INVENTORY',
  categoryId: '',
  categoryLabel: '',
  unitId: '',
  unitLabel: '',
  description: '',
  isActive: true,
});

export function fromItem(item: ErpItem): ItemFormData {
  return {
    code: item.code,
    name: item.name,
    itemType: item.itemType,
    categoryId: item.categoryId,
    categoryLabel: item.category?.name ?? '',
    unitId: item.unitId,
    unitLabel: item.unit ? `${item.unit.code} — ${item.unit.name}` : '',
    description: item.description ?? '',
    isActive: item.isActive,
  };
}

export function toItemPayload(f: ItemFormData): CreateItemPayload {
  return {
    code: f.code,
    name: f.name,
    itemType: f.itemType,
    categoryId: f.categoryId,
    unitId: f.unitId,
    description: f.description || undefined,
    isActive: f.isActive,
  };
}

export const validateItem = (form: ItemFormData) =>
  validateForm(form, [
    { field: 'code', label: 'Kode', required: true },
    { field: 'name', label: 'Nama', required: true },
    { field: 'categoryId', label: 'Kategori', required: true },
    { field: 'unitId', label: 'Satuan', required: true },
  ]);

interface ItemFormProps {
  data: ItemFormData;
  onChange: (d: ItemFormData) => void;
  errors?: FormErrors<ItemFormData>;
}

export function ItemFormFields({ data, onChange, errors = {} }: ItemFormProps) {
  const set = (k: keyof ItemFormData, v: string | boolean) =>
    onChange({ ...data, [k]: v });

  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="if-code" required error={errors.code}>
        <Input
          id="if-code"
          value={data.code}
          onChange={(e) => set('code', e.target.value)}
          placeholder="ITM-001"
          aria-invalid={!!errors.code}
        />
      </FormField>
      <FormField label="Nama" htmlFor="if-name" required error={errors.name}>
        <Input
          id="if-name"
          value={data.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Baja Plat 2mm"
          aria-invalid={!!errors.name}
        />
      </FormField>
      <FormField label="Tipe" htmlFor="if-type" required>
        <Select
          value={data.itemType}
          onValueChange={(v) => set('itemType', v as ErpItemType)}
        >
          <SelectTrigger id="if-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ITEM_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Kategori" htmlFor="if-cat" required error={errors.categoryId}>
        <SearchSelect
          id="if-cat"
          placeholder="Cari kategori…"
          value={data.categoryId}
          onValueChange={(v) => set('categoryId', v)}
          loadOptions={loadCategoryOptions}
          error={!!errors.categoryId}
          initialLabel={data.categoryLabel}
        />
      </FormField>
      <FormField label="Satuan" htmlFor="if-unit" required error={errors.unitId}>
        <SearchSelect
          id="if-unit"
          placeholder="Cari satuan…"
          value={data.unitId}
          onValueChange={(v) => set('unitId', v)}
          loadOptions={loadUnitOptions}
          error={!!errors.unitId}
          initialLabel={data.unitLabel}
        />
      </FormField>
      <FormField label="Deskripsi" htmlFor="if-desc">
        <Input
          id="if-desc"
          value={data.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Opsional"
        />
      </FormField>
      <FormField label="Status" htmlFor="if-active">
        <BooleanRadio
          id="if-active"
          value={data.isActive}
          onValueChange={(v) => set('isActive', v)}
        />
      </FormField>
    </div>
  );
}
