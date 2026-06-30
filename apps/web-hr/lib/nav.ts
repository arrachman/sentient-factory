// Senti HR navigation model — drives the app-shell sidebar.
// `status: 'live'` screens consume real /api/hr endpoints; `status: 'soon'`
// are jibble-roadmap stubs (see db-design/module-roadmap.md).
import type { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import {
  Square,
  LayoutDashboard,
  History,
  ClipboardCheck,
  MapPin,
  ScanFace,
  Users,
  ShieldCheck,
  Fingerprint,
  CalendarClock,
  CalendarDays,
  CalendarX,
  Plane,
  FolderKanban,
  BarChart3,
  MonitorSmartphone,
  Timer,
  Settings,
} from 'lucide-react';

export type NavStatus = 'live' | 'soon';

export interface HrNavItem {
  key: string;
  title: string;
  path: string;
  icon: LucideIcon;
  status: NavStatus;
}

export interface HrNavGroup {
  key: string;
  title: string;
  items: HrNavItem[];
}

export const HR_NAV: HrNavGroup[] = [
  {
    key: 'attendance',
    title: 'Kehadiran',
    items: [
      { key: 'dashboard', title: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard, status: 'live' },
      { key: 'attendance', title: 'Absensi Saya', path: '/app/attendance', icon: Fingerprint, status: 'live' },
      { key: 'history', title: 'Riwayat Absensi', path: '/app/attendance-history', icon: History, status: 'live' },
      { key: 'reviews', title: 'Tinjauan Absensi', path: '/app/attendance-reviews', icon: ClipboardCheck, status: 'live' },
      { key: 'worksites', title: 'Lokasi & Geofence', path: '/app/worksites', icon: MapPin, status: 'live' },
      { key: 'face', title: 'Pendaftaran Wajah', path: '/app/face-enrollments', icon: ScanFace, status: 'live' },
      { key: 'employees', title: 'Karyawan', path: '/app/employees', icon: Users, status: 'live' },
      { key: 'roles', title: 'Akses & Peran', path: '/app/roles', icon: ShieldCheck, status: 'live' },
    ],
  },
  {
    key: 'workforce',
    title: 'Manajemen Tenaga Kerja',
    items: [
      { key: 'timesheets', title: 'Timesheet', path: '/app/timesheets', icon: CalendarClock, status: 'live' },
      { key: 'schedules', title: 'Jadwal & Shift', path: '/app/schedules', icon: CalendarDays, status: 'live' },
      { key: 'leave', title: 'Cuti', path: '/app/leave', icon: Plane, status: 'live' },
      { key: 'holidays', title: 'Kalender Libur', path: '/app/holidays', icon: CalendarX, status: 'live' },
      { key: 'projects', title: 'Proyek & Aktivitas', path: '/app/projects', icon: FolderKanban, status: 'live' },
    ],
  },
  {
    key: 'insight',
    title: 'Laporan & Lainnya',
    items: [
      { key: 'reports', title: 'Laporan', path: '/app/reports', icon: BarChart3, status: 'live' },
      { key: 'kiosk', title: 'Mode Kiosk', path: '/app/kiosk', icon: MonitorSmartphone, status: 'live' },
      { key: 'overtime', title: 'Aturan Lembur', path: '/app/overtime', icon: Timer, status: 'live' },
      { key: 'settings', title: 'Pengaturan', path: '/app/settings', icon: Settings, status: 'live' },
    ],
  },
];

export const HR_NAV_FLAT: HrNavItem[] = HR_NAV.flatMap((g) => g.items);

// ── Shell routing helpers ───────────────────────────────────────────────────
// The catch-all shell lives under `/app`. Sidebar `HR_NAV` paths are stored
// fully (`/app/dashboard`) so the static nav doubles as a fallback; the dynamic
// menu endpoint stores canonical paths WITHOUT the base (`/dashboard`).

export const APP_BASE = '/app';

/** Prepend the `/app` base to a canonical menu path, idempotently. */
export function toAppPath(canonical: string): string {
  const p = canonical.startsWith('/') ? canonical : `/${canonical}`;
  return p.startsWith(`${APP_BASE}/`) || p === APP_BASE ? p : `${APP_BASE}${p}`;
}

/** Strip the `/app` base, yielding the canonical route id (leading slash kept). */
export function stripApp(pathname: string): string {
  if (pathname === APP_BASE) return '/';
  return pathname.startsWith(`${APP_BASE}/`)
    ? pathname.slice(APP_BASE.length)
    : pathname;
}

/** Resolve a lucide icon name (from `hr_menus.icon`) to a component. */
export function resolveIcon(name?: string | null): LucideIcon {
  if (name && name in LucideIcons) {
    const candidate = (LucideIcons as Record<string, unknown>)[name];
    if (typeof candidate === 'function' || typeof candidate === 'object') {
      return candidate as LucideIcon;
    }
  }
  return Square;
}

export interface PageMeta {
  title: string;
  Icon: LucideIcon;
}

/** Title + icon for a tab/breadcrumb, derived from the static nav. Detail
 *  sub-routes (`/app/attendance-reviews/:id`) fall back to their parent item;
 *  unknown routes get a humanised last segment. */
export function pageMetaFor(pathname: string): PageMeta {
  const exact = HR_NAV_FLAT.find((i) => i.path === pathname);
  if (exact) return { title: exact.title, Icon: exact.icon };

  const parent = HR_NAV_FLAT.find((i) => pathname.startsWith(`${i.path}/`));
  if (parent) return { title: parent.title, Icon: parent.icon };

  const seg = pathname.split('/').filter(Boolean).pop() ?? 'home';
  const title = seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return { title, Icon: Square };
}
