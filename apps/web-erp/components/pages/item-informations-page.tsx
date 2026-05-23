'use client';

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { SimpleMasterPage } from '@/components/organisms/simple-master-page';
import {
  listItemInformations, createErpItemInformation, updateErpItemInformation, deleteErpItemInformation,
  type ErpItemInformation, type CreateErpItemInformationPayload,
} from '@/lib/api/item-informations';
import { validateForm, type FormErrors } from '@/lib/form-validation';
import type { BaseEntity } from '@/components/organisms/simple-master-page';

/** Adapter: maps ErpItemInformation to the BaseEntity shape expected by SimpleMasterPage. */
interface ItemInfoRecord extends BaseEntity {
  id: string;
  code: string; // = id (proxy)
  name: string; // = itemId
  isActive: boolean;
  itemId: string;
  manufacturer?: string;
  countryOfOrigin?: string;
  warrantyPeriodMonths?: number;
  tags?: string;
  notes?: string;
}

function toRecord(r: ErpItemInformation): ItemInfoRecord {
  return {
    ...r,
    code: r.id,
    name: r.itemId,
    isActive: true,
  };
}

interface FormData {
  itemId: string;
  manufacturer: string;
  countryOfOrigin: string;
  warrantyPeriodMonths: number;
  tags: string;
  notes: string;
}

const defaultForm = (): FormData => ({
  itemId: '',
  manufacturer: '',
  countryOfOrigin: '',
  warrantyPeriodMonths: 0,
  tags: '',
  notes: '',
});

const fromRecord = (r: ItemInfoRecord): FormData => ({
  itemId: r.itemId,
  manufacturer: r.manufacturer ?? '',
  countryOfOrigin: r.countryOfOrigin ?? '',
  warrantyPeriodMonths: r.warrantyPeriodMonths ?? 0,
  tags: r.tags ?? '',
  notes: r.notes ?? '',
});

const toPayload = (f: FormData): CreateErpItemInformationPayload => ({
  itemId: f.itemId,
  manufacturer: f.manufacturer || undefined,
  countryOfOrigin: f.countryOfOrigin || undefined,
  warrantyPeriodMonths: f.warrantyPeriodMonths || undefined,
  tags: f.tags || undefined,
  notes: f.notes || undefined,
});

const validateItemInformation = (form: FormData) =>
  validateForm(form, [
    { field: 'itemId', label: 'ID Barang', required: true },
  ]);

function FormFields({ data, onChange, errors = {} }: { data: FormData; onChange: (d: FormData) => void; errors?: FormErrors<FormData> }) {
  const set = (k: keyof FormData, v: string | number) => onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="ID Barang" htmlFor="ef-itemId" required error={errors.itemId}>
        <Input id="ef-itemId" value={data.itemId} onChange={(e) => set('itemId', e.target.value)} placeholder="ID barang" aria-invalid={!!errors.itemId} />
      </FormField>
      <FormField label="Produsen" htmlFor="ef-manufacturer">
        <Input id="ef-manufacturer" value={data.manufacturer} onChange={(e) => set('manufacturer', e.target.value)} placeholder="Nama produsen (opsional)" />
      </FormField>
      <FormField label="Negara Asal" htmlFor="ef-origin">
        <Input id="ef-origin" value={data.countryOfOrigin} onChange={(e) => set('countryOfOrigin', e.target.value)} placeholder="Negara asal (opsional)" />
      </FormField>
      <FormField label="Garansi (Bulan)" htmlFor="ef-warranty">
        <Input id="ef-warranty" type="number" value={data.warrantyPeriodMonths} onChange={(e) => set('warrantyPeriodMonths', parseInt(e.target.value, 10) || 0)} placeholder="0" />
      </FormField>
      <FormField label="Tags" htmlFor="ef-tags">
        <Input id="ef-tags" value={data.tags} onChange={(e) => set('tags', e.target.value)} placeholder="Tag (opsional)" />
      </FormField>
      <FormField label="Catatan" htmlFor="ef-notes">
        <Input id="ef-notes" value={data.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Catatan (opsional)" />
      </FormField>
    </div>
  );
}

async function listAdapter(params: Parameters<typeof listItemInformations>[0]): Promise<{ success: boolean; data: ItemInfoRecord[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
  const res = await listItemInformations(params);
  return { ...res, data: res.data.map(toRecord) };
}

async function createAdapter(payload: any): Promise<ItemInfoRecord> {
  return toRecord(await createErpItemInformation(payload));
}

async function updateAdapter(id: string, payload: any): Promise<ItemInfoRecord> {
  return toRecord(await updateErpItemInformation(id, payload));
}

function noopBulkStatus(_ids: string[], _isActive: boolean): Promise<{ affected: number }> {
  return Promise.resolve({ affected: 0 });
}

function noopBulkDelete(_ids: string[]): Promise<{ affected: number }> {
  return Promise.resolve({ affected: 0 });
}

export function ErpItemInformationsPage() {
  return (
    <SimpleMasterPage<ItemInfoRecord, FormData>
      title="Item Information"
      code="INF"
      entityLabel="item information"
      storageKey="item-informations"
      auditEntityName="ErpItemInformation"
      list={listAdapter}
      create={createAdapter}
      update={updateAdapter}
      remove={deleteErpItemInformation}
      bulkStatus={noopBulkStatus}
      bulkDelete={noopBulkDelete}
      defaultForm={defaultForm}
      fromRecord={fromRecord}
      toPayload={toPayload}
      FormFields={FormFields}
      validate={validateItemInformation}
    />
  );
}
