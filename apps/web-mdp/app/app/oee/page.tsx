import type { Metadata } from "next";
import { OeeDashboardPage } from "@/components/pages/oee-dashboard-page";

export const metadata: Metadata = { title: "OEE Overlay" };

export default function OeePage() {
  return <OeeDashboardPage />;
}
