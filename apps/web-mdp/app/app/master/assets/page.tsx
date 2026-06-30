import type { Metadata } from "next";
import { AssetsPage } from "@/components/pages/assets-page";

export const metadata: Metadata = { title: "Master · Aset" };

export default function Page() {
  return <AssetsPage />;
}
