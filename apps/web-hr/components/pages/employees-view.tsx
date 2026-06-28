'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/molecules/page-header';
import { QueryState } from '@/components/molecules/query-state';
import { DataTable, type Column } from '@/components/organisms/data-table';
import { WorksiteAssignDialog } from '@/components/pages/worksite-assign-dialog';
import { useEmployees } from '@/lib/api/hooks';
import type { HrEmployee } from '@/lib/api/employees';

function faceVariant(status?: string): 'success' | 'warn' | 'default' {
  if (status === 'enrolled') return 'success';
  if (status === 'pending') return 'warn';
  return 'default';
}

export function EmployeesView() {
  const { data, isLoading, error } = useEmployees();
  const rows = data ?? [];
  const [assignFor, setAssignFor] = useState<HrEmployee | null>(null);

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
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => (
        <Button size="sm" variant="default" onClick={() => setAssignFor(r)}>
          <MapPin className="h-3.5 w-3.5" /> Worksite
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Karyawan"
        description="Daftar karyawan untuk operasi absensi + penugasan worksite (adaptasi jibble People & Groups)."
      />
      <QueryState isLoading={isLoading} error={error} isEmpty={rows.length === 0}>
        <DataTable columns={columns} rows={rows} rowKey={(r) => String(r.appUserId)} />
      </QueryState>
      <WorksiteAssignDialog
        open={assignFor !== null}
        onOpenChange={(o) => !o && setAssignFor(null)}
        appUserId={assignFor ? String(assignFor.appUserId) : null}
        employeeName={assignFor?.name}
      />
    </div>
  );
}
