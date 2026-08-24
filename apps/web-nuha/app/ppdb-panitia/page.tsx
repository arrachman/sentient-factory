import { requirePage } from '@/lib/access';
import { prisma } from '@/lib/prisma';
import { Shell } from '@/components/templates/Shell';
import { JudulHalaman, Tabs, tabAktif } from '@/components';
import { TabPendaftar } from './TabPendaftar';
import { TabSeleksi } from './TabSeleksi';
import { TabKelulusan } from './TabKelulusan';

const TABS = [
  { key: 'pendaftar', label: 'Pendaftar' },
  { key: 'seleksi', label: 'Seleksi & verifikasi' },
  { key: 'kelulusan', label: 'Pengumuman kelulusan' },
];

export default async function PpdbPanitiaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await requirePage('ppdb');
  const sp = await searchParams;
  const aktif = tabAktif(TABS, sp.tab);

  const perStatus = await prisma.pendaftar.groupBy({ by: ['status'], _count: { _all: true } });
  const jumlah = (status: string) => perStatus.find((r) => r.status === status)?._count._all ?? 0;
  const total = perStatus.reduce((sum, r) => sum + r._count._all, 0);

  const STAT = [
    { label: 'Total pendaftar', n: total, c: '#0A4A2B' },
    { label: 'Menunggu verifikasi', n: jumlah('Baru') + jumlah('Verifikasi'), c: '#92400E' },
    { label: 'Dalam seleksi', n: jumlah('Seleksi'), c: '#1E40AF' },
    { label: 'Lulus', n: jumlah('Lulus'), c: '#0F6B3D' },
    { label: 'Daftar ulang', n: jumlah('DaftarUlang'), c: '#0A4A2B' },
  ];

  return (
    <Shell session={session} active="ppdb" title="PPDB 2026/2027 — Sisi Panitia">
      <JudulHalaman judul="PPDB 2026/2027 — Sisi Panitia" sub="Verifikasi berkas, seleksi, dan penetapan kelulusan calon santri." />
      <section className="grid g4" style={{ marginBottom: 16 }}>
        {STAT.map((s) => (
          <div className="card" key={s.label}>
            <div className="label">{s.label}</div>
            <div className="angka" style={{ color: s.c }}>{s.n}</div>
          </div>
        ))}
      </section>
      <Tabs tabs={TABS} aktif={aktif} basePath="/ppdb-panitia" />
      {aktif === 'pendaftar' && <TabPendaftar searchParams={sp} />}
      {aktif === 'seleksi' && <TabSeleksi searchParams={sp} />}
      {aktif === 'kelulusan' && <TabKelulusan searchParams={sp} />}
    </Shell>
  );
}
