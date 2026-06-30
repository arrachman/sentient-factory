import type { Metadata } from "next";
import { PrtNav } from "@/components/molecules/prt-nav";
import { PrtEscalationsPage } from "@/components/pages/prt-escalations-page";

export const metadata: Metadata = { title: "Escalations" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <PrtNav />
      <div className="min-h-0 flex-1">
        <PrtEscalationsPage />
      </div>
    </div>
  );
}
