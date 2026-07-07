'use client';

import { mntFailureCodes, type MntFailureCode } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const columns: ColumnDef<MntFailureCode>[] = [
  { key: 'code', label: 'Kode' },
  { key: 'name', label: 'Nama' },
  { key: 'type', label: 'Jenis' },
  { key: 'description', label: 'Deskripsi', render: (r) => r.description ?? '—' },
];

const fields: FieldDef[] = [
  { key: 'code', label: 'Kode', required: true, placeholder: 'FC-BEARING' },
  { key: 'name', label: 'Nama', required: true, span: 'full' },
  {
    key: 'type',
    label: 'Jenis',
    type: 'select',
    required: true,
    defaultValue: 'FAILURE',
    options: [
      { value: 'FAILURE', label: 'Failure (gejala)' },
      { value: 'CAUSE', label: 'Cause (penyebab)' },
      { value: 'REMEDY', label: 'Remedy (tindakan)' },
    ],
  },
  { key: 'description', label: 'Deskripsi', span: 'full' },
];

export function MntFailureCodesPage() {
  return (
    <MasterCrudPage<MntFailureCode>
      title="Failure Codes"
      subtitle="CMMS · taksonomi failure/cause/remedy untuk work order."
      resource={mntFailureCodes}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'code', sortDir: 'asc' }}
      noun="failure-code"
    />
  );
}
