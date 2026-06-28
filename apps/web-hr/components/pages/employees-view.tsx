'use client';

import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/molecules/page-header';
import { QueryState } from '@/components/molecules/query-state';
import { DataTable, type Column } from '@/components/organisms/data-table';
import { useEmployees } from '@/lib/api/hooks';
import type { HrEmployee } from '@/lib/api/employees';

function faceVariant(status?: string): 'success' | 'warn' | 'default' {
  if (status === 'enrolled') return 'success';
  if (status === 'pending') return 'warn';
  return 'default';
}

const columns: Column<HrEmployee>[] = [
  { key: 'employeeCode', header: 'Kode', render: (r) => r.employeeCode ?? '—' },
  { key: 'name', header: 'Nama' },
  { key: 'username', header: 'Username', render: (r) => r.username ?? '—' },
  {
    key: 'faceEnrollmentStatus',
    header: 'Wajah',
    render: (r) => (
      <Badge variant={faceVariant(r.faceEnrollmentStatus)} dot>
        {r.faceEnrollmentStatus ?? 'belum'}
      </Badge>
    ),
  },
];

export function EmployeesView() {
  const { data, isLoading, error } = useEmployees();
  const rows = data ?? [];

  return (
    <div>
      <PageHeader
        title="Karyawan"
        description="Daftar karyawan untuk operasi absensi (adaptasi jibble People & Groups)."
      />
      <QueryState isLoading={isLoading} error={error} isEmpty={rows.length === 0}>
        <DataTable columns={columns} rows={rows} rowKey={(r) => String(r.appUserId)} />
      </QueryState>
    </div>
  );
}
