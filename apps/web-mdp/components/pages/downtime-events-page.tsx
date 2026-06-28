'use client';

import { cn } from '@/lib/utils';
import { fmtDateTime, fmtDuration } from '@/lib/format';
import { downtimeEvents, type DowntimeEvent, type DowntimeType } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const TYPE_STYLE: Record<DowntimeType, string> = {
  PLANNED: 'bg-info-soft text-info',
  UNPLANNED: 'bg-warn-soft text-warn',
};

const columns: ColumnDef<DowntimeEvent>[] = [
  { key: 'workCenter', label: 'Work Center', render: (r) => r.workCenter?.code ?? `#${r.workCenterId}` },
  { key: 'reason', label: 'Alasan', render: (r) => r.reason?.name ?? `#${r.reasonId}` },
  {
    key: 'type',
    label: 'Tipe',
    render: (r) => (
      <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', TYPE_STYLE[r.type])}>
        {r.type}
      </span>
    ),
  },
  { key: 'startedAt', label: 'Mulai', render: (r) => fmtDateTime(r.startedAt) },
  { key: 'endedAt', label: 'Selesai', render: (r) => fmtDateTime(r.endedAt) },
  { key: 'durationSeconds', label: 'Durasi', align: 'right', render: (r) => fmtDuration(r.durationSeconds) },
];

const fields: FieldDef[] = [
  { key: 'workCenterId', label: 'Work Center ID', required: true, placeholder: 'eam_work_centers id' },
  { key: 'reasonId', label: 'Reason Code ID', required: true, placeholder: 'mdp_reason_codes id (DOWNTIME)' },
  {
    key: 'type',
    label: 'Tipe',
    type: 'select',
    defaultValue: 'UNPLANNED',
    options: [
      { value: 'UNPLANNED', label: 'Unplanned' },
      { value: 'PLANNED', label: 'Planned' },
    ],
  },
  { key: 'productionOrderId', label: 'Production Order ID', placeholder: 'opsional' },
  { key: 'operationId', label: 'Operation ID', placeholder: 'opsional' },
  { key: 'assetId', label: 'Asset ID', placeholder: 'eam_assets id (opsional)' },
  { key: 'startedAt', label: 'Mulai', type: 'datetime', required: true },
  { key: 'endedAt', label: 'Selesai (derive durasi)', type: 'datetime' },
  { key: 'notes', label: 'Catatan', span: 'full' },
];

export function DowntimeEventsPage() {
  return (
    <MasterCrudPage<DowntimeEvent>
      title="Downtime Events"
      subtitle="MES · stoppage ber-reason code. durationSeconds di-derive saat close (OEE availability)."
      resource={downtimeEvents}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'startedAt', sortDir: 'desc' }}
      noun="downtime"
    />
  );
}
