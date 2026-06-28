'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/molecules/page-header';
import { QueryState } from '@/components/molecules/query-state';
import { Pagination } from '@/components/molecules/pagination';
import { DataTable, type Column } from '@/components/organisms/data-table';
import { useTimesheets } from '@/lib/api/hooks';
import { formatMinutes } from '@/lib/api/timesheets';
import type { TimesheetRow } from '@/lib/api/timesheets';

function firstOfMonthISO(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}
function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function TimesheetsView() {
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState(firstOfMonthISO());
  const [dateTo, setDateTo] = useState(todayISO());
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useTimesheets({
    search: search || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page,
    limit: 25,
  });

  const rows = (data?.data ?? []) as TimesheetRow[];
  const totalPages = data?.meta?.totalPages ?? 1;

  const columns: Column<TimesheetRow>[] = [
    { key: 'employeeCode', header: 'Kode', render: (r) => r.employeeCode ?? '—' },
    { key: 'fullName', header: 'Karyawan', render: (r) => r.fullName ?? r.username ?? '—' },
    { key: 'daysPresent', header: 'Hari Hadir', className: 'tabular-nums', render: (r) => r.daysPresent },
    {
      key: 'totalMinutes',
      header: 'Total Jam',
      className: 'tabular-nums',
      render: (r) => <span className="font-medium">{formatMinutes(r.totalMinutes)}</span>,
    },
    {
      key: 'overtimeMinutes',
      header: 'Lembur',
      render: (r) =>
        r.overtimeMinutes > 0 ? (
          <Badge variant="warn">{formatMinutes(r.overtimeMinutes)}</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Timesheet"
        description="Rekap jam kerja per karyawan dari sesi absensi — dasar payroll (adaptasi jibble Timesheets)."
      />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input
          placeholder="Cari nama / kode…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-56"
        />
        <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className="w-40" />
        <span className="text-xs text-muted-foreground">s/d</span>
        <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} className="w-40" />
      </div>
      <QueryState isLoading={isLoading} error={error} isEmpty={rows.length === 0}>
        <DataTable columns={columns} rows={rows} rowKey={(r) => String(r.appUserId)} />
        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
      </QueryState>
    </div>
  );
}
