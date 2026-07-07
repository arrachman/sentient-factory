import type { Metadata } from "next";
import { QmsPlansPage } from "@/components/pages/qms-plans-page";

export const metadata: Metadata = { title: "QMS · Inspection Plans" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <QmsPlansPage />
      </div>
    </div>
  );
}
