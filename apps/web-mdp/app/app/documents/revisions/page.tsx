import type { Metadata } from "next";
import { DmsRevisionsPage } from "@/components/pages/dms-revisions-page";

export const metadata: Metadata = { title: "Revisions" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <DmsRevisionsPage />
      </div>
    </div>
  );
}
