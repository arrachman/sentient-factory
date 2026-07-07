import type { Metadata } from "next";
import { ProductionOrdersPage } from "@/components/pages/production-orders-page";

export const metadata: Metadata = { title: "MES · Production Orders" };

export default function MesPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <ProductionOrdersPage />
      </div>
    </div>
  );
}
