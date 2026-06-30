import type { Metadata } from "next";
import { LmsCompetenciesPage } from "@/components/pages/lms-competencies-page";

export const metadata: Metadata = { title: "Competencies" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <LmsCompetenciesPage />
      </div>
    </div>
  );
}
