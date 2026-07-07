'use client';

import { fmtDateTime } from '@/lib/format';
import { prtEscalations, type PrtEscalation } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const columns: ColumnDef<PrtEscalation>[] = [
  { key: 'issueId', label: 'Issue', render: (r) => (r.issueId ? `#${r.issueId}` : '—') },
  { key: 'level', label: 'Level', align: 'right' },
  { key: 'escalatedAt', label: 'Eskalasi', render: (r) => (r.escalatedAt ? fmtDateTime(r.escalatedAt) : '—') },
  { key: 'dueAt', label: 'Jatuh Tempo', render: (r) => (r.dueAt ? fmtDateTime(r.dueAt) : '—') },
  { key: 'status', label: 'Status' },
];

const fields: FieldDef[] = [
  { key: 'issueId', label: 'Issue Id', required: true, placeholder: 'prt_issues id' },
  { key: 'level', label: 'Level', type: 'number' },
  { key: 'escalatedToId', label: 'Escalated To Id', placeholder: 'adm_users id' },
  { key: 'escalatedAt', label: 'Escalated At', required: true, type: 'datetime' },
  { key: 'dueAt', label: 'Due At', type: 'datetime' },
  { key: 'status', label: 'Status', type: 'select', defaultValue: 'PENDING', options: [{ value: 'PENDING', label: 'Pending' }, { value: 'ACKNOWLEDGED', label: 'Acknowledged' }, { value: 'RESOLVED', label: 'Resolved' }] },
  { key: 'reason', label: 'Reason', span: 'full' },
  { key: 'notes', label: 'Notes', span: 'full' },
];

export function PrtEscalationsPage() {
  return (
    <MasterCrudPage<PrtEscalation>
      title="Escalations"
      subtitle="PRTS · langkah eskalasi + SLA per issue."
      resource={prtEscalations}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'createdAt', sortDir: 'desc' }}
      noun="escalation"
    />
  );
}
