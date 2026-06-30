import type { Metadata } from "next";
import { DmsNav } from "@/components/molecules/dms-nav";
import { DmsAcknowledgementsPage } from "@/components/pages/dms-acknowledgements-page";

export const metadata: Metadata = { title: "Acknowledgements" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <DmsNav />
      <div className="min-h-0 flex-1">
        <DmsAcknowledgementsPage />
      </div>
    </div>
  );
}
