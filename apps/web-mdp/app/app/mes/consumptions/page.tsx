import type { Metadata } from "next";
import { MesNav } from "@/components/molecules/mes-nav";
import { MaterialConsumptionsPage } from "@/components/pages/material-consumptions-page";

export const metadata: Metadata = { title: "MES · Material Consumptions" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <MesNav />
      <div className="min-h-0 flex-1">
        <MaterialConsumptionsPage />
      </div>
    </div>
  );
}
