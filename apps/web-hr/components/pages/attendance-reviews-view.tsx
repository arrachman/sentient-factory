"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, X, MessageCircleQuestion } from "lucide-react";
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
import { useAttendanceReviews, hrQueryKeys } from "@/lib/api/hooks";
import { applyAttendanceReviewAction } from "@/lib/api/attendance-reviews";
import type { ReviewStatus, ReviewAction } from "@/lib/api/attendance-reviews";

type ReviewRow = Record<string, unknown>;

const STATUS_OPTIONS: { value: ReviewStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "needs_clarification", label: "Klarifikasi" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
];

function pick(row: ReviewRow, ...keys: string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== null && v !== "") return String(v);
  }
  return "—";
}

export function AttendanceReviewsView() {
  const [status, setStatus] = useState<ReviewStatus>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const query = { reviewStatus: status, page, limit: 25 };
  const { data, isLoading, error, refetch } = useAttendanceReviews(query);
  const rows = (data?.data ?? []) as ReviewRow[];
  const totalPages = data?.meta?.totalPages ?? 1;
  const totalRows = data?.meta?.total ?? rows.length;

  async function act(eventId: string, action: ReviewAction) {
    setBusyId(eventId);
    try {
      await applyAttendanceReviewAction(eventId, action);
      toast.success("Tinjauan diperbarui.");
      await qc.invalidateQueries({ queryKey: hrQueryKeys.reviews(query) });
    } catch (e) {
      toast.error((e as Error)?.message ?? "Aksi gagal.");
    } finally {
      setBusyId(null);
    }
  }

  const columns: Column<ReviewRow>[] = [
    {
      key: "name",
      header: "Karyawan",
      render: (r) => pick(r, "name", "employeeName"),
    },
    {
      key: "date",
      header: "Waktu",
      render: (r) => pick(r, "eventAt", "event_at", "createdAt", "workDate"),
    },
    {
      key: "reason",
      header: "Alasan",
      render: (r) => pick(r, "reasonCode", "reason_code", "reason"),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <Badge variant="warn" dot>
          {pick(r, "reviewStatus", "review_status", "status")}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (r) => {
        const id = pick(r, "id", "eventId", "event_id");
        const busy = busyId === id;
        if (status !== "pending" && status !== "needs_clarification") {
          return (
            <div className="flex justify-end gap-1.5">
              <Button asChild size="sm" variant="ghost">
                <Link href={`/app/attendance-reviews/${id}`}>Detail</Link>
              </Button>
              <Button
                size="sm"
                variant="default"
                disabled={busy}
                onClick={() => act(id, "reopen")}
              >
                Buka lagi
              </Button>
            </div>
          );
        }
        return (
          <div className="flex justify-end gap-1.5">
            <Button asChild size="sm" variant="ghost">
              <Link href={`/app/attendance-reviews/${id}`}>Detail</Link>
            </Button>
            <Button
              size="sm"
              variant="default"
              disabled={busy}
              onClick={() => act(id, "request-clarification")}
            >
              <MessageCircleQuestion className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant="default"
              disabled={busy}
              onClick={() => act(id, "reject")}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant="primary"
              disabled={busy}
              onClick={() => act(id, "approve")}
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];

  const statusFilter = (
    <Select
      value={status}
      onValueChange={(v) => {
        setStatus(v as ReviewStatus);
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
    <HrListLayout
      title="Tinjauan Absensi"
      code="REV"
      loading={isLoading}
      error={error ? ((error as Error)?.message ?? "Terjadi kesalahan.") : null}
      onRefresh={() => refetch()}
      toolbar={statusFilter}
      summary={{
        metricLabel: "Tinjauan",
        rowCount: rows.length,
        totalCount: totalRows,
      }}
      pagination={{ page, pageCount: totalPages, totalRows, onPage: setPage }}
    >
      {rows.length === 0 ? (
        <div className="flex min-h-[160px] items-center justify-center text-sm text-muted-foreground">
          Tidak ada tinjauan untuk status ini.
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r, i) => pick(r, "id", "eventId") + i}
        />
      )}
    </HrListLayout>
  );
}
