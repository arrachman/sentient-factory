'use client';

import { fmtDateTime } from '@/lib/format';
import { dmsDocuments, type DmsDocument } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const columns: ColumnDef<DmsDocument>[] = [
  { key: 'code', label: 'Kode' },
  { key: 'name', label: 'Judul' },
  { key: 'category', label: 'Kategori' },
  { key: 'status', label: 'Status' },
  { key: 'currentRevision', label: 'Rev' },
  { key: 'effectiveAt', label: 'Berlaku', render: (r) => (r.effectiveAt ? fmtDateTime(r.effectiveAt) : '—') },
];

const fields: FieldDef[] = [
  { key: 'code', label: 'Code', required: true, placeholder: 'DOC-0001' },
  { key: 'name', label: 'Name', required: true, span: 'full' },
  { key: 'category', label: 'Category', type: 'select', defaultValue: 'SOP', options: [{ value: 'SOP', label: 'Sop' }, { value: 'WORK_INSTRUCTION', label: 'Work Instruction' }, { value: 'DRAWING', label: 'Drawing' }, { value: 'POLICY', label: 'Policy' }, { value: 'FORM', label: 'Form' }, { value: 'RECORD', label: 'Record' }, { value: 'OTHER', label: 'Other' }] },
  { key: 'status', label: 'Status', type: 'select', defaultValue: 'DRAFT', options: [{ value: 'DRAFT', label: 'Draft' }, { value: 'IN_REVIEW', label: 'In Review' }, { value: 'APPROVED', label: 'Approved' }, { value: 'RELEASED', label: 'Released' }, { value: 'OBSOLETE', label: 'Obsolete' }] },
  { key: 'currentRevision', label: 'Current Revision', placeholder: 'A' },
  { key: 'ownerId', label: 'Owner Id', placeholder: 'adm_users id' },
  { key: 'description', label: 'Description', span: 'full' },
  { key: 'effectiveAt', label: 'Effective At', type: 'datetime' },
];

export function DmsDocumentsPage() {
  return (
    <MasterCrudPage<DmsDocument>
      title="Documents"
      subtitle="DMS · dokumen terkontrol (SOP, work instruction, drawing)."
      resource={dmsDocuments}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'code', sortDir: 'asc' }}
      noun="document"
    />
  );
}
