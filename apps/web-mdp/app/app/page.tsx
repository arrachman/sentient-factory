import type { Metadata } from "next";
import { ModuleGrid } from "@/components/organisms/module-grid";

export const metadata: Metadata = { title: "Beranda" };

export default function AppHomePage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-foreground">
          Manufacturing Operations Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Platform Level 3 (MOM) di antara Senti ERP (Level 4) dan lapangan
          (Level 2-0). Modul dibangun bertahap — MES sebagai anchor.
        </p>
      </div>
      <ModuleGrid />
    </div>
  );
}
