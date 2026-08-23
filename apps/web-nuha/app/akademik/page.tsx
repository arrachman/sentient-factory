import { Shell } from '@/components/Shell';
import { requirePage } from '@/lib/access';
import { prisma } from '@/lib/prisma';

export default async function AkademikPage() {
  const session = await requirePage('akademik');
  const [jadwal, nilai, kelas] = await Promise.all([
    prisma.jadwalPelajaran.findMany({ orderBy: [{ hari: 'asc' }, { jamKe: 'asc' }] }),
    prisma.nilai.findMany({ include: { santri: { include: { orang: true } }, mapel: true }, take: 20 }),
    prisma.kelas.findMany({ include: { _count: { select: { santri: true } } } }),
  ]);
  return <Shell session={session} active="akademik" title="Akademik">
    <section className="grid grid-4"><div className="card"><div className="kpi-label">Kelas aktif</div><div className="kpi-value">{kelas.length}</div></div><div className="card"><div className="kpi-label">Jadwal pekanan</div><div className="kpi-value">{jadwal.length}</div></div><div className="card"><div className="kpi-label">Nilai terekam</div><div className="kpi-value">{nilai.length}</div></div><div className="card"><div className="kpi-label">Siswa terdaftar</div><div className="kpi-value">{kelas.reduce((total, item) => total + item._count.santri, 0)}</div></div></section>
    <section className="grid grid-2" style={{ marginTop: 16 }}><div className="card"><h3>Jadwal pelajaran</h3><table><thead><tr><th>Hari / jam</th><th>Mata pelajaran</th><th>Kelas</th></tr></thead><tbody>{jadwal.map((item) => <tr key={item.id}><td>{item.hari}<br /><span className="muted">{item.waktu}</span></td><td>{item.mapel}<br /><span className="muted">{item.guru}</span></td><td>{item.kelas}</td></tr>)}</tbody></table></div><div className="card"><h3>Nilai terbaru</h3><table><thead><tr><th>Santri</th><th>Mapel</th><th>Akhir</th></tr></thead><tbody>{nilai.map((item) => <tr key={String(item.id)}><td>{item.santri.orang.nama}</td><td>{item.mapel.nama}</td><td><strong>{Number(item.akhir).toFixed(1)}</strong><br /><span className="muted">{item.predikat}</span></td></tr>)}</tbody></table></div></section>
  </Shell>;
}
