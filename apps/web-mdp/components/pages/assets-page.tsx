'use client';

import { MasterCrudPage } from '@/components/organisms/master-crud-page';
import { assets, type Asset } from '@/lib/api';
import { StatusBadge } from '@/components/atoms/status-badge';

export function AssetsPage() {
  return (
    <MasterCrudPage<Asset>
      title="Aset / Equipment"
      subtitle="eam · master equipment yang dirawat; link opsional ke ERP fixed asset"
      noun="aset"
      resource={assets}
      listQuery={{ limit: 100, sortBy: 'code', sortDir: 'asc' }}
      columns={[
        { key: 'code', label: 'Kode' },
        { key: 'name', label: 'Nama' },
        {
          key: 'erpFixedAssetId',
          label: 'ERP Fixed Asset',
          render: (r) => (r.erpFixedAssetId ? `#${r.erpFixedAssetId}` : '—'),
        },
        { key: 'isActive', label: 'Status', render: (r) => <StatusBadge active={r.isActive} /> },
      ]}
      fields={[
        { key: 'code', label: 'Kode', required: true, placeholder: 'AST-PRESS-01' },
        { key: 'name', label: 'Nama', required: true, placeholder: 'Hydraulic Press 01' },
        {
          key: 'erpFixedAssetId',
          label: 'ERP Fixed Asset ID',
          placeholder: 'fa_assets id (opsional)',
        },
        { key: 'isActive', label: 'Aktif', type: 'checkbox', defaultValue: true },
      ]}
    />
  );
}
