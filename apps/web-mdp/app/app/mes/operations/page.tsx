import type { Metadata } from "next";
import { MesNav } from "@/components/molecules/mes-nav";
import { OperationsPage } from "@/components/pages/operations-page";

export const metadata: Metadata = { title: "MES · Operations" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <MesNav />
      <div className="min-h-0 flex-1">
        <OperationsPage />
      </div>
    </div>
  );
}
