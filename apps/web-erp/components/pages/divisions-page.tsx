'use client';

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
import { SimpleMasterPage } from '@/components/organisms/simple-master-page';
import {
  listDivisions, createDivision, updateDivision, deleteDivision,
  bulkUpdateDivisionStatus, bulkDeleteDivisions,
  type ErpDivision, type CreateDivisionPayload,
} from '@/lib/api/divisions';

interface DivisionForm {
  code: string;
  name: string;
  isActive: boolean;
}

const defaultForm = (): DivisionForm => ({ code: '', name: '', isActive: true });

const fromRecord = (r: ErpDivision): DivisionForm => ({
  code: r.code, name: r.name, isActive: r.isActive,
});

const toPayload = (f: DivisionForm): CreateDivisionPayload => ({
  code: f.code, name: f.name, isActive: f.isActive,
});

function DivisionFormFields({ data, onChange }: { data: DivisionForm; onChange: (d: DivisionForm) => void }) {
  const set = (k: keyof DivisionForm, v: string | boolean) => onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="dv-code" required>
        <Input id="dv-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="DIV-OPS" />
      </FormField>
      <FormField label="Nama" htmlFor="dv-name" required>
        <Input id="dv-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Operations" />
      </FormField>
      <FormField label="Status" htmlFor="dv-active">
        <BooleanRadio id="dv-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
      </FormField>
    </div>
  );
}

export function ErpDivisionsPage() {
  return (
    <SimpleMasterPage<ErpDivision, DivisionForm>
      title="Division"
      code="DIV"
      entityLabel="division"
      storageKey="divisions"
      auditEntityName="ErpDivision"
      list={listDivisions}
      create={createDivision}
      update={updateDivision}
      remove={deleteDivision}
      bulkStatus={bulkUpdateDivisionStatus}
      bulkDelete={bulkDeleteDivisions}
      defaultForm={defaultForm}
      fromRecord={fromRecord}
      toPayload={toPayload}
      FormFields={DivisionFormFields}
    />
  );
}
