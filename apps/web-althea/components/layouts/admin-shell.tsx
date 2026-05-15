'use client';

import { ReactNode, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useMe } from '@/features/auth/hooks/use-me';
import { usePsikologMe } from '@/features/psikolog-profile/hooks/use-profile';
import { DesktopTopbar } from './admin-shell/desktop-topbar';
import { performLogout, resolvePageMeta, userInitial } from './admin-shell/lib';
import { LogoutConfirmDialog } from './admin-shell/logout-confirm-dialog';
import { MobileTopbar } from './admin-shell/mobile-topbar';
import { NAV_BY_ROLE, ROLE_LABEL, type ShellRole } from './admin-shell/nav-config';
import { SidebarBrand } from './admin-shell/sidebar-brand';
import { SidebarFooter } from './admin-shell/sidebar-footer';
import { SidebarNav } from './admin-shell/sidebar-nav';
import { SidebarRolePill } from './admin-shell/sidebar-role-pill';

export type { ShellRole };

export function AdminShell({ role, children }: { role: ShellRole; children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const meQuery = useMe();
  const me = meQuery.data?.data;
  const psikologMeQuery = usePsikologMe({ enabled: role === 'psikolog' });
  const psikologProfile = psikologMeQuery.data?.data;
  const nav = NAV_BY_ROLE[role];
  const meta = resolvePageMeta(pathname, nav);

  function isActive(href: string): boolean {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function confirmLogout() {
    setLoggingOut(true);
    performLogout();
  }

  const userName = me?.fullName || me?.username || ROLE_LABEL[role].short;
  const userRole = ROLE_LABEL[role].short;
  const initial = userInitial(me?.fullName ?? me?.username, ROLE_LABEL[role].short);

  const searchPlaceholder =
    role === 'admin'
      ? 'Cari klien, psikolog…'
      : role === 'psikolog'
        ? 'Cari klien saya…'
        : role === 'resepsionis'
          ? 'Cari booking hari ini…'
          : 'Cari…';

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card flex flex-col transition-transform lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarBrand onCloseMobile={() => setMobileOpen(false)} />
        <SidebarRolePill pill={ROLE_LABEL[role]} />
        <SidebarNav
          nav={nav}
          isActive={isActive}
          onItemClick={() => setMobileOpen(false)}
        />
        <SidebarFooter
          initial={initial}
          userName={userName}
          userRole={userRole}
          onRequestLogout={() => setLogoutConfirmOpen(true)}
          avatarUrl={psikologProfile?.avatarUrl ?? null}
          avatarColor={psikologProfile?.color ?? null}
        />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <MobileTopbar
          roleShort={userRole}
          onOpenMenu={() => setMobileOpen(true)}
        />
        <DesktopTopbar
          meta={meta}
          searchPlaceholder={searchPlaceholder}
          initial={initial}
          userName={userName}
          avatarUrl={psikologProfile?.avatarUrl ?? null}
          avatarColor={psikologProfile?.color ?? null}
        />
        <main className="flex-1">{children}</main>
      </div>

      {logoutConfirmOpen && (
        <LogoutConfirmDialog
          userName={userName}
          userRole={userRole}
          loggingOut={loggingOut}
          onConfirm={confirmLogout}
          onCancel={() => setLogoutConfirmOpen(false)}
        />
      )}
    </div>
  );
}
