import type { Metadata } from "next";
import { QmsInspectionsPage } from "@/components/pages/qms-inspections-page";

export const metadata: Metadata = { title: "QMS · Inspections" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <QmsInspectionsPage />
      </div>
    </div>
  );
}
