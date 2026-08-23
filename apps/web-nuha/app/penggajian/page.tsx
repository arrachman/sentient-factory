import { Shell } from '@/components/Shell';
import { requirePage } from '@/lib/access';
import { hitungGaji, rupiah } from '@/lib/gaji';
import { prisma } from '@/lib/prisma';

export default async function PenggajianPage() {
  const session = await requirePage('gaji');
  const employees = await prisma.pegawai.findMany({ include: { orang: true, unit: true, komponen: true }, orderBy: { nip: 'asc' } });
  const calculations = employees.map((employee) => ({ employee, ...hitungGaji(employee.komponen) }));
  const total = calculations.reduce((sum, item) => sum + item.netto, 0);
  return <Shell session={session} active="gaji" title="Penggajian">
    <section className="grid grid-4"><div className="card"><div className="kpi-label">Pegawai</div><div className="kpi-value">{employees.length}</div></div><div className="card"><div className="kpi-label">Bruto periode ini</div><div className="kpi-value" style={{ fontSize: 19 }}>{rupiah(calculations.reduce((sum, item) => sum + item.bruto, 0))}</div></div><div className="card"><div className="kpi-label">Potongan</div><div className="kpi-value" style={{ fontSize: 19 }}>{rupiah(calculations.reduce((sum, item) => sum + item.potongan, 0))}</div></div><div className="card"><div className="kpi-label">Netto dibayarkan</div><div className="kpi-value" style={{ fontSize: 19 }}>{rupiah(total)}</div></div></section>
    <div className="card" style={{ marginTop: 16 }}><h3>Perhitungan gaji · Agustus 2026</h3><table><thead><tr><th>Pegawai</th><th>Unit / jabatan</th><th>Bruto</th><th>Potongan</th><th>Netto</th></tr></thead><tbody>{calculations.map((item) => <tr key={String(item.employee.id)}><td><strong>{item.employee.orang.nama}</strong><br /><span className="muted">{item.employee.nip}</span></td><td>{item.employee.unit?.nama ?? 'Yayasan'}<br /><span className="muted">{item.employee.jabatan}</span></td><td>{rupiah(item.bruto)}</td><td>{rupiah(item.potongan)}</td><td><strong>{rupiah(item.netto)}</strong></td></tr>)}</tbody></table></div>
  </Shell>;
}
