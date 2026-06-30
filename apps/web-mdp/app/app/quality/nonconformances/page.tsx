import type { Metadata } from "next";
import { QmsNonconformancesPage } from "@/components/pages/qms-nonconformances-page";

export const metadata: Metadata = { title: "QMS · NCR" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <QmsNonconformancesPage />
      </div>
    </div>
  );
}
