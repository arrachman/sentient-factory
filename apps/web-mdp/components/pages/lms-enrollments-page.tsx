'use client';

import { fmtDateTime, fmtQty } from '@/lib/format';
import { lmsEnrollments, type LmsEnrollment } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const columns: ColumnDef<LmsEnrollment>[] = [
  { key: 'courseId', label: 'Kursus', render: (r) => (r.courseId ? `#${r.courseId}` : '—') },
  { key: 'userId', label: 'User', render: (r) => (r.userId ? `#${r.userId}` : '—') },
  { key: 'status', label: 'Status' },
  { key: 'progressPct', label: 'Progres', align: 'right', render: (r) => (r.progressPct ? fmtQty(r.progressPct) : '—') },
  { key: 'enrolledAt', label: 'Daftar', render: (r) => (r.enrolledAt ? fmtDateTime(r.enrolledAt) : '—') },
];

const fields: FieldDef[] = [
  { key: 'courseId', label: 'Course Id', required: true, placeholder: 'lms_courses id' },
  { key: 'userId', label: 'User Id', required: true, placeholder: 'adm_users id' },
  { key: 'status', label: 'Status', type: 'select', defaultValue: 'ENROLLED', options: [{ value: 'ENROLLED', label: 'Enrolled' }, { value: 'IN_PROGRESS', label: 'In Progress' }, { value: 'COMPLETED', label: 'Completed' }, { value: 'FAILED', label: 'Failed' }, { value: 'EXPIRED', label: 'Expired' }] },
  { key: 'progressPct', label: 'Progress Pct', type: 'number' },
  { key: 'enrolledAt', label: 'Enrolled At', required: true, type: 'datetime' },
  { key: 'completedAt', label: 'Completed At', type: 'datetime' },
  { key: 'score', label: 'Score', type: 'number' },
  { key: 'certificateCode', label: 'Certificate Code' },
  { key: 'expiresAt', label: 'Expires At', type: 'datetime' },
  { key: 'notes', label: 'Notes', span: 'full' },
];

export function LmsEnrollmentsPage() {
  return (
    <MasterCrudPage<LmsEnrollment>
      title="Enrollments"
      subtitle="LMS · progres & penyelesaian per peserta."
      resource={lmsEnrollments}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'createdAt', sortDir: 'desc' }}
      noun="enrollment"
    />
  );
}
