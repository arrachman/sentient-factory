import type { ReactNode } from 'react';
import Link from 'next/link';
import { Layers } from 'lucide-react';
import { MDP_MODULES } from '@/lib/modules';

const ICON_CLS =
  'flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground';

/**
 * Minimal app shell — icon sidebar + topbar + content slot. Phase 1 scaffold:
 * sidebar items are the MOM modules (not yet routed). Replaced by a dynamic,
 * role-filtered nav (mdp_menus SSOT) in a later phase.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full w-full bg-background">
      <aside className="flex w-[52px] shrink-0 flex-col items-center gap-1 border-r border-border bg-card py-2">
        <Link href="/app" title="Beranda" className="mb-2 flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Layers className="size-5" />
        </Link>
        {MDP_MODULES.map((mod) => {
          const Icon = mod.icon;
          const title = `${mod.name} · ${mod.system}`;
          return mod.route ? (
            <Link key={mod.id} href={mod.route} title={title} className={ICON_CLS}>
              <Icon className="size-4.5" />
            </Link>
          ) : (
            <button key={mod.id} type="button" title={title} className={ICON_CLS} disabled>
              <Icon className="size-4.5" />
            </button>
          );
        })}
      </aside>

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
