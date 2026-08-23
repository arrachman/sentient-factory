import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { isSuperAdmin, type SessionPayload } from '@/lib/auth';
import { LogoutButton } from '@/components/LogoutButton';
import { PemilihPeran } from '@/components/PemilihPeran';
import { inisial } from '@/components/ui/primitives';

const HREF_BY_KEY: Record<string, string> = {
  dashboard: '/',
  induk: '/induk',
  pesantren: '/kepesantrenan',
  poskestren: '/poskestren',
  keuangan: '/keuangan',
  akademik: '/akademik',
  kurikulum: '/kurikulum',
  ujian: '/ujian',
  lms: '/lms',
  gaji: '/penggajian',
  wa: '/notifikasi',
  kunjungan: '/kunjungan-wali',
  ppdb: '/ppdb-panitia',
  laporan: '/laporan',
  pengaturan: '/pengaturan',
  'portal-santri': '/portal/santri',
  'portal-wali': '/portal/wali',
  data: '/data',
};

// Warna stroke ikon per menu — menCol di prototype.
const WARNA_IKON: Record<string, string> = {
  dashboard: '#F2B770', induk: '#93C5FD', akademik: '#86EFAC', kurikulum: '#FDBA74', ujian: '#FCD34D',
  pesantren: '#C4B5FD', poskestren: '#FCA5A5', keuangan: '#6EE7B7', gaji: '#FDE047',
  lms: '#7DD3FC', wa: '#4ADE80', kunjungan: '#F9A8D4', ppdb: '#A5B4FC',
  laporan: '#67E8F9', pengaturan: '#D6D3D1', data: '#D6D3D1',
  'portal-santri': '#7DD3FC', 'portal-wali': '#F9A8D4',
};

const IKON_CADANGAN = 'M4 6h16v12H4z';

export async function Shell({ session, active, title, children }: { session: SessionPayload; active: string; title: string; children: React.ReactNode }) {
  const [menus, agenda] = await Promise.all([
    prisma.menu.findMany({
      where: { akses: { some: { peran: { key: { in: session.peran } } } } },
      orderBy: { urutan: 'asc' },
    }),
    prisma.agenda.findMany({ orderBy: { tgl: 'asc' }, take: 6 }),
  ]);
  const visible = menus.filter((menu) => HREF_BY_KEY[menu.key]);
  const peranUtama = session.peran[0] ?? 'pengguna';
  const menyamar = Boolean(session.peranAsli);

  const ticker = agenda.map((a) => {
    const tgl = a.tgl.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    return `${tgl} · ${a.judul}${a.unit ? ` — ${a.unit}` : ''}`;
  });

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidehead">
          <span className="tile">
            <Image src="/assets/logo-nuha.webp" alt="" width={34} height={34} />
          </span>
          <span style={{ minWidth: 0 }}>
            <span className="nama" style={{ display: 'block' }}>SIMTERPADU</span>
            <span className="sub" style={{ display: 'block' }}>NURUL HUDA MERGOSONO</span>
          </span>
        </div>

        <nav className="menu">
          {visible.map((menu) => (
            <Link key={menu.key} href={HREF_BY_KEY[menu.key]} className={`menuitem ${menu.key === active ? 'active' : ''}`}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={WARNA_IKON[menu.key] ?? '#D6D3D1'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={menu.icon || IKON_CADANGAN} />
              </svg>
              <span className="menulabel">{menu.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidefoot">
          <div className="userchip">
            <span className="ava">{inisial(session.nama)}</span>
            <span style={{ minWidth: 0 }}>
              <span className="nm" style={{ display: 'block' }}>{session.nama}</span>
              <span className="rl" style={{ display: 'block' }}>{peranUtama}</span>
            </span>
          </div>
          <Link href="/docs" className="btn-ghost-terang" style={{ display: 'block', textAlign: 'center', color: '#f3f1e9' }}>
            Panduan
          </Link>
          <LogoutButton />
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div style={{ flex: 1, minWidth: 180 }}>
            <h2 className="judul">{title}</h2>
            {ticker.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span className="pill-agenda">Agenda</span>
                <div className="mq">
                  <div className="mqtrack">
                    {[...ticker, ...ticker].map((teks, i) => (
                      <span key={i} style={{ fontSize: 12, color: 'var(--teks-lembut)' }}>{teks}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {isSuperAdmin(session) && <PemilihPeran session={session} />}
          <p className="muted" style={{ margin: 0 }}>Tahun Ajaran 2026/2027 · Semester Gasal</p>
        </header>
        <div className="pad">
          {menyamar && (
            <div className="alert alert-peringatan" style={{ marginBottom: 14 }}>
              Mode debug: Anda melihat aplikasi sebagai <b>{peranUtama}</b>. Data dan menu mengikuti peran itu — pilih
              &ldquo;Super admin&rdquo; di kanan atas untuk kembali.
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
