'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useHrTabs } from '@/lib/use-hr-tabs';
import { pageMetaFor } from '@/lib/nav';
import { DynamicSidebar } from '@/components/organisms/dynamic-sidebar';
import { TabBar } from '@/components/organisms/tab-bar';
import { useHrMe } from '@/lib/api/hooks';
import { clearSession } from '@/lib/api/auth';

/**
 * Multi-tab shell for Senti HR — ported from web-erp (icon-rail sidebar + topbar
 * + browser-style tab strip), adapted to HR's URL-driven tabs. Lives in the
 * persistent `app/app/layout.tsx`, so the tab strip survives client navigations.
 *
 * The active view = `children` rendered by the per-route `page.tsx` (filesystem
 * routing stays the source of truth for route→view). Deviations from the ERP
 * shell (documented in CLAUDE.md): tabs are keyed by their `/app/...` pathname so
 * the existing `<Link>`-based views navigate natively; only the active route's
 * view is mounted (no hidden keep-alive divs); reload remounts the active view
 * via a per-route nonce. No command palette / drawers / i18n yet.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  useSessionGuard(pathname);

  const {
    tabs,
    activeRoute,
    activeNonce,
    activate,
    closeTab,
    closeOthers,
    closeRight,
    reload,
    reorder,
  } = useHrTabs();

  return (
    <div className="app">
      <DynamicSidebar />
      <Topbar />
      <main className="main">
        <TabBar
          tabs={tabs}
          activeRoute={activeRoute}
          onActivate={activate}
          onClose={closeTab}
          onReload={reload}
          onCloseOthers={closeOthers}
          onCloseRight={closeRight}
          onReorder={reorder}
        />
        <div className="tabviews">
          <div className="tabview" style={{ display: 'flex' }}>
            <div key={`${activeRoute}:${activeNonce}`} className="h-full w-full overflow-auto p-6">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * Client backstop to the proxy cookie gate: if the session cookie is present but
 * the gateway rejects it (expired/invalid → 401 on /api/auth/me), send the user
 * to /login instead of leaving every panel stuck on "Gagal memuat data".
 */
function useSessionGuard(pathname: string) {
  const router = useRouter();
  const { error } = useHrMe();
  const code = (error as { code?: string } | null)?.code;
  const isUnauthorized = code === 'HTTP_401' || code === 'UNAUTHORIZED';

  useEffect(() => {
    if (isUnauthorized) {
      router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`);
    }
  }, [isUnauthorized, pathname, router]);
}

function Topbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const meta = pageMetaFor(pathname);

  return (
    <header className="topbar">
      <div className="brand">
        <span className="logo" />
        <span>Senti HR</span>
      </div>
      <nav className="breadcrumb">
        <span className="crumb">Time &amp; Attendance</span>
        <span className="sep">/</span>
        <span className="crumb active">{meta.title}</span>
      </nav>
      <div className="spacer" />
      <button
        type="button"
        aria-label="Ganti tema"
        className="iconbtn"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        <Sun size={16} className="dark:hidden" />
        <Moon size={16} className="hidden dark:block" />
      </button>
      <UserMenu />
    </header>
  );
}

/**
 * Identity chip + logout. HR's `sf_token` cookie is JS-set by the login page
 * (not HttpOnly), so logout is purely client-side: clear the cookie then hard
 * navigate to /login (a full reload drops all in-memory query cache + state).
 */
function UserMenu() {
  const { data: me } = useHrMe();
  const displayName = me?.name || me?.username || 'Pengguna';
  const initial = displayName.charAt(0).toUpperCase();

  const onLogout = () => {
    clearSession();
    window.location.assign('/login');
  };

  return (
    <>
      <span className="user-chip" title={displayName}>
        <span className="avatar">{initial}</span>
        <span>{displayName}</span>
      </span>
      <button type="button" aria-label="Keluar" title="Keluar" className="iconbtn" onClick={onLogout}>
        <LogOut size={16} />
      </button>
    </>
  );
}
