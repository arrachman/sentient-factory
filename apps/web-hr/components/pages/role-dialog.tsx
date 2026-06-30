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
import { createRole, updateRole } from "@/lib/api/roles";
import type { HrRole, CreateRolePayload } from "@/lib/api/roles";
import { hrQueryKeys } from "@/lib/api/hooks";

export function RoleDialog({
  open,
  onOpenChange,
  role,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: HrRole | null;
}) {
  const qc = useQueryClient();
  const isEdit = Boolean(role);
  const isSystem = Boolean(role?.isSystem);
  const defaults = {
    code: role?.code ?? "",
    name: role?.name ?? "",
    description: role?.description ?? "",
    isActive: role?.isActive ?? true,
  };
  const formKey = `${open ? "open" : "closed"}-${role?.id ?? "new"}`;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload: CreateRolePayload = {
      code: String(formData.get("code") ?? "")
        .trim()
        .toUpperCase(),
      name: String(formData.get("name") ?? "").trim(),
      description:
        String(formData.get("description") ?? "").trim() || undefined,
      isActive: formData.get("isActive") === "on",
    };
    if (!payload.code || !payload.name) {
      toast.error("Kode dan nama peran wajib diisi.");
      return;
    }
    try {
      if (isEdit && role) {
        // System role codes are immutable; only send editable fields.
        await updateRole(String(role.id), {
          name: payload.name,
          description: payload.description,
          isActive: payload.isActive,
          ...(isSystem ? {} : { code: payload.code }),
        });
      } else {
        await createRole(payload);
      }
      toast.success(isEdit ? "Peran diperbarui." : "Peran dibuat.");
      await qc.invalidateQueries({ queryKey: hrQueryKeys.roles });
      onOpenChange(false);
    } catch (e) {
      toast.error((e as Error)?.message ?? "Gagal menyimpan peran.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Peran" : "Tambah Peran"}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form key={formKey} className="space-y-3" onSubmit={submit}>
            <div className="space-y-1">
              <Label>Kode</Label>
              <Input
                name="code"
                defaultValue={defaults.code}
                placeholder="HR_SUPERVISOR"
                disabled={isSystem}
              />
              {isSystem && (
                <p className="text-xs text-muted-foreground">
                  Kode peran sistem tidak dapat diubah.
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Nama</Label>
              <Input
                name="name"
                defaultValue={defaults.name}
                placeholder="Supervisor"
              />
            </div>
            <div className="space-y-1">
              <Label>Deskripsi</Label>
              <Input
                name="description"
                defaultValue={defaults.description}
                placeholder="Mengawasi kehadiran shift."
              />
            </div>
            <label className="flex items-center gap-2 pt-1 text-sm">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked={defaults.isActive}
              />
              Aktif
            </label>
            <div className="flex justify-end gap-2 pt-2">
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
