import { Shell } from '@/components/Shell';
import { requirePage } from '@/lib/access';
import { rupiah } from '@/lib/gaji';
import { prisma } from '@/lib/prisma';

export default async function PortalSantriPage() {
  const session = await requirePage('portal-santri');
  // Scope everything from the session identity, never from a URL parameter.
  const user = await prisma.user.findUnique({
    where: { id: BigInt(session.userId) },
    include: { orang: { include: { santri: { include: { unit: true, kelas: true, kamar: { include: { asrama: true } } } } } } },
  });
  const santri = user?.orang.santri;
  if (!santri) {
    return <Shell session={session} active="portal-santri" title="Portal Santri">
      <div className="card">Akun ini belum tertaut ke data santri.</div>
    </Shell>;
  }

  const [hafalan, izin, tagihan] = await Promise.all([
    prisma.hafalan.findMany({ where: { santriId: santri.id }, orderBy: { tgl: 'desc' }, take: 8 }),
    prisma.izin.findMany({ where: { santriId: santri.id }, orderBy: { keluarAt: 'desc' }, take: 8 }),
    prisma.tagihan.findMany({ where: { santriId: santri.id }, orderBy: { jatuhTempo: 'desc' }, take: 8 }),
  ]);
  const tunggakan = tagihan.reduce((total, row) => total + (Number(row.nominal) - Number(row.dibayar)), 0);

  return <Shell session={session} active="portal-santri" title="Portal Santri">
    <section className="grid g4">
      <div className="card"><div className="label">Nama</div><div className="angka" style={{ fontSize: 18 }}>{user!.orang.nama}</div><div className="muted">NIS {santri.nis}</div></div>
      <div className="card"><div className="label">Unit / kelas</div><div className="angka" style={{ fontSize: 18 }}>{santri.unit?.nama ?? '-'}</div><div className="muted">{santri.kelas?.nama ?? '-'}</div></div>
      <div className="card"><div className="label">Asrama</div><div className="angka" style={{ fontSize: 18 }}>{santri.kamar?.asrama.nama ?? '-'}</div><div className="muted">{santri.kamar?.kode ?? '-'}</div></div>
      <div className="card"><div className="label">Sisa tagihan</div><div className="angka" style={{ fontSize: 18 }}>{rupiah(tunggakan)}</div></div>
    </section>
    <section className="grid g2" style={{ marginTop: 16 }}>
      <div className="card"><h3>Setoran hafalan</h3><table><thead><tr><th>Tanggal</th><th>Surat</th><th>Nilai</th></tr></thead><tbody>{hafalan.map((row) => <tr key={String(row.id)}><td>{row.tgl.toLocaleDateString('id-ID')}</td><td>{row.surat} {row.ayat}</td><td>{row.nilai}</td></tr>)}</tbody></table></div>
      <div className="card"><h3>Perizinan</h3><table><thead><tr><th>Keluar</th><th>Jenis</th><th>Status</th></tr></thead><tbody>{izin.map((row) => <tr key={String(row.id)}><td>{row.keluarAt.toLocaleDateString('id-ID')}</td><td>{row.jenis}<br /><span className="muted">{row.alasan}</span></td><td>{row.status}</td></tr>)}</tbody></table></div>
    </section>
    <div className="card" style={{ marginTop: 16 }}><h3>Tagihan</h3><table><thead><tr><th>Jenis</th><th>Periode</th><th>Nominal</th><th>Dibayar</th></tr></thead><tbody>{tagihan.map((row) => <tr key={String(row.id)}><td>{row.jenis}</td><td>{row.periode}</td><td>{rupiah(Number(row.nominal))}</td><td>{rupiah(Number(row.dibayar))}</td></tr>)}</tbody></table></div>
  </Shell>;
}
