import type { Metadata } from "next";
import { WmsTasksPage } from "@/components/pages/wms-tasks-page";

export const metadata: Metadata = { title: "WMS · Tasks" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <WmsTasksPage />
      </div>
    </div>
  );
}
