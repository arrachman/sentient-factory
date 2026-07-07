'use client';

import { cn } from '@/lib/utils';
import { fmtDateTime, fmtQty } from '@/lib/format';
import {
  materialConsumptions,
  type MaterialConsumption,
  type MesPostingStatus,
} from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const POST_STYLE: Record<MesPostingStatus, string> = {
  PENDING: 'bg-muted text-muted-foreground',
  POSTED: 'bg-success-soft text-success',
  FAILED: 'bg-danger-soft text-danger',
};

const columns: ColumnDef<MaterialConsumption>[] = [
  {
    key: 'productionOrder',
    label: 'Order',
    render: (r) => r.productionOrder?.code ?? `#${r.productionOrderId}`,
  },
  { key: 'itemId', label: 'Item (ERP)', render: (r) => `#${r.itemId}` },
  {
    key: 'qty',
    label: 'Qty',
    align: 'right',
    render: (r) => `${fmtQty(r.qty)}${r.uomCode ? ` ${r.uomCode}` : ''}`,
  },
  { key: 'sourceBinId', label: 'Bin', render: (r) => (r.sourceBinId ? `#${r.sourceBinId}` : '—') },
  { key: 'consumedAt', label: 'Waktu', render: (r) => fmtDateTime(r.consumedAt) },
  {
    key: 'postingStatus',
    label: 'Posting',
    render: (r) => (
      <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', POST_STYLE[r.postingStatus])}>
        {r.postingStatus}
      </span>
    ),
  },
];

const fields: FieldDef[] = [
  { key: 'productionOrderId', label: 'Production Order ID', required: true, placeholder: 'mes_production_orders id' },
  { key: 'operationId', label: 'Operation ID', placeholder: 'opsional' },
  { key: 'itemId', label: 'Item ID (ERP)', required: true, placeholder: 'md_items id' },
  { key: 'qty', label: 'Qty', type: 'number', required: true, placeholder: '100' },
  { key: 'uomCode', label: 'Satuan', placeholder: 'PCS', defaultValue: 'PCS' },
  { key: 'sourceBinId', label: 'Source Bin ID', placeholder: 'md_storage_bins id' },
  { key: 'consumedAt', label: 'Waktu Konsumsi', type: 'datetime', required: true },
];

export function MaterialConsumptionsPage() {
  return (
    <MasterCrudPage<MaterialConsumption>
      title="Material Consumptions"
      subtitle="MES · komponen terpakai (→ ERP inv_ issue). postingStatus PENDING s/d emit."
      resource={materialConsumptions}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'consumedAt', sortDir: 'desc' }}
      noun="konsumsi"
    />
  );
}
