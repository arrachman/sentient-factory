import type { Metadata } from "next";
import { EhsIncidentsPage } from "@/components/pages/ehs-incidents-page";

export const metadata: Metadata = { title: "Incidents" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <EhsIncidentsPage />
      </div>
    </div>
  );
}
