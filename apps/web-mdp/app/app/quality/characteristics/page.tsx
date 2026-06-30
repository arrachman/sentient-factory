import type { Metadata } from "next";
import { QmsCharacteristicsPage } from "@/components/pages/qms-characteristics-page";

export const metadata: Metadata = { title: "QMS · Characteristics" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <QmsCharacteristicsPage />
      </div>
    </div>
  );
}
