import type { Metadata } from "next";
import { RoleMenusPage } from "@/components/pages/role-menus-page";

export const metadata: Metadata = { title: "Master · Akses Menu per Role" };

export default function Page() {
  return <RoleMenusPage />;
}
