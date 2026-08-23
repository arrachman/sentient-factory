import { Shell } from '@/components/Shell';
import { requirePage } from '@/lib/access';
import { prisma } from '@/lib/prisma';

export default async function LmsPage() {
  const session = await requirePage('lms');
  const [courses, materials, assignments] = await Promise.all([
    prisma.kursusLms.findMany({ orderBy: { nama: 'asc' } }),
    prisma.materiLms.findMany({ include: { kursus: true }, orderBy: { tgl: 'desc' }, take: 12 }),
    prisma.tugasLms.findMany({ include: { kursus: true }, orderBy: { deadline: 'asc' }, take: 12 }),
  ]);
  const progress = courses.length ? Math.round(courses.reduce((total, item) => total + (item.modul ? item.selesai / item.modul : 0), 0) / courses.length * 100) : 0;
  return <Shell session={session} active="lms" title="LMS & Kompetensi">
    <section className="grid g4"><div className="card"><div className="label">Kursus aktif</div><div className="angka">{courses.length}</div></div><div className="card"><div className="label">Progres rata-rata</div><div className="angka">{progress}%</div></div><div className="card"><div className="label">Tugas aktif</div><div className="angka">{courses.reduce((total, item) => total + item.tugasAktif, 0)}</div></div><div className="card"><div className="label">Nilai rata-rata</div><div className="angka">{courses.length ? Math.round(courses.reduce((total, item) => total + item.nilai, 0) / courses.length) : 0}</div></div></section>
    <section className="grid g2" style={{ marginTop: 16 }}><div className="card"><h3>Kursus</h3><table><thead><tr><th>Kursus</th><th>Progres</th><th>Nilai</th></tr></thead><tbody>{courses.map((item) => <tr key={item.id}><td><strong>{item.nama}</strong><br /><span className="muted">{item.guru}</span></td><td>{item.selesai}/{item.modul} modul<br /><span className="muted">{item.tugasAktif} tugas aktif</span></td><td>{item.nilai}</td></tr>)}</tbody></table></div><div className="card"><h3>Tugas terdekat</h3><table><thead><tr><th>Tugas</th><th>Deadline</th><th>Status</th></tr></thead><tbody>{assignments.map((item) => <tr key={item.id}><td>{item.judul}<br /><span className="muted">{item.kursus.nama}</span></td><td>{item.deadline.toLocaleDateString('id-ID')}</td><td><span className="badge badge-emas">{item.status}</span></td></tr>)}</tbody></table></div></section>
    <div className="card" style={{ marginTop: 16 }}><h3>Materi terbaru</h3><table><thead><tr><th>Kursus</th><th>Materi</th><th>Tipe</th><th>Status</th><th>Tanggal</th></tr></thead><tbody>{materials.map((item) => <tr key={item.id}><td>{item.kursus.nama}</td><td>{item.judul}</td><td>{item.tipe}</td><td>{item.status}</td><td>{item.tgl.toLocaleDateString('id-ID')}</td></tr>)}</tbody></table></div>
  </Shell>;
}
