'use client';

import { cn } from '@/lib/utils';
import { fmtDateTime } from '@/lib/format';
import { qmsInspections, type QmsInspection, type QmsInspectionVerdict } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const VERDICT_STYLE: Record<QmsInspectionVerdict, string> = {
  PENDING: 'bg-info-soft text-info',
  PASS: 'bg-success-soft text-success',
  FAIL: 'bg-danger-soft text-danger',
};

const TYPE_OPTIONS = [
  { value: 'INCOMING', label: 'Incoming' },
  { value: 'IN_PROCESS', label: 'In-Process' },
  { value: 'FINAL', label: 'Final' },
];

const columns: ColumnDef<QmsInspection>[] = [
  { key: 'code', label: 'Kode' },
  { key: 'plan', label: 'Plan', render: (r) => r.plan?.code ?? '—' },
  { key: 'type', label: 'Tahap' },
  { key: 'itemId', label: 'Item', render: (r) => (r.itemId ? `#${r.itemId}` : '—') },
  { key: 'lotCode', label: 'Lot', render: (r) => r.lotCode ?? '—' },
  { key: 'inspectedAt', label: 'Waktu', render: (r) => fmtDateTime(r.inspectedAt) },
  {
    key: 'result',
    label: 'Verdict',
    render: (r) => (
      <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', VERDICT_STYLE[r.result])}>{r.result}</span>
    ),
  },
];

const fields: FieldDef[] = [
  { key: 'code', label: 'Kode', required: true, placeholder: 'QI-2606-0001' },
  { key: 'planId', label: 'Plan ID', placeholder: 'qms_inspection_plans id' },
  { key: 'type', label: 'Tahap Inspeksi', type: 'select', required: true, defaultValue: 'INCOMING', options: TYPE_OPTIONS },
  { key: 'itemId', label: 'Item ID (ERP)', placeholder: 'md_items id' },
  { key: 'productionOrderId', label: 'Production Order ID', placeholder: 'mes_production_orders id' },
  { key: 'lotCode', label: 'Lot Code' },
  { key: 'lotSize', label: 'Lot Size', type: 'number' },
  { key: 'sampleSize', label: 'Sample Size', type: 'number' },
  {
    key: 'result',
    label: 'Verdict',
    type: 'select',
    defaultValue: 'PENDING',
    options: [
      { value: 'PENDING', label: 'Pending' },
      { value: 'PASS', label: 'Pass' },
      { value: 'FAIL', label: 'Fail' },
    ],
  },
  { key: 'inspectedAt', label: 'Waktu Inspeksi', type: 'datetime', required: true },
  { key: 'inspectedById', label: 'Inspektor (user)', placeholder: 'adm_users id' },
  { key: 'notes', label: 'Catatan', span: 'full' },
];

export function QmsInspectionsPage() {
  return (
    <MasterCrudPage<QmsInspection>
      title="Inspections"
      subtitle="QMS · hasil inspeksi tercatat (incoming/in-process/final)."
      resource={qmsInspections}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'createdAt', sortDir: 'desc' }}
      noun="inspection"
    />
  );
}
