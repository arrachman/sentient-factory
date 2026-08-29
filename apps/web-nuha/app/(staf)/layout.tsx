import { redirect } from 'next/navigation';
import { readSession, isSuperAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { StaffShell } from '@/components/templates/StaffShell';

export default async function StafLayout({ children }: { children: React.ReactNode }) {
  const session = await readSession();
  if (!session) redirect('/beranda');

  const [menus, agenda] = await Promise.all([
    prisma.menu.findMany({
      where: { akses: { some: { peran: { key: { in: session.peran } } } } },
      orderBy: { urutan: 'asc' },
    }),
    prisma.agenda.findMany({ orderBy: { tgl: 'asc' }, take: 6 }),
  ]);

  const MENU_DISEMBUNYIKAN = new Set([
    'kurikulum', 'poskestren', 'keuangan', 'lms', 'gaji', 'ujian',
    'kunjungan', 'ppdb', 'laporan',
  ]);
  const HREF_KNOWN = new Set([
    'dashboard', 'induk', 'pesantren', 'poskestren', 'keuangan', 'akademik', 'kurikulum', 'ujian',
    'lms', 'gaji', 'wa', 'kunjungan', 'ppdb', 'laporan', 'pengaturan', 'kepegawaian', 'data',
  ]);
  const visible = menus
    .filter((menu) => HREF_KNOWN.has(menu.key) && !MENU_DISEMBUNYIKAN.has(menu.key))
    .map((menu) => ({ key: menu.key, label: menu.label, icon: menu.icon }));

  const ticker = agenda.map((a) => {
    const tgl = a.tgl.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    return `${tgl} · ${a.judul}${a.unit ? ` — ${a.unit}` : ''}`;
  });

  return (
    <StaffShell
      session={session}
      menus={visible}
      ticker={ticker}
      showRolePicker={isSuperAdmin(session)}
    >
      {children}
    </StaffShell>
  );
}
