'use client';

import { cn } from '@/lib/utils';
import { fmtQty } from '@/lib/format';
import { qmsResults, type QmsResult, type QmsResultStatus } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const STATUS_STYLE: Record<QmsResultStatus, string> = {
  PASS: 'bg-success-soft text-success',
  FAIL: 'bg-danger-soft text-danger',
  NA: 'bg-muted text-muted-foreground',
};

const columns: ColumnDef<QmsResult>[] = [
  { key: 'inspectionId', label: 'Inspeksi', render: (r) => `#${r.inspectionId}` },
  { key: 'characteristic', label: 'Karakteristik', render: (r) => r.characteristic?.name ?? (r.characteristicId ? `#${r.characteristicId}` : '—') },
  { key: 'measuredValue', label: 'Nilai', align: 'right', render: (r) => (r.measuredValue ? fmtQty(r.measuredValue) : '—') },
  {
    key: 'status',
    label: 'Status',
    render: (r) => (
      <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', STATUS_STYLE[r.status])}>{r.status}</span>
    ),
  },
];

const fields: FieldDef[] = [
  { key: 'inspectionId', label: 'Inspection ID', required: true, placeholder: 'qms_inspections id' },
  { key: 'characteristicId', label: 'Characteristic ID', placeholder: 'qms_inspection_characteristics id' },
  { key: 'measuredValue', label: 'Nilai Terukur', type: 'number' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    defaultValue: 'PASS',
    options: [
      { value: 'PASS', label: 'Pass' },
      { value: 'FAIL', label: 'Fail' },
      { value: 'NA', label: 'N/A' },
    ],
  },
  { key: 'notes', label: 'Catatan', span: 'full' },
];

export function QmsResultsPage() {
  return (
    <MasterCrudPage<QmsResult>
      title="Inspection Results"
      subtitle="QMS · nilai terukur per karakteristik dalam satu inspeksi."
      resource={qmsResults}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'createdAt', sortDir: 'desc' }}
      noun="result"
    />
  );
}
