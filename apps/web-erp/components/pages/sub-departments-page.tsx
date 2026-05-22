'use client';

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
import {
  Select, SelectTrigger, SelectValue, SelectContentWithSearch, SelectItem,
} from '@/components/ui/select';
import { SimpleMasterPage, type ExtraColumn } from '@/components/organisms/simple-master-page';
import {
  listSubDepartments, createSubDepartment, updateSubDepartment, deleteSubDepartment,
  bulkUpdateSubDepartmentStatus, bulkDeleteSubDepartments,
  type ErpSubDepartment, type CreateSubDepartmentPayload,
} from '@/lib/api/sub-departments';
import { listDepartments, type ErpDepartment } from '@/lib/api/departments';
import { validateForm, type FormErrors } from '@/lib/form-validation';

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

const validateSubDepartment = (form: SubDepartmentForm) =>
  validateForm(form, [
    { field: 'code', label: 'Kode', required: true },
    { field: 'name', label: 'Nama', required: true },
    { field: 'departmentId', label: 'Department', required: true },
  ]);

function SubDepartmentFormFields({ data, onChange, errors = {} }: { data: SubDepartmentForm; onChange: (d: SubDepartmentForm) => void; errors?: FormErrors<SubDepartmentForm> }) {
  const set = <K extends keyof SubDepartmentForm>(k: K, v: SubDepartmentForm[K]) =>
    onChange({ ...data, [k]: v });
  const [departments, setDepartments] = React.useState<ErpDepartment[]>([]);
  const [deptSearch, setDeptSearch] = React.useState('');
  React.useEffect(() => {
    listDepartments({ limit: 500, isActive: true }).then((r) => setDepartments(r.data)).catch(() => {});
  }, []);
  const filteredDepts = departments.filter(
    (d) => `${d.code} ${d.name}`.toLowerCase().includes(deptSearch.toLowerCase()),
  );
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="sp-code" required error={errors.code}>
        <Input id="sp-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="SUB-DEPT-A" aria-invalid={!!errors.code} />
      </FormField>
      <FormField label="Nama" htmlFor="sp-name" required error={errors.name}>
        <Input id="sp-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Sub Department A" aria-invalid={!!errors.name} />
      </FormField>
      <FormField label="Department" htmlFor="sp-dept" required error={errors.departmentId}>
        <Select
          value={data.departmentId}
          onValueChange={(v) => { set('departmentId', v); setDeptSearch(''); }}
          onOpenChange={(open) => { if (!open) setDeptSearch(''); }}
        >
          <SelectTrigger id="sp-dept" aria-invalid={!!errors.departmentId}><SelectValue placeholder="Pilih department" /></SelectTrigger>
          <SelectContentWithSearch
            searchPlaceholder="Cari department..."
            searchValue={deptSearch}
            onSearchChange={setDeptSearch}
          >
            {filteredDepts.map((d) => (
              <SelectItem key={d.id} value={d.id}>{d.code} — {d.name}</SelectItem>
            ))}
          </SelectContentWithSearch>
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
      validate={validateSubDepartment}
    />
  );
}
