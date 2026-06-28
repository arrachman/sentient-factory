'use client';

import { cn } from '@/lib/utils';
import { fmtQty } from '@/lib/format';
import { wmsTasks, type WmsTask, type WmsTaskStatus } from '@/lib/api';
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

const columns: ColumnDef<WmsTask>[] = [
  { key: 'code', label: 'Kode' },
  { key: 'type', label: 'Tipe' },
  { key: 'itemId', label: 'Item', render: (r) => (r.itemId ? `#${r.itemId}` : '—') },
  { key: 'qty', label: 'Qty', align: 'right', render: (r) => `${fmtQty(r.qty)}${r.uomCode ? ` ${r.uomCode}` : ''}` },
  { key: 'sourceBinId', label: 'Dari Bin', render: (r) => (r.sourceBinId ? `#${r.sourceBinId}` : '—') },
  { key: 'destBinId', label: 'Ke Bin', render: (r) => (r.destBinId ? `#${r.destBinId}` : '—') },
  { key: 'priority', label: 'Prio', align: 'right' },
  {
    key: 'status',
    label: 'Status',
    render: (r) => (
      <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', STATUS_STYLE[r.status])}>{r.status}</span>
    ),
  },
];

const fields: FieldDef[] = [
  { key: 'code', label: 'Kode', required: true, placeholder: 'WT-2606-0001' },
  {
    key: 'type',
    label: 'Tipe',
    type: 'select',
    required: true,
    defaultValue: 'PICK',
    options: [
      { value: 'PUTAWAY', label: 'Putaway' },
      { value: 'PICK', label: 'Pick' },
      { value: 'MOVE', label: 'Move' },
      { value: 'COUNT', label: 'Count' },
      { value: 'REPLENISH', label: 'Replenish' },
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
      { value: 'COMPLETED', label: 'Completed' },
      { value: 'CANCELLED', label: 'Cancelled' },
    ],
  },
  { key: 'itemId', label: 'Item ID (ERP)', placeholder: 'md_items id' },
  { key: 'qty', label: 'Qty', type: 'number' },
  { key: 'uomCode', label: 'Satuan', placeholder: 'PCS' },
  { key: 'sourceBinId', label: 'Source Bin ID', placeholder: 'md_storage_bins id' },
  { key: 'destBinId', label: 'Dest Bin ID', placeholder: 'md_storage_bins id' },
  { key: 'productionOrderId', label: 'Production Order ID', placeholder: 'mes_production_orders id' },
  { key: 'assignedToId', label: 'Assigned To (user)', placeholder: 'adm_users id' },
  { key: 'priority', label: 'Prioritas', type: 'number', defaultValue: '0' },
  { key: 'notes', label: 'Catatan', span: 'full' },
];

export function WmsTasksPage() {
  return (
    <MasterCrudPage<WmsTask>
      title="WMS Tasks"
      subtitle="WMS · unit kerja gudang (putaway/pick/move/count). Manual entry."
      resource={wmsTasks}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'priority', sortDir: 'desc' }}
      noun="task"
    />
  );
}
