'use client';

import { MasterCrudPage } from '@/components/organisms/master-crud-page';
import { workCenters, type WorkCenter } from '@/lib/api';
import { StatusBadge } from '@/components/atoms/status-badge';

export function WorkCentersPage() {
  return (
    <MasterCrudPage<WorkCenter>
      title="Work Center"
      subtitle="eam · resource produksi (line / cell / station) untuk routing MES"
      noun="work center"
      resource={workCenters}
      listQuery={{ limit: 100, sortBy: 'code', sortDir: 'asc' }}
      columns={[
        { key: 'code', label: 'Kode' },
        { key: 'name', label: 'Nama' },
        {
          key: 'idealCycleSeconds',
          label: 'Ideal Cycle (dtk)',
          align: 'right',
          render: (r) => (r.idealCycleSeconds ? r.idealCycleSeconds : '—'),
        },
        { key: 'isActive', label: 'Status', render: (r) => <StatusBadge active={r.isActive} /> },
      ]}
      fields={[
        { key: 'code', label: 'Kode', required: true, placeholder: 'WC-CUTTING-01' },
        { key: 'name', label: 'Nama', required: true, placeholder: 'Cutting Line 1' },
        { key: 'assetId', label: 'Asset ID (utama)', placeholder: 'eam_assets id (opsional)' },
        {
          key: 'idealCycleSeconds',
          label: 'Ideal Cycle (detik/unit)',
          type: 'number',
          placeholder: '12.5',
        },
        { key: 'isActive', label: 'Aktif', type: 'checkbox', defaultValue: true },
      ]}
    />
  );
}
