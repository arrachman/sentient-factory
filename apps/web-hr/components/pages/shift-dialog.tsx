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
import { createShift, updateShift } from "@/lib/api/schedules";
import type { HrShift } from "@/lib/api/schedules";

export function ShiftDialog({
  open,
  onOpenChange,
  shift,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shift?: HrShift | null;
}) {
  const qc = useQueryClient();
  const isEdit = Boolean(shift);
  const formKey = `${open ? "open" : "closed"}-${shift?.id ?? "new"}`;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const code = String(formData.get("code") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const startTime = String(formData.get("startTime") ?? "08:00");
    const endTime = String(formData.get("endTime") ?? "16:00");
    const breakMinutes = String(formData.get("breakMinutes") ?? "60");
    if (!code || !name) {
      toast.error("Kode dan nama shift wajib diisi.");
      return;
    }
    try {
      const payload = {
        code,
        name,
        startTime,
        endTime,
        breakMinutes: Number(breakMinutes) || 0,
      };
      if (isEdit && shift) await updateShift(shift.id, payload);
      else await createShift(payload);
      toast.success(isEdit ? "Shift diperbarui." : "Shift dibuat.");
      await qc.invalidateQueries({ queryKey: ["hr", "shifts"] });
      onOpenChange(false);
    } catch (e) {
      toast.error((e as Error)?.message ?? "Gagal menyimpan shift.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Ubah Shift" : "Tambah Shift"}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form key={formKey} className="space-y-3" onSubmit={submit}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Kode</Label>
                <Input
                  name="code"
                  defaultValue={shift?.code ?? ""}
                  placeholder="PAGI"
                />
              </div>
              <div className="space-y-1">
                <Label>Nama</Label>
                <Input
                  name="name"
                  defaultValue={shift?.name ?? ""}
                  placeholder="Shift Pagi"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label>Mulai</Label>
                <Input
                  name="startTime"
                  type="time"
                  defaultValue={shift?.startTime ?? "08:00"}
                />
              </div>
              <div className="space-y-1">
                <Label>Selesai</Label>
                <Input
                  name="endTime"
                  type="time"
                  defaultValue={shift?.endTime ?? "16:00"}
                />
              </div>
              <div className="space-y-1">
                <Label>Istirahat (mnt)</Label>
                <Input
                  name="breakMinutes"
                  type="number"
                  min={0}
                  defaultValue={String(shift?.breakMinutes ?? 60)}
                />
              </div>
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
