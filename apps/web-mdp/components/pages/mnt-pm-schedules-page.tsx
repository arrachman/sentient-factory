'use client';

import { fmtDateTime } from '@/lib/format';
import { mntPmSchedules, type MntPmSchedule } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const columns: ColumnDef<MntPmSchedule>[] = [
  { key: 'code', label: 'Kode' },
  { key: 'name', label: 'Nama' },
  { key: 'assetId', label: 'Aset', render: (r) => (r.assetId ? `#${r.assetId}` : '—') },
  { key: 'triggerType', label: 'Trigger' },
  { key: 'intervalDays', label: 'Interval (hari)', align: 'right', render: (r) => r.intervalDays ?? '—' },
  { key: 'nextDueAt', label: 'Jatuh Tempo', render: (r) => (r.nextDueAt ? fmtDateTime(r.nextDueAt) : '—') },
];

const fields: FieldDef[] = [
  { key: 'code', label: 'Kode', required: true, placeholder: 'PM-CUT-30D' },
  { key: 'name', label: 'Nama', required: true, span: 'full' },
  { key: 'assetId', label: 'Asset ID', placeholder: 'eam_assets id' },
  { key: 'workCenterId', label: 'Work Center ID', placeholder: 'eam_work_centers id' },
  {
    key: 'triggerType',
    label: 'Trigger',
    type: 'select',
    defaultValue: 'TIME_BASED',
    options: [
      { value: 'TIME_BASED', label: 'Time-based' },
      { value: 'METER_BASED', label: 'Meter-based' },
    ],
  },
  { key: 'intervalDays', label: 'Interval (hari)', type: 'number' },
  { key: 'meterType', label: 'Tipe Meter', placeholder: 'RUN_HOURS' },
  { key: 'meterInterval', label: 'Interval Meter', type: 'number' },
  { key: 'lastServiceAt', label: 'Servis Terakhir', type: 'datetime' },
  { key: 'nextDueAt', label: 'Jatuh Tempo Berikutnya', type: 'datetime' },
  { key: 'taskDescription', label: 'Deskripsi Tugas', span: 'full' },
];

export function MntPmSchedulesPage() {
  return (
    <MasterCrudPage<MntPmSchedule>
      title="PM Schedules"
      subtitle="CMMS · jadwal pemeliharaan preventif (berbasis waktu atau meter)."
      resource={mntPmSchedules}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'code', sortDir: 'asc' }}
      noun="pm-schedule"
    />
  );
}
