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
  Home,
  List,
  LogOut,
  Menu,
  MessageSquare,
  Notebook,
  Search,
  Settings,
  Stethoscope,
  UserCircle2,
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
// PSIKOLOG_NAV — 3 groups (Praktik / Klinis / Akun) sesuai mockup AdminShell.jsx.
// Privacy: psikolog hanya melihat data sendiri (BR-04) — tidak ada Tim/Kelola.
const PSIKOLOG_NAV: NavGroup[] = [
  {
    category: 'Praktik',
    items: [
      {
        href: '/psikolog/dashboard',
        label: 'Dashboard',
        icon: <Home className="h-4 w-4" />,
      },
      {
        href: '/psikolog/schedule',
        label: 'Jadwal saya',
        icon: <CalendarDays className="h-4 w-4" />,
        pageTitle: 'Jadwal saya · Minggu ini',
      },
      {
        href: '/psikolog/patients',
        label: 'Klien saya',
        icon: <UserSquare className="h-4 w-4" />,
      },
    ],
  },
  {
    category: 'Klinis',
    items: [
      {
        href: '/psikolog/sessions',
        label: 'Catatan klinis',
        icon: <Notebook className="h-4 w-4" />,
        pageTitle: 'Catatan klinis (SOAP)',
      },
      {
        href: '/psikolog/rooms',
        label: 'Ruangan',
        icon: <DoorOpen className="h-4 w-4" />,
        pageTitle: 'Ruangan klinik',
      },
    ],
  },
  {
    category: 'Akun',
    items: [
      {
        href: '/psikolog/profile',
        label: 'Profil saya',
        icon: <UserCircle2 className="h-4 w-4" />,
      },
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

type RolePillStyle = {
  full: string;
  short: string;
  bg: string;
  border: string;
  dot: string;
};

const ROLE_LABEL: Record<ShellRole, RolePillStyle> = {
  admin: {
    full: 'ADMIN · KLINIK',
    short: 'Admin',
    bg: 'var(--sage-50)',
    border: 'var(--sage-200)',
    dot: 'var(--sage-500)',
  },
  psikolog: {
    full: 'STAFF PSIKOLOG',
    short: 'Psikolog',
    bg: 'var(--cream-100)',
    border: 'var(--border)',
    dot: 'var(--teal-700)',
  },
  owner: {
    full: 'OWNER · KLINIK',
    short: 'Owner',
    bg: 'var(--sage-50)',
    border: 'var(--sage-200)',
    dot: 'var(--sage-500)',
  },
  resepsionis: {
    full: 'RESEPSIONIS',
    short: 'Resepsionis',
    bg: 'var(--cream-100)',
    border: 'var(--border)',
    dot: 'var(--teal-700)',
  },
  marketing: {
    full: 'MARKETING',
    short: 'Marketing',
    bg: 'var(--cream-100)',
    border: 'var(--border)',
    dot: 'var(--teal-700)',
  },
  intern: {
    full: 'INTERN',
    short: 'Intern',
    bg: 'var(--cream-100)',
    border: 'var(--border)',
    dot: 'var(--teal-700)',
  },
};

/**
 * Logout: clear cookie sf_token (set client-side karena NPM bypass Route
 * Handler — lihat use-login.ts untuk konteks). Best-effort fire-and-forget
 * call ke /api/auth/logout untuk invalidate session di api-gateway, lalu
 * hard-navigate ke /login.
 */
async function performLogout() {
  // Fire-and-forget logout API (jangan block redirect kalau gagal)
  fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  }).catch(() => {
    /* ignore — yang penting cookie + redirect */
  });

  // Clear cookie client-side (NPM bypass Route Handler — lihat use-login.ts)
  if (typeof window !== 'undefined') {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${TOKEN_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax${secure}`;
  }
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
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  function confirmLogout() {
    setLoggingOut(true);
    performLogout();
  }
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

        {/* Role pill — color tint per role (sage untuk admin/owner, cream untuk psikolog/dll) */}
        <div className="px-3 pt-3">
          <div
            className="flex items-center gap-2"
            style={{
              padding: '8px 12px',
              border: '1px solid ' + ROLE_LABEL[role].border,
              borderRadius: 8,
              background: ROLE_LABEL[role].bg,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: 999,
                background: ROLE_LABEL[role].dot,
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
              onClick={() => setLogoutConfirmOpen(true)}
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

        {/* No padding di <main> — pages mengelola padding sendiri (sesuai mockup) */}
        <main className="flex-1">{children}</main>
      </div>

      {/* Logout confirmation modal */}
      {logoutConfirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-confirm-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !loggingOut) {
              setLogoutConfirmOpen(false);
            }
          }}
        >
          <div
            className="card-althea bg-card"
            style={{ width: '100%', maxWidth: 420 }}
          >
            <div
              className="flex items-start gap-3"
              style={{ padding: '20px 22px 4px' }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  background: 'var(--cream-100)',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                <LogOut size={18} style={{ color: 'var(--teal-800)' }} />
              </div>
              <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
                <h2
                  id="logout-confirm-title"
                  className="h2"
                  style={{ margin: 0, fontSize: 17 }}
                >
                  Keluar dari akun?
                </h2>
                <p className="caption" style={{ marginTop: 6, lineHeight: 1.5 }}>
                  Anda akan keluar dari sesi <strong>{userName}</strong> ({userRole}).
                  Data yang belum disimpan bisa hilang.
                </p>
              </div>
            </div>
            <div
              className="flex items-center justify-end gap-2"
              style={{ padding: '14px 22px 18px' }}
            >
              <button
                type="button"
                onClick={() => setLogoutConfirmOpen(false)}
                disabled={loggingOut}
                className="btn btn-outline btn-sm"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                disabled={loggingOut}
                className="btn btn-primary btn-sm"
                style={{
                  background: loggingOut ? undefined : 'var(--danger, #b54141)',
                  borderColor: loggingOut ? undefined : 'var(--danger, #b54141)',
                }}
              >
                <LogOut size={14} style={{ stroke: '#fff' }} />
                {loggingOut ? 'Keluar...' : 'Ya, keluar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
