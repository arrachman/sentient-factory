import type { Metadata } from "next";
import { PrtEscalationsPage } from "@/components/pages/prt-escalations-page";

export const metadata: Metadata = { title: "Escalations" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <PrtEscalationsPage />
      </div>
    </div>
  );
}
