import Link from 'next/link';
import { requirePage } from '@/lib/access';
import { prisma } from '@/lib/prisma';
import { Shell } from '@/components/templates/Shell';
import { JudulHalaman, Kosong, type TabDef } from '@/components';
import { DaftarSantri } from './DaftarSantri';
import { HeaderSantri } from './HeaderSantri';
import { TabBiodata } from './TabBiodata';
import { TabAkademik } from './TabAkademik';
import { TabKepesantrenan } from './TabKepesantrenan';
import { TabKesehatan } from './TabKesehatan';
import { TabKeuangan } from './TabKeuangan';
import { TabWali } from './TabWali';

const TABS: TabDef[] = [
  { key: 'biodata', label: 'Biodata' },
  { key: 'akademik', label: 'Akademik' },
  { key: 'pesantren', label: 'Kepesantrenan' },
  { key: 'kesehatan', label: 'Kesehatan' },
  { key: 'keuangan', label: 'Keuangan' },
  { key: 'wali', label: 'Wali & Keluarga' },
];

/** Data Induk — master-detail: daftar santri di kiri, profil lintas modul di kanan.
 * Seleksi & tab dibawa lewat query (`?sel=&tab=`), bukan state klien, supaya bisa dibookmark. */
export default async function IndukPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await requirePage('induk');
  const sp = await searchParams;
  const ambil = (k: string) => { const v = sp[k]; return Array.isArray(v) ? v[0] : v; };
  const q = ambil('q') ?? '';
  const tabRaw = ambil('tab');
  const tabAktif = TABS.some((t) => t.key === tabRaw) ? (tabRaw as string) : TABS[0].key;

  const daftar = await prisma.santri.findMany({
    where: q ? { orang: { nama: { contains: q } } } : undefined,
    include: { orang: true, unit: true, kelas: true },
    orderBy: { orang: { nama: 'asc' } },
  });

  const selRaw = ambil('sel');
  const selId = daftar.some((s) => String(s.id) === selRaw) ? BigInt(selRaw as string) : daftar[0]?.id;

  const sel = selId
    ? await prisma.santri.findUnique({
      where: { id: selId },
      include: { orang: true, unit: true },
    })
    : null;

  return (
    <Shell session={session} active="induk" title="Data Induk Santri">
      <JudulHalaman
        judul="Data Induk Santri & Siswa"
        sub="Satu identitas, banyak peran — data akademik, kepesantrenan, kesehatan, dan keuangan menyatu di satu profil."
      />
      <div className="grid" style={{ gridTemplateColumns: '290px 1fr', alignItems: 'start' }}>
        <DaftarSantri daftar={daftar} q={q} selId={selId} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          {sel ? (
            <>
              <HeaderSantri sel={sel} />
              <nav className="tabbar">
                {TABS.map((t) => (
                  <Link
                    key={t.key}
                    href={`/induk?sel=${selId}${t.key === TABS[0].key ? '' : `&tab=${t.key}`}`}
                    className={`tab ${t.key === tabAktif ? 'active' : ''}`}
                  >
                    {t.label}
                  </Link>
                ))}
              </nav>
              <div className="card">
                {tabAktif === 'biodata' && <TabBiodata santriId={sel.id} />}
                {tabAktif === 'akademik' && <TabAkademik santriId={sel.id} />}
                {tabAktif === 'pesantren' && <TabKepesantrenan santriId={sel.id} />}
                {tabAktif === 'kesehatan' && <TabKesehatan santriId={sel.id} />}
                {tabAktif === 'keuangan' && <TabKeuangan santriId={sel.id} />}
                {tabAktif === 'wali' && <TabWali santriId={sel.id} />}
              </div>
            </>
          ) : <Kosong pesan="Belum ada santri yang terdaftar." />}
        </div>
      </div>
    </Shell>
  );
}
