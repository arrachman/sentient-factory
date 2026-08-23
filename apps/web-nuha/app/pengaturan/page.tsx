import { Shell } from '@/components/Shell';
import { requirePage } from '@/lib/access';
import { prisma } from '@/lib/prisma';

export default async function PengaturanPage() {
  const session = await requirePage('pengaturan');
  const [units, roles, users, menus] = await Promise.all([
    prisma.unit.findMany({ orderBy: { key: 'asc' } }),
    prisma.peran.findMany({ orderBy: { nama: 'asc' } }),
    prisma.user.findMany({ include: { orang: true, peran: { include: { peran: true } } }, orderBy: { email: 'asc' } }),
    prisma.menu.findMany({ include: { akses: { include: { peran: true } } }, orderBy: { urutan: 'asc' } }),
  ]);
  return <Shell session={session} active="pengaturan" title="Pengaturan Yayasan">
    <section className="grid grid-4"><div className="card"><div className="kpi-label">Unit</div><div className="kpi-value">{units.length}</div></div><div className="card"><div className="kpi-label">Peran</div><div className="kpi-value">{roles.length}</div></div><div className="card"><div className="kpi-label">Pengguna aktif</div><div className="kpi-value">{users.filter((item) => item.aktif).length}</div></div><div className="card"><div className="kpi-label">Menu berbasis peran</div><div className="kpi-value">{menus.length}</div></div></section>
    <section className="grid grid-2" style={{ marginTop: 16 }}><div className="card"><h3>Unit kerja</h3><table><thead><tr><th>Kode</th><th>Nama</th><th>Status</th></tr></thead><tbody>{units.map((item) => <tr key={item.id}><td>{item.key}</td><td>{item.nama}<br /><span className="muted">{item.deskripsi}</span></td><td><span className="badge badge-hijau">{item.aktif ? 'Aktif' : 'Nonaktif'}</span></td></tr>)}</tbody></table></div><div className="card"><h3>Peran</h3><table><thead><tr><th>Kunci</th><th>Nama</th></tr></thead><tbody>{roles.map((item) => <tr key={item.id}><td>{item.key}</td><td>{item.nama}</td></tr>)}</tbody></table></div></section>
    <div className="card" style={{ marginTop: 16 }}><h3>Pengguna dan akses</h3><table><thead><tr><th>Nama</th><th>Email</th><th>Peran</th><th>Status</th></tr></thead><tbody>{users.map((item) => <tr key={String(item.id)}><td>{item.orang.nama}</td><td>{item.email}</td><td>{item.peran.map((role) => role.peran.nama).join(', ')}</td><td><span className={`badge ${item.aktif ? 'badge-hijau' : 'badge-merah'}`}>{item.aktif ? 'Aktif' : 'Nonaktif'}</span></td></tr>)}</tbody></table></div>
    <div className="card" style={{ marginTop: 16 }}><h3>Konfigurasi menu</h3><table><thead><tr><th>Menu</th><th>Peran yang diizinkan</th></tr></thead><tbody>{menus.map((item) => <tr key={item.id}><td>{item.label}</td><td>{item.akses.map((access) => access.peran.nama).join(', ')}</td></tr>)}</tbody></table></div>
  </Shell>;
}
