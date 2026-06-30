import type { ReactNode } from "react";
import { AppShell } from "@/components/templates/app-shell";

/**
 * Shared shell for all `/app/**` routes. Living here (not inside each page)
 * means the sidebar + topbar persist across navigations — only the inner
 * content swaps — so switching menus no longer remounts `DynamicSidebar`
 * (which would refetch nav and flicker on every route change).
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
