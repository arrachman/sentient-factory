'use client';

import { StatusBadge } from '@/components/atoms/status-badge';
import { fmtQty } from '@/lib/format';
import { workCalendars, type WorkCalendar } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const columns: ColumnDef<WorkCalendar>[] = [
  { key: 'code', label: 'Kode' },
  { key: 'name', label: 'Nama' },
  {
    key: 'workCenterId',
    label: 'Scope',
    render: (r) => (r.workCenterId ? `WC #${r.workCenterId}` : 'Plant-wide'),
  },
  {
    key: 'plannedMinutesPerDay',
    label: 'Menit/Hari',
    align: 'right',
    render: (r) => fmtQty(r.plannedMinutesPerDay),
  },
  { key: 'workingDaysPerWeek', label: 'Hari/Minggu', align: 'right' },
  { key: 'isActive', label: 'Status', render: (r) => <StatusBadge active={r.isActive} /> },
];

const fields: FieldDef[] = [
  { key: 'code', label: 'Kode', required: true, placeholder: 'CAL-DEFAULT' },
  { key: 'name', label: 'Nama', required: true, placeholder: 'Kalender Default (3 shift)' },
  { key: 'description', label: 'Deskripsi', span: 'full' },
  { key: 'workCenterId', label: 'Work Center ID', placeholder: 'kosong = plant-wide' },
  { key: 'shiftId', label: 'Shift ID', placeholder: 'kosong = semua shift' },
  {
    key: 'plannedMinutesPerDay',
    label: 'Menit Rencana / Hari',
    type: 'number',
    required: true,
    placeholder: '1440',
  },
  { key: 'workingDaysPerWeek', label: 'Hari Kerja / Minggu', type: 'number', defaultValue: '7' },
  { key: 'effectiveFrom', label: 'Berlaku Dari', type: 'datetime' },
  { key: 'effectiveTo', label: 'Berlaku Sampai', type: 'datetime' },
  { key: 'isActive', label: 'Aktif', type: 'checkbox', defaultValue: true },
];

export function WorkCalendarsPage() {
  return (
    <MasterCrudPage<WorkCalendar>
      title="Work Calendar"
      subtitle="mdp · planned operating time — basis OEE Availability."
      resource={workCalendars}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'code', sortDir: 'asc' }}
      noun="kalender"
    />
  );
}
