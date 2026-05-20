'use client';

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
import { SimpleMasterPage, type ExtraColumn } from '@/components/organisms/simple-master-page';
import {
  listProjects, createProject, updateProject, deleteProject,
  bulkUpdateProjectStatus, bulkDeleteProjects,
  type ErpProject, type CreateProjectPayload,
} from '@/lib/api/projects';

interface ProjectForm {
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const defaultForm = (): ProjectForm => ({ code: '', name: '', startDate: '', endDate: '', isActive: true });

const fromRecord = (r: ErpProject): ProjectForm => ({
  code: r.code, name: r.name,
  startDate: r.startDate ? r.startDate.slice(0, 10) : '',
  endDate: r.endDate ? r.endDate.slice(0, 10) : '',
  isActive: r.isActive,
});

const toPayload = (f: ProjectForm): CreateProjectPayload => ({
  code: f.code, name: f.name,
  startDate: f.startDate || undefined,
  endDate: f.endDate || undefined,
  isActive: f.isActive,
});

function ProjectFormFields({ data, onChange }: { data: ProjectForm; onChange: (d: ProjectForm) => void }) {
  const set = (k: keyof ProjectForm, v: string | boolean) => onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="pr-code" required>
        <Input id="pr-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="PRJ-2026-A" />
      </FormField>
      <FormField label="Nama" htmlFor="pr-name" required>
        <Input id="pr-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Project Alpha 2026" />
      </FormField>
      <FormField label="Tanggal Mulai" htmlFor="pr-start">
        <Input id="pr-start" type="date" value={data.startDate} onChange={(e) => set('startDate', e.target.value)} />
      </FormField>
      <FormField label="Tanggal Selesai" htmlFor="pr-end">
        <Input id="pr-end" type="date" value={data.endDate} onChange={(e) => set('endDate', e.target.value)} />
      </FormField>
      <FormField label="Status" htmlFor="pr-active">
        <BooleanRadio id="pr-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
      </FormField>
    </div>
  );
}

const extraColumns: ExtraColumn<ErpProject>[] = [
  { key: 'startDate', label: 'Mulai', render: (r) => r.startDate ? r.startDate.slice(0, 10) : '—' },
  { key: 'endDate', label: 'Selesai', render: (r) => r.endDate ? r.endDate.slice(0, 10) : '—' },
];

export function ErpProjectsPage() {
  return (
    <SimpleMasterPage<ErpProject, ProjectForm>
      title="Project" code="PRJ" entityLabel="project"
      storageKey="projects" auditEntityName="ErpProject"
      list={listProjects} create={createProject} update={updateProject} remove={deleteProject}
      bulkStatus={bulkUpdateProjectStatus} bulkDelete={bulkDeleteProjects}
      defaultForm={defaultForm} fromRecord={fromRecord} toPayload={toPayload}
      FormFields={ProjectFormFields}
      extraColumns={extraColumns}
    />
  );
}
