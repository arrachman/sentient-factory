import Link from 'next/link';
import { Shell, IkonMenu } from '@/components/templates/Shell';
import { requirePage } from '@/lib/access';
import { prisma } from '@/lib/prisma';
import { ENTITIES } from '@/lib/crud/registry';

export default async function DataPage() {
  const session = await requirePage('dashboard');
  const [grants, menus] = await Promise.all([
    prisma.menuPeran.findMany({ where: { peran: { key: { in: session.peran } } }, select: { menu: { select: { key: true } } } }),
    prisma.menu.findMany({ select: { key: true, label: true, urutan: true, icon: true } }),
  ]);
  const allowed = new Set(grants.map((grant) => grant.menu.key));
  const entities = ENTITIES.filter((entity) => entity.menu === 'dashboard' || allowed.has(entity.menu));
  const menuInfo = new Map(menus.map((menu) => [menu.key, menu]));

  const grup = new Map<string, typeof entities>();
  for (const entity of entities) {
    if (!grup.has(entity.menu)) grup.set(entity.menu, []);
    grup.get(entity.menu)!.push(entity);
  }
  const kelompok = [...grup.entries()].sort((a, b) => (menuInfo.get(a[0])?.urutan ?? 999) - (menuInfo.get(b[0])?.urutan ?? 999));

  return <Shell session={session} active="data" title="Kelola Data">
    <div className="card"><h3>CRUD data operasional</h3><p className="muted">Tambah, ubah, dan hapus data dengan hak akses menu yang sama, dikelompokkan per modul. Setiap perubahan dicatat ke audit log.</p></div>
    {kelompok.map(([menuKey, items]) => <div className="card" key={menuKey} style={{ marginTop: 16 }}>
      <h4 style={{ margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <IkonMenu menuKey={menuKey} path={menuInfo.get(menuKey)?.icon} size={18} />
        {menuInfo.get(menuKey)?.label ?? menuKey}
      </h4>
      <div className="grid g3">{items.map((entity) => <Link className="card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }} href={`/data/${entity.key}`} key={entity.key}>
        <IkonMenu menuKey={menuKey} path={menuInfo.get(menuKey)?.icon} size={16} />
        <strong>{entity.label}</strong>
      </Link>)}</div>
    </div>)}
  </Shell>;
}
