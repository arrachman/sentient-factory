'use client';

import { fmtDateTime } from '@/lib/format';
import { dmsAcknowledgements, type DmsAcknowledgement } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const columns: ColumnDef<DmsAcknowledgement>[] = [
  { key: 'documentId', label: 'Dokumen', render: (r) => (r.documentId ? `#${r.documentId}` : '—') },
  { key: 'revisionId', label: 'Rev', render: (r) => (r.revisionId ? `#${r.revisionId}` : '—') },
  { key: 'userId', label: 'User', render: (r) => (r.userId ? `#${r.userId}` : '—') },
  { key: 'acknowledgedAt', label: 'Waktu', render: (r) => (r.acknowledgedAt ? fmtDateTime(r.acknowledgedAt) : '—') },
];

const fields: FieldDef[] = [
  { key: 'documentId', label: 'Document Id', required: true, placeholder: 'dms_documents id' },
  { key: 'revisionId', label: 'Revision Id', placeholder: 'dms_revisions id' },
  { key: 'userId', label: 'User Id', required: true, placeholder: 'adm_users id' },
  { key: 'acknowledgedAt', label: 'Acknowledged At', required: true, type: 'datetime' },
  { key: 'notes', label: 'Notes', span: 'full' },
];

export function DmsAcknowledgementsPage() {
  return (
    <MasterCrudPage<DmsAcknowledgement>
      title="Acknowledgements"
      subtitle="DMS · sign-off read/understood per user."
      resource={dmsAcknowledgements}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'createdAt', sortDir: 'desc' }}
      noun="acknowledgement"
    />
  );
}
