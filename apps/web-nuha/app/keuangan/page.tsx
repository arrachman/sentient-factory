import { requirePage } from '@/lib/access';
import { prisma } from '@/lib/prisma';
import { Shell } from '@/components/templates/Shell';
import { JudulHalaman, StatCard, rp, Tabs, tabAktif, type TabDef } from '@/components';
import { TabTagihan } from './TabTagihan';
import { TabSpp } from './TabSpp';
import { TabRekap } from './TabRekap';
import { TabTunggakan } from './TabTunggakan';
import { TabTransaksi } from './TabTransaksi';

const TABS: TabDef[] = [
  { key: 'tagihan', label: 'Tagihan' },
  { key: 'spp', label: 'Riwayat SPP per Anak' },
  { key: 'rekap', label: 'Rekap Nama Santri' },
  { key: 'tunggakan', label: 'Tunggakan' },
  { key: 'transaksi', label: 'Riwayat Transaksi' },
];

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** KPI ringkas di puncak modul — ditarik dari Tagihan + TransaksiKas, bukan angka tetap. */
async function ambilKartu() {
  const [totals, kas] = await Promise.all([
    prisma.tagihan.aggregate({ _sum: { nominal: true, dibayar: true } }),
    prisma.transaksiKas.groupBy({ by: ['arah'], _sum: { nominal: true } }),
  ]);
  const totalTagihan = Number(totals._sum.nominal ?? 0);
  const totalBayar = Number(totals._sum.dibayar ?? 0);
  const masuk = Number(kas.find((k) => k.arah === 'Masuk')?._sum.nominal ?? 0);
  const keluar = Number(kas.find((k) => k.arah === 'Keluar')?._sum.nominal ?? 0);
  return { totalTagihan, totalBayar, tunggakan: totalTagihan - totalBayar, saldoKas: masuk - keluar };
}

export default async function KeuanganPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requirePage('keuangan');
  const sp = await searchParams;
  const aktif = tabAktif(TABS, sp.tab);
  const kartu = await ambilKartu();

  return (
    <Shell session={session} active="keuangan" title="Keuangan">
      <JudulHalaman
        judul="Modul Keuangan"
        sub="SPP unit sekolah, syahriyah pondok, uang makan, dan laundry dalam satu tagihan per santri."
      />

      <section className="grid g4">
        <StatCard label="Total tagihan" nilai={rp(kartu.totalTagihan)} />
        <StatCard label="Sudah dibayar" nilai={rp(kartu.totalBayar)} warna="#0F6B3D" />
        <StatCard label="Tunggakan" nilai={rp(kartu.tunggakan)} warna="#B91C1C" />
        <StatCard label="Saldo kas yayasan" nilai={rp(kartu.saldoKas)} warna="#1D4ED8" />
      </section>

      <Tabs tabs={TABS} aktif={aktif} basePath="/keuangan" />

      {aktif === 'tagihan' && <TabTagihan q={typeof sp.q === 'string' ? sp.q : ''} />}
      {aktif === 'spp' && <TabSpp anakId={typeof sp.anak === 'string' ? sp.anak : undefined} />}
      {aktif === 'rekap' && <TabRekap q={typeof sp.q === 'string' ? sp.q : ''} />}
      {aktif === 'tunggakan' && <TabTunggakan />}
      {aktif === 'transaksi' && <TabTransaksi />}
    </Shell>
  );
}
