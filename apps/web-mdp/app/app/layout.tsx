import type { ReactNode } from 'react';
import { AppShell } from '@/components/templates/app-shell';
import { fetchNavServer } from '@/lib/api/nav-server';

/**
 * Shared shell for all `/app/**` routes. Living here (not inside each page)
 * means the sidebar + topbar persist across navigations — only the inner
 * content swaps — so switching menus no longer remounts `DynamicSidebar`
 * (which would refetch nav and flicker on every route change).
 *
 * The nav tree is fetched server-side and handed to the sidebar as
 * `initialNav`, so the first paint already shows the correct role-filtered
 * menu — no static-fallback→fetch swap on refresh.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const initialNav = await fetchNavServer();
  return <AppShell initialNav={initialNav}>{children}</AppShell>;
}
