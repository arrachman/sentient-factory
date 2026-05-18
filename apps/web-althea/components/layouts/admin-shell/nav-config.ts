/**
 * Navigation config per role + role pill style.
 *
 * - Admin: 3 groups (Operasional / Manajemen / Sistem)
 * - Psikolog: 3 groups (Praktik / Klinis / Akun) — privacy BR-04: hanya
 *   data sendiri, tidak ada Tim/Kelola
 * - Owner / Resepsionis / Marketing / Intern: single Dashboard
 */
import type { ReactNode } from 'react';
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  Clock,
  DoorOpen,
  FileText,
  Notebook,
  Home,
  List,
  MessageSquare,
  Settings,
  Stethoscope,
  UserCircle2,
  UserSquare,
  Users,
} from 'lucide-react';
import { createElement } from 'react';

export type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: string;
  pageTitle?: string;
};

export type NavGroup = {
  category: string;
  items: NavItem[];
};

const ICON_CLASS = 'h-4 w-4';

const ADMIN_NAV: NavGroup[] = [
  {
    category: 'Operasional',
    items: [
      {
        href: '/admin/jadwal',
        label: 'Jadwal',
        icon: createElement(CalendarDays, { className: ICON_CLASS }),
        pageTitle: 'Jadwal Sesi',
      },
      {
        href: '/admin/clients',
        label: 'Klien',
        icon: createElement(UserSquare, { className: ICON_CLASS }),
        pageTitle: 'Daftar Klien',
      },
      {
        href: '/admin/rooms',
        label: 'Ruangan',
        icon: createElement(DoorOpen, { className: ICON_CLASS }),
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
        icon: createElement(Stethoscope, { className: ICON_CLASS }),
        pageTitle: 'Tim Psikolog',
      },
      {
        href: '/admin/layanan',
        label: 'Layanan',
        icon: createElement(List, { className: ICON_CLASS }),
        pageTitle: 'Katalog Layanan',
      },
      {
        href: '/admin/notif-wa',
        label: 'Notifikasi WA',
        icon: createElement(MessageSquare, { className: ICON_CLASS }),
        badge: 'aktif',
        pageTitle: 'WhatsApp Otomatis',
      },
    ],
  },
  {
    category: 'Sistem',
    items: [
      {
        href: '/admin/daftar-jadwal',
        label: 'Daftar Jadwal',
        icon: createElement(FileText, { className: ICON_CLASS }),
        pageTitle: 'Daftar Jadwal',
      },
      {
        href: '/admin/audit-log',
        label: 'Audit log',
        icon: createElement(Clock, { className: ICON_CLASS }),
        pageTitle: 'Audit Log',
      },
      {
        href: '/admin/users-roles',
        label: 'User & Role',
        icon: createElement(Users, { className: ICON_CLASS }),
        pageTitle: 'Pengelolaan User & Role',
      },
      {
        href: '/admin/pengaturan',
        label: 'Pengaturan',
        icon: createElement(Settings, { className: ICON_CLASS }),
        pageTitle: 'Pengaturan Klinik',
      },
    ],
  },
];

const PSIKOLOG_NAV: NavGroup[] = [
  {
    category: 'Praktik',
    items: [
      {
        href: '/psikolog/dashboard',
        label: 'Dashboard',
        icon: createElement(Home, { className: ICON_CLASS }),
      },
      {
        href: '/psikolog/schedule',
        label: 'Jadwal saya',
        icon: createElement(CalendarDays, { className: ICON_CLASS }),
        pageTitle: 'Jadwal saya · Minggu ini',
      },
      {
        href: '/psikolog/patients',
        label: 'Klien saya',
        icon: createElement(UserSquare, { className: ICON_CLASS }),
      },
    ],
  },
  {
    category: 'Klinis',
    items: [
      {
        href: '/psikolog/sessions',
        label: 'Catatan klinis',
        icon: createElement(Notebook, { className: ICON_CLASS }),
        pageTitle: 'Catatan klinis (SOAP)',
      },
      {
        href: '/psikolog/rooms',
        label: 'Ruangan',
        icon: createElement(DoorOpen, { className: ICON_CLASS }),
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
        icon: createElement(UserCircle2, { className: ICON_CLASS }),
      },
    ],
  },
];

const singleDashboardNav = (basePath: string): NavGroup[] => [
  {
    category: 'Utama',
    items: [
      {
        href: `${basePath}/dashboard`,
        label: 'Dashboard',
        icon: createElement(ClipboardList, { className: ICON_CLASS }),
      },
    ],
  },
];

export type ShellRole =
  | 'admin'
  | 'psikolog'
  | 'owner'
  | 'resepsionis'
  | 'marketing'
  | 'intern';

const RESEPSIONIS_NAV: NavGroup[] = [
  {
    category: 'Utama',
    items: [
      {
        href: '/resepsionis/dashboard',
        label: 'Dashboard',
        icon: createElement(ClipboardList, { className: ICON_CLASS }),
      },
      {
        href: '/resepsionis/daftar-jadwal',
        label: 'Daftar Jadwal',
        icon: createElement(FileText, { className: ICON_CLASS }),
        pageTitle: 'Daftar Jadwal',
      },
      {
        href: '/resepsionis/clients',
        label: 'Klien',
        icon: createElement(UserSquare, { className: ICON_CLASS }),
        pageTitle: 'Daftar Klien',
      },
    ],
  },
];

const OWNER_NAV: NavGroup[] = [
  {
    category: 'Utama',
    items: [
      {
        href: '/owner/dashboard',
        label: 'Dashboard',
        icon: createElement(Home, { className: ICON_CLASS }),
        pageTitle: 'Snapshot Klinik · Hari Ini',
      },
      {
        href: '/owner/analitik',
        label: 'Analitik',
        icon: createElement(BarChart3, { className: ICON_CLASS }),
        pageTitle: 'Analitik & Performa Klinik',
      },
      {
        href: '/owner/jadwal',
        label: 'Jadwal Psikolog',
        icon: createElement(CalendarDays, { className: ICON_CLASS }),
        pageTitle: 'Grid Penjadwalan · Psikolog × Slot',
      },
      {
        href: '/owner/ruangan',
        label: 'Pemakaian Ruangan',
        icon: createElement(DoorOpen, { className: ICON_CLASS }),
        pageTitle: 'Pemakaian Ruangan · Slot × Ruangan',
      },
    ],
  },
];

export const NAV_BY_ROLE: Record<ShellRole, NavGroup[]> = {
  admin: ADMIN_NAV,
  psikolog: PSIKOLOG_NAV,
  owner: OWNER_NAV,
  resepsionis: RESEPSIONIS_NAV,
  marketing: singleDashboardNav('/marketing'),
  intern: singleDashboardNav('/intern'),
};

export type RolePillStyle = {
  full: string;
  short: string;
  bg: string;
  border: string;
  dot: string;
};

export const ROLE_LABEL: Record<ShellRole, RolePillStyle> = {
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
