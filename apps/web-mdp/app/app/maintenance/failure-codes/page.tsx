import type { Metadata } from "next";
import { MntNav } from "@/components/molecules/mnt-nav";
import { MntFailureCodesPage } from "@/components/pages/mnt-failure-codes-page";

export const metadata: Metadata = { title: "CMMS · Failure Codes" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <MntNav />
      <div className="min-h-0 flex-1">
        <MntFailureCodesPage />
      </div>
    </div>
  );
}
