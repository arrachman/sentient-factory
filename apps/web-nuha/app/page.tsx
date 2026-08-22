import { redirect } from 'next/navigation';
import { readSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Shell } from '@/components/Shell';

const rupiah = (amount: { toString(): string }) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(amount));

export default async function DashboardPage() {
  const session = await readSession();
  if (!session) redirect('/login');
  const [santri, mukim, pendaftar, outstanding, agenda, announcements] = await Promise.all([
    prisma.santri.count(),
    prisma.santri.count({ where: { status: 'Mukim' } }),
    prisma.pendaftar.count({ where: { status: { in: ['Baru', 'Verifikasi', 'Seleksi'] } } }),
    prisma.tagihan.aggregate({ _sum: { nominal: true, dibayar: true } }),
    prisma.agenda.findMany({ orderBy: { tgl: 'asc' }, take: 5 }),
    prisma.pengumuman.findMany({ orderBy: { tgl: 'desc' }, take: 5 }),
  ]);
  const tunggakan = Number(outstanding._sum.nominal ?? 0) - Number(outstanding._sum.dibayar ?? 0);

  return <Shell session={session} active="dashboard" title="Dashboard Yayasan">
    <section className="grid grid-4">
      <div className="card"><div className="kpi-label">Santri aktif</div><div className="kpi-value">{santri}</div><div className="kpi-sub">{mukim} santri mukim</div></div>
      <div className="card"><div className="kpi-label">PPDB perlu diproses</div><div className="kpi-value">{pendaftar}</div><div className="kpi-sub">Pendaftar baru / verifikasi</div></div>
      <div className="card"><div className="kpi-label">Tunggakan aktif</div><div className="kpi-value" style={{ fontSize: 21 }}>{rupiah({ toString: () => String(tunggakan) })}</div><div className="kpi-sub">SPP, syahriyah, dan makan</div></div>
      <div className="card"><div className="kpi-label">Unit terintegrasi</div><div className="kpi-value">4</div><div className="kpi-sub">SMP · MA · Pondok · Poskestren</div></div>
    </section>
    <section className="grid grid-2" style={{ marginTop: 16 }}>
      <div className="card"><h3>Agenda terdekat</h3><table><tbody>{agenda.map((item) => <tr key={String(item.id)}><td><strong>{item.judul}</strong><br /><span className="muted">{item.unit ?? 'Yayasan'}</span></td><td>{item.tgl.toLocaleDateString('id-ID')}<br /><span className="muted">{item.jam}</span></td></tr>)}</tbody></table></div>
      <div className="card"><h3>Pengumuman terbaru</h3><table><tbody>{announcements.map((item) => <tr key={String(item.id)}><td><strong>{item.judul}</strong><br /><span className="muted">{item.isi}</span></td><td>{item.tgl.toLocaleDateString('id-ID')}</td></tr>)}</tbody></table></div>
    </section>
  </Shell>;
}
