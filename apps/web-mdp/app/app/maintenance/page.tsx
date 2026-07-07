import type { Metadata } from "next";
import { MntWorkOrdersPage } from "@/components/pages/mnt-work-orders-page";

export const metadata: Metadata = { title: "CMMS · Work Orders" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <MntWorkOrdersPage />
      </div>
    </div>
  );
}
