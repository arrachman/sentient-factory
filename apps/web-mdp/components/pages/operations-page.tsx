'use client';

import { cn } from '@/lib/utils';
import { fmtQty } from '@/lib/format';
import { operations, type MesOperationStatus, type Operation } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const OP_STATUS_STYLE: Record<MesOperationStatus, string> = {
  PENDING: 'bg-info-soft text-info',
  IN_PROGRESS: 'bg-warn-soft text-warn',
  COMPLETED: 'bg-success-soft text-success',
  SKIPPED: 'bg-muted text-muted-foreground',
};

const columns: ColumnDef<Operation>[] = [
  { key: 'sequence', label: 'Seq', align: 'right' },
  { key: 'name', label: 'Operasi' },
  {
    key: 'productionOrder',
    label: 'Order',
    render: (r) => r.productionOrder?.code ?? `#${r.productionOrderId}`,
  },
  { key: 'workCenter', label: 'Work Center', render: (r) => r.workCenter?.code ?? '—' },
  { key: 'goodQty', label: 'Good', align: 'right', render: (r) => fmtQty(r.goodQty) },
  { key: 'scrapQty', label: 'Scrap', align: 'right', render: (r) => fmtQty(r.scrapQty) },
  {
    key: 'status',
    label: 'Status',
    render: (r) => (
      <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', OP_STATUS_STYLE[r.status])}>
        {r.status}
      </span>
    ),
  },
];

const fields: FieldDef[] = [
  { key: 'productionOrderId', label: 'Production Order ID', required: true, placeholder: 'mes_production_orders id' },
  { key: 'sequence', label: 'Sequence', type: 'number', required: true, placeholder: '10' },
  { key: 'name', label: 'Nama Operasi', required: true, placeholder: 'Cutting' },
  { key: 'workCenterId', label: 'Work Center ID', required: true, placeholder: 'eam_work_centers id' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    defaultValue: 'PENDING',
    options: [
      { value: 'PENDING', label: 'Pending' },
      { value: 'IN_PROGRESS', label: 'In Progress' },
      { value: 'COMPLETED', label: 'Completed' },
      { value: 'SKIPPED', label: 'Skipped' },
    ],
  },
  { key: 'plannedQty', label: 'Qty Rencana', type: 'number', placeholder: '1000' },
];

export function OperationsPage() {
  return (
    <MasterCrudPage<Operation>
      title="Operations"
      subtitle="MES · langkah routing per production order (entry manual)."
      resource={operations}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'sequence', sortDir: 'asc' }}
      noun="operasi"
    />
  );
}
