'use client';

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { SimpleMasterPage, type ExtraColumn } from '@/components/organisms/simple-master-page';
import {
  listSubDivisions, createSubDivision, updateSubDivision, deleteSubDivision,
  bulkUpdateSubDivisionStatus, bulkDeleteSubDivisions,
  type ErpSubDivision, type CreateSubDivisionPayload,
} from '@/lib/api/sub-divisions';
import { listDivisions, type ErpDivision } from '@/lib/api/divisions';

interface SubDivisionForm {
  code: string;
  name: string;
  divisionId: string;
  isActive: boolean;
}

const defaultForm = (): SubDivisionForm => ({ code: '', name: '', divisionId: '', isActive: true });

const fromRecord = (r: ErpSubDivision): SubDivisionForm => ({
  code: r.code, name: r.name, divisionId: r.divisionId, isActive: r.isActive,
});

const toPayload = (f: SubDivisionForm): CreateSubDivisionPayload => ({
  code: f.code, name: f.name, divisionId: f.divisionId, isActive: f.isActive,
});

function SubDivisionFormFields({ data, onChange }: { data: SubDivisionForm; onChange: (d: SubDivisionForm) => void }) {
  const set = <K extends keyof SubDivisionForm>(k: K, v: SubDivisionForm[K]) =>
    onChange({ ...data, [k]: v });
  const [divisions, setDivisions] = React.useState<ErpDivision[]>([]);
  React.useEffect(() => {
    listDivisions({ limit: 100, isActive: true }).then((r) => setDivisions(r.data)).catch(() => {});
  }, []);
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="sd-code" required>
        <Input id="sd-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="SUB-OPS-A" />
      </FormField>
      <FormField label="Nama" htmlFor="sd-name" required>
        <Input id="sd-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Operations A" />
      </FormField>
      <FormField label="Division" htmlFor="sd-div" required>
        <Select value={data.divisionId} onValueChange={(v) => set('divisionId', v)}>
          <SelectTrigger id="sd-div"><SelectValue placeholder="Pilih division" /></SelectTrigger>
          <SelectContent>
            {divisions.map((d) => (
              <SelectItem key={d.id} value={d.id}>{d.code} — {d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Status" htmlFor="sd-active">
        <BooleanRadio id="sd-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
      </FormField>
    </div>
  );
}

const extraColumns: ExtraColumn<ErpSubDivision>[] = [
  { key: 'division', label: 'Division', render: (r) => r.division ? `${r.division.code} — ${r.division.name}` : '—' },
];

export function ErpSubDivisionsPage() {
  return (
    <SimpleMasterPage<ErpSubDivision, SubDivisionForm>
      title="Sub Division" code="SDIV" entityLabel="sub division"
      storageKey="sub-divisions" auditEntityName="ErpSubdivision"
      list={listSubDivisions} create={createSubDivision} update={updateSubDivision} remove={deleteSubDivision}
      bulkStatus={bulkUpdateSubDivisionStatus} bulkDelete={bulkDeleteSubDivisions}
      defaultForm={defaultForm} fromRecord={fromRecord} toPayload={toPayload}
      FormFields={SubDivisionFormFields}
      extraColumns={extraColumns}
    />
  );
}
