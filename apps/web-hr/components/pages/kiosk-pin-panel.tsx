"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { KeyRound, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";
import { QueryState } from "@/components/molecules/query-state";
import { DataTable, type Column } from "@/components/organisms/data-table";
import { useKioskRoster } from "@/lib/api/hooks";
import { setKioskPin, clearKioskPin } from "@/lib/api/kiosk";
import type { KioskRosterEntry } from "@/lib/api/kiosk";

export function KioskPinPanel() {
  const qc = useQueryClient();
  const roster = useKioskRoster();
  const rows = roster.data ?? [];
  const [target, setTarget] = useState<KioskRosterEntry | null>(null);
  const [pin, setPin] = useState("");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function savePin() {
    if (!target) return;
    if (!/^\d{4,6}$/.test(pin)) {
      toast.error("PIN harus 4–6 digit angka.");
      return;
    }
    setSaving(true);
    try {
      await setKioskPin(target.appUserId, pin);
      toast.success(`PIN ${target.fullName} tersimpan.`);
      await qc.invalidateQueries({ queryKey: ["hr", "kiosk", "roster"] });
      setTarget(null);
      setPin("");
    } catch (e) {
      toast.error((e as Error)?.message ?? "Gagal menyimpan PIN.");
    } finally {
      setSaving(false);
    }
  }

  async function removePin(entry: KioskRosterEntry) {
    setBusyId(entry.appUserId);
    try {
      await clearKioskPin(entry.appUserId);
      toast.success(`PIN ${entry.fullName} dihapus.`);
      await qc.invalidateQueries({ queryKey: ["hr", "kiosk", "roster"] });
    } catch (e) {
      toast.error((e as Error)?.message ?? "Gagal menghapus PIN.");
    } finally {
      setBusyId(null);
    }
  }

  const columns: Column<KioskRosterEntry>[] = [
    {
      key: "fullName",
      header: "Karyawan",
      render: (r) => <span className="font-medium">{r.fullName}</span>,
    },
    {
      key: "employeeCode",
      header: "Kode",
      render: (r) => r.employeeCode ?? "—",
    },
    {
      key: "hasPin",
      header: "PIN",
      render: (r) => (
        <Badge variant={r.hasPin ? "success" : "default"} dot>
          {r.hasPin ? "Terset" : "Belum"}
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
            onClick={() => {
              setTarget(r);
              setPin("");
            }}
          >
            <KeyRound className="h-3.5 w-3.5" /> {r.hasPin ? "Ubah" : "Set"}
          </Button>
          {r.hasPin && (
            <Button
              size="sm"
              variant="danger"
              disabled={busyId === r.appUserId}
              onClick={() => removePin(r)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <QueryState
        isLoading={roster.isLoading}
        error={roster.error}
        isEmpty={rows.length === 0}
      >
        <DataTable columns={columns} rows={rows} rowKey={(r) => r.appUserId} />
      </QueryState>

      <Dialog
        open={Boolean(target)}
        onOpenChange={(o) => {
          if (!o) setTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>PIN Kiosk — {target?.fullName}</DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-3">
            <div className="space-y-1">
              <Label>PIN baru (4–6 digit)</Label>
              <Input
                type="password"
                inputMode="numeric"
                value={pin}
                maxLength={6}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="default"
                onClick={() => setTarget(null)}
                disabled={saving}
              >
                Batal
              </Button>
              <Button variant="primary" onClick={savePin} disabled={saving}>
                {saving ? "Menyimpan…" : "Simpan PIN"}
              </Button>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  );
}
