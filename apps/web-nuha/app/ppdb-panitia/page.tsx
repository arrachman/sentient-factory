import { requirePage } from '@/lib/access';
import { prisma } from '@/lib/prisma';
import { Shell } from '@/components/Shell';
import { DaftarPpdb } from './DaftarPpdb';

export default async function PpdbPage() {
  const session = await requirePage('ppdb');
  const pendaftar = await prisma.pendaftar.findMany({ orderBy: { tglDaftar: 'desc' } });
  const lulus = pendaftar.filter((row) => row.status === 'Lulus').length;

  return <Shell session={session} active="ppdb" title="PPDB 2026/2027">
    <section className="grid g4">
      <div className="card"><div className="label">Total pendaftar</div><div className="angka">{pendaftar.length}</div></div>
      <div className="card"><div className="label">Lulus seleksi</div><div className="angka">{lulus}</div></div>
      <div className="card"><div className="label">Menunggu proses</div><div className="angka">{pendaftar.filter((r) => ['Baru','Verifikasi','Seleksi'].includes(r.status)).length}</div></div>
      <div className="card"><div className="label">Daftar ulang</div><div className="angka">{pendaftar.filter((r) => r.status === 'DaftarUlang').length}</div></div>
    </section>
    <div style={{ marginTop: 16 }}><DaftarPpdb /></div>
    <div className="card" style={{ marginTop: 16 }}>
      <h3>Daftar pendaftar</h3>
      <table><thead><tr><th>No. Reg</th><th>Nama</th><th>Pilihan</th><th>Asal sekolah</th><th>Status</th></tr></thead>
        <tbody>{pendaftar.map((row) => <tr key={String(row.id)}><td>{row.noReg}</td><td>{row.nama}</td><td>{row.pilihan}</td><td>{row.asalSekolah ?? '-'}</td><td><span className={`badge ${row.status === 'Lulus' ? 'badge-hijau' : row.status === 'TidakLulus' ? 'badge-merah' : 'badge-emas'}`}>{row.status}</span></td></tr>)}</tbody>
      </table>
    </div>
  </Shell>;
}
