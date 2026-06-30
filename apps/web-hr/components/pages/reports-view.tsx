"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, FileSpreadsheet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/molecules/page-header";
import { QueryState } from "@/components/molecules/query-state";
import { DataTable, type Column } from "@/components/organisms/data-table";
import { useReportCatalog, useReport } from "@/lib/api/hooks";
import { downloadReport } from "@/lib/api/reports";
import type {
  HrReportColType,
  HrReportColumn,
  HrReportFilters,
  HrReportFormat,
} from "@/lib/api/reports";

type Row = Record<string, unknown>;

function isNumeric(type: HrReportColType): boolean {
  return type === "number" || type === "hours" || type === "days";
}

function formatValue(value: unknown, type: HrReportColType): string {
  if (value === null || value === undefined || value === "") return "—";
  if (isNumeric(type)) {
    const n = Number(value);
    if (!Number.isFinite(n)) return String(value);
    const digits = type === "number" ? 0 : 2;
    return n.toLocaleString("id-ID", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  }
  return String(value);
}

function renderCell(value: unknown, type: HrReportColType) {
  if (type === "status") {
    const label = String(value ?? "");
    return (
      <Badge variant={label === "Billable" ? "success" : "default"} dot>
        {label}
      </Badge>
    );
  }
  return formatValue(value, type);
}

export function ReportsView() {
  const catalog = useReportCatalog();
  const reports = catalog.data ?? [];
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [exporting, setExporting] = useState<HrReportFormat | null>(null);

  const activeKey = selectedKey ?? reports[0]?.key ?? null;
  const activeDef = reports.find((r) => r.key === activeKey) ?? null;

  const filters: HrReportFilters = useMemo(
    () => ({ dateFrom: dateFrom || undefined, dateTo: dateTo || undefined }),
    [dateFrom, dateTo],
  );

  const report = useReport(activeKey, filters);
  const dataset = report.data;

  const columns: Column<Row>[] = useMemo(() => {
    const defs = (dataset?.columns ??
      activeDef?.columns ??
      []) as HrReportColumn[];
    return defs.map((col) => ({
      key: col.key,
      header: col.header,
      className: isNumeric(col.type) ? "text-right" : undefined,
      render: (row: Row) => renderCell(row[col.key], col.type),
    }));
  }, [dataset?.columns, activeDef?.columns]);

  async function onExport(format: HrReportFormat) {
    if (!activeKey) return;
    setExporting(format);
    try {
      await downloadReport(activeKey, format, filters);
    } catch (e) {
      toast.error((e as Error)?.message ?? "Unduhan gagal.");
    } finally {
      setExporting(null);
    }
  }

  const rows = (dataset?.rows ?? []) as Row[];

  return (
    <PageHeader
      title="Laporan & Export"
      description="Rekap kehadiran, jam proyek, dan cuti — lihat di layar atau unduh XLS/CSV (jibble Reports/Exports)."
      actions={
        <div className="flex gap-2">
          <Button
            variant="default"
            disabled={!activeKey || exporting !== null || report.isLoading}
            onClick={() => onExport("csv")}
          >
            <Download className="h-4 w-4" />{" "}
            {exporting === "csv" ? "Mengunduh…" : "CSV"}
          </Button>
          <Button
            variant="primary"
            disabled={!activeKey || exporting !== null || report.isLoading}
            onClick={() => onExport("xlsx")}
          >
            <FileSpreadsheet className="h-4 w-4" />{" "}
            {exporting === "xlsx" ? "Mengunduh…" : "Excel"}
          </Button>
        </div>
      }
    >
      <QueryState
        isLoading={catalog.isLoading}
        error={catalog.error}
        isEmpty={reports.length === 0}
      >
        <div className="mb-4 flex flex-wrap gap-1.5">
          {reports.map((r) => (
            <Button
              key={r.key}
              size="sm"
              variant={activeKey === r.key ? "primary" : "default"}
              onClick={() => setSelectedKey(r.key)}
            >
              {r.title}
            </Button>
          ))}
        </div>

        {activeDef ? (
          <p className="mb-4 text-sm text-muted-foreground">
            {activeDef.description}
          </p>
        ) : null}

        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label>Dari Tanggal</Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Sampai Tanggal</Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          {(dateFrom || dateTo) && (
            <Button
              size="sm"
              variant="default"
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
            >
              Reset
            </Button>
          )}
        </div>

        {dataset && dataset.summary.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {dataset.summary.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border bg-card px-4 py-3"
              >
                <div className="text-xs text-muted-foreground">
                  {item.label}
                </div>
                <div className="mt-1 text-lg font-semibold">
                  {formatValue(item.value, item.type ?? "text")}
                </div>
              </div>
            ))}
          </div>
        )}

        <QueryState
          isLoading={report.isLoading}
          error={report.error}
          isEmpty={rows.length === 0}
        >
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(_, i) => String(i)}
          />
        </QueryState>
      </QueryState>
    </PageHeader>
  );
}
