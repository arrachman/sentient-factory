'use client';

import { fmtDateTime } from '@/lib/format';
import { prtIssues, type PrtIssue } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const columns: ColumnDef<PrtIssue>[] = [
  { key: 'code', label: 'Kode' },
  { key: 'name', label: 'Judul' },
  { key: 'type', label: 'Tipe' },
  { key: 'severity', label: 'Severity' },
  { key: 'status', label: 'Status' },
  { key: 'raisedAt', label: 'Dilaporkan', render: (r) => (r.raisedAt ? fmtDateTime(r.raisedAt) : '—') },
];

const fields: FieldDef[] = [
  { key: 'code', label: 'Code', required: true, placeholder: 'ISS-2606-0001' },
  { key: 'name', label: 'Name', required: true, span: 'full' },
  { key: 'type', label: 'Type', required: true, type: 'select', defaultValue: 'QUALITY', options: [{ value: 'QUALITY', label: 'Quality' }, { value: 'MACHINE', label: 'Machine' }, { value: 'SAFETY', label: 'Safety' }, { value: 'MATERIAL', label: 'Material' }, { value: 'PROCESS', label: 'Process' }, { value: 'OTHER', label: 'Other' }] },
  { key: 'severity', label: 'Severity', type: 'select', defaultValue: 'LOW', options: [{ value: 'LOW', label: 'Low' }, { value: 'MEDIUM', label: 'Medium' }, { value: 'HIGH', label: 'High' }, { value: 'CRITICAL', label: 'Critical' }] },
  { key: 'status', label: 'Status', type: 'select', defaultValue: 'OPEN', options: [{ value: 'OPEN', label: 'Open' }, { value: 'ACKNOWLEDGED', label: 'Acknowledged' }, { value: 'IN_PROGRESS', label: 'In Progress' }, { value: 'RESOLVED', label: 'Resolved' }, { value: 'CLOSED', label: 'Closed' }, { value: 'CANCELLED', label: 'Cancelled' }] },
  { key: 'source', label: 'Source' },
  { key: 'assetId', label: 'Asset Id', placeholder: 'eam_assets id' },
  { key: 'workCenterId', label: 'Work Center Id', placeholder: 'eam_work_centers id' },
  { key: 'productionOrderId', label: 'Production Order Id', placeholder: 'mes_production_orders id' },
  { key: 'description', label: 'Description', span: 'full' },
  { key: 'reportedById', label: 'Reported By Id', placeholder: 'adm_users id' },
  { key: 'assignedToId', label: 'Assigned To Id', placeholder: 'adm_users id' },
  { key: 'raisedAt', label: 'Raised At', required: true, type: 'datetime' },
  { key: 'resolvedAt', label: 'Resolved At', type: 'datetime' },
  { key: 'resolution', label: 'Resolution', span: 'full' },
  { key: 'notes', label: 'Notes', span: 'full' },
];

export function PrtIssuesPage() {
  return (
    <MasterCrudPage<PrtIssue>
      title="Issues"
      subtitle="PRTS · Andon — penangkapan masalah lini/mesin/kualitas."
      resource={prtIssues}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'code', sortDir: 'asc' }}
      noun="issue"
    />
  );
}
