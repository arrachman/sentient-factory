"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QueryState } from "@/components/molecules/query-state";
import { useRoles, hrQueryKeys } from "@/lib/api/hooks";
import { getUserRoles, setUserRoles } from "@/lib/api/roles";
import type { UserRoles } from "@/lib/api/roles";
import type { HrEmployee } from "@/lib/api/employees";

function unwrap<T>(payload: T | { data: T }): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export function RoleAssignDialog({
  open,
  onOpenChange,
  employee,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: HrEmployee | null;
}) {
  const qc = useQueryClient();
  const { data: roles = [] } = useRoles();
  const appUserId = employee ? String(employee.appUserId) : "";

  const { data, isLoading, error } = useQuery<UserRoles>({
    queryKey: hrQueryKeys.userRoles(appUserId),
    queryFn: async () => unwrap<UserRoles>(await getUserRoles(appUserId)),
    enabled: open && Boolean(appUserId),
  });

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [syncKey, setSyncKey] = useState("");
  const [saving, setSaving] = useState(false);

  // Seed local selection from server roles whenever the target user (or their
  // server-side roles) change. Adjusting state during render is React's
  // recommended alternative to a sync effect.
  if (data) {
    const key = `${appUserId}|${data.roles.map((r) => r.id).join(",")}`;
    if (key !== syncKey) {
      setSyncKey(key);
      setSelected(new Set(data.roles.map((r) => String(r.id))));
    }
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function save() {
    if (!appUserId) return;
    setSaving(true);
    try {
      await setUserRoles(appUserId, Array.from(selected).map(Number));
      toast.success("Peran karyawan diperbarui.");
      await qc.invalidateQueries({
        queryKey: hrQueryKeys.userRoles(appUserId),
      });
      await qc.invalidateQueries({ queryKey: hrQueryKeys.roles });
      onOpenChange(false);
    } catch (e) {
      toast.error((e as Error)?.message ?? "Gagal menyimpan peran.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Peran — {employee?.name ?? employee?.username ?? ""}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <QueryState
            isLoading={isLoading}
            error={error}
            isEmpty={roles.length === 0}
          >
            <div className="space-y-1">
              {roles.map((role) => (
                <label
                  key={role.id}
                  className="flex cursor-pointer items-start gap-3 rounded-md border p-3"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4"
                    checked={selected.has(String(role.id))}
                    onChange={() => toggle(String(role.id))}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">
                      {role.name}
                    </span>
                    <span className="block font-mono text-[11px] text-muted-foreground">
                      {role.code}
                    </span>
                    {role.description && (
                      <span className="block text-xs text-muted-foreground">
                        {role.description}
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </QueryState>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="default"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={saving}
              onClick={save}
            >
              {saving ? "Menyimpan…" : "Simpan"}
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
