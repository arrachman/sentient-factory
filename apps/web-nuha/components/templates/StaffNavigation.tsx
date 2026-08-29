'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IkonMenu } from '@/components/atoms/IkonMenu';

type Menu = { key: string; label: string; icon: string | null };

const HREF_BY_KEY: Record<string, string> = {
  dashboard: '/', induk: '/induk', pesantren: '/kepesantrenan', poskestren: '/poskestren', keuangan: '/keuangan', akademik: '/akademik', kurikulum: '/kurikulum', ujian: '/ujian', lms: '/lms', gaji: '/penggajian', wa: '/notifikasi', kunjungan: '/kunjungan-wali', ppdb: '/ppdb-panitia', laporan: '/laporan', pengaturan: '/pengaturan', kepegawaian: '/kepegawaian', data: '/data',
};

const TITLE_BY_PATH: Record<string, string> = {
  '/': 'Dashboard Yayasan', '/induk': 'Data Induk Santri', '/kepesantrenan': 'Kepesantrenan', '/poskestren': 'Poskestren', '/keuangan': 'Keuangan', '/akademik': 'Akademik', '/kurikulum': 'Kurikulum', '/ujian': 'Ujian', '/lms': 'LMS & Kompetensi', '/penggajian': 'Penggajian', '/notifikasi': 'Notifikasi WhatsApp', '/kunjungan-wali': 'Kunjungan Wali', '/ppdb-panitia': 'PPDB 2026/2027 — Sisi Panitia', '/laporan': 'Laporan Rekap Bulanan', '/pengaturan': 'Pengaturan', '/kepegawaian': 'Kepegawaian', '/data': 'Kelola Data',
};

export function StaffNavigation({ menus }: { menus: Menu[] }) {
  const pathname = usePathname();
  return <nav className="menu">{menus.map((menu) => <Link key={menu.key} href={HREF_BY_KEY[menu.key]} className={`menuitem ${HREF_BY_KEY[menu.key] === pathname || (menu.key === 'data' && pathname.startsWith('/data/')) ? 'active' : ''}`}><IkonMenu menuKey={menu.key} path={menu.icon} /><span className="menulabel">{menu.label}</span></Link>)}</nav>;
}

export function StaffTitle() {
  const pathname = usePathname();
  const title = pathname.startsWith('/data/') ? 'Kelola Data' : (TITLE_BY_PATH[pathname] ?? 'SIMTERPADU');
  return <h2 className="judul">{title}</h2>;
}
