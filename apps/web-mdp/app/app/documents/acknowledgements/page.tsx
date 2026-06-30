import type { Metadata } from "next";
import { DmsAcknowledgementsPage } from "@/components/pages/dms-acknowledgements-page";

export const metadata: Metadata = { title: "Acknowledgements" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <DmsAcknowledgementsPage />
      </div>
    </div>
  );
}
