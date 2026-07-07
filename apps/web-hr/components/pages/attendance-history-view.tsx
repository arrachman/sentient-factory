"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { HrListLayout } from "@/components/organisms/list-layout";
import { DataTable, type Column } from "@/components/organisms/data-table";
import { useAttendanceHistory } from "@/lib/api/hooks";

// History rows are dynamic from the backend; render the most common fields and
// fall back gracefully. Keys cover both camelCase and snake_case shapes.
type HistoryRow = Record<string, unknown>;

function pick(row: HistoryRow, ...keys: string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== null && v !== "") return String(v);
  }
  return "—";
}

const columns: Column<HistoryRow>[] = [
  {
    key: "name",
    header: "Karyawan",
    render: (r) => pick(r, "name", "employeeName", "fullName"),
  },
  {
    key: "date",
    header: "Tanggal",
    render: (r) => pick(r, "workDate", "work_date", "date"),
  },
  {
    key: "in",
    header: "Clock In",
    render: (r) => pick(r, "clockInAt", "clock_in_at", "clockIn"),
  },
  {
    key: "out",
    header: "Clock Out",
    render: (r) => pick(r, "clockOutAt", "clock_out_at", "clockOut"),
  },
  {
    key: "status",
    header: "Status",
    render: (r) => pick(r, "status", "reviewStatus", "state"),
  },
];

export function AttendanceHistoryView() {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useAttendanceHistory({
    search: search || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page,
    limit: 25,
  });

  const rows = (data?.data ?? []) as HistoryRow[];
  const totalPages = data?.meta?.totalPages ?? 1;
  const totalRows = data?.meta?.total ?? rows.length;

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
      title="Riwayat Absensi"
      code="ATT"
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
        metricLabel: "Catatan",
        rowCount: rows.length,
        totalCount: totalRows,
      }}
      pagination={{ page, pageCount: totalPages, totalRows, onPage: setPage }}
    >
      {rows.length === 0 ? (
        <div className="flex min-h-[160px] items-center justify-center text-sm text-muted-foreground">
          Tidak ada catatan absensi untuk filter ini.
        </div>
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(_, i) => String(i)} />
      )}
    </HrListLayout>
  );
}
