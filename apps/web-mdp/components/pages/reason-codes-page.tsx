'use client';

import { MasterCrudPage } from '@/components/organisms/master-crud-page';
import { reasonCodes, type ReasonCode, type ReasonCodeCategory } from '@/lib/api';
import { StatusBadge } from '@/components/atoms/status-badge';

const CATEGORIES: { value: ReasonCodeCategory; label: string }[] = [
  { value: 'DOWNTIME', label: 'Downtime' },
  { value: 'SCRAP', label: 'Scrap' },
  { value: 'DELAY', label: 'Delay' },
  { value: 'QUALITY', label: 'Quality' },
  { value: 'OTHER', label: 'Lainnya' },
];

const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label]));

export function ReasonCodesPage() {
  return (
    <MasterCrudPage<ReasonCode>
      title="Reason Code"
      subtitle="mdp · katalog alasan downtime / scrap / delay (typed)"
      noun="reason code"
      resource={reasonCodes}
      listQuery={{ limit: 100, sortBy: 'code', sortDir: 'asc' }}
      columns={[
        { key: 'code', label: 'Kode' },
        { key: 'name', label: 'Nama' },
        { key: 'category', label: 'Kategori', render: (r) => CATEGORY_LABEL[r.category] ?? r.category },
        { key: 'isActive', label: 'Status', render: (r) => <StatusBadge active={r.isActive} /> },
      ]}
      fields={[
        { key: 'code', label: 'Kode', required: true, placeholder: 'DT-CHANGEOVER' },
        { key: 'name', label: 'Nama', required: true, placeholder: 'Changeover / Setup' },
        { key: 'category', label: 'Kategori', type: 'select', required: true, options: CATEGORIES },
        { key: 'isActive', label: 'Aktif', type: 'checkbox', defaultValue: true },
      ]}
    />
  );
}
