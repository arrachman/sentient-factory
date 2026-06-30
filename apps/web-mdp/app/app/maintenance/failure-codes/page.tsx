import type { Metadata } from "next";
import { MntFailureCodesPage } from "@/components/pages/mnt-failure-codes-page";

export const metadata: Metadata = { title: "CMMS · Failure Codes" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <MntFailureCodesPage />
      </div>
    </div>
  );
}
