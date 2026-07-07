'use client';

import { fmtDateTime, fmtDuration } from '@/lib/format';
import { laborLogs, type LaborLog } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const columns: ColumnDef<LaborLog>[] = [
  {
    key: 'operation',
    label: 'Operasi',
    render: (r) => (r.operation ? `#${r.operation.sequence} ${r.operation.name}` : `#${r.operationId}`),
  },
  { key: 'operatorId', label: 'Operator', render: (r) => `#${r.operatorId}` },
  { key: 'shift', label: 'Shift', render: (r) => r.shift?.code ?? '—' },
  { key: 'startedAt', label: 'Mulai', render: (r) => fmtDateTime(r.startedAt) },
  { key: 'endedAt', label: 'Selesai', render: (r) => fmtDateTime(r.endedAt) },
  { key: 'durationSeconds', label: 'Durasi', align: 'right', render: (r) => fmtDuration(r.durationSeconds) },
];

const fields: FieldDef[] = [
  { key: 'operationId', label: 'Operation ID', required: true, placeholder: 'mes_operations id' },
  { key: 'operatorId', label: 'Operator ID', required: true, placeholder: 'adm_users id' },
  { key: 'shiftId', label: 'Shift ID', placeholder: 'mdp_shifts id (opsional)' },
  { key: 'startedAt', label: 'Mulai', type: 'datetime', required: true },
  { key: 'endedAt', label: 'Selesai (derive durasi)', type: 'datetime' },
];

export function LaborLogsPage() {
  return (
    <MasterCrudPage<LaborLog>
      title="Labor Logs"
      subtitle="MES · waktu operator per operasi. durationSeconds di-derive saat close."
      resource={laborLogs}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'startedAt', sortDir: 'desc' }}
      noun="labor log"
    />
  );
}
