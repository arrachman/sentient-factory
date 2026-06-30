"use client";

import { Users, MapPin, ScanFace, Clock4, ClipboardCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/molecules/page-header";
import { QueryState } from "@/components/molecules/query-state";
import { useAttendanceDashboard } from "@/lib/api/hooks";
import type { AttendanceDashboardSummary } from "@/lib/api/attendance";

const STAT_DEFS: {
  key: keyof AttendanceDashboardSummary;
  label: string;
  icon: LucideIcon;
}[] = [
  { key: "totalEmployees", label: "Total Karyawan", icon: Users },
  { key: "clockedInToday", label: "Hadir Hari Ini", icon: Clock4 },
  { key: "enrolledEmployees", label: "Wajah Terdaftar", icon: ScanFace },
  { key: "activeWorksites", label: "Lokasi Aktif", icon: MapPin },
  { key: "pendingReviews", label: "Tinjauan Pending", icon: ClipboardCheck },
];

export function DashboardView() {
  const { data, isLoading, error } = useAttendanceDashboard();
  const summary =
    data?.summary ?? (data as AttendanceDashboardSummary | undefined) ?? {};

  return (
    <PageHeader
      title="Dashboard Kehadiran"
      description="Ringkasan absensi real-time, identitas terverifikasi, dan antrian tinjauan."
    >
      <QueryState isLoading={isLoading} error={error}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {STAT_DEFS.map(({ key, label, icon: Icon }) => {
            const value = summary[key];
            return (
              <div key={String(key)} className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {label}
                  </span>
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="mt-2 text-2xl font-semibold tabular-nums">
                  {typeof value === "number" ? value : "—"}
                </p>
              </div>
            );
          })}
        </div>
      </QueryState>
    </PageHeader>
  );
}
