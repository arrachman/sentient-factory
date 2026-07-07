"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/molecules/page-header";
import { QueryState } from "@/components/molecules/query-state";
import {
  getSettings,
  updateSetting,
  normalizeSettings,
} from "@/lib/api/settings";
import type { HrSetting } from "@/lib/api/settings";

export function SettingsView() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["hr", "settings"],
    queryFn: getSettings,
  });

  const [draft, setDraft] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const settings: HrSetting[] = normalizeSettings(data);
  const currentValues = useMemo(
    () =>
      Object.fromEntries(settings.map((s) => [s.key, valueToString(s.value)])),
    [settings],
  );

  async function save(key: string) {
    const value = draft[key] ?? currentValues[key] ?? "";
    setSavingKey(key);
    try {
      await updateSetting(key, parseValue(value));
      toast.success(`Pengaturan "${key}" disimpan.`);
      setDraft((prev) => {
        if (!(key in prev)) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } catch (e) {
      toast.error((e as Error)?.message ?? "Gagal menyimpan.");
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <PageHeader
      title="Pengaturan"
      description="Konfigurasi kebijakan absensi & verifikasi (ambang skor wajah, geofence, dll)."
      bodyClassName="mx-auto max-w-3xl"
    >
      <QueryState
        isLoading={isLoading}
        error={error}
        isEmpty={settings.length === 0}
      >
        <div className="divide-y rounded-lg border bg-card">
          {settings.map((s) => (
            <div key={s.key} className="flex items-center gap-3 p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {s.label ?? s.key}
                </p>
                {s.description && (
                  <p className="text-xs text-muted-foreground">
                    {s.description}
                  </p>
                )}
                {!s.label && (
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {s.key}
                  </p>
                )}
              </div>
              <Input
                className="w-56"
                value={draft[s.key] ?? currentValues[s.key] ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, [s.key]: e.target.value }))
                }
              />
              <Button
                size="sm"
                variant="primary"
                disabled={savingKey === s.key}
                onClick={() => save(s.key)}
              >
                {savingKey === s.key ? "Menyimpan…" : "Simpan"}
              </Button>
            </div>
          ))}
        </div>
      </QueryState>
    </PageHeader>
  );
}

function valueToString(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function parseValue(s: string): unknown {
  const t = s.trim();
  if (t === "true") return true;
  if (t === "false") return false;
  if (t !== "" && !Number.isNaN(Number(t))) return Number(t);
  try {
    if (t.startsWith("{") || t.startsWith("[")) return JSON.parse(t);
  } catch {
    /* keep as string */
  }
  return s;
}
