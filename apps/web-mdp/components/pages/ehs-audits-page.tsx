'use client';

import { fmtDateTime, fmtQty } from '@/lib/format';
import { ehsAudits, type EhsAudit } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const columns: ColumnDef<EhsAudit>[] = [
  { key: 'code', label: 'Kode' },
  { key: 'name', label: 'Judul' },
  { key: 'type', label: 'Tipe' },
  { key: 'status', label: 'Status' },
  { key: 'scheduledAt', label: 'Jadwal', render: (r) => (r.scheduledAt ? fmtDateTime(r.scheduledAt) : '—') },
  { key: 'score', label: 'Skor', align: 'right', render: (r) => (r.score ? fmtQty(r.score) : '—') },
];

const fields: FieldDef[] = [
  { key: 'code', label: 'Code', required: true, placeholder: 'AUD-0001' },
  { key: 'name', label: 'Name', required: true, span: 'full' },
  { key: 'type', label: 'Type', required: true, type: 'select', defaultValue: 'SAFETY', options: [{ value: 'SAFETY', label: 'Safety' }, { value: 'ENVIRONMENTAL', label: 'Environmental' }, { value: 'QUALITY', label: 'Quality' }, { value: 'FIVE_S', label: 'Five S' }, { value: 'INTERNAL', label: 'Internal' }, { value: 'EXTERNAL', label: 'External' }] },
  { key: 'status', label: 'Status', type: 'select', defaultValue: 'PLANNED', options: [{ value: 'PLANNED', label: 'Planned' }, { value: 'IN_PROGRESS', label: 'In Progress' }, { value: 'COMPLETED', label: 'Completed' }, { value: 'CANCELLED', label: 'Cancelled' }] },
  { key: 'scope', label: 'Scope' },
  { key: 'workCenterId', label: 'Work Center Id', placeholder: 'eam_work_centers id' },
  { key: 'auditorId', label: 'Auditor Id', placeholder: 'adm_users id' },
  { key: 'scheduledAt', label: 'Scheduled At', type: 'datetime' },
  { key: 'conductedAt', label: 'Conducted At', type: 'datetime' },
  { key: 'score', label: 'Score', type: 'number' },
  { key: 'findings', label: 'Findings', span: 'full' },
  { key: 'notes', label: 'Notes', span: 'full' },
];

export function EhsAuditsPage() {
  return (
    <MasterCrudPage<EhsAudit>
      title="Audits"
      subtitle="IMS / QHSE · checklist audit/inspeksi + temuan."
      resource={ehsAudits}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'code', sortDir: 'asc' }}
      noun="audit"
    />
  );
}
