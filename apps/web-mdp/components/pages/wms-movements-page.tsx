'use client';

import { cn } from '@/lib/utils';
import { fmtDateTime, fmtQty } from '@/lib/format';
import { wmsMovements, type WmsMovement, type WmsPostingStatus } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const POST_STYLE: Record<WmsPostingStatus, string> = {
  PENDING: 'bg-muted text-muted-foreground',
  POSTED: 'bg-success-soft text-success',
  FAILED: 'bg-danger-soft text-danger',
};

const columns: ColumnDef<WmsMovement>[] = [
  { key: 'code', label: 'Kode' },
  { key: 'itemId', label: 'Item', render: (r) => `#${r.itemId}` },
  { key: 'qty', label: 'Qty', align: 'right', render: (r) => `${fmtQty(r.qty)}${r.uomCode ? ` ${r.uomCode}` : ''}` },
  { key: 'fromBinId', label: 'Dari', render: (r) => (r.fromBinId ? `#${r.fromBinId}` : '—') },
  { key: 'toBinId', label: 'Ke', render: (r) => (r.toBinId ? `#${r.toBinId}` : '—') },
  { key: 'movedAt', label: 'Waktu', render: (r) => fmtDateTime(r.movedAt) },
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
  { key: 'code', label: 'Kode', required: true, placeholder: 'WM-2606-0001' },
  { key: 'taskId', label: 'Task ID', placeholder: 'wms_tasks id (opsional)' },
  { key: 'itemId', label: 'Item ID (ERP)', required: true, placeholder: 'md_items id' },
  { key: 'qty', label: 'Qty', type: 'number', required: true },
  { key: 'uomCode', label: 'Satuan', placeholder: 'PCS' },
  { key: 'fromBinId', label: 'From Bin ID', placeholder: 'md_storage_bins id' },
  { key: 'toBinId', label: 'To Bin ID', placeholder: 'md_storage_bins id' },
  { key: 'handlingUnitId', label: 'Handling Unit ID', placeholder: 'wms_handling_units id' },
  { key: 'movedAt', label: 'Waktu Pindah', type: 'datetime', required: true },
  { key: 'movedById', label: 'Oleh (user)', placeholder: 'adm_users id' },
  { key: 'notes', label: 'Catatan', span: 'full' },
];

export function WmsMovementsPage() {
  return (
    <MasterCrudPage<WmsMovement>
      title="WMS Movements"
      subtitle="WMS · perpindahan fisik selesai. postingStatus PENDING s/d emit ke ERP inv_ (decision #3)."
      resource={wmsMovements}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'movedAt', sortDir: 'desc' }}
      noun="movement"
    />
  );
}
