import { Shell } from '@/components/Shell';
import { requirePage } from '@/lib/access';
import { JudulHalaman } from '@/components/ui/primitives';
import { Tabs, tabAktif, type TabDef } from '@/components/ui/Tabs';
import { TabSiswa } from './TabSiswa';
import { TabPresensi } from './TabPresensi';
import { TabNilai } from './TabNilai';
import { TabRapor } from './TabRapor';

const TABS: TabDef[] = [
  { key: 'siswa', label: 'Siswa' },
  { key: 'presensi', label: 'Presensi' },
  { key: 'nilai', label: 'Nilai' },
  { key: 'rapor', label: 'Rapor' },
];

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AkademikPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requirePage('akademik');
  const sp = await searchParams;
  const aktif = tabAktif(TABS, sp.tab);

  return (
    <Shell session={session} active="akademik" title="Akademik">
      <JudulHalaman judul="Modul Akademik" sub="Daftar siswa, rekap presensi, input nilai, dan cetak rapor." />
      <Tabs tabs={TABS} aktif={aktif} basePath="/akademik" />
      {aktif === 'siswa' && <TabSiswa searchParams={sp} />}
      {aktif === 'presensi' && <TabPresensi searchParams={sp} />}
      {aktif === 'nilai' && <TabNilai searchParams={sp} />}
      {aktif === 'rapor' && <TabRapor searchParams={sp} />}
    </Shell>
  );
}
