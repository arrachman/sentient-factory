'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Moon, Sun, Clock4 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HR_NAV } from '@/lib/nav';

/**
 * Lean persistent chrome (sidebar + topbar) for Senti HR.
 *
 * Deliberately simpler than the web-erp multi-tab shell: HR has ~10 top-level
 * screens, not 200 ERP transactions, so a flat data-driven sidebar fits better.
 * It still follows the same tokens, folder layout, and one-way dependency rules
 * (FRONTEND-DESIGN-SYSTEM §3). The richer ERP shell can be ported later if HR
 * grows multi-tab needs.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full">
      <Sidebar pathname={pathname} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="min-h-0 flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside
      className="flex shrink-0 flex-col border-r bg-card"
      style={{ width: 'var(--sidebar-w)' }}
    >
      <div className="flex h-[var(--topbar-h)] items-center gap-2 border-b px-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Clock4 className="h-4 w-4" />
        </span>
        <span className="text-sm font-semibold">Senti HR</span>
      </div>

      <nav className="flex-1 overflow-auto px-2 py-3">
        {HR_NAV.map((group) => (
          <div key={group.key} className="mb-4">
            <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.path || pathname.startsWith(`${item.path}/`);
                const Icon = item.icon;
                return (
                  <li key={item.key}>
                    <Link
                      href={item.path}
                      className={cn(
                        'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors',
                        active
                          ? 'bg-accent font-medium text-accent-foreground'
                          : 'text-foreground/80 hover:bg-muted',
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                      {item.status === 'soon' && (
                        <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium uppercase text-muted-foreground">
                          Soon
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

function Topbar() {
  const { theme, setTheme } = useTheme();
  return (
    <header
      className="flex shrink-0 items-center justify-between border-b bg-card px-6"
      style={{ height: 'var(--topbar-h)' }}
    >
      <div className="text-sm font-medium text-muted-foreground">
        Time &amp; Attendance
      </div>
      <button
        type="button"
        aria-label="Toggle theme"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="flex h-8 w-8 items-center justify-center rounded-md text-foreground/70 hover:bg-muted"
      >
        <Sun className="h-4 w-4 dark:hidden" />
        <Moon className="hidden h-4 w-4 dark:block" />
      </button>
    </header>
  );
}
