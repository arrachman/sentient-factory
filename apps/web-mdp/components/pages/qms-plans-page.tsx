'use client';

import { qmsPlans, type QmsPlan } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const TYPE_OPTIONS = [
  { value: 'INCOMING', label: 'Incoming' },
  { value: 'IN_PROCESS', label: 'In-Process' },
  { value: 'FINAL', label: 'Final' },
];

const columns: ColumnDef<QmsPlan>[] = [
  { key: 'code', label: 'Kode' },
  { key: 'name', label: 'Nama' },
  { key: 'type', label: 'Tahap' },
  { key: 'itemId', label: 'Item', render: (r) => (r.itemId ? `#${r.itemId}` : '—') },
  { key: 'operationId', label: 'Operasi', render: (r) => (r.operationId ? `#${r.operationId}` : '—') },
];

const fields: FieldDef[] = [
  { key: 'code', label: 'Kode', required: true, placeholder: 'QIP-INC-0001' },
  { key: 'name', label: 'Nama', required: true, span: 'full' },
  { key: 'type', label: 'Tahap Inspeksi', type: 'select', required: true, defaultValue: 'INCOMING', options: TYPE_OPTIONS },
  { key: 'itemId', label: 'Item ID (ERP)', placeholder: 'md_items id' },
  { key: 'operationId', label: 'Operation ID', placeholder: 'mes_operations id' },
  { key: 'description', label: 'Deskripsi', span: 'full' },
];

export function QmsPlansPage() {
  return (
    <MasterCrudPage<QmsPlan>
      title="Inspection Plans"
      subtitle="QMS · template karakteristik & batas spesifikasi per item/operasi."
      resource={qmsPlans}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'code', sortDir: 'asc' }}
      noun="plan"
    />
  );
}
