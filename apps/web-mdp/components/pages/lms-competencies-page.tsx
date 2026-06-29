'use client';

import { lmsCompetencies, type LmsCompetency } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const columns: ColumnDef<LmsCompetency>[] = [
  { key: 'code', label: 'Kode' },
  { key: 'name', label: 'Nama' },
  { key: 'category', label: 'Kategori' },
  { key: 'level', label: 'Level' },
  { key: 'requiredCourseId', label: 'Kursus', render: (r) => (r.requiredCourseId ? `#${r.requiredCourseId}` : '—') },
];

const fields: FieldDef[] = [
  { key: 'code', label: 'Code', required: true, placeholder: 'CMP-0001' },
  { key: 'name', label: 'Name', required: true, span: 'full' },
  { key: 'category', label: 'Category' },
  { key: 'description', label: 'Description', span: 'full' },
  { key: 'requiredCourseId', label: 'Required Course Id', placeholder: 'lms_courses id' },
  { key: 'level', label: 'Level' },
];

export function LmsCompetenciesPage() {
  return (
    <MasterCrudPage<LmsCompetency>
      title="Competencies"
      subtitle="LMS · matriks kompetensi (gate untuk operasi)."
      resource={lmsCompetencies}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'code', sortDir: 'asc' }}
      noun="competency"
    />
  );
}
