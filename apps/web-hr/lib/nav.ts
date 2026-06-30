// Senti HR navigation model — drives the app-shell sidebar.
// `status: 'live'` screens consume real /api/hr endpoints; `status: 'soon'`
// are jibble-roadmap stubs (see db-design/module-roadmap.md).
import type { LucideIcon } from 'lucide-react';
import {
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
