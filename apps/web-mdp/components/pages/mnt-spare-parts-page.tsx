'use client';

import { cn } from '@/lib/utils';
import { fmtQty } from '@/lib/format';
import { mntSpareParts, type MntSparePart, type MntPostingStatus } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const POSTING_STYLE: Record<MntPostingStatus, string> = {
  PENDING: 'bg-info-soft text-info',
  POSTED: 'bg-success-soft text-success',
  FAILED: 'bg-danger-soft text-danger',
};

const columns: ColumnDef<MntSparePart>[] = [
  { key: 'workOrderId', label: 'Work Order', render: (r) => `#${r.workOrderId}` },
  { key: 'itemId', label: 'Item', render: (r) => `#${r.itemId}` },
  { key: 'qty', label: 'Qty', align: 'right', render: (r) => `${fmtQty(r.qty)}${r.uomCode ? ` ${r.uomCode}` : ''}` },
  {
    key: 'postingStatus',
    label: 'Posting ERP',
    render: (r) => (
      <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', POSTING_STYLE[r.postingStatus])}>{r.postingStatus}</span>
    ),
  },
];

const fields: FieldDef[] = [
  { key: 'workOrderId', label: 'Work Order ID', required: true, placeholder: 'mnt_work_orders id' },
  { key: 'itemId', label: 'Item ID (ERP)', required: true, placeholder: 'md_items id' },
  { key: 'qty', label: 'Qty', type: 'number', required: true },
  { key: 'uomCode', label: 'Satuan', placeholder: 'PCS' },
  {
    key: 'postingStatus',
    label: 'Posting ERP',
    type: 'select',
    defaultValue: 'PENDING',
    options: [
      { value: 'PENDING', label: 'Pending' },
      { value: 'POSTED', label: 'Posted' },
      { value: 'FAILED', label: 'Failed' },
    ],
  },
  { key: 'notes', label: 'Catatan', span: 'full' },
];

export function MntSparePartsPage() {
  return (
    <MasterCrudPage<MntSparePart>
      title="Spare Parts"
      subtitle="CMMS · part dikonsumsi pada work order → emit ERP inv_ issue (stub decision #3)."
      resource={mntSpareParts}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'createdAt', sortDir: 'desc' }}
      noun="spare-part"
    />
  );
}
