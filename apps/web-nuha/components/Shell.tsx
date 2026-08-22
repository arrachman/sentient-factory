import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import type { SessionPayload } from '@/lib/auth';

const HREF_BY_KEY: Record<string, string> = {
  dashboard: '/',
  induk: '/induk',
  pesantren: '/kepesantrenan',
  poskestren: '/poskestren',
  keuangan: '/keuangan',
  ppdb: '/ppdb',
  gaji: '/penggajian',
  wa: '/notifikasi',
};

export async function Shell({ session, active, title, children }: { session: SessionPayload; active: string; title: string; children: React.ReactNode }) {
  const menus = await prisma.menu.findMany({
    where: { akses: { some: { peran: { key: { in: session.peran } } } } },
    orderBy: { urutan: 'asc' },
  });
  const visible = menus.filter((menu) => HREF_BY_KEY[menu.key]);

  return (
    <div className="shell">
      <aside className="sidebar">
        <h1>SIMTERPADU</h1>
        <p>Nurul Huda Mergosono</p>
        <nav>
          {visible.map((menu) => (
            <Link key={menu.key} href={HREF_BY_KEY[menu.key]} className={menu.key === active ? 'active' : ''}>
              {menu.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <h2 style={{ color: 'var(--hijau-tua)' }}>{title}</h2>
            <p className="muted">Tahun ajaran 2026/2027 · Semester Gasal</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{session.nama}</div>
            <div className="muted">{session.peran.join(', ')}</div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
