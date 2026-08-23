import { requirePage } from '@/lib/access';
import { prisma } from '@/lib/prisma';
import { Shell } from '@/components/Shell';

export default async function KepesantrenanPage() {
  const session = await requirePage('pesantren');
  const [asrama, hafalan, tazir, izin] = await Promise.all([
    prisma.asrama.findMany({ include: { kamar: { include: { _count: { select: { santri: true } } } } } }),
    prisma.hafalan.findMany({ include: { santri: { include: { orang: true } } }, orderBy: { tgl: 'desc' }, take: 8 }),
    prisma.tazir.findMany({ include: { santri: { include: { orang: true } } }, orderBy: { tgl: 'desc' }, take: 8 }),
    prisma.izin.findMany({ include: { santri: { include: { orang: true } } }, orderBy: { keluarAt: 'desc' }, take: 8 }),
  ]);

  return <Shell session={session} active="pesantren" title="Kepesantrenan">
    <section className="grid grid-4">
      {asrama.map((row) => {
        const isi = row.kamar.reduce((total, kamar) => total + kamar._count.santri, 0);
        return <div className="card" key={row.id}><div className="kpi-label">{row.jk === 'L' ? 'Putra' : 'Putri'}</div><div style={{ fontWeight: 700, marginTop: 4 }}>{row.nama}</div><div className="kpi-sub">{isi} / {row.kapasitas} · {row.musyrif}</div></div>;
      })}
    </section>
    <section className="grid grid-2" style={{ marginTop: 16 }}>
      <div className="card"><h3>Setoran hafalan terbaru</h3><table><thead><tr><th>Santri</th><th>Surat</th><th>Nilai</th></tr></thead><tbody>{hafalan.map((row) => <tr key={String(row.id)}><td>{row.santri.orang.nama}</td><td>{row.surat} {row.ayat}</td><td>{row.nilai}</td></tr>)}</tbody></table></div>
      <div className="card"><h3>Ta&apos;zir terbaru</h3><table><thead><tr><th>Santri</th><th>Pelanggaran</th><th>Poin</th></tr></thead><tbody>{tazir.map((row) => <tr key={String(row.id)}><td>{row.santri.orang.nama}</td><td>{row.pelanggaran}</td><td>{row.poin}</td></tr>)}</tbody></table></div>
    </section>
    <div className="card" style={{ marginTop: 16 }}><h3>Perizinan</h3><table><thead><tr><th>Kode</th><th>Santri</th><th>Alasan</th><th>Keluar</th><th>Status</th></tr></thead><tbody>{izin.map((row) => <tr key={String(row.id)}><td>{row.kode}</td><td>{row.santri.orang.nama}</td><td>{row.alasan}</td><td>{row.keluarAt.toLocaleDateString('id-ID')}</td><td><span className={`badge ${row.status === 'Menunggu' ? 'badge-emas' : 'badge-hijau'}`}>{row.status}</span></td></tr>)}</tbody></table></div>
  </Shell>;
}
