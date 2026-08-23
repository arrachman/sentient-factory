import { Shell } from '@/components/Shell';
import { requirePage } from '@/lib/access';
import { rupiah } from '@/lib/gaji';
import { prisma } from '@/lib/prisma';

export default async function LaporanPage() {
  const session = await requirePage('laporan');
  const [byUnit, byStatus, keuangan, kas, medis, hafalan, pendaftar] = await Promise.all([
    prisma.santri.groupBy({ by: ['unitId'], _count: { _all: true } }),
    prisma.santri.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.tagihan.aggregate({ _sum: { nominal: true, dibayar: true } }),
    prisma.transaksiKas.groupBy({ by: ['arah'], _sum: { nominal: true } }),
    prisma.rekamMedis.count(),
    prisma.hafalan.count(),
    prisma.pendaftar.groupBy({ by: ['status'], _count: { _all: true } }),
  ]);
  const units = await prisma.unit.findMany();
  const unitById = new Map(units.map((unit) => [unit.id, unit.nama]));
  const masuk = Number(kas.find((row) => row.arah === 'Masuk')?._sum.nominal ?? 0);
  const keluar = Number(kas.find((row) => row.arah === 'Keluar')?._sum.nominal ?? 0);
  const tagih = Number(keuangan._sum.nominal ?? 0);
  const bayar = Number(keuangan._sum.dibayar ?? 0);

  return <Shell session={session} active="laporan" title="Laporan Yayasan">
    <section className="grid grid-4"><div className="card"><div className="kpi-label">Kas masuk</div><div className="kpi-value" style={{ fontSize: 19 }}>{rupiah(masuk)}</div></div><div className="card"><div className="kpi-label">Kas keluar</div><div className="kpi-value" style={{ fontSize: 19 }}>{rupiah(keluar)}</div></div><div className="card"><div className="kpi-label">Saldo</div><div className="kpi-value" style={{ fontSize: 19 }}>{rupiah(masuk - keluar)}</div></div><div className="card"><div className="kpi-label">Rasio tertagih</div><div className="kpi-value">{tagih ? Math.round(bayar / tagih * 100) : 0}%</div><div className="kpi-sub">{rupiah(tagih - bayar)} tunggakan</div></div></section>
    <section className="grid grid-2" style={{ marginTop: 16 }}>
      <div className="card"><h3>Santri per unit</h3><table><thead><tr><th>Unit</th><th>Jumlah</th></tr></thead><tbody>{byUnit.map((row) => <tr key={String(row.unitId)}><td>{row.unitId ? unitById.get(row.unitId) : 'Belum ditentukan'}</td><td>{row._count._all}</td></tr>)}</tbody></table></div>
      <div className="card"><h3>Santri per status</h3><table><thead><tr><th>Status</th><th>Jumlah</th></tr></thead><tbody>{byStatus.map((row) => <tr key={row.status}><td>{row.status}</td><td>{row._count._all}</td></tr>)}</tbody></table></div>
    </section>
    <section className="grid grid-2" style={{ marginTop: 16 }}>
      <div className="card"><h3>PPDB per status</h3><table><thead><tr><th>Status</th><th>Jumlah</th></tr></thead><tbody>{pendaftar.map((row) => <tr key={row.status}><td>{row.status}</td><td>{row._count._all}</td></tr>)}</tbody></table></div>
      <div className="card"><h3>Aktivitas terekam</h3><table><tbody><tr><td>Kunjungan poskestren</td><td>{medis}</td></tr><tr><td>Setoran hafalan</td><td>{hafalan}</td></tr></tbody></table></div>
    </section>
  </Shell>;
}
