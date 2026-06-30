import type { Metadata } from "next";
import { LaborLogsPage } from "@/components/pages/labor-logs-page";

export const metadata: Metadata = { title: "MES · Labor Logs" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <LaborLogsPage />
      </div>
    </div>
  );
}
