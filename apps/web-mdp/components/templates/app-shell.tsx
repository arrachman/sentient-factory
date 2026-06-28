import type { ReactNode } from 'react';
import { DynamicSidebar } from '@/components/organisms/dynamic-sidebar';

/**
 * App shell — role-filtered icon rail + topbar + content slot. The sidebar
 * (`DynamicSidebar`) consumes `/api/mdp/menus/nav` (mdp_menus SSOT filtered by
 * the user's ERP roles via mdp_role_menus), falling back to the static module
 * registry when nav is unavailable.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full w-full bg-background">
      <DynamicSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-11 shrink-0 items-center gap-3 border-b border-border bg-card px-4">
          <span className="text-sm font-semibold text-foreground">Senti MDP</span>
          <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground">
            ISA-95 · Level 3 / MOM
          </span>
        </header>
        <main className="min-h-0 flex-1 overflow-auto p-5">{children}</main>
      </div>
    </div>
  );
}
