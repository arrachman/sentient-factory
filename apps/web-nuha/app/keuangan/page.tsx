import { requirePage } from '@/lib/access';
import { prisma } from '@/lib/prisma';
import { Shell } from '@/components/Shell';

const rupiah = (value: { toString(): string }) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value));
export default async function KeuanganPage() {
  const session = await requirePage('keuangan');
  const [invoices, totals, transactions] = await Promise.all([
    prisma.tagihan.findMany({ include: { santri: { include: { orang: true } } }, orderBy: { jatuhTempo: 'desc' }, take: 30 }),
    prisma.tagihan.aggregate({ _sum: { nominal: true, dibayar: true } }),
    prisma.transaksiKas.findMany({ orderBy: { tgl: 'desc' }, take: 10 }),
  ]);
  const nominal = Number(totals._sum.nominal ?? 0); const paid = Number(totals._sum.dibayar ?? 0);
  return <Shell session={session} active="keuangan" title="Keuangan Yayasan">
    <section className="grid g4"><div className="card"><div className="label">Total tagihan</div><div className="angka" style={{fontSize:20}}>{rupiah({toString:()=>String(nominal)})}</div></div><div className="card"><div className="label">Sudah dibayar</div><div className="angka" style={{fontSize:20}}>{rupiah({toString:()=>String(paid)})}</div></div><div className="card"><div className="label">Tunggakan</div><div className="angka" style={{fontSize:20}}>{rupiah({toString:()=>String(nominal-paid)})}</div></div><div className="card"><div className="label">Invoice aktif</div><div className="angka">{invoices.length}</div></div></section>
    <section className="grid g2" style={{marginTop:16}}><div className="card"><h3>Tagihan santri</h3><table><thead><tr><th>Santri</th><th>Jenis</th><th>Nominal</th><th>Status</th></tr></thead><tbody>{invoices.map((item)=><tr key={String(item.id)}><td>{item.santri.orang.nama}<br/><span className="muted">{item.periode}</span></td><td>{item.jenis}</td><td>{rupiah(item.nominal)}</td><td><span className={`badge ${Number(item.dibayar)>=Number(item.nominal)?'badge-hijau':'badge-emas'}`}>{Number(item.dibayar)>=Number(item.nominal)?'Lunas':'Belum lunas'}</span></td></tr>)}</tbody></table></div><div className="card"><h3>Kas terakhir</h3><table><thead><tr><th>Tanggal</th><th>Uraian</th><th>Nilai</th></tr></thead><tbody>{transactions.map((item)=><tr key={String(item.id)}><td>{item.tgl.toLocaleDateString('id-ID')}</td><td>{item.uraian}<br/><span className="muted">{item.kategori}</span></td><td style={{color:item.arah==='Masuk'?'var(--hijau)':'#b91c1c'}}>{item.arah==='Masuk'?'+':'-'} {rupiah(item.nominal)}</td></tr>)}</tbody></table></div></section>
  </Shell>;
}
