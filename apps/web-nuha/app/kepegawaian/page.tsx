import { requirePage } from '@/lib/access';
import { Shell } from '@/components/templates/Shell';
import { JudulHalaman, Tabs, tabAktif } from '@/components';
import { TabPiket } from './TabPiket';
import { TabJurnal } from './TabJurnal';
import { TabPresensi } from './TabPresensi';
import { TabBebanJam } from './TabBebanJam';
import { TabArsipSk } from './TabArsipSk';
import { TabStruktur } from './TabStruktur';

const TABS = [
  { key: 'piket', label: 'Guru Piket' },
  { key: 'jurnal', label: 'Jurnal Mengajar' },
  { key: 'presensi', label: 'Presensi Pegawai' },
  { key: 'beban-jam', label: 'Beban Jam' },
  { key: 'arsip-sk', label: 'Arsip SK' },
  { key: 'struktur', label: 'Struktur Organisasi' },
];

export default async function KepegawaianPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await requirePage('kepegawaian');
  const sp = await searchParams;
  const aktif = tabAktif(TABS, sp.tab);

  return (
    <Shell session={session} active="kepegawaian" title="Kepegawaian">
      <JudulHalaman
        judul="Kepegawaian"
        sub="Jadwal piket, jurnal mengajar, presensi & beban jam pegawai, serta arsip SK kepegawaian."
      />
      <Tabs tabs={TABS} aktif={aktif} basePath="/kepegawaian" />
      {aktif === 'piket' && <TabPiket />}
      {aktif === 'jurnal' && <TabJurnal />}
      {aktif === 'presensi' && <TabPresensi />}
      {aktif === 'beban-jam' && <TabBebanJam />}
      {aktif === 'arsip-sk' && <TabArsipSk />}
      {aktif === 'struktur' && <TabStruktur />}
    </Shell>
  );
}
