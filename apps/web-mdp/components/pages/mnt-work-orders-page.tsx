'use client';

import { cn } from '@/lib/utils';
import { fmtDateTime } from '@/lib/format';
import { mntWorkOrders, type MntWorkOrder, type MntWorkOrderStatus } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const STATUS_STYLE: Record<MntWorkOrderStatus, string> = {
  OPEN: 'bg-info-soft text-info',
  SCHEDULED: 'bg-info-soft text-info',
  IN_PROGRESS: 'bg-warn-soft text-warn',
  ON_HOLD: 'bg-warn-soft text-warn',
  COMPLETED: 'bg-success-soft text-success',
  CANCELLED: 'bg-muted text-muted-foreground',
};

const columns: ColumnDef<MntWorkOrder>[] = [
  { key: 'code', label: 'Kode' },
  { key: 'name', label: 'Judul' },
  { key: 'type', label: 'Tipe' },
  { key: 'priority', label: 'Prioritas' },
  { key: 'assetId', label: 'Aset', render: (r) => (r.assetId ? `#${r.assetId}` : '—') },
  { key: 'scheduledStartAt', label: 'Jadwal', render: (r) => (r.scheduledStartAt ? fmtDateTime(r.scheduledStartAt) : '—') },
  {
    key: 'status',
    label: 'Status',
    render: (r) => (
      <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', STATUS_STYLE[r.status])}>{r.status}</span>
    ),
  },
];

const fields: FieldDef[] = [
  { key: 'code', label: 'Kode', required: true, placeholder: 'WO-2606-0001' },
  { key: 'name', label: 'Judul', required: true, span: 'full' },
  {
    key: 'type',
    label: 'Tipe',
    type: 'select',
    defaultValue: 'CORRECTIVE',
    options: [
      { value: 'CORRECTIVE', label: 'Corrective' },
      { value: 'PREVENTIVE', label: 'Preventive' },
      { value: 'PREDICTIVE', label: 'Predictive' },
      { value: 'INSPECTION', label: 'Inspection' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    defaultValue: 'OPEN',
    options: [
      { value: 'OPEN', label: 'Open' },
      { value: 'SCHEDULED', label: 'Scheduled' },
      { value: 'IN_PROGRESS', label: 'In Progress' },
      { value: 'ON_HOLD', label: 'On Hold' },
      { value: 'COMPLETED', label: 'Completed' },
      { value: 'CANCELLED', label: 'Cancelled' },
    ],
  },
  {
    key: 'priority',
    label: 'Prioritas',
    type: 'select',
    defaultValue: 'MEDIUM',
    options: [
      { value: 'LOW', label: 'Low' },
      { value: 'MEDIUM', label: 'Medium' },
      { value: 'HIGH', label: 'High' },
      { value: 'URGENT', label: 'Urgent' },
    ],
  },
  { key: 'assetId', label: 'Asset ID', placeholder: 'eam_assets id' },
  { key: 'workCenterId', label: 'Work Center ID', placeholder: 'eam_work_centers id' },
  { key: 'pmScheduleId', label: 'PM Schedule ID', placeholder: 'mnt_pm_schedules id' },
  { key: 'failureCodeId', label: 'Failure Code ID', placeholder: 'mnt_failure_codes id' },
  { key: 'description', label: 'Deskripsi', span: 'full' },
  { key: 'scheduledStartAt', label: 'Jadwal Mulai', type: 'datetime' },
  { key: 'scheduledEndAt', label: 'Jadwal Selesai', type: 'datetime' },
  { key: 'actualStartAt', label: 'Mulai Aktual', type: 'datetime' },
  { key: 'actualEndAt', label: 'Selesai Aktual', type: 'datetime' },
  { key: 'downtimeMinutes', label: 'Downtime (menit)', type: 'number' },
  { key: 'reportedById', label: 'Pelapor (user)', placeholder: 'adm_users id' },
  { key: 'assignedToId', label: 'Teknisi (user)', placeholder: 'adm_users id' },
  { key: 'notes', label: 'Catatan', span: 'full' },
];

export function MntWorkOrdersPage() {
  return (
    <MasterCrudPage<MntWorkOrder>
      title="Work Orders"
      subtitle="CMMS · work order pemeliharaan korektif/preventif terhadap aset."
      resource={mntWorkOrders}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'createdAt', sortDir: 'desc' }}
      noun="work-order"
    />
  );
}
