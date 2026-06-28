'use client';

import { MasterCrudPage } from '@/components/organisms/master-crud-page';
import { shifts, type Shift } from '@/lib/api';
import { StatusBadge } from '@/components/atoms/status-badge';

export function ShiftsPage() {
  return (
    <MasterCrudPage<Shift>
      title="Shift"
      subtitle="mdp · definisi shift kerja (basis MES & OEE availability)"
      noun="shift"
      resource={shifts}
      listQuery={{ limit: 100, sortBy: 'code', sortDir: 'asc' }}
      columns={[
        { key: 'code', label: 'Kode' },
        { key: 'name', label: 'Nama' },
        { key: 'startTime', label: 'Mulai' },
        { key: 'endTime', label: 'Selesai' },
        { key: 'isActive', label: 'Status', render: (r) => <StatusBadge active={r.isActive} /> },
      ]}
      fields={[
        { key: 'code', label: 'Kode', required: true, placeholder: 'SHIFT-1' },
        { key: 'name', label: 'Nama', required: true, placeholder: 'Shift Pagi' },
        { key: 'startTime', label: 'Mulai (HH:mm)', type: 'time', required: true },
        { key: 'endTime', label: 'Selesai (HH:mm)', type: 'time', required: true },
        { key: 'isActive', label: 'Aktif', type: 'checkbox', defaultValue: true },
      ]}
    />
  );
}
