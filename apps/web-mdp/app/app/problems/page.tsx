import type { Metadata } from "next";
import { PrtIssuesPage } from "@/components/pages/prt-issues-page";

export const metadata: Metadata = { title: "Issues" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <PrtIssuesPage />
      </div>
    </div>
  );
}
