import type { Metadata } from "next";
import { AppearancePage } from "@/components/pages/appearance-page";

export const metadata: Metadata = { title: "Setting · Tampilan" };

export default function Page() {
  return <AppearancePage />;
}
