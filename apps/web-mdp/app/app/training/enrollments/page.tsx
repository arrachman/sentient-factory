import type { Metadata } from "next";
import { LmsNav } from "@/components/molecules/lms-nav";
import { LmsEnrollmentsPage } from "@/components/pages/lms-enrollments-page";

export const metadata: Metadata = { title: "Enrollments" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <LmsNav />
      <div className="min-h-0 flex-1">
        <LmsEnrollmentsPage />
      </div>
    </div>
  );
}
