import { Shell } from '@/components/Shell';
import { requirePage } from '@/lib/access';
import { prisma } from '@/lib/prisma';

export default async function KunjunganWaliPage() {
  const session = await requirePage('kunjungan');
  const visits = await prisma.kunjungan.findMany({ include: { santri: { include: { orang: true, kamar: { include: { asrama: true } } } } }, orderBy: { tgl: 'desc' }, take: 30 });
  const ongoing = visits.filter((item) => item.status === 'Sedang berkunjung').length;
  return <Shell session={session} active="kunjungan" title="Kunjungan Wali">
    <section className="grid g4"><div className="card"><div className="label">Kunjungan tercatat</div><div className="angka">{visits.length}</div></div><div className="card"><div className="label">Sedang berkunjung</div><div className="angka">{ongoing}</div></div><div className="card"><div className="label">Selesai</div><div className="angka">{visits.filter((item) => item.status === 'Selesai').length}</div></div><div className="card"><div className="label">Terjadwal</div><div className="angka">{visits.filter((item) => item.status === 'Terjadwal').length}</div></div></section>
    <div className="card" style={{ marginTop: 16 }}><h3>Daftar kunjungan</h3><table><thead><tr><th>Tanggal / jam</th><th>Wali</th><th>Santri</th><th>Keperluan</th><th>Status</th></tr></thead><tbody>{visits.map((item) => <tr key={String(item.id)}><td>{item.tgl.toLocaleDateString('id-ID')}<br /><span className="muted">{item.jamMasuk} – {item.jamKeluar ?? '-'}</span></td><td>{item.namaWali}<br /><span className="muted">{item.hubungan}</span></td><td>{item.santri.orang.nama}<br /><span className="muted">{item.santri.kamar?.asrama.nama} · {item.santri.kamar?.kode}</span></td><td>{item.keperluan}</td><td><span className={`badge ${item.status === 'Selesai' ? 'badge-hijau' : 'badge-emas'}`}>{item.status}</span></td></tr>)}</tbody></table></div>
  </Shell>;
}
