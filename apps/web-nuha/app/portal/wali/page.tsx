import { Shell } from '@/components/Shell';
import { requirePage } from '@/lib/access';
import { rupiah } from '@/lib/gaji';
import { prisma } from '@/lib/prisma';

export default async function PortalWaliPage() {
  const session = await requirePage('portal-wali');
  const user = await prisma.user.findUnique({ where: { id: BigInt(session.userId) }, include: { orang: { include: { waliDari: { include: { anak: { include: { santri: { include: { unit: true, kelas: true } } } } } } } } } });
  const children = user?.orang.waliDari ?? [];
  const childIds = children.map((row) => row.anakId);
  const tagihan = childIds.length ? await prisma.tagihan.findMany({ where: { santri: { orangId: { in: childIds } } }, orderBy: { jatuhTempo: 'desc' }, take: 20, include: { santri: { include: { orang: true } } } }) : [];

  return <Shell session={session} active="portal-wali" title="Portal Wali Santri">
    <div className="card"><h3>Selamat datang, {user?.orang.nama ?? session.nama}</h3><p className="muted">Akses data hanya untuk anak yang tertaut pada akun wali ini.</p></div>
    <section className="grid g3" style={{ marginTop: 16 }}>{children.map((row) => <div className="card" key={String(row.id)}><div className="label">Anak · {row.hubungan}</div><div className="angka" style={{ fontSize: 18 }}>{row.anak.nama}</div><div className="muted">{row.anak.santri?.nis} · {row.anak.santri?.unit?.nama} · {row.anak.santri?.kelas?.nama}</div></div>)}</section>
    <div className="card" style={{ marginTop: 16 }}><h3>Tagihan anak</h3><table><thead><tr><th>Santri</th><th>Jenis / periode</th><th>Nominal</th><th>Status bayar</th></tr></thead><tbody>{tagihan.map((row) => <tr key={String(row.id)}><td>{row.santri.orang.nama}</td><td>{row.jenis}<br /><span className="muted">{row.periode}</span></td><td>{rupiah(Number(row.nominal))}</td><td>{Number(row.dibayar) >= Number(row.nominal) ? 'Lunas' : `Sisa ${rupiah(Number(row.nominal) - Number(row.dibayar))}`}</td></tr>)}</tbody></table></div>
  </Shell>;
}
