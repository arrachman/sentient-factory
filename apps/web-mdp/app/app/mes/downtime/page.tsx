import type { Metadata } from "next";
import { DowntimeEventsPage } from "@/components/pages/downtime-events-page";

export const metadata: Metadata = { title: "MES · Downtime Events" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <DowntimeEventsPage />
      </div>
    </div>
  );
}
