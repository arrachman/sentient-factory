'use client';

import { useMemo, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HrListLayout } from '@/components/organisms/list-layout';
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
  const { data, isLoading, error, refetch } = useEmployees();
  const allRows = useMemo(() => data ?? [], [data]);
  const [search, setSearch] = useState('');
  const [assignFor, setAssignFor] = useState<HrEmployee | null>(null);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allRows;
    return allRows.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.employeeCode?.toLowerCase().includes(q) ||
        r.username?.toLowerCase().includes(q),
    );
  }, [allRows, search]);

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
    <>
      <HrListLayout
        title="Karyawan"
        code="EMP"
        loading={isLoading}
        error={error ? ((error as Error)?.message ?? 'Terjadi kesalahan.') : null}
        search={search}
        onSearch={setSearch}
        onRefresh={() => refetch()}
        summary={{ metricLabel: 'Karyawan', rowCount: rows.length, totalCount: allRows.length }}
      >
        {rows.length === 0 ? (
          <div className="flex min-h-[160px] items-center justify-center text-sm text-muted-foreground">
            {allRows.length === 0 ? 'Belum ada karyawan.' : 'Tidak ada hasil untuk pencarian ini.'}
          </div>
        ) : (
          <DataTable columns={columns} rows={rows} rowKey={(r) => String(r.appUserId)} />
        )}
      </HrListLayout>
      <WorksiteAssignDialog
        open={assignFor !== null}
        onOpenChange={(o) => !o && setAssignFor(null)}
        appUserId={assignFor ? String(assignFor.appUserId) : null}
        employeeName={assignFor?.name}
      />
    </>
  );
}
