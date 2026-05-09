'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';
import {
  Bell,
  CalendarDays,
  ClipboardList,
  Clock,
  DoorOpen,
  FileText,
  List,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  Stethoscope,
  UserSquare,
  Users,
  X,
} from 'lucide-react';
import { TOKEN_COOKIE } from '@/shared/auth/constants';
import { useMe } from '@/features/auth/hooks/use-me';

type NavItem = {
  href: string;
  label: string; // sidebar label (mis. "Notifikasi WA")
  icon: ReactNode;
  badge?: string; // mis. "aktif"
  /**
   * Override page title di top header. Defaults ke `label`.
   * Contoh: menu "Notifikasi WA" → top title "WhatsApp Otomatis".
   */
  pageTitle?: string;
};

type NavGroup = {
  category: string;
  items: NavItem[];
};

// ============================================================================
// Admin nav — 3 categories matching psychology-design mockup
// ============================================================================
const ADMIN_NAV: NavGroup[] = [
  {
    category: 'Operasional',
    items: [
      {
        href: '/admin/schedule',
        label: 'Penjadwalan',
        icon: <CalendarDays className="h-4 w-4" />,
        pageTitle: 'Jadwal Sesi',
      },
      {
        href: '/admin/clients',
        label: 'Klien',
        icon: <UserSquare className="h-4 w-4" />,
        pageTitle: 'Daftar Klien',
      },
      {
        href: '/admin/rooms',
        label: 'Ruangan',
        icon: <DoorOpen className="h-4 w-4" />,
        pageTitle: 'Timeline Ruangan',
      },
    ],
  },
  {
    category: 'Manajemen',
    items: [
      {
        href: '/admin/psikolog',
        label: 'Psikolog',
        icon: <Stethoscope className="h-4 w-4" />,
        pageTitle: 'Tim Psikolog',
      },
      {
        href: '/admin/layanan',
        label: 'Layanan',
        icon: <List className="h-4 w-4" />,
        pageTitle: 'Katalog Layanan',
      },
      {
        href: '/admin/notif-wa',
        label: 'Notifikasi WA',
        icon: <MessageSquare className="h-4 w-4" />,
        badge: 'aktif',
        pageTitle: 'WhatsApp Otomatis',
      },
    ],
  },
  {
    category: 'Sistem',
    items: [
      {
        href: '/admin/booking',
        label: 'Daftar booking',
        icon: <FileText className="h-4 w-4" />,
        pageTitle: 'Daftar Booking',
      },
      {
        href: '/admin/audit-log',
        label: 'Audit log',
        icon: <Clock className="h-4 w-4" />,
        pageTitle: 'Audit Log',
      },
      {
        href: '/admin/users-roles',
        label: 'User & Role',
        icon: <Users className="h-4 w-4" />,
        pageTitle: 'Pengelolaan User & Role',
      },
      {
        href: '/admin/pengaturan',
        label: 'Pengaturan',
        icon: <Settings className="h-4 w-4" />,
        pageTitle: 'Pengaturan Klinik',
      },
    ],
  },
];

// Other roles — flat list (single section)
const PSIKOLOG_NAV: NavGroup[] = [
  {
    category: 'Praktik',
    items: [
      { href: '/psikolog/dashboard', label: 'Dashboard', icon: <ClipboardList className="h-4 w-4" /> },
      { href: '/psikolog/schedule', label: 'Jadwal Saya', icon: <CalendarDays className="h-4 w-4" /> },
      { href: '/psikolog/sessions', label: 'Sesi', icon: <ClipboardList className="h-4 w-4" /> },
      { href: '/psikolog/patients', label: 'Pasien', icon: <UserSquare className="h-4 w-4" /> },
    ],
  },
];

const SINGLE_DASHBOARD_NAV = (basePath: string): NavGroup[] => [
  {
    category: 'Utama',
    items: [
      { href: `${basePath}/dashboard`, label: 'Dashboard', icon: <ClipboardList className="h-4 w-4" /> },
    ],
  },
];

export type ShellRole = 'admin' | 'psikolog' | 'owner' | 'resepsionis' | 'marketing' | 'intern';

const NAV_BY_ROLE: Record<ShellRole, NavGroup[]> = {
  admin: ADMIN_NAV,
  psikolog: PSIKOLOG_NAV,
  owner: SINGLE_DASHBOARD_NAV('/owner'),
  resepsionis: SINGLE_DASHBOARD_NAV('/resepsionis'),
  marketing: SINGLE_DASHBOARD_NAV('/marketing'),
  intern: SINGLE_DASHBOARD_NAV('/intern'),
};

const ROLE_LABEL: Record<ShellRole, { full: string; short: string }> = {
  admin: { full: 'ADMIN · KLINIK', short: 'Admin' },
  psikolog: { full: 'PSIKOLOG', short: 'Psikolog' },
  owner: { full: 'OWNER · KLINIK', short: 'Owner' },
  resepsionis: { full: 'RESEPSIONIS', short: 'Resepsionis' },
  marketing: { full: 'MARKETING', short: 'Marketing' },
  intern: { full: 'INTERN', short: 'Intern' },
};

