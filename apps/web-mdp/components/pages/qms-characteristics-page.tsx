'use client';

import { fmtQty } from '@/lib/format';
import { qmsCharacteristics, type QmsCharacteristic } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const columns: ColumnDef<QmsCharacteristic>[] = [
  { key: 'planId', label: 'Plan', render: (r) => `#${r.planId}` },
  { key: 'sequence', label: 'Seq', align: 'right' },
  { key: 'name', label: 'Karakteristik' },
  { key: 'characteristicType', label: 'Tipe' },
  { key: 'nominal', label: 'Nominal', align: 'right', render: (r) => (r.nominal ? fmtQty(r.nominal) : '—') },
  { key: 'lowerLimit', label: 'LSL', align: 'right', render: (r) => (r.lowerLimit ? fmtQty(r.lowerLimit) : '—') },
  { key: 'upperLimit', label: 'USL', align: 'right', render: (r) => (r.upperLimit ? fmtQty(r.upperLimit) : '—') },
  { key: 'uomCode', label: 'Satuan', render: (r) => r.uomCode ?? '—' },
];

const fields: FieldDef[] = [
  { key: 'planId', label: 'Plan ID', required: true, placeholder: 'qms_inspection_plans id' },
  { key: 'sequence', label: 'Urutan', type: 'number', defaultValue: '0' },
  { key: 'name', label: 'Nama Karakteristik', required: true, span: 'full' },
  {
    key: 'characteristicType',
    label: 'Tipe',
    type: 'select',
    defaultValue: 'VARIABLE',
    options: [
      { value: 'VARIABLE', label: 'Variable (terukur)' },
      { value: 'ATTRIBUTE', label: 'Attribute (pass/fail)' },
    ],
  },
  { key: 'uomCode', label: 'Satuan', placeholder: 'MM' },
  { key: 'nominal', label: 'Nominal', type: 'number' },
  { key: 'lowerLimit', label: 'Lower Limit (LSL)', type: 'number' },
  { key: 'upperLimit', label: 'Upper Limit (USL)', type: 'number' },
  { key: 'notes', label: 'Catatan', span: 'full' },
];

export function QmsCharacteristicsPage() {
  return (
    <MasterCrudPage<QmsCharacteristic>
      title="Inspection Characteristics"
      subtitle="QMS · baris spesifikasi (batas) per inspection plan."
      resource={qmsCharacteristics}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'sequence', sortDir: 'asc' }}
      noun="characteristic"
    />
  );
}
