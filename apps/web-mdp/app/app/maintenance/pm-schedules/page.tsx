import type { Metadata } from "next";
import { MntPmSchedulesPage } from "@/components/pages/mnt-pm-schedules-page";

export const metadata: Metadata = { title: "CMMS · PM Schedules" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <MntPmSchedulesPage />
      </div>
    </div>
  );
}
