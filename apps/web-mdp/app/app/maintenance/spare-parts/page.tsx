import type { Metadata } from "next";
import { MntSparePartsPage } from "@/components/pages/mnt-spare-parts-page";

export const metadata: Metadata = { title: "CMMS · Spare Parts" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <MntSparePartsPage />
      </div>
    </div>
  );
}
