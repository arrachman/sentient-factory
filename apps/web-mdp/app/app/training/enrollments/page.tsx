import type { Metadata } from "next";
import { LmsEnrollmentsPage } from "@/components/pages/lms-enrollments-page";

export const metadata: Metadata = { title: "Enrollments" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <LmsEnrollmentsPage />
      </div>
    </div>
  );
}
