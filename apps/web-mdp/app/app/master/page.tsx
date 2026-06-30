import type { Metadata } from "next";
import { MasterGrid } from "@/components/organisms/master-grid";

export const metadata: Metadata = { title: "Master Data" };

export default function MasterHomePage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-foreground">Master Data</h1>
        <p className="text-sm text-muted-foreground">
          Master fondasi (mdp · eam) yang menopang eksekusi MES — work center,
          aset, shift, dan reason code.
        </p>
      </div>
      <MasterGrid />
    </div>
  );
}
