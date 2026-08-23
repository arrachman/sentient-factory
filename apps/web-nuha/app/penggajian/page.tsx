import { Shell } from '@/components/Shell';
import { requirePage } from '@/lib/access';
import { hitungGaji, rupiah } from '@/lib/gaji';
import { prisma } from '@/lib/prisma';
import { SlipActions } from '@/components/SlipActions';

export default async function PenggajianPage() {
  const session = await requirePage('gaji');
  const employees = await prisma.pegawai.findMany({ include: { orang: true, unit: true, komponen: true }, orderBy: { nip: 'asc' } });
  const periode = process.env.NUHA_PERIODE_GAJI ?? new Date().toISOString().slice(0, 7);
  const slips = await prisma.slipGaji.findMany({ where: { periode } });
  const slipByPegawai = new Map(slips.map((slip) => [String(slip.pegawaiId), slip]));
  const calculations = employees.map((employee) => ({ employee, slip: slipByPegawai.get(String(employee.id)), ...hitungGaji(employee.komponen) }));
  const total = calculations.reduce((sum, item) => sum + item.netto, 0);
  return <Shell session={session} active="gaji" title="Penggajian">
    <section className="grid g4"><div className="card"><div className="label">Pegawai</div><div className="angka">{employees.length}</div></div><div className="card"><div className="label">Bruto periode ini</div><div className="angka" style={{ fontSize: 19 }}>{rupiah(calculations.reduce((sum, item) => sum + item.bruto, 0))}</div></div><div className="card"><div className="label">Potongan</div><div className="angka" style={{ fontSize: 19 }}>{rupiah(calculations.reduce((sum, item) => sum + item.potongan, 0))}</div></div><div className="card"><div className="label">Netto dibayarkan</div><div className="angka" style={{ fontSize: 19 }}>{rupiah(total)}</div></div></section>
    <div className="card" style={{ marginTop: 16 }}><h3>Perhitungan gaji · {periode}</h3><p className="muted">Semua pemegang akses menu Penggajian dapat menerbitkan, membayar, atau merevisi. Revisi setelah bayar tetap tercatat di audit log.</p><table><thead><tr><th>Pegawai</th><th>Unit / jabatan</th><th>Bruto</th><th>Potongan</th><th>Netto</th><th>Slip</th><th>Aksi</th></tr></thead><tbody>{calculations.map((item) => <tr key={String(item.employee.id)}><td><strong>{item.employee.orang.nama}</strong><br /><span className="muted">{item.employee.nip}</span></td><td>{item.employee.unit?.nama ?? 'Yayasan'}<br /><span className="muted">{item.employee.jabatan}</span></td><td>{rupiah(item.bruto)}</td><td>{rupiah(item.potongan)}</td><td><strong>{rupiah(item.netto)}</strong></td><td>{item.slip ? <><span className="badge badge-hijau">{item.slip.status}</span><br /><span className="muted">Revisi {item.slip.revisi}</span></> : <span className="muted">Belum terbit</span>}</td><td><SlipActions pegawaiId={String(item.employee.id)} periode={periode} status={item.slip?.status} /></td></tr>)}</tbody></table></div>
  </Shell>;
}
