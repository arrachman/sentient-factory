import { Shell } from '@/components/Shell';
import { requirePage } from '@/lib/access';
import { prisma } from '@/lib/prisma';
import { WaTestForm } from '@/components/WaTestForm';

export default async function NotifikasiPage() {
  const session = await requirePage('wa');
  const [templates, logs] = await Promise.all([
    prisma.templateWa.findMany({ orderBy: { kode: 'asc' } }),
    prisma.logWa.findMany({ include: { template: true }, orderBy: { waktu: 'desc' }, take: 20 }),
  ]);
  const byRole = templates.reduce<Record<string, number>>((acc, item) => ({ ...acc, [item.role]: (acc[item.role] ?? 0) + 1 }), {});
  return <Shell session={session} active="wa" title="Notifikasi WhatsApp">
    <section className="grid g4"><div className="card"><div className="label">Template</div><div className="angka">{templates.length}</div></div><div className="card"><div className="label">Aktif</div><div className="angka">{templates.filter((item) => item.aktif).length}</div></div><div className="card"><div className="label">Kelompok penerima</div><div className="angka">{Object.keys(byRole).length}</div></div><div className="card"><div className="label">Log terkirim</div><div className="angka">{logs.length}</div></div></section>
    <WaTestForm templates={templates.filter((item) => item.aktif).map((item) => ({ kode: item.kode, judul: item.judul }))} />
    <div className="card" style={{ marginTop: 16 }}><h3>Template pesan</h3><p className="muted" style={{ marginBottom: 10 }}>Pemicu terdaftar di sini; pengiriman memakai gateway WhatsApp kompatibel-Fonnte.</p><table><thead><tr><th>Kode</th><th>Penerima</th><th>Judul / pemicu</th><th>Status</th></tr></thead><tbody>{templates.map((item) => <tr key={item.id}><td>{item.kode}</td><td>{item.role}</td><td>{item.judul}<br /><span className="muted">{item.pemicu}</span></td><td><span className={`badge ${item.aktif ? 'badge-hijau' : 'badge-emas'}`}>{item.aktif ? 'Aktif' : 'Nonaktif'}</span></td></tr>)}</tbody></table></div>
    {logs.length > 0 && <div className="card" style={{ marginTop: 16 }}><h3>Log pengiriman</h3><table><thead><tr><th>Waktu</th><th>Tujuan</th><th>Isi</th><th>Status</th></tr></thead><tbody>{logs.map((item) => <tr key={String(item.id)}><td>{item.waktu.toLocaleString('id-ID')}</td><td>{item.tujuan}<br /><span className="muted">{item.nomor}</span></td><td>{item.isi}</td><td>{item.status}</td></tr>)}</tbody></table></div>}
  </Shell>;
}
