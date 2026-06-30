import type { Metadata } from "next";
import { WorkCentersPage } from "@/components/pages/work-centers-page";

export const metadata: Metadata = { title: "Master · Work Center" };

export default function Page() {
  return <WorkCentersPage />;
}
