import type { Metadata } from "next";
import { WorkCalendarsPage } from "@/components/pages/work-calendars-page";

export const metadata: Metadata = { title: "Master · Work Calendar" };

export default function Page() {
  return <WorkCalendarsPage />;
}
