'use client';

import { fmtQty } from '@/lib/format';
import { lmsCourses, type LmsCourse } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const columns: ColumnDef<LmsCourse>[] = [
  { key: 'code', label: 'Kode' },
  { key: 'name', label: 'Nama' },
  { key: 'category', label: 'Kategori' },
  { key: 'status', label: 'Status' },
  { key: 'durationHours', label: 'Jam', align: 'right', render: (r) => (r.durationHours ? fmtQty(r.durationHours) : '—') },
  { key: 'isMandatory', label: 'Wajib', render: (r) => (r.isMandatory ? 'Ya' : '—') },
];

const fields: FieldDef[] = [
  { key: 'code', label: 'Code', required: true, placeholder: 'CRS-0001' },
  { key: 'name', label: 'Name', required: true, span: 'full' },
  { key: 'category', label: 'Category', type: 'select', defaultValue: 'SAFETY', options: [{ value: 'SAFETY', label: 'Safety' }, { value: 'QUALITY', label: 'Quality' }, { value: 'TECHNICAL', label: 'Technical' }, { value: 'ONBOARDING', label: 'Onboarding' }, { value: 'COMPLIANCE', label: 'Compliance' }, { value: 'OTHER', label: 'Other' }] },
  { key: 'status', label: 'Status', type: 'select', defaultValue: 'DRAFT', options: [{ value: 'DRAFT', label: 'Draft' }, { value: 'ACTIVE', label: 'Active' }, { value: 'ARCHIVED', label: 'Archived' }] },
  { key: 'description', label: 'Description', span: 'full' },
  { key: 'durationHours', label: 'Duration Hours', type: 'number' },
  { key: 'isMandatory', label: 'Is Mandatory', type: 'checkbox', defaultValue: false },
  { key: 'validityMonths', label: 'Validity Months', type: 'number' },
];

export function LmsCoursesPage() {
  return (
    <MasterCrudPage<LmsCourse>
      title="Courses"
      subtitle="LMS · katalog kursus & materi pelatihan."
      resource={lmsCourses}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'code', sortDir: 'asc' }}
      noun="course"
    />
  );
}
