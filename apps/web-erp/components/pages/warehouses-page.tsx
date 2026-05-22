'use client';

/**
 * Master Data — Warehouse page.
 * Lists md_warehouses; supports create, edit, delete.
 * Location FK rendered as a SearchSelect populated lazily from /locations.
 * Atomic tier: Page.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
import { SearchSelect } from '@/components/molecules/search-select';
import { SimpleMasterPage, type ExtraColumn } from '@/components/organisms/simple-master-page';
import {
  listWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  bulkUpdateWarehouseStatus,
  bulkDeleteWarehouses,
  type ErpWarehouse,
  type CreateWarehousePayload,
} from '@/lib/api/warehouses';
import { listLocations } from '@/lib/api/locations';

// ─── Form state ───────────────────────────────────────────────────────────────

interface WarehouseForm {
  code: string;
  name: string;
  locationId: string;
  allowNegativeStock: boolean;
  notes: string;
  isActive: boolean;
}

const defaultForm = (): WarehouseForm => ({
  code: '',
  name: '',
  locationId: '',
  allowNegativeStock: false,
  notes: '',
  isActive: true,
});

const fromRecord = (w: ErpWarehouse): WarehouseForm => ({
  code: w.code,
  name: w.name,
  locationId: w.locationId ?? '',
  allowNegativeStock: w.allowNegativeStock,
  notes: w.notes ?? '',
  isActive: w.isActive,
});

const toPayload = (f: WarehouseForm): CreateWarehousePayload => ({
  code: f.code,
  name: f.name,
  locationId: f.locationId,
  allowNegativeStock: f.allowNegativeStock,
  notes: f.notes || undefined,
  isActive: f.isActive,
});

// ─── FK loader ────────────────────────────────────────────────────────────────

async function loadLocationOptions(search: string, page: number, limit: number) {
  const res = await listLocations({ search: search || undefined, page, limit, isActive: true });
  return {
    data: res.data.map((l) => ({ value: l.id, label: l.name, code: l.code })),
    total: res.meta.total,
  };
}

// ─── Form fields ──────────────────────────────────────────────────────────────

function WarehouseFormFields({ data, onChange }: { data: WarehouseForm; onChange: (d: WarehouseForm) => void }) {
  const set = <K extends keyof WarehouseForm>(k: K, v: WarehouseForm[K]) =>
    onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="wf-code" required>
        <Input id="wf-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="WH-001" />
      </FormField>
      <FormField label="Nama" htmlFor="wf-name" required>
        <Input id="wf-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Gudang Bahan Baku A" />
      </FormField>
      <FormField label="Lokasi" htmlFor="wf-loc" required>
        <SearchSelect
          id="wf-loc"
          placeholder="Cari lokasi…"
          value={data.locationId}
          onValueChange={(v) => set('locationId', v)}
          loadOptions={loadLocationOptions}
        />
      </FormField>
      <FormField label="Izinkan Stok Negatif" htmlFor="wf-neg">
        <BooleanRadio id="wf-neg" value={data.allowNegativeStock} onValueChange={(v) => set('allowNegativeStock', v)} trueLabel="Ya" falseLabel="Tidak" />
      </FormField>
      <FormField label="Catatan" htmlFor="wf-notes">
        <Input id="wf-notes" value={data.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Gudang utama bahan baku produksi" />
      </FormField>
      <FormField label="Status" htmlFor="wf-active">
        <BooleanRadio id="wf-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
      </FormField>
    </div>
  );
}

// ─── Extra columns ────────────────────────────────────────────────────────────

const extraColumns: ExtraColumn<ErpWarehouse>[] = [
  {
    key: 'location',
    label: 'Lokasi',
    render: (r) => (r.location ? `${r.location.code} — ${r.location.name}` : '—'),
  },
  {
    key: 'allowNegativeStock',
    label: 'Stok Negatif',
    render: (r) => (r.allowNegativeStock ? 'Diizinkan' : 'Tidak'),
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ErpWarehousesPage() {
  return (
    <SimpleMasterPage<ErpWarehouse, WarehouseForm>
      title="Gudang" code="WH" entityLabel="gudang"
      storageKey="warehouses" auditEntityName="ErpWarehouse"
      list={listWarehouses} create={createWarehouse} update={updateWarehouse} remove={deleteWarehouse}
      bulkStatus={bulkUpdateWarehouseStatus} bulkDelete={bulkDeleteWarehouses}
      defaultForm={defaultForm} fromRecord={fromRecord} toPayload={toPayload}
      FormFields={WarehouseFormFields}
      extraColumns={extraColumns}
    />
  );
}
