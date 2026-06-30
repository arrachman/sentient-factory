import type { Metadata } from "next";
import { ShiftsPage } from "@/components/pages/shifts-page";

export const metadata: Metadata = { title: "Master · Shift" };

export default function Page() {
  return <ShiftsPage />;
}
