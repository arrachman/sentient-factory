import type { Metadata } from "next";
import { EhsNav } from "@/components/molecules/ehs-nav";
import { EhsAuditsPage } from "@/components/pages/ehs-audits-page";

export const metadata: Metadata = { title: "Audits" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <EhsNav />
      <div className="min-h-0 flex-1">
        <EhsAuditsPage />
      </div>
    </div>
  );
}
