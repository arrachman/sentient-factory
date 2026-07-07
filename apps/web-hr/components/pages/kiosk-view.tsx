"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  LogIn,
  LogOut,
  KeyRound,
  MonitorSmartphone,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/molecules/page-header";
import { QueryState } from "@/components/molecules/query-state";
import { KioskPinPanel } from "@/components/pages/kiosk-pin-panel";
import { useWorksites, useKioskRoster } from "@/lib/api/hooks";
import { kioskClock } from "@/lib/api/kiosk";
import type { KioskAction, KioskRosterEntry } from "@/lib/api/kiosk";

type Tab = "clock" | "pin";

export function KioskView() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("clock");
  const [worksiteId, setWorksiteId] = useState("");
  const [selected, setSelected] = useState<KioskRosterEntry | null>(null);
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);

  const { data: worksites } = useWorksites();
  const roster = useKioskRoster();
  const employees = useMemo(
    () => (roster.data ?? []).filter((e) => e.hasPin),
    [roster.data],
  );

  function pressDigit(d: string) {
    setPin((p) => (p.length >= 6 ? p : p + d));
  }

  async function submit(action: KioskAction) {
    if (!worksiteId) return toast.error("Pilih lokasi kiosk dulu.");
    if (!selected) return toast.error("Pilih karyawan dulu.");
    if (pin.length < 4) return toast.error("PIN minimal 4 digit.");
    setBusy(true);
    try {
      await kioskClock({
        action,
        worksiteId: Number(worksiteId),
        appUserId: Number(selected.appUserId),
        pin,
      });
      toast.success(
        `${selected.fullName} berhasil clock-${action === "in" ? "in" : "out"}.`,
      );
      setSelected(null);
      setPin("");
      await qc.invalidateQueries({ queryKey: ["hr", "attendance"] });
    } catch (e) {
      toast.error((e as Error)?.message ?? "Gagal mencatat kehadiran.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageHeader
      title="Mode Kiosk"
      description="Perangkat bersama on-site — karyawan clock-in/out via PIN (adaptasi jibble Kiosk + PIN)."
      actions={
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={tab === "clock" ? "primary" : "default"}
            onClick={() => setTab("clock")}
          >
            <MonitorSmartphone className="h-4 w-4" /> Kiosk
          </Button>
          <Button
            size="sm"
            variant={tab === "pin" ? "primary" : "default"}
            onClick={() => setTab("pin")}
          >
            <KeyRound className="h-4 w-4" /> Kelola PIN
          </Button>
        </div>
      }
    >
      {tab === "pin" ? (
        <KioskPinPanel />
      ) : (
        <>
          <div className="mb-4 max-w-xs space-y-1">
            <label className="text-sm font-medium">Lokasi Kiosk</label>
            <select
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
              value={worksiteId}
              onChange={(e) => setWorksiteId(e.target.value)}
            >
              <option value="">— pilih lokasi —</option>
              {(worksites ?? []).map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          {!selected ? (
            <QueryState
              isLoading={roster.isLoading}
              error={roster.error}
              isEmpty={employees.length === 0}
              emptyLabel="Belum ada karyawan dengan PIN. Atur di tab Kelola PIN."
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {employees.map((e) => (
                  <button
                    key={e.appUserId}
                    type="button"
                    onClick={() => {
                      setSelected(e);
                      setPin("");
                    }}
                    disabled={!worksiteId}
                    className="rounded-lg border bg-card px-4 py-5 text-left transition hover:border-primary hover:bg-muted/40 disabled:opacity-50"
                  >
                    <div className="text-sm font-semibold">{e.fullName}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {e.employeeCode ?? "—"}
                    </div>
                  </button>
                ))}
              </div>
            </QueryState>
          ) : (
            <div className="mx-auto max-w-sm rounded-xl border bg-card p-6">
              <button
                type="button"
                className="mb-4 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setSelected(null);
                  setPin("");
                }}
              >
                <ArrowLeft className="h-3.5 w-3.5" /> ganti karyawan
              </button>
              <div className="mb-1 text-center text-lg font-semibold">
                {selected.fullName}
              </div>
              <Badge variant="default" className="mx-auto mb-4 block w-fit">
                {selected.employeeCode ?? "—"}
              </Badge>

              <div className="mb-4 flex justify-center gap-2" aria-label="PIN">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-3 w-3 rounded-full border ${i < pin.length ? "bg-primary" : "bg-transparent"}`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
                  <Button
                    key={d}
                    variant="default"
                    disabled={busy}
                    onClick={() => pressDigit(d)}
                  >
                    {d}
                  </Button>
                ))}
                <Button
                  variant="default"
                  disabled={busy}
                  onClick={() => setPin("")}
                >
                  C
                </Button>
                <Button
                  variant="default"
                  disabled={busy}
                  onClick={() => pressDigit("0")}
                >
                  0
                </Button>
                <Button
                  variant="default"
                  disabled={busy}
                  onClick={() => setPin((p) => p.slice(0, -1))}
                >
                  ⌫
                </Button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button
                  variant="primary"
                  disabled={busy}
                  onClick={() => submit("in")}
                >
                  <LogIn className="h-4 w-4" /> Masuk
                </Button>
                <Button
                  variant="danger"
                  disabled={busy}
                  onClick={() => submit("out")}
                >
                  <LogOut className="h-4 w-4" /> Keluar
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </PageHeader>
  );
}
