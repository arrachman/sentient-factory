import { redirect } from 'next/navigation';
import { readSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Shell } from '@/components/Shell';

export default async function PoskestrenPage() {
  const session = await readSession();
  if (!session) redirect('/login');
  const [visits, medicines] = await Promise.all([
    prisma.rekamMedis.findMany({ include: { santri: { include: { orang: true } } }, orderBy: { tgl: 'desc' }, take: 20 }),
    prisma.obat.findMany({ orderBy: { stok: 'asc' } }),
  ]);
  return <Shell session={session} active="poskestren" title="Poskestren">
    <section className="grid grid-4"><div className="card"><div className="kpi-label">Kunjungan tercatat</div><div className="kpi-value">{visits.length}</div></div><div className="card"><div className="kpi-label">Jenis obat</div><div className="kpi-value">{medicines.length}</div></div><div className="card"><div className="kpi-label">Stok perlu perhatian</div><div className="kpi-value">{medicines.filter((item) => item.stok <= item.stokMin).length}</div></div><div className="card"><div className="kpi-label">Layanan</div><div className="kpi-value">24/7</div></div></section>
    <section className="grid grid-2" style={{ marginTop: 16 }}><div className="card"><h3>Rekam kunjungan</h3><table><thead><tr><th>Santri</th><th>Keluhan / Diagnosis</th><th>Petugas</th></tr></thead><tbody>{visits.map((item) => <tr key={String(item.id)}><td>{item.santri.orang.nama}<br/><span className="muted">{item.tgl.toLocaleDateString('id-ID')}</span></td><td>{item.keluhan}<br/><span className="muted">{item.diagnosis}</span></td><td>{item.petugas}</td></tr>)}</tbody></table></div><div className="card"><h3>Stok obat</h3><table><thead><tr><th>Obat</th><th>Stok</th><th>Kadaluwarsa</th></tr></thead><tbody>{medicines.map((item) => <tr key={item.id}><td>{item.nama}<br/><span className="muted">{item.satuan}</span></td><td><span className={`badge ${item.stok <= item.stokMin ? 'badge-merah' : 'badge-hijau'}`}>{item.stok}</span></td><td>{item.kadaluarsa}</td></tr>)}</tbody></table></div></section>
  </Shell>;
}
