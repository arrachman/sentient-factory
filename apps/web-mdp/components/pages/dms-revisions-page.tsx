'use client';

import { fmtDateTime } from '@/lib/format';
import { dmsRevisions, type DmsRevision } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const columns: ColumnDef<DmsRevision>[] = [
  { key: 'documentId', label: 'Dokumen', render: (r) => (r.documentId ? `#${r.documentId}` : '—') },
  { key: 'revisionCode', label: 'Rev' },
  { key: 'status', label: 'Status' },
  { key: 'approvedAt', label: 'Disetujui', render: (r) => (r.approvedAt ? fmtDateTime(r.approvedAt) : '—') },
];

const fields: FieldDef[] = [
  { key: 'documentId', label: 'Document Id', required: true, placeholder: 'dms_documents id' },
  { key: 'revisionCode', label: 'Revision Code', required: true, placeholder: 'B' },
  { key: 'status', label: 'Status', type: 'select', defaultValue: 'DRAFT', options: [{ value: 'DRAFT', label: 'Draft' }, { value: 'IN_REVIEW', label: 'In Review' }, { value: 'APPROVED', label: 'Approved' }, { value: 'SUPERSEDED', label: 'Superseded' }] },
  { key: 'filePath', label: 'File Path' },
  { key: 'changeSummary', label: 'Change Summary', span: 'full' },
  { key: 'approvedById', label: 'Approved By Id', placeholder: 'adm_users id' },
  { key: 'approvedAt', label: 'Approved At', type: 'datetime' },
  { key: 'notes', label: 'Notes', span: 'full' },
];

export function DmsRevisionsPage() {
  return (
    <MasterCrudPage<DmsRevision>
      title="Revisions"
      subtitle="DMS · riwayat revisi + status persetujuan."
      resource={dmsRevisions}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'createdAt', sortDir: 'desc' }}
      noun="revision"
    />
  );
}
