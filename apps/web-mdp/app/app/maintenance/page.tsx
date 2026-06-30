import type { Metadata } from "next";
import { MntNav } from "@/components/molecules/mnt-nav";
import { MntWorkOrdersPage } from "@/components/pages/mnt-work-orders-page";

export const metadata: Metadata = { title: "CMMS · Work Orders" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <MntNav />
      <div className="min-h-0 flex-1">
        <MntWorkOrdersPage />
      </div>
    </div>
  );
}
