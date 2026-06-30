import type { Metadata } from "next";
import { LmsNav } from "@/components/molecules/lms-nav";
import { LmsCoursesPage } from "@/components/pages/lms-courses-page";

export const metadata: Metadata = { title: "Courses" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <LmsNav />
      <div className="min-h-0 flex-1">
        <LmsCoursesPage />
      </div>
    </div>
  );
}
