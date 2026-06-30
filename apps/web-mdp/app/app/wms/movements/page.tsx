import type { Metadata } from "next";
import { WmsNav } from "@/components/molecules/wms-nav";
import { WmsMovementsPage } from "@/components/pages/wms-movements-page";

export const metadata: Metadata = { title: "WMS · Movements" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <WmsNav />
      <div className="min-h-0 flex-1">
        <WmsMovementsPage />
      </div>
    </div>
  );
}
