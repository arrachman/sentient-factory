'use client';

import { cn } from '@/lib/utils';
import { fmtQty } from '@/lib/format';
import { productionOrders, type MesOrderStatus, type ProductionOrder } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const STATUS_STYLE: Record<MesOrderStatus, string> = {
  RELEASED: 'bg-info-soft text-info',
  IN_PROGRESS: 'bg-warn-soft text-warn',
  PAUSED: 'bg-muted text-muted-foreground',
  COMPLETED: 'bg-success-soft text-success',
  CLOSED: 'bg-muted text-muted-foreground',
  CANCELLED: 'bg-danger-soft text-danger',
};

const columns: ColumnDef<ProductionOrder>[] = [
  { key: 'code', label: 'Kode' },
  { key: 'itemId', label: 'Item', render: (r) => `#${r.itemId}` },
  { key: 'workCenter', label: 'Work Center', render: (r) => r.workCenter?.code ?? '—' },
  {
    key: 'plannedQty',
    label: 'Qty Rencana',
    align: 'right',
    render: (r) => `${fmtQty(r.plannedQty)}${r.uomCode ? ` ${r.uomCode}` : ''}`,
  },
  { key: 'producedGoodQty', label: 'Good', align: 'right', render: (r) => fmtQty(r.producedGoodQty) },
  {
    key: 'status',
    label: 'Status',
    render: (r) => (
      <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', STATUS_STYLE[r.status])}>
        {r.status}
      </span>
    ),
  },
];

const fields: FieldDef[] = [
  { key: 'code', label: 'Kode', required: true, placeholder: 'MO-2606-0001' },
  { key: 'itemId', label: 'Item ID (ERP)', required: true, placeholder: 'md_items id' },
  { key: 'plannedQty', label: 'Qty Rencana', type: 'number', required: true, placeholder: '1000' },
  { key: 'uomCode', label: 'Satuan', defaultValue: 'PCS' },
  { key: 'workCenterId', label: 'Work Center ID', placeholder: 'eam_work_centers id' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    defaultValue: 'RELEASED',
    options: [
      { value: 'RELEASED', label: 'Released' },
      { value: 'IN_PROGRESS', label: 'In Progress' },
      { value: 'PAUSED', label: 'Paused' },
      { value: 'COMPLETED', label: 'Completed' },
      { value: 'CLOSED', label: 'Closed' },
      { value: 'CANCELLED', label: 'Cancelled' },
    ],
  },
  { key: 'notes', label: 'Catatan', span: 'full' },
];

export function ProductionOrdersPage() {
  return (
    <MasterCrudPage<ProductionOrder>
      title="Production Orders"
      subtitle="MES · eksekusi produksi (entry manual)."
      resource={productionOrders}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'createdAt', sortDir: 'desc' }}
      noun="order"
    />
  );
}
