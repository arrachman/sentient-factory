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
import { useProjects } from "@/lib/api/hooks";
import { createProjectTime } from "@/lib/api/projects";

export function ProjectTimeDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const qc = useQueryClient();
  const { data: projects } = useProjects();
  const formKey = open ? "project-time-open" : "project-time-closed";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const projectId = String(formData.get("projectId") ?? "");
    const workDate = String(formData.get("workDate") ?? "");
    const hours = String(formData.get("hours") ?? "");
    const activity = String(formData.get("activity") ?? "").trim();
    const note = String(formData.get("note") ?? "").trim();
    const hoursNum = Number(hours);
    if (!projectId || !workDate || !hoursNum || hoursNum <= 0) {
      toast.error("Proyek, tanggal, dan durasi (>0) wajib diisi.");
      return;
    }
    try {
      await createProjectTime({
        projectId: Number(projectId),
        workDate,
        minutes: Math.round(hoursNum * 60),
        activity: activity || undefined,
        note: note || undefined,
      });
      toast.success("Waktu proyek tercatat.");
      await qc.invalidateQueries({ queryKey: ["hr", "project-time"] });
      onOpenChange(false);
    } catch (e) {
      toast.error((e as Error)?.message ?? "Gagal mencatat waktu.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Catat Waktu Proyek</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form key={formKey} className="space-y-3" onSubmit={submit}>
            <div className="space-y-1">
              <Label>Proyek</Label>
              <select
                name="projectId"
                className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                defaultValue=""
              >
                <option value="">— pilih —</option>
                {(projects ?? []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                    {p.isBillable ? " · billable" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Tanggal</Label>
                <Input name="workDate" type="date" defaultValue="" />
              </div>
              <div className="space-y-1">
                <Label>Durasi (jam)</Label>
                <Input
                  name="hours"
                  type="number"
                  min={0}
                  step={0.25}
                  defaultValue=""
                  placeholder="2"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Aktivitas (opsional)</Label>
              <Input
                name="activity"
                defaultValue=""
                placeholder="Development, meeting…"
              />
            </div>
            <div className="space-y-1">
              <Label>Catatan (opsional)</Label>
              <Input name="note" defaultValue="" placeholder="Detail…" />
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
                Simpan
              </Button>
            </div>
          </form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
