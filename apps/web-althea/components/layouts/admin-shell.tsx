'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  DoorOpen,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  MessageSquare,
  Settings,
  Stethoscope,
  Users,
  UserSquare,
  X,
} from 'lucide-react';
import { TOKEN_COOKIE } from '@/shared/auth/constants';

type NavItem = { href: string; label: string; icon: ReactNode };

const ADMIN_NAV: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: '/admin/schedule', label: 'Jadwal', icon: <CalendarDays className="h-4 w-4" /> },
  { href: '/admin/booking', label: 'Booking', icon: <ClipboardList className="h-4 w-4" /> },
  { href: '/admin/psikolog', label: 'Psikolog', icon: <Stethoscope className="h-4 w-4" /> },
  { href: '/admin/layanan', label: 'Layanan', icon: <ClipboardList className="h-4 w-4" /> },
  { href: '/admin/rooms', label: 'Ruang', icon: <DoorOpen className="h-4 w-4" /> },
  { href: '/admin/clients', label: 'Klien', icon: <UserSquare className="h-4 w-4" /> },
  { href: '/admin/users-roles', label: 'Users & Roles', icon: <Users className="h-4 w-4" /> },
  { href: '/admin/notif-wa', label: 'Notifikasi WA', icon: <MessageSquare className="h-4 w-4" /> },
  { href: '/admin/audit-log', label: 'Audit Log', icon: <BarChart3 className="h-4 w-4" /> },
  { href: '/admin/pengaturan', label: 'Pengaturan', icon: <Settings className="h-4 w-4" /> },
];

const PSIKOLOG_NAV: NavItem[] = [
  { href: '/psikolog/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: '/psikolog/schedule', label: 'Jadwal Saya', icon: <CalendarDays className="h-4 w-4" /> },
  { href: '/psikolog/sessions', label: 'Sesi', icon: <ClipboardList className="h-4 w-4" /> },
  { href: '/psikolog/patients', label: 'Pasien', icon: <UserSquare className="h-4 w-4" /> },
];

const OWNER_NAV: NavItem[] = [
  { href: '/owner/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
];
const RESEPSIONIS_NAV: NavItem[] = [
  { href: '/resepsionis/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
];
const MARKETING_NAV: NavItem[] = [
  { href: '/marketing/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
];
const INTERN_NAV: NavItem[] = [
  { href: '/intern/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
];

export type ShellRole = 'admin' | 'psikolog' | 'owner' | 'resepsionis' | 'marketing' | 'intern';

const NAV_BY_ROLE: Record<ShellRole, NavItem[]> = {
  admin: ADMIN_NAV,
  psikolog: PSIKOLOG_NAV,
  owner: OWNER_NAV,
  resepsionis: RESEPSIONIS_NAV,
  marketing: MARKETING_NAV,
  intern: INTERN_NAV,
};

const ROLE_BADGE: Record<ShellRole, string> = {
  admin: 'Admin',
  psikolog: 'Psikolog',
  owner: 'Owner',
  resepsionis: 'Resepsionis',
  marketing: 'Marketing',
  intern: 'Intern',
};

function logout() {
  document.cookie = `${TOKEN_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
  window.location.href = '/login';
}

export function AdminShell({
  role,
  children,
}: {
  role: ShellRole;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = NAV_BY_ROLE[role];

  function isActive(href: string): boolean {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar — desktop persistent, mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card flex flex-col transition-transform lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2">
            <span className="brand-mark text-xl text-teal-800">Althea</span>
            <span className="badge badge-sage">{ROLE_BADGE[role]}</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden btn btn-ghost btn-icon"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="space-y-0.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={logout}
            className="nav-item w-full justify-start"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Mobile topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="btn btn-ghost btn-icon"
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="brand-mark text-lg text-teal-800">Althea</span>
          <span className="badge badge-sage ml-auto">{ROLE_BADGE[role]}</span>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
