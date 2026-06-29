'use client';

import { fmtDateTime } from '@/lib/format';
import { ehsIncidents, type EhsIncident } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const columns: ColumnDef<EhsIncident>[] = [
  { key: 'code', label: 'Kode' },
  { key: 'name', label: 'Judul' },
  { key: 'type', label: 'Tipe' },
  { key: 'severity', label: 'Severity' },
  { key: 'status', label: 'Status' },
  { key: 'occurredAt', label: 'Kejadian', render: (r) => (r.occurredAt ? fmtDateTime(r.occurredAt) : '—') },
];

const fields: FieldDef[] = [
  { key: 'code', label: 'Code', required: true, placeholder: 'INC-0001' },
  { key: 'name', label: 'Name', required: true, span: 'full' },
  { key: 'type', label: 'Type', required: true, type: 'select', defaultValue: 'INJURY', options: [{ value: 'INJURY', label: 'Injury' }, { value: 'NEAR_MISS', label: 'Near Miss' }, { value: 'PROPERTY_DAMAGE', label: 'Property Damage' }, { value: 'ENVIRONMENTAL', label: 'Environmental' }, { value: 'SECURITY', label: 'Security' }, { value: 'OTHER', label: 'Other' }] },
  { key: 'severity', label: 'Severity', type: 'select', defaultValue: 'MINOR', options: [{ value: 'MINOR', label: 'Minor' }, { value: 'MODERATE', label: 'Moderate' }, { value: 'MAJOR', label: 'Major' }, { value: 'FATAL', label: 'Fatal' }] },
  { key: 'status', label: 'Status', type: 'select', defaultValue: 'REPORTED', options: [{ value: 'REPORTED', label: 'Reported' }, { value: 'UNDER_INVESTIGATION', label: 'Under Investigation' }, { value: 'ACTION_PENDING', label: 'Action Pending' }, { value: 'CLOSED', label: 'Closed' }, { value: 'CANCELLED', label: 'Cancelled' }] },
  { key: 'assetId', label: 'Asset Id', placeholder: 'eam_assets id' },
  { key: 'workCenterId', label: 'Work Center Id', placeholder: 'eam_work_centers id' },
  { key: 'location', label: 'Location' },
  { key: 'description', label: 'Description', span: 'full' },
  { key: 'occurredAt', label: 'Occurred At', required: true, type: 'datetime' },
  { key: 'reportedById', label: 'Reported By Id', placeholder: 'adm_users id' },
  { key: 'investigatedById', label: 'Investigated By Id', placeholder: 'adm_users id' },
  { key: 'rootCause', label: 'Root Cause', span: 'full' },
  { key: 'correctiveAction', label: 'Corrective Action', span: 'full' },
  { key: 'closedAt', label: 'Closed At', type: 'datetime' },
  { key: 'notes', label: 'Notes', span: 'full' },
];

export function EhsIncidentsPage() {
  return (
    <MasterCrudPage<EhsIncident>
      title="Incidents"
      subtitle="IMS / QHSE · insiden K3L + investigasi."
      resource={ehsIncidents}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'code', sortDir: 'asc' }}
      noun="incident"
    />
  );
}
