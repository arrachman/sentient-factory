"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, X, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HrListLayout } from "@/components/organisms/list-layout";
import { DataTable, type Column } from "@/components/organisms/data-table";
import { LeaveRequestDialog } from "@/components/pages/leave-request-dialog";
import { useLeaveRequests } from "@/lib/api/hooks";
import { applyLeaveAction } from "@/lib/api/leave";
import type { LeaveRequest, LeaveStatus, LeaveAction } from "@/lib/api/leave";

const STATUS_OPTIONS: { value: LeaveStatus; label: string }[] = [
  { value: "pending", label: "Menunggu" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
  { value: "cancelled", label: "Dibatalkan" },
];

const STATUS_VARIANT: Record<
  LeaveStatus,
  "warn" | "success" | "danger" | "default"
> = {
  pending: "warn",
  approved: "success",
  rejected: "danger",
  cancelled: "default",
};

export function LeaveView() {
  const qc = useQueryClient();
  const [status, setStatus] = useState<LeaveStatus>("pending");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const query = { status, page, limit: 25 };
  const { data, isLoading, error, refetch } = useLeaveRequests(query);
  const rows = (data?.data ?? []) as LeaveRequest[];
  const totalPages = data?.meta?.totalPages ?? 1;
  const totalRows = data?.meta?.total ?? rows.length;

  async function act(id: string, action: LeaveAction) {
    setBusyId(id);
    try {
      await applyLeaveAction(id, action);
      toast.success("Pengajuan diperbarui.");
      await qc.invalidateQueries({ queryKey: ["hr", "leave", "requests"] });
    } catch (e) {
      toast.error((e as Error)?.message ?? "Aksi gagal.");
    } finally {
      setBusyId(null);
    }
  }

  const columns: Column<LeaveRequest>[] = [
    {
      key: "fullName",
      header: "Karyawan",
      render: (r) => r.fullName ?? r.username ?? "—",
    },
    {
      key: "leaveTypeName",
      header: "Tipe",
      render: (r) => r.leaveTypeName ?? "—",
    },
    {
      key: "period",
      header: "Periode",
      render: (r) => (
        <span className="text-xs">
          {r.startDate} → {r.endDate}{" "}
          <span className="text-muted-foreground">
            ({Number(r.totalDays)} hari)
          </span>
        </span>
      ),
    },
    { key: "reason", header: "Alasan", render: (r) => r.reason ?? "—" },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <Badge variant={STATUS_VARIANT[r.status]} dot>
          {r.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (r) => {
        const busy = busyId === String(r.id);
        if (r.status === "pending") {
          return (
            <div className="flex justify-end gap-1.5">
              <Button
                size="sm"
                variant="default"
                disabled={busy}
                onClick={() => act(String(r.id), "cancel")}
              >
                <Ban className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="sm"
                variant="danger"
                disabled={busy}
                onClick={() => act(String(r.id), "reject")}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="sm"
                variant="primary"
                disabled={busy}
                onClick={() => act(String(r.id), "approve")}
              >
                <Check className="h-3.5 w-3.5" />
              </Button>
            </div>
          );
        }
        return (
          <span className="text-xs text-muted-foreground">
            {r.reviewNote ?? "—"}
          </span>
        );
      },
    },
  ];

  const statusFilter = (
    <Select
      value={status}
      onValueChange={(v) => {
        setStatus(v as LeaveStatus);
        setPage(1);
      }}
    >
      <SelectTrigger style={{ width: "auto", minWidth: "9rem" }}>
        <span style={{ color: "var(--fg-faint)", marginRight: 2 }}>
          Status:
        </span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <>
      <HrListLayout
        title="Cuti"
        code="LVE"
        loading={isLoading}
        error={
          error ? ((error as Error)?.message ?? "Terjadi kesalahan.") : null
        }
        onRefresh={() => refetch()}
        onAdd={() => setDialogOpen(true)}
        addLabel="Ajukan Cuti"
        toolbar={statusFilter}
        summary={{
          metricLabel: "Pengajuan",
          rowCount: rows.length,
          totalCount: totalRows,
        }}
        pagination={{ page, pageCount: totalPages, totalRows, onPage: setPage }}
      >
        {rows.length === 0 ? (
          <div className="flex min-h-[160px] items-center justify-center text-sm text-muted-foreground">
            Tidak ada pengajuan untuk status ini.
          </div>
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(r) => String(r.id)}
          />
        )}
      </HrListLayout>
      <LeaveRequestDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
