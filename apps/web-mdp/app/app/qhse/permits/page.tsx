import type { Metadata } from "next";
import { EhsNav } from "@/components/molecules/ehs-nav";
import { EhsPermitsPage } from "@/components/pages/ehs-permits-page";

export const metadata: Metadata = { title: "Permits" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <EhsNav />
      <div className="min-h-0 flex-1">
        <EhsPermitsPage />
      </div>
    </div>
  );
}
