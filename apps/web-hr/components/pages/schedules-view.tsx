"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/molecules/page-header";
import { QueryState } from "@/components/molecules/query-state";
import { DataTable, type Column } from "@/components/organisms/data-table";
import { ShiftDialog } from "@/components/pages/shift-dialog";
import { ShiftAssignDialog } from "@/components/pages/shift-assign-dialog";
import { useShifts, useShiftAssignments } from "@/lib/api/hooks";
import { deleteShift, deleteShiftAssignment } from "@/lib/api/schedules";
import type { HrShift, HrShiftAssignment } from "@/lib/api/schedules";

type Tab = "shifts" | "assignments";

export function SchedulesView() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("shifts");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [shiftDialogOpen, setShiftDialogOpen] = useState(false);
  const [editShift, setEditShift] = useState<HrShift | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const shiftsQuery = useShifts();
  const assignmentsQuery = useShiftAssignments();
  const shifts = shiftsQuery.data ?? [];
  const assignments = assignmentsQuery.data ?? [];

  async function removeShift(id: string) {
    setBusyId(id);
    try {
      await deleteShift(id);
      toast.success("Shift dihapus.");
      await qc.invalidateQueries({ queryKey: ["hr", "shifts"] });
    } catch (e) {
      toast.error((e as Error)?.message ?? "Gagal menghapus shift.");
    } finally {
      setBusyId(null);
    }
  }

  async function removeAssignment(id: string) {
    setBusyId(id);
    try {
      await deleteShiftAssignment(id);
      toast.success("Jadwal dihapus.");
      await qc.invalidateQueries({ queryKey: ["hr", "shift-assignments"] });
    } catch (e) {
      toast.error((e as Error)?.message ?? "Gagal menghapus jadwal.");
    } finally {
      setBusyId(null);
    }
  }

  const shiftColumns: Column<HrShift>[] = [
    {
      key: "code",
      header: "Kode",
      render: (r) => <span className="font-medium">{r.code}</span>,
    },
    { key: "name", header: "Nama", render: (r) => r.name },
    {
      key: "time",
      header: "Jam",
      render: (r) => (
        <span className="text-xs">
          {r.startTime}–{r.endTime}{" "}
          <span className="text-muted-foreground">
            · {r.breakMinutes}m istirahat
          </span>
        </span>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      render: (r) => (
        <Badge variant={r.isActive ? "success" : "default"} dot>
          {r.isActive ? "Aktif" : "Nonaktif"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (r) => (
        <div className="flex justify-end gap-1.5">
          <Button
            size="sm"
            variant="default"
            disabled={busyId === r.id}
            onClick={() => {
              setEditShift(r);
              setShiftDialogOpen(true);
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="danger"
            disabled={busyId === r.id}
            onClick={() => removeShift(r.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  const assignColumns: Column<HrShiftAssignment>[] = [
    {
      key: "workDate",
      header: "Tanggal",
      render: (r) => <span className="font-medium">{r.workDate}</span>,
    },
    {
      key: "employee",
      header: "Karyawan",
      render: (r) => r.fullName ?? r.username ?? "—",
    },
    {
      key: "shift",
      header: "Shift",
      render: (r) => (
        <span className="text-xs">
          {r.shiftName ?? r.shiftCode ?? "—"}{" "}
          {r.startTime ? (
            <span className="text-muted-foreground">
              ({r.startTime}–{r.endTime})
            </span>
          ) : null}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (r) => (
        <Button
          size="sm"
          variant="danger"
          disabled={busyId === r.id}
          onClick={() => removeAssignment(r.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <PageHeader
      title="Jadwal & Shift"
      description="Kelola pola shift dan jadwal kerja karyawan (adaptasi jibble Work Schedules)."
      actions={
        tab === "shifts" ? (
          <Button
            variant="primary"
            onClick={() => {
              setEditShift(null);
              setShiftDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Tambah Shift
          </Button>
        ) : (
          <Button variant="primary" onClick={() => setAssignDialogOpen(true)}>
            <Plus className="h-4 w-4" /> Assign Shift
          </Button>
        )
      }
    >
      <div className="mb-4 flex gap-1.5">
        <Button
          size="sm"
          variant={tab === "shifts" ? "primary" : "default"}
          onClick={() => setTab("shifts")}
        >
          Master Shift
        </Button>
        <Button
          size="sm"
          variant={tab === "assignments" ? "primary" : "default"}
          onClick={() => setTab("assignments")}
        >
          Jadwal Kerja
        </Button>
      </div>

      {tab === "shifts" ? (
        <QueryState
          isLoading={shiftsQuery.isLoading}
          error={shiftsQuery.error}
          isEmpty={shifts.length === 0}
        >
          <DataTable
            columns={shiftColumns}
            rows={shifts}
            rowKey={(r) => r.id}
          />
        </QueryState>
      ) : (
        <QueryState
          isLoading={assignmentsQuery.isLoading}
          error={assignmentsQuery.error}
          isEmpty={assignments.length === 0}
        >
          <DataTable
            columns={assignColumns}
            rows={assignments}
            rowKey={(r) => r.id}
          />
        </QueryState>
      )}

      <ShiftDialog
        open={shiftDialogOpen}
        onOpenChange={setShiftDialogOpen}
        shift={editShift}
      />
      <ShiftAssignDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
      />
    </PageHeader>
  );
}
