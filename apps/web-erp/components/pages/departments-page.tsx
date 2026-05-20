'use client';

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
import { SimpleMasterPage } from '@/components/organisms/simple-master-page';
import {
  listDepartments, createDepartment, updateDepartment, deleteDepartment,
  bulkUpdateDepartmentStatus, bulkDeleteDepartments,
  type ErpDepartment, type CreateDepartmentPayload,
} from '@/lib/api/departments';

interface DepartmentForm {
  code: string;
  name: string;
  isActive: boolean;
}

const defaultForm = (): DepartmentForm => ({ code: '', name: '', isActive: true });
const fromRecord = (r: ErpDepartment): DepartmentForm => ({ code: r.code, name: r.name, isActive: r.isActive });
const toPayload = (f: DepartmentForm): CreateDepartmentPayload => ({ code: f.code, name: f.name, isActive: f.isActive });

function DepartmentFormFields({ data, onChange }: { data: DepartmentForm; onChange: (d: DepartmentForm) => void }) {
  const set = (k: keyof DepartmentForm, v: string | boolean) => onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="dp-code" required>
        <Input id="dp-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="DEPT-FIN" />
      </FormField>
      <FormField label="Nama" htmlFor="dp-name" required>
        <Input id="dp-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Finance Department" />
      </FormField>
      <FormField label="Status" htmlFor="dp-active">
        <BooleanRadio id="dp-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
      </FormField>
    </div>
  );
}

export function ErpDepartmentsPage() {
  return (
    <SimpleMasterPage<ErpDepartment, DepartmentForm>
      title="Department" code="DEPT" entityLabel="departemen"
      storageKey="departments" auditEntityName="ErpDepartment"
      list={listDepartments} create={createDepartment} update={updateDepartment} remove={deleteDepartment}
      bulkStatus={bulkUpdateDepartmentStatus} bulkDelete={bulkDeleteDepartments}
      defaultForm={defaultForm} fromRecord={fromRecord} toPayload={toPayload}
      FormFields={DepartmentFormFields}
    />
  );
}
