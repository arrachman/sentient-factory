"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/molecules/page-header";
import { QueryState } from "@/components/molecules/query-state";
import { useOvertimePolicy, hrQueryKeys } from "@/lib/api/hooks";
import { updateOvertimePolicy } from "@/lib/api/policy";
import type { OvertimePolicy } from "@/lib/api/policy";

type NumberField = {
  key: keyof OvertimePolicy;
  label: string;
  hint: string;
  min: number;
  max: number;
  step?: number;
};

const NUMBER_FIELDS: NumberField[] = [
  {
    key: "dailyRegularHours",
    label: "Jam reguler / hari",
    hint: "Jam kerja sebelum dihitung lembur",
    min: 0,
    max: 24,
    step: 0.5,
  },
  {
    key: "weeklyRegularHours",
    label: "Jam reguler / minggu",
    hint: "Batas mingguan sebelum lembur",
    min: 0,
    max: 168,
    step: 1,
  },
  {
    key: "overtimeMultiplier",
    label: "Pengali lembur",
    hint: "Faktor upah jam lembur (mis. 1.5×)",
    min: 1,
    max: 10,
    step: 0.1,
  },
  {
    key: "breakMinutes",
    label: "Istirahat (menit)",
    hint: "Durasi istirahat default per shift",
    min: 0,
    max: 480,
    step: 5,
  },
];

type BoolField = { key: keyof OvertimePolicy; label: string; hint: string };

const BOOL_FIELDS: BoolField[] = [
  {
    key: "overtimeEnabled",
    label: "Hitung lembur",
    hint: "Aktifkan perhitungan jam lembur",
  },
  {
    key: "breakPaid",
    label: "Istirahat dibayar",
    hint: "Waktu istirahat termasuk jam kerja terbayar",
  },
  {
    key: "countHolidayAsOvertime",
    label: "Hari libur = lembur",
    hint: "Kerja di hari libur (kalender) dihitung lembur",
  },
];

export function OvertimePolicyView() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useOvertimePolicy();
  // `edits` holds only the fields the user changed; effective value falls back
  // to the server data — avoids mirroring server state into local state.
  const [edits, setEdits] = useState<Partial<OvertimePolicy>>({});
  const [saving, setSaving] = useState(false);

  const draft: OvertimePolicy | null = data ? { ...data, ...edits } : null;

  function setField<K extends keyof OvertimePolicy>(
    key: K,
    value: OvertimePolicy[K],
  ) {
    setEdits((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    if (!draft) return;
    setSaving(true);
    try {
      await updateOvertimePolicy(draft);
      setEdits({});
      toast.success("Kebijakan lembur disimpan.");
      await qc.invalidateQueries({ queryKey: hrQueryKeys.overtimePolicy });
    } catch (e) {
      toast.error((e as Error)?.message ?? "Gagal menyimpan kebijakan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageHeader
      title="Aturan Lembur & Istirahat"
      description="Kebijakan perhitungan lembur, break, dan hari libur (adaptasi jibble Overtime Tracker). Privileged-only."
      actions={
        <Button variant="primary" disabled={saving || !draft} onClick={save}>
          {saving ? "Menyimpan…" : "Simpan"}
        </Button>
      }
    >
      <QueryState isLoading={isLoading} error={error} isEmpty={!draft}>
        {draft && (
          <div className="space-y-6">
            <section className="rounded-lg border bg-card">
              <header className="border-b px-4 py-2.5 text-sm font-medium">
                Ambang & pengali
              </header>
              <div className="grid grid-cols-2 gap-4 p-4">
                {NUMBER_FIELDS.map((f) => (
                  <div key={String(f.key)} className="space-y-1">
                    <Label>{f.label}</Label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      min={f.min}
                      max={f.max}
                      step={f.step ?? 1}
                      value={String(draft[f.key] ?? "")}
                      onChange={(e) =>
                        setField(f.key, Number(e.target.value) as never)
                      }
                    />
                    <p className="text-xs text-muted-foreground">{f.hint}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-lg border bg-card">
              <header className="border-b px-4 py-2.5 text-sm font-medium">
                Kebijakan
              </header>
              <div className="divide-y">
                {BOOL_FIELDS.map((f) => (
                  <label
                    key={String(f.key)}
                    className="flex cursor-pointer items-center gap-3 p-4"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={Boolean(draft[f.key])}
                      onChange={(e) =>
                        setField(f.key, e.target.checked as never)
                      }
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">
                        {f.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {f.hint}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </div>
        )}
      </QueryState>
    </PageHeader>
  );
}
