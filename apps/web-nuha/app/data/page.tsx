import Link from 'next/link';
import { Shell } from '@/components/Shell';
import { requirePage } from '@/lib/access';
import { prisma } from '@/lib/prisma';
import { ENTITIES } from '@/lib/crud/registry';

export default async function DataPage() {
  const session = await requirePage('dashboard');
  const grants = await prisma.menuPeran.findMany({ where: { peran: { key: { in: session.peran } } }, select: { menu: { select: { key: true } } } });
  const allowed = new Set(grants.map((grant) => grant.menu.key));
  const entities = ENTITIES.filter((entity) => entity.menu === 'dashboard' || allowed.has(entity.menu));
  return <Shell session={session} active="dashboard" title="Kelola Data">
    <div className="card"><h3>CRUD data operasional</h3><p className="muted">Tambah, ubah, dan hapus data dengan hak akses menu yang sama. Setiap perubahan dicatat ke audit log.</p>
      <div className="grid g3" style={{ marginTop: 16 }}>{entities.map((entity) => <Link className="card" style={{ textDecoration: 'none' }} href={`/data/${entity.key}`} key={entity.key}><strong>{entity.label}</strong><br /><span className="muted">Menu: {entity.menu}</span></Link>)}</div>
    </div>
  </Shell>;
}
