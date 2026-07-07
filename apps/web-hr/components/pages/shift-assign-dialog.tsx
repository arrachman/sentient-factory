"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useShifts, useEmployees } from "@/lib/api/hooks";
import { createShiftAssignment } from "@/lib/api/schedules";

export function ShiftAssignDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const qc = useQueryClient();
  const { data: shifts } = useShifts();
  const { data: employees } = useEmployees();
  const formKey = open ? "shift-assign-open" : "shift-assign-closed";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const appUserId = String(formData.get("appUserId") ?? "");
    const shiftId = String(formData.get("shiftId") ?? "");
    const workDate = String(formData.get("workDate") ?? "");
    if (!appUserId || !shiftId || !workDate) {
      toast.error("Karyawan, shift, dan tanggal wajib diisi.");
      return;
    }
    try {
      await createShiftAssignment({
        appUserId: Number(appUserId),
        shiftId: Number(shiftId),
        workDate,
      });
      toast.success("Jadwal shift tersimpan.");
      await qc.invalidateQueries({ queryKey: ["hr", "shift-assignments"] });
      onOpenChange(false);
    } catch (e) {
      toast.error((e as Error)?.message ?? "Gagal menyimpan jadwal.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Shift</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form key={formKey} className="space-y-3" onSubmit={submit}>
            <div className="space-y-1">
              <Label>Karyawan</Label>
              <select
                name="appUserId"
                className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                defaultValue=""
              >
                <option value="">— pilih —</option>
                {(employees ?? []).map((emp) => (
                  <option key={emp.appUserId} value={emp.appUserId}>
                    {emp.name}
                    {emp.employeeCode ? ` (${emp.employeeCode})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Shift</Label>
              <select
                name="shiftId"
                className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                defaultValue=""
              >
                <option value="">— pilih —</option>
                {(shifts ?? []).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.startTime}–{s.endTime})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Tanggal</Label>
              <Input name="workDate" type="date" defaultValue="" />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="default"
                onClick={() => onOpenChange(false)}
              >
                Batal
              </Button>
              <Button type="submit" variant="primary">
                Assign
              </Button>
            </div>
          </form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
