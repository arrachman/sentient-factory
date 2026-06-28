'use client';

import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/atoms/status-badge';
import { wmsHandlingUnits, type WmsHandlingUnit, type WmsHandlingUnitStatus } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const STATUS_STYLE: Record<WmsHandlingUnitStatus, string> = {
  OPEN: 'bg-info-soft text-info',
  CLOSED: 'bg-warn-soft text-warn',
  SHIPPED: 'bg-success-soft text-success',
};

const columns: ColumnDef<WmsHandlingUnit>[] = [
  { key: 'code', label: 'Kode' },
  {
    key: 'status',
    label: 'Status',
    render: (r) => (
      <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', STATUS_STYLE[r.status])}>{r.status}</span>
    ),
  },
  { key: 'currentBinId', label: 'Bin', render: (r) => (r.currentBinId ? `#${r.currentBinId}` : '—') },
  { key: 'notes', label: 'Catatan', render: (r) => r.notes ?? '—' },
  { key: 'isActive', label: 'Aktif', render: (r) => <StatusBadge active={r.isActive} /> },
];

const fields: FieldDef[] = [
  { key: 'code', label: 'Kode', required: true, placeholder: 'HU-PLT-0001' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    defaultValue: 'OPEN',
    options: [
      { value: 'OPEN', label: 'Open' },
      { value: 'CLOSED', label: 'Closed' },
      { value: 'SHIPPED', label: 'Shipped' },
    ],
  },
  { key: 'currentBinId', label: 'Current Bin ID', placeholder: 'md_storage_bins id' },
  { key: 'notes', label: 'Catatan', span: 'full' },
  { key: 'isActive', label: 'Aktif', type: 'checkbox', defaultValue: true },
];

export function WmsHandlingUnitsPage() {
  return (
    <MasterCrudPage<WmsHandlingUnit>
      title="WMS Handling Units"
      subtitle="WMS · pallet / kontainer / license plate."
      resource={wmsHandlingUnits}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'code', sortDir: 'asc' }}
      noun="handling unit"
    />
  );
}
