import type { Metadata } from "next";
import { LmsCoursesPage } from "@/components/pages/lms-courses-page";

export const metadata: Metadata = { title: "Courses" };

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <LmsCoursesPage />
      </div>
    </div>
  );
}
