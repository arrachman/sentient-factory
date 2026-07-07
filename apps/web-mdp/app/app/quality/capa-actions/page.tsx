import type { Metadata } from "next";
import { QmsCapaActionsPage } from "@/components/pages/qms-capa-actions-page";

export const metadata: Metadata = { title: "QMS · CAPA" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <QmsCapaActionsPage />
      </div>
    </div>
  );
}
