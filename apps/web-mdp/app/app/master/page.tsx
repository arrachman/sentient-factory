import type { Metadata } from "next";
import { MasterGrid } from "@/components/organisms/master-grid";

export const metadata: Metadata = { title: "Master Data" };

export default function MasterHomePage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">
          Master Data
          <span className="code-tag">MDP</span>
        </h1>
      </div>
      <div className="page-body flex flex-col gap-5 overflow-auto p-4">
        <p className="text-sm text-muted-foreground">
          Master fondasi (mdp · eam) yang menopang eksekusi MES — work center,
          aset, shift, dan reason code.
        </p>
        <MasterGrid />
      </div>
    </div>
  );
}
