import { Shell } from '@/components/Shell';
import { requirePage } from '@/lib/access';
import { prisma } from '@/lib/prisma';

export default async function KurikulumPage() {
  const session = await requirePage('kurikulum');
  const [mapel, perangkat, capaian, soal] = await Promise.all([
    prisma.mataPelajaran.findMany({ orderBy: [{ kelompok: 'asc' }, { nama: 'asc' }] }),
    prisma.perangkatAjar.findMany({ orderBy: { kode: 'desc' } }),
    prisma.capaianPembelajaran.findMany({ orderBy: { kode: 'asc' } }),
    prisma.bankSoal.findMany({ orderBy: { kode: 'desc' } }),
  ]);
  const totalJp = mapel.reduce((total, item) => total + item.jp, 0);
  return <Shell session={session} active="kurikulum" title="Kurikulum">
    <section className="grid grid-4"><div className="card"><div className="kpi-label">Mata pelajaran</div><div className="kpi-value">{mapel.length}</div><div className="kpi-sub">{totalJp} JP per pekan</div></div><div className="card"><div className="kpi-label">Perangkat ajar</div><div className="kpi-value">{perangkat.length}</div><div className="kpi-sub">{perangkat.filter((item) => item.status === 'Disetujui').length} disetujui</div></div><div className="card"><div className="kpi-label">Capaian pembelajaran</div><div className="kpi-value">{capaian.length}</div></div><div className="card"><div className="kpi-label">Butir bank soal</div><div className="kpi-value">{soal.reduce((total, item) => total + item.butir, 0)}</div><div className="kpi-sub">{soal.length} paket</div></div></section>
    <div className="card" style={{ marginTop: 16 }}><h3>Struktur kurikulum</h3><table><thead><tr><th>Kelompok</th><th>Mata pelajaran</th><th>Guru</th><th>JP</th><th>KKM</th></tr></thead><tbody>{mapel.map((item) => <tr key={item.id}><td>{item.kelompok}</td><td>{item.nama}<br /><span className="muted">{item.kurikulum}</span></td><td>{item.guru}</td><td>{item.jp}</td><td>{item.kkm}</td></tr>)}</tbody></table></div>
    <section className="grid grid-2" style={{ marginTop: 16 }}><div className="card"><h3>Perangkat ajar</h3><table><thead><tr><th>Kode</th><th>Topik</th><th>Status</th></tr></thead><tbody>{perangkat.map((item) => <tr key={item.id}><td>{item.kode}<br /><span className="muted">{item.kelas}</span></td><td>{item.topik}<br /><span className="muted">{item.mapel} · {item.pertemuan} pertemuan</span></td><td><span className={`badge ${item.status === 'Disetujui' ? 'badge-hijau' : 'badge-emas'}`}>{item.status}</span></td></tr>)}</tbody></table></div><div className="card"><h3>Capaian pembelajaran</h3><table><thead><tr><th>Kode</th><th>Capaian</th></tr></thead><tbody>{capaian.map((item) => <tr key={item.id}><td>{item.kode}<br /><span className="muted">{item.fase}</span></td><td>{item.capaian}</td></tr>)}</tbody></table></div></section>
    <div className="card" style={{ marginTop: 16 }}><h3>Bank soal</h3><table><thead><tr><th>Kode</th><th>Mapel / topik</th><th>Tipe</th><th>Level</th><th>Butir</th><th>Dipakai</th></tr></thead><tbody>{soal.map((item) => <tr key={item.id}><td>{item.kode}</td><td>{item.mapel}<br /><span className="muted">{item.topik}</span></td><td>{item.tipe}</td><td>{item.level}</td><td>{item.butir}</td><td>{item.dipakai}</td></tr>)}</tbody></table></div>
  </Shell>;
}