function logout() {
  document.cookie = `${TOKEN_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
  window.location.href = '/login';
}

function userInitial(name: string | null | undefined, fallback: string): string {
  const n = (name ?? '').trim() || fallback;
  return n.charAt(0).toUpperCase();
}

/**
 * Resolve breadcrumb + page title dari pathname + nav config.
 * Mis. /admin/notif-wa → { category: 'Manajemen', label: 'Notifikasi WA',
 *                          title: 'WhatsApp Otomatis' }
 */
function resolvePageMeta(
  pathname: string,
  nav: NavGroup[],
): { category: string; label: string; title: string } | null {
  for (const group of nav) {
    for (const item of group.items) {
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        return {
          category: group.category,
          label: item.label,
          title: item.pageTitle ?? item.label,
        };
      }
    }
  }
  return null;
}

export function AdminShell({ role, children }: { role: ShellRole; children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = NAV_BY_ROLE[role];
  const meQuery = useMe();
  const me = meQuery.data?.data;
  const meta = resolvePageMeta(pathname, nav);

  function isActive(href: string): boolean {
    return pathname === href || pathname.startsWith(`${href}/`);
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
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card flex flex-col transition-transform lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header — A square + Althea + PSYCHOLOGY */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b border-border"
          style={{ minHeight: 64 }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'var(--sage-500)',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                fontFamily: 'var(--font-serif)',
                fontWeight: 600,
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              A
            </div>
            <div className="flex flex-col leading-tight">
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 18,
                  fontWeight: 600,
                  color: 'var(--teal-800)',
                }}
              >
                Althea
              </span>
              <span
                className="caption"
                style={{
                  fontSize: 9.5,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginTop: 1,
                }}
              >
                Psychology
              </span>
            </div>
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

        {/* Role pill — green dot + ADMIN · KLINIK */}
        <div className="px-3 pt-3">
          <div
            className="flex items-center gap-2"
            style={{
              padding: '8px 12px',
              border: '1px solid var(--sage-200)',
              borderRadius: 8,
              background: 'var(--sage-50)',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: 999,
                background: 'var(--sage-500)',
                boxShadow: '0 0 0 3px rgba(91,138,102,0.18)',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: 'var(--teal-800)',
              }}
            >
              {ROLE_LABEL[role].full}
            </span>
          </div>
        </div>

        {/* Nav — grouped sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {nav.map((group) => (
            <div key={group.category} className="mb-4">
              <div
                className="eyebrow"
                style={{
                  padding: '6px 10px 4px',
                  fontSize: 10.5,
                  letterSpacing: '0.12em',
                }}
              >
                {group.category}
              </div>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                      style={{ justifyContent: 'flex-start' }}
                    >
                      {item.icon}
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {item.badge && (
                        <span
                          className="badge badge-success"
                          style={{ fontSize: 9.5, height: 16, padding: '0 6px' }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer — user avatar + name + logout */}
        <div className="border-t border-border p-3">
          <div
            className="flex items-center gap-3"
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              background: 'var(--cream-100)',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                background: 'var(--cream-300)',
                color: 'var(--teal-800)',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 700,
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              {initial}
            </div>
            <div className="flex flex-col leading-tight" style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--teal-800)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={userName}
              >
                {userName}
              </span>
              <span className="caption" style={{ fontSize: 11, marginTop: 1 }}>
                {userRole}
              </span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="btn btn-ghost btn-icon"
              aria-label="Logout"
              title="Logout"
              style={{ flexShrink: 0 }}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-black/40 lg:hidden" />
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
          <span className="badge badge-sage ml-auto">{ROLE_LABEL[role].short}</span>
        </header>

        {/* Desktop top header — breadcrumb + title + search + bell + avatar */}
        <header
          className="hidden lg:flex sticky top-0 z-20 items-center justify-between border-b border-border bg-card"
          style={{ height: 64, padding: '0 28px' }}
        >
          <div className="flex flex-col leading-tight">
            {meta && (
              <span className="caption" style={{ fontSize: 12 }}>
                {meta.category} · {meta.label}
              </span>
            )}
            <h1
              style={{
                margin: 0,
                fontFamily: 'var(--font-serif)',
                fontSize: 22,
                fontWeight: 500,
                color: 'var(--teal-800)',
                letterSpacing: '-0.01em',
              }}
            >
              {meta?.title ?? 'Althea Psychology'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div style={{ position: 'relative', width: 240 }}>
              <span style={{ position: 'absolute', left: 11, top: 10 }}>
                <Search size={15} style={{ color: 'var(--fg-muted)' }} />
              </span>
              <input
                className="input-althea"
                placeholder={searchPlaceholder}
                style={{ paddingLeft: 34, height: 36, fontSize: 13 }}
                aria-label="Cari"
              />
            </div>
            <button
              type="button"
              className="btn btn-icon btn-ghost"
              aria-label="Notifikasi"
              title="Notifikasi"
            >
              <Bell size={17} />
            </button>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                background: 'var(--cream-300)',
                color: 'var(--teal-800)',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 700,
                fontSize: 14,
                flexShrink: 0,
              }}
              title={userName}
              aria-label={`Akun: ${userName}`}
            >
              {initial}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
