'use client';

import { fmtDateTime } from '@/lib/format';
import { ehsPermits, type EhsPermit } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const columns: ColumnDef<EhsPermit>[] = [
  { key: 'code', label: 'Kode' },
  { key: 'name', label: 'Judul' },
  { key: 'type', label: 'Tipe' },
  { key: 'status', label: 'Status' },
  { key: 'validFrom', label: 'Mulai', render: (r) => (r.validFrom ? fmtDateTime(r.validFrom) : '—') },
  { key: 'validTo', label: 'Selesai', render: (r) => (r.validTo ? fmtDateTime(r.validTo) : '—') },
];

const fields: FieldDef[] = [
  { key: 'code', label: 'Code', required: true, placeholder: 'PTW-0001' },
  { key: 'name', label: 'Name', required: true, span: 'full' },
  { key: 'type', label: 'Type', required: true, type: 'select', defaultValue: 'HOT_WORK', options: [{ value: 'HOT_WORK', label: 'Hot Work' }, { value: 'CONFINED_SPACE', label: 'Confined Space' }, { value: 'WORKING_AT_HEIGHT', label: 'Working At Height' }, { value: 'ELECTRICAL', label: 'Electrical' }, { value: 'EXCAVATION', label: 'Excavation' }, { value: 'CHEMICAL', label: 'Chemical' }, { value: 'OTHER', label: 'Other' }] },
  { key: 'status', label: 'Status', type: 'select', defaultValue: 'REQUESTED', options: [{ value: 'REQUESTED', label: 'Requested' }, { value: 'APPROVED', label: 'Approved' }, { value: 'ACTIVE', label: 'Active' }, { value: 'CLOSED', label: 'Closed' }, { value: 'EXPIRED', label: 'Expired' }, { value: 'REJECTED', label: 'Rejected' }, { value: 'CANCELLED', label: 'Cancelled' }] },
  { key: 'assetId', label: 'Asset Id', placeholder: 'eam_assets id' },
  { key: 'workCenterId', label: 'Work Center Id', placeholder: 'eam_work_centers id' },
  { key: 'location', label: 'Location' },
  { key: 'requestedById', label: 'Requested By Id', placeholder: 'adm_users id' },
  { key: 'approvedById', label: 'Approved By Id', placeholder: 'adm_users id' },
  { key: 'validFrom', label: 'Valid From', type: 'datetime' },
  { key: 'validTo', label: 'Valid To', type: 'datetime' },
  { key: 'description', label: 'Description', span: 'full' },
  { key: 'notes', label: 'Notes', span: 'full' },
];

export function EhsPermitsPage() {
  return (
    <MasterCrudPage<EhsPermit>
      title="Permits"
      subtitle="IMS / QHSE · permit-to-work (hot work, confined space, …)."
      resource={ehsPermits}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'code', sortDir: 'asc' }}
      noun="permit"
    />
  );
}
