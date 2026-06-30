import type { Metadata } from "next";
import { QmsResultsPage } from "@/components/pages/qms-results-page";

export const metadata: Metadata = { title: "QMS · Results" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <QmsResultsPage />
      </div>
    </div>
  );
}
