'use client';

/**
 * F3 Master Data — Unit of Measure page.
 * Uses SimpleMasterPage organism for full-feature CRUD.
 * Atomic tier: Page.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
import { SimpleMasterPage } from '@/components/organisms/simple-master-page';
import {
  listUnits, createUnit, updateUnit, deleteUnit,
  bulkUpdateErpUnitStatus, bulkDeleteErpUnits,
  type ErpUnit, type CreateUnitPayload,
} from '@/lib/api/units';

interface UnitForm {
  code: string;
  name: string;
  isActive: boolean;
}

const defaultForm = (): UnitForm => ({ code: '', name: '', isActive: true });

const fromRecord = (r: ErpUnit): UnitForm => ({
  code: r.code,
  name: r.name,
  isActive: r.isActive,
});

const toPayload = (f: UnitForm): CreateUnitPayload => ({
  code: f.code,
  name: f.name,
  isActive: f.isActive,
});

function FormFields({ data, onChange }: { data: UnitForm; onChange: (d: UnitForm) => void }) {
  const set = (k: keyof UnitForm, v: string | boolean) => onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="uf-code" required>
        <Input id="uf-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="KG" />
      </FormField>
      <FormField label="Nama" htmlFor="uf-name" required>
        <Input id="uf-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Kilogram" />
      </FormField>
      <FormField label="Status" htmlFor="uf-active">
        <BooleanRadio id="uf-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
      </FormField>
    </div>
  );
}

export function ErpUnitsPage() {
  return (
    <SimpleMasterPage<ErpUnit, UnitForm>
      title="Satuan"
      code="UOM"
      entityLabel="satuan"
      storageKey="units"
      auditEntityName="ErpUnit"
      list={listUnits}
      create={createUnit}
      update={updateUnit}
      remove={deleteUnit}
      bulkStatus={bulkUpdateErpUnitStatus}
      bulkDelete={bulkDeleteErpUnits}
      defaultForm={defaultForm}
      fromRecord={fromRecord}
      toPayload={toPayload}
      FormFields={FormFields}
    />
  );
}
