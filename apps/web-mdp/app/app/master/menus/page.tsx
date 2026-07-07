import type { Metadata } from "next";
import { MenusPage } from "@/components/pages/menus-page";

export const metadata: Metadata = { title: "Master · Menu / Navigasi" };

export default function Page() {
  return <MenusPage />;
}
