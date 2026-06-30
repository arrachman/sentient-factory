import type { Metadata } from "next";
import { MesNav } from "@/components/molecules/mes-nav";
import { LaborLogsPage } from "@/components/pages/labor-logs-page";

export const metadata: Metadata = { title: "MES · Labor Logs" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <MesNav />
      <div className="min-h-0 flex-1">
        <LaborLogsPage />
      </div>
    </div>
  );
}
