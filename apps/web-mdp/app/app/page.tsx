import type { Metadata } from "next";
import { ModuleGrid } from "@/components/organisms/module-grid";

export const metadata: Metadata = { title: "Beranda" };

export default function AppHomePage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">
          Manufacturing Operations Management
          <span className="code-tag">MDP</span>
        </h1>
      </div>
      <div className="page-body flex flex-col gap-5 overflow-auto p-4">
        <p className="text-sm text-muted-foreground">
          Platform Level 3 (MOM) di antara Senti ERP (Level 4) dan lapangan
          (Level 2-0). Modul dibangun bertahap — MES sebagai anchor.
        </p>
        <ModuleGrid />
      </div>
    </div>
  );
}
