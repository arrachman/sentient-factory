'use client';

import { StatusBadge } from '@/components/atoms/status-badge';
import { menus, type Menu } from '@/lib/api';
import {
  MasterCrudPage,
  type ColumnDef,
  type FieldDef,
} from '@/components/organisms/master-crud-page';

const columns: ColumnDef<Menu>[] = [
  { key: 'sequence', label: 'Seq', align: 'right' },
  { key: 'code', label: 'Kode' },
  { key: 'name', label: 'Nama' },
  { key: 'parent', label: 'Parent', render: (r) => r.parent?.code ?? '—' },
  { key: 'path', label: 'Route', render: (r) => r.path ?? '—' },
  { key: 'moduleKey', label: 'Modul', render: (r) => r.moduleKey ?? '—' },
  { key: 'isActive', label: 'Status', render: (r) => <StatusBadge active={r.isActive} /> },
];

const fields: FieldDef[] = [
  { key: 'code', label: 'Kode', required: true, placeholder: 'mes' },
  { key: 'name', label: 'Label', required: true, placeholder: 'Manufacturing Execution' },
  { key: 'parentId', label: 'Parent Menu ID', placeholder: 'kosong = root' },
  { key: 'path', label: 'Route', placeholder: '/app/mes' },
  { key: 'icon', label: 'Icon (lucide)', placeholder: 'Factory' },
  { key: 'moduleKey', label: 'Module Key', placeholder: 'mes / qms / wms …' },
  { key: 'sequence', label: 'Urutan', type: 'number', defaultValue: '0' },
  { key: 'isActive', label: 'Aktif', type: 'checkbox', defaultValue: true },
];

export function MenusPage() {
  return (
    <MasterCrudPage<Menu>
      title="Menu / Navigasi"
      subtitle="mdp · SSOT navigasi shell MDP (mirror sys_menus)."
      resource={menus}
      columns={columns}
      fields={fields}
      listQuery={{ sortBy: 'sequence', sortDir: 'asc' }}
      noun="menu"
    />
  );
}
