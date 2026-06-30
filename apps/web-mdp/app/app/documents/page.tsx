import type { Metadata } from "next";
import { DmsDocumentsPage } from "@/components/pages/dms-documents-page";

export const metadata: Metadata = { title: "Documents" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <DmsDocumentsPage />
      </div>
    </div>
  );
}
