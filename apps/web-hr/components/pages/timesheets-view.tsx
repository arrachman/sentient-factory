"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HrListLayout } from "@/components/organisms/list-layout";
import { DataTable, type Column } from "@/components/organisms/data-table";
import { useTimesheets } from "@/lib/api/hooks";
import { formatMinutes } from "@/lib/api/timesheets";
import type { TimesheetRow } from "@/lib/api/timesheets";

function firstOfMonthISO(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}
function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function TimesheetsView() {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState(firstOfMonthISO());
  const [dateTo, setDateTo] = useState(todayISO());
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useTimesheets({
    search: search || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page,
    limit: 25,
  });

  const rows = (data?.data ?? []) as TimesheetRow[];
  const totalPages = data?.meta?.totalPages ?? 1;
  const totalRows = data?.meta?.total ?? rows.length;

  const columns: Column<TimesheetRow>[] = [
    {
      key: "employeeCode",
      header: "Kode",
      render: (r) => r.employeeCode ?? "—",
    },
    {
      key: "fullName",
      header: "Karyawan",
      render: (r) => r.fullName ?? r.username ?? "—",
    },
    {
      key: "daysPresent",
      header: "Hari Hadir",
      className: "tabular-nums",
      render: (r) => r.daysPresent,
    },
    {
      key: "totalMinutes",
      header: "Total Jam",
      className: "tabular-nums",
      render: (r) => (
        <span className="font-medium">{formatMinutes(r.totalMinutes)}</span>
      ),
    },
    {
      key: "holidayMinutes",
      header: "Jam Libur",
      render: (r) =>
        (r.holidayMinutes ?? 0) > 0 ? (
          <Badge variant="default">{formatMinutes(r.holidayMinutes)}</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "overtimeMinutes",
      header: "Lembur",
      render: (r) =>
        r.overtimeMinutes > 0 ? (
          <Badge variant="warn">{formatMinutes(r.overtimeMinutes)}</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
  ];

  const dateRange = (
    <>
      <Input
        type="date"
        value={dateFrom}
        onChange={(e) => {
          setDateFrom(e.target.value);
          setPage(1);
        }}
        className="w-40"
      />
      <span className="text-xs text-muted-foreground">s/d</span>
      <Input
        type="date"
        value={dateTo}
        onChange={(e) => {
          setDateTo(e.target.value);
          setPage(1);
        }}
        className="w-40"
      />
    </>
  );

  return (
    <HrListLayout
      title="Timesheet"
      code="TMS"
      loading={isLoading}
      error={error ? ((error as Error)?.message ?? "Terjadi kesalahan.") : null}
      search={search}
      onSearch={(q) => {
        setSearch(q);
        setPage(1);
      }}
      onRefresh={() => refetch()}
      toolbar={dateRange}
      summary={{
        metricLabel: "Karyawan",
        rowCount: rows.length,
        totalCount: totalRows,
      }}
      pagination={{ page, pageCount: totalPages, totalRows, onPage: setPage }}
    >
      {rows.length === 0 ? (
        <div className="flex min-h-[160px] items-center justify-center text-sm text-muted-foreground">
          Tidak ada data timesheet untuk filter ini.
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => String(r.appUserId)}
        />
      )}
    </HrListLayout>
  );
}
