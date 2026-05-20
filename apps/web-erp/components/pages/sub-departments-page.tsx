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
  listSubDepartments, createSubDepartment, updateSubDepartment, deleteSubDepartment,
  bulkUpdateSubDepartmentStatus, bulkDeleteSubDepartments,
  type ErpSubDepartment, type CreateSubDepartmentPayload,
} from '@/lib/api/sub-departments';
import { listDepartments, type ErpDepartment } from '@/lib/api/departments';

interface SubDepartmentForm {
  code: string;
  name: string;
  departmentId: string;
  isActive: boolean;
}

const defaultForm = (): SubDepartmentForm => ({ code: '', name: '', departmentId: '', isActive: true });

const fromRecord = (r: ErpSubDepartment): SubDepartmentForm => ({
  code: r.code, name: r.name, departmentId: r.departmentId, isActive: r.isActive,
});

const toPayload = (f: SubDepartmentForm): CreateSubDepartmentPayload => ({
  code: f.code, name: f.name, departmentId: f.departmentId, isActive: f.isActive,
});

function SubDepartmentFormFields({ data, onChange }: { data: SubDepartmentForm; onChange: (d: SubDepartmentForm) => void }) {
  const set = <K extends keyof SubDepartmentForm>(k: K, v: SubDepartmentForm[K]) =>
    onChange({ ...data, [k]: v });
  const [departments, setDepartments] = React.useState<ErpDepartment[]>([]);
  React.useEffect(() => {
    listDepartments({ limit: 100, isActive: true }).then((r) => setDepartments(r.data)).catch(() => {});
  }, []);
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="sp-code" required>
        <Input id="sp-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="SUB-DEPT-A" />
      </FormField>
      <FormField label="Nama" htmlFor="sp-name" required>
        <Input id="sp-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Sub Department A" />
      </FormField>
      <FormField label="Department" htmlFor="sp-dept" required>
        <Select value={data.departmentId} onValueChange={(v) => set('departmentId', v)}>
          <SelectTrigger id="sp-dept"><SelectValue placeholder="Pilih department" /></SelectTrigger>
          <SelectContent>
            {departments.map((d) => (
              <SelectItem key={d.id} value={d.id}>{d.code} — {d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Status" htmlFor="sp-active">
        <BooleanRadio id="sp-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
      </FormField>
    </div>
  );
}

const extraColumns: ExtraColumn<ErpSubDepartment>[] = [
  { key: 'department', label: 'Department', render: (r) => r.department ? `${r.department.code} — ${r.department.name}` : '—' },
];

export function ErpSubDepartmentsPage() {
  return (
    <SimpleMasterPage<ErpSubDepartment, SubDepartmentForm>
      title="Sub Department" code="SDEPT" entityLabel="sub departemen"
      storageKey="sub-departments" auditEntityName="ErpSubDepartment"
      list={listSubDepartments} create={createSubDepartment} update={updateSubDepartment} remove={deleteSubDepartment}
      bulkStatus={bulkUpdateSubDepartmentStatus} bulkDelete={bulkDeleteSubDepartments}
      defaultForm={defaultForm} fromRecord={fromRecord} toPayload={toPayload}
      FormFields={SubDepartmentFormFields}
      extraColumns={extraColumns}
    />
  );
}
