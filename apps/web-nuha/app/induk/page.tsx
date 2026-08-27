import Link from 'next/link';
import { requirePage } from '@/lib/access';
import { prisma } from '@/lib/prisma';
import { Shell } from '@/components/templates/Shell';
import { JudulHalaman, Kosong, type TabDef } from '@/components';
import { CrudPanel } from '@/components/CrudPanel';
import { getEntity } from '@/lib/crud/registry';
import { listRows, toClientEntity } from '@/lib/crud/engine';
import { BarisFilter } from './BarisFilter';
import { DaftarSantri } from './DaftarSantri';
import { PohonLembaga } from './PohonLembaga';
import { bacaFilter, hrefInduk, whereFilter } from './filter';
import { ambilAngkatan, ambilPohon } from './pohon';
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

/** Data Induk — penjelajah berjenjang (lembaga → tingkat → kelas) + penyaring,
 * lalu master-detail: daftar hasil di kiri, profil lintas modul di kanan.
 * Seluruh keadaan hidup di query (`?unit=&kelas=&status=&jk=&angkatan=&q=&sel=&tab=`)
 * supaya tiap tampilan bisa dibookmark dan dibagikan. */
export default async function IndukPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await requirePage('induk');
  const sp = await searchParams;
  const ambil = (k: string) => { const v = sp[k]; return Array.isArray(v) ? v[0] : v; };

  const f = bacaFilter(sp);
  const tabRaw = ambil('tab');
  const tabAktif = TABS.some((t) => t.key === tabRaw) ? (tabRaw as string) : TABS[0].key;

  const where = whereFilter(f);

  const entitasSantri = getEntity('santri')!;
  const [daftar, pohon, angkatan, barisCrud] = await Promise.all([
    prisma.santri.findMany({
      where,
      select: {
        id: true, nis: true, nisn: true, status: true,
        orang: { select: { nama: true } },
        kelas: { select: { nama: true } },
        unit: { select: { nama: true } },
      },
      orderBy: { orang: { nama: 'asc' } },
    }),
    ambilPohon(f),
    ambilAngkatan(),
    listRows(entitasSantri),
  ]);

  const selRaw = ambil('sel');
  const selId = daftar.some((s) => String(s.id) === selRaw) ? BigInt(selRaw as string) : daftar[0]?.id;

  const sel = selId
    ? await prisma.santri.findUnique({ where: { id: selId }, include: { orang: true, unit: true } })
    : null;

  return (
    <Shell session={session} active="induk" title="Data Induk Santri">
      <JudulHalaman
        judul="Data Induk Santri & Siswa"
        sub="Telusuri per lembaga, tingkat, dan kelas — lalu buka satu profil yang menyatukan data akademik, kepesantrenan, kesehatan, dan keuangan."
      />

      <BarisFilter f={f} angkatan={angkatan} hasil={daftar.length} />

      <CrudPanel entity={toClientEntity(entitasSantri)} rows={barisCrud} />

      <div className="grid" style={{ gridTemplateColumns: '250px 300px 1fr', alignItems: 'start', marginTop: 14 }}>
        <div className="card" style={{ padding: 12 }}>
          <div className="label" style={{ marginBottom: 8, paddingLeft: 4 }}>Lembaga & kelas</div>
          <PohonLembaga pohon={pohon} f={f} />
        </div>

        <div className="card" style={{ padding: 12 }}>
          <div className="label" style={{ marginBottom: 8, paddingLeft: 4 }}>Hasil ({daftar.length})</div>
          <DaftarSantri daftar={daftar} f={f} selId={selId} tab={tabAktif} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          {sel ? (
            <>
              <HeaderSantri sel={sel} />
              <nav className="tabbar">
                {TABS.map((t) => (
                  <Link
                    key={t.key}
                    href={hrefInduk(f, {}, { sel: selId!, tab: t.key })}
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
          ) : <Kosong pesan="Tidak ada santri pada penyaring ini. Longgarkan filter untuk melihat data." />}
        </div>
      </div>
    </Shell>
  );
}
