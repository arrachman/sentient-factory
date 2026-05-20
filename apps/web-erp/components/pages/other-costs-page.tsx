'use client';

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
import { SimpleMasterPage } from '@/components/organisms/simple-master-page';
import {
  listOtherCosts, createErpOtherCost, updateErpOtherCost, deleteErpOtherCost,
  bulkUpdateErpOtherCostStatus, bulkDeleteErpOtherCosts,
  type ErpOtherCost, type CreateErpOtherCostPayload,
} from '@/lib/api/other-costs';

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

const fromRecord = (r: ErpOtherCost): FormData => ({
  code: r.code,
  name: r.name,

  isActive: r.isActive,
});

const toPayload = (f: FormData): CreateErpOtherCostPayload => ({
  code: f.code,
  name: f.name,

  isActive: f.isActive,
});

function FormFields({ data, onChange }: { data: FormData; onChange: (d: FormData) => void }) {
  const set = (k: keyof FormData, v: string | boolean) => onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="ef-code" required>
        <Input id="ef-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="OCT-001" />
      </FormField>
      <FormField label="Nama" htmlFor="ef-name" required>
        <Input id="ef-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Other Cost" />
      </FormField>

      <FormField label="Status" htmlFor="ef-active">
        <BooleanRadio id="ef-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
      </FormField>
    </div>
  );
}

export function ErpOtherCostsPage() {
  return (
    <SimpleMasterPage<ErpOtherCost, FormData>
      title="Other Cost"
      code="OCT"
      entityLabel="other cost"
      storageKey="other-costs"
      auditEntityName="ErpOtherCost"
      list={listOtherCosts}
      create={createErpOtherCost}
      update={updateErpOtherCost}
      remove={deleteErpOtherCost}
      bulkStatus={bulkUpdateErpOtherCostStatus}
      bulkDelete={bulkDeleteErpOtherCosts}
      defaultForm={defaultForm}
      fromRecord={fromRecord}
      toPayload={toPayload}
      FormFields={FormFields}
    />
  );
}
