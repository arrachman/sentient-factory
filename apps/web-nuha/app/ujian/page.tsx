import { requirePage } from '@/lib/access';
import { prisma } from '@/lib/prisma';
import { Shell } from '@/components/Shell';
import { JudulHalaman, StatCard } from '@/components/ui/primitives';
import { Tabs, tabAktif } from '@/components/ui/Tabs';
import { TabGelombang } from './TabGelombang';
import { TabJadwal } from './TabJadwal';
import { TabNilai } from './TabNilai';

const TABS = [
  { key: 'gelombang', label: 'Gelombang Ujian' },
  { key: 'jadwal', label: 'Kartu Ujian' },
  { key: 'nilai', label: 'Input Nilai' },
];

/** Peran yang boleh memindahkan status gelombang; guru hanya mengisi nilai. */
const PENGELOLA = ['ketua', 'kepsmp', 'kepma'];

export default async function UjianPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await requirePage('ujian');
  const sp = await searchParams;
  const aktif = tabAktif(TABS, sp.tab);

  const bolehKelola = session.peran.some((peran) => PENGELOLA.includes(peran));
  // Guru murni disaring ke mapel yang diampunya; pengelola melihat seluruh sesi.
  const namaGuru = !bolehKelola && session.peran.includes('guru') ? session.nama?.trim() || null : null;

  const [gelombang, berjalan, sesi, nilai] = await Promise.all([
    prisma.ujian.count(),
    prisma.ujian.count({ where: { status: 'Berjalan' } }),
    prisma.jadwalUjian.count(),
    prisma.nilaiUjian.count(),
  ]);

  return (
    <Shell session={session} active="ujian" title="Ujian">
      <JudulHalaman
        judul="Manajemen Ujian"
        sub="Gelombang ujian per unit, kartu ujian tiap sesi, dan input nilai oleh guru pengampu."
      />
      {namaGuru && (
        <div className="alert alert-info">
          Anda masuk sebagai <strong>Guru</strong>. Yang tampil hanya sesi mata pelajaran yang Anda ampu; status
          gelombang diatur kepala unit.
        </div>
      )}
      <section className="grid g4">
        <StatCard label="Gelombang ujian" nilai={gelombang} sub={`${berjalan} sedang berjalan`} />
        <StatCard label="Sesi terjadwal" nilai={sesi} warna="#17804A" />
        <StatCard label="Nilai masuk" nilai={nilai} warna="#E8973A" />
        <StatCard label="Status Anda" nilai={bolehKelola ? 'Pengelola' : 'Pengampu'} sub={bolehKelola ? 'dapat mengubah status gelombang' : 'dapat mengisi nilai sesi'} warna="#5B21B6" />
      </section>
      <Tabs tabs={TABS} aktif={aktif} basePath="/ujian" />
      {aktif === 'gelombang' && <TabGelombang bolehKelola={bolehKelola} />}
      {aktif === 'jadwal' && <TabJadwal searchParams={sp} namaGuru={namaGuru} />}
      {aktif === 'nilai' && <TabNilai searchParams={sp} namaGuru={namaGuru} />}
    </Shell>
  );
}
