'use client';

import { cn } from '@/lib/utils';
import { fmtQty } from '@/lib/format';
import {
  qmsNonconformances,
  type QmsNonconformance,
  type QmsNcrStatus,
  type QmsNcrSeverity,
} from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const STATUS_STYLE: Record<QmsNcrStatus, string> = {
  OPEN: 'bg-info-soft text-info',
  UNDER_REVIEW: 'bg-warn-soft text-warn',
  CONTAINED: 'bg-warn-soft text-warn',
  CLOSED: 'bg-success-soft text-success',
  CANCELLED: 'bg-muted text-muted-foreground',
};

const SEVERITY_STYLE: Record<QmsNcrSeverity, string> = {
  MINOR: 'bg-muted text-muted-foreground',
  MAJOR: 'bg-warn-soft text-warn',
  CRITICAL: 'bg-danger-soft text-danger',
};

const columns: ColumnDef<QmsNonconformance>[] = [
  { key: 'code', label: 'Kode' },
  { key: 'name', label: 'Judul' },
  {
    key: 'severity',
    label: 'Severity',
    render: (r) => (
      <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', SEVERITY_STYLE[r.severity])}>{r.severity}</span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (r) => (
      <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', STATUS_STYLE[r.status])}>{r.status}</span>
    ),
  },
  { key: 'disposition', label: 'Disposisi' },
  { key: 'qtyAffected', label: 'Qty', align: 'right', render: (r) => (r.qtyAffected ? fmtQty(r.qtyAffected) : '—') },
];

const fields: FieldDef[] = [
  { key: 'code', label: 'Kode', required: true, placeholder: 'NCR-2606-0001' },
  { key: 'name', label: 'Judul', required: true, span: 'full' },
  { key: 'description', label: 'Deskripsi', span: 'full' },
  {
    key: 'severity',
    label: 'Severity',
    type: 'select',
    defaultValue: 'MINOR',
    options: [
      { value: 'MINOR', label: 'Minor' },
      { value: 'MAJOR', label: 'Major' },
      { value: 'CRITICAL', label: 'Critical' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    defaultValue: 'OPEN',
    options: [
      { value: 'OPEN', label: 'Open' },
      { value: 'UNDER_REVIEW', label: 'Under Review' },
      { value: 'CONTAINED', label: 'Contained' },
      { value: 'CLOSED', label: 'Closed' },
      { value: 'CANCELLED', label: 'Cancelled' },
    ],
  },
  {
    key: 'disposition',
    label: 'Disposisi',
    type: 'select',
    defaultValue: 'PENDING',
    options: [
      { value: 'PENDING', label: 'Pending' },
      { value: 'USE_AS_IS', label: 'Use As-Is' },
      { value: 'REWORK', label: 'Rework' },
      { value: 'REPAIR', label: 'Repair' },
      { value: 'SCRAP', label: 'Scrap' },
      { value: 'RETURN_TO_SUPPLIER', label: 'Return to Supplier' },
    ],
  },
  { key: 'sourceType', label: 'Sumber', placeholder: 'INSPECTION / PRODUCTION / SUPPLIER' },
  { key: 'itemId', label: 'Item ID (ERP)', placeholder: 'md_items id' },
  { key: 'productionOrderId', label: 'Production Order ID', placeholder: 'mes_production_orders id' },
  { key: 'inspectionId', label: 'Inspection ID', placeholder: 'qms_inspections id' },
  { key: 'qtyAffected', label: 'Qty Terdampak', type: 'number' },
  { key: 'erpReferenceType', label: 'ERP Ref Type', placeholder: 'GRN / PO' },
  { key: 'erpReferenceId', label: 'ERP Ref ID', placeholder: 'ERP doc id' },
  { key: 'detectedAt', label: 'Waktu Ditemukan', type: 'datetime', required: true },
  { key: 'detectedById', label: 'Ditemukan oleh (user)', placeholder: 'adm_users id' },
  { key: 'closedAt', label: 'Waktu Ditutup', type: 'datetime' },
  { key: 'notes', label: 'Catatan', span: 'full' },
];

export function QmsNonconformancesPage() {
  return (
    <MasterCrudPage<QmsNonconformance>
      title="Nonconformances (NCR)"
      subtitle="QMS · catatan ketidaksesuaian + disposisi. Disposisi tidak auto-posting ke stok."
      resource={qmsNonconformances}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'createdAt', sortDir: 'desc' }}
      noun="nonconformance"
    />
  );
}
