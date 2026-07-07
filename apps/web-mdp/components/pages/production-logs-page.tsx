'use client';

import { cn } from '@/lib/utils';
import { fmtDateTime, fmtQty } from '@/lib/format';
import { productionLogs, type MesPostingStatus, type ProductionLog } from '@/lib/api';
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

const columns: ColumnDef<ProductionLog>[] = [
  {
    key: 'productionOrder',
    label: 'Order',
    render: (r) => r.productionOrder?.code ?? `#${r.productionOrderId}`,
  },
  { key: 'goodQty', label: 'Good', align: 'right', render: (r) => fmtQty(r.goodQty) },
  { key: 'scrapQty', label: 'Scrap', align: 'right', render: (r) => fmtQty(r.scrapQty) },
  { key: 'reworkQty', label: 'Rework', align: 'right', render: (r) => fmtQty(r.reworkQty) },
  { key: 'scrapReason', label: 'Alasan Scrap', render: (r) => r.scrapReason?.code ?? '—' },
  { key: 'startedAt', label: 'Mulai', render: (r) => fmtDateTime(r.startedAt) },
  { key: 'endedAt', label: 'Selesai', render: (r) => fmtDateTime(r.endedAt) },
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
  { key: 'shiftId', label: 'Shift ID', placeholder: 'mdp_shifts id' },
  { key: 'operatorId', label: 'Operator ID', placeholder: 'adm_users id' },
  { key: 'goodQty', label: 'Good Qty', type: 'number', defaultValue: '0' },
  { key: 'scrapQty', label: 'Scrap Qty', type: 'number', defaultValue: '0' },
  { key: 'reworkQty', label: 'Rework Qty', type: 'number', defaultValue: '0' },
  { key: 'scrapReasonId', label: 'Scrap Reason ID', placeholder: 'mdp_reason_codes id' },
  { key: 'startedAt', label: 'Mulai', type: 'datetime', required: true },
  { key: 'endedAt', label: 'Selesai', type: 'datetime' },
  { key: 'notes', label: 'Catatan', span: 'full' },
];

export function ProductionLogsPage() {
  return (
    <MasterCrudPage<ProductionLog>
      title="Production Logs"
      subtitle="MES · catat good/scrap per order. Mutasi me-recompute rollup order (MES-4)."
      resource={productionLogs}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'startedAt', sortDir: 'desc' }}
      noun="log"
    />
  );
}
