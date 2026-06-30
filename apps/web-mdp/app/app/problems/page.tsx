import type { Metadata } from "next";
import { PrtNav } from "@/components/molecules/prt-nav";
import { PrtIssuesPage } from "@/components/pages/prt-issues-page";

export const metadata: Metadata = { title: "Issues" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <PrtNav />
      <div className="min-h-0 flex-1">
        <PrtIssuesPage />
      </div>
    </div>
  );
}
