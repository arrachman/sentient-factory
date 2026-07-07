'use client';

import { cn } from '@/lib/utils';
import { fmtQty } from '@/lib/format';
import { wmsPicks, type WmsPick, type WmsTaskStatus } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const STATUS_STYLE: Record<WmsTaskStatus, string> = {
  OPEN: 'bg-info-soft text-info',
  IN_PROGRESS: 'bg-warn-soft text-warn',
  COMPLETED: 'bg-success-soft text-success',
  CANCELLED: 'bg-danger-soft text-danger',
};

const columns: ColumnDef<WmsPick>[] = [
  { key: 'taskId', label: 'Task', render: (r) => `#${r.taskId}` },
  { key: 'itemId', label: 'Item', render: (r) => `#${r.itemId}` },
  { key: 'qtyRequested', label: 'Diminta', align: 'right', render: (r) => fmtQty(r.qtyRequested) },
  { key: 'qtyPicked', label: 'Diambil', align: 'right', render: (r) => fmtQty(r.qtyPicked) },
  { key: 'sourceBinId', label: 'Bin', render: (r) => (r.sourceBinId ? `#${r.sourceBinId}` : '—') },
  { key: 'handlingUnit', label: 'HU', render: (r) => r.handlingUnit?.code ?? '—' },
  {
    key: 'status',
    label: 'Status',
    render: (r) => (
      <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', STATUS_STYLE[r.status])}>{r.status}</span>
    ),
  },
];

const fields: FieldDef[] = [
  { key: 'taskId', label: 'Task ID', required: true, placeholder: 'wms_tasks id' },
  { key: 'itemId', label: 'Item ID (ERP)', required: true, placeholder: 'md_items id' },
  { key: 'qtyRequested', label: 'Qty Diminta', type: 'number', required: true },
  { key: 'qtyPicked', label: 'Qty Diambil', type: 'number', defaultValue: '0' },
  { key: 'sourceBinId', label: 'Source Bin ID', placeholder: 'md_storage_bins id' },
  { key: 'handlingUnitId', label: 'Handling Unit ID', placeholder: 'wms_handling_units id' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    defaultValue: 'OPEN',
    options: [
      { value: 'OPEN', label: 'Open' },
      { value: 'IN_PROGRESS', label: 'In Progress' },
      { value: 'COMPLETED', label: 'Completed' },
      { value: 'CANCELLED', label: 'Cancelled' },
    ],
  },
  { key: 'notes', label: 'Catatan', span: 'full' },
];

export function WmsPicksPage() {
  return (
    <MasterCrudPage<WmsPick>
      title="WMS Picks"
      subtitle="WMS · baris pengambilan terhadap task."
      resource={wmsPicks}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'createdAt', sortDir: 'desc' }}
      noun="pick"
    />
  );
}
