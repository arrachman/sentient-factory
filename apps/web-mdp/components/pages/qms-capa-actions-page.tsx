'use client';

import { cn } from '@/lib/utils';
import { fmtDateTime } from '@/lib/format';
import { qmsCapaActions, type QmsCapaAction, type QmsCapaStatus } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const STATUS_STYLE: Record<QmsCapaStatus, string> = {
  OPEN: 'bg-info-soft text-info',
  IN_PROGRESS: 'bg-warn-soft text-warn',
  IMPLEMENTED: 'bg-warn-soft text-warn',
  VERIFIED: 'bg-success-soft text-success',
  CLOSED: 'bg-success-soft text-success',
  CANCELLED: 'bg-muted text-muted-foreground',
};

const columns: ColumnDef<QmsCapaAction>[] = [
  { key: 'code', label: 'Kode' },
  { key: 'name', label: 'Judul' },
  { key: 'type', label: 'Tipe' },
  { key: 'nonconformance', label: 'NCR', render: (r) => r.nonconformance?.code ?? '—' },
  {
    key: 'status',
    label: 'Status',
    render: (r) => (
      <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', STATUS_STYLE[r.status])}>{r.status}</span>
    ),
  },
  { key: 'dueDate', label: 'Jatuh Tempo', render: (r) => (r.dueDate ? fmtDateTime(r.dueDate) : '—') },
];

const fields: FieldDef[] = [
  { key: 'code', label: 'Kode', required: true, placeholder: 'CAPA-2606-0001' },
  { key: 'name', label: 'Judul', required: true, span: 'full' },
  { key: 'nonconformanceId', label: 'NCR ID', placeholder: 'qms_nonconformances id' },
  {
    key: 'type',
    label: 'Tipe',
    type: 'select',
    defaultValue: 'CORRECTIVE',
    options: [
      { value: 'CORRECTIVE', label: 'Corrective' },
      { value: 'PREVENTIVE', label: 'Preventive' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    defaultValue: 'OPEN',
    options: [
      { value: 'OPEN', label: 'Open' },
      { value: 'IN_PROGRESS', label: 'In Progress' },
      { value: 'IMPLEMENTED', label: 'Implemented' },
      { value: 'VERIFIED', label: 'Verified' },
      { value: 'CLOSED', label: 'Closed' },
      { value: 'CANCELLED', label: 'Cancelled' },
    ],
  },
  { key: 'description', label: 'Deskripsi', span: 'full' },
  { key: 'rootCause', label: 'Root Cause', span: 'full' },
  { key: 'actionPlan', label: 'Rencana Tindakan', span: 'full' },
  { key: 'assignedToId', label: 'Penanggung Jawab (user)', placeholder: 'adm_users id' },
  { key: 'dueDate', label: 'Jatuh Tempo', type: 'datetime' },
  { key: 'completedAt', label: 'Selesai', type: 'datetime' },
  { key: 'verifiedById', label: 'Diverifikasi oleh (user)', placeholder: 'adm_users id' },
  { key: 'verifiedAt', label: 'Waktu Verifikasi', type: 'datetime' },
  { key: 'effectiveness', label: 'Efektivitas', span: 'full' },
  { key: 'notes', label: 'Catatan', span: 'full' },
];

export function QmsCapaActionsPage() {
  return (
    <MasterCrudPage<QmsCapaAction>
      title="CAPA Actions"
      subtitle="QMS · tindakan korektif/preventif + verifikasi efektivitas."
      resource={qmsCapaActions}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'createdAt', sortDir: 'desc' }}
      noun="capa-action"
    />
  );
}
