import Link from 'next/link';
import { Shell, IkonMenu } from '@/components/templates/Shell';
import { requirePage } from '@/lib/access';
import { prisma } from '@/lib/prisma';
import { ENTITIES } from '@/lib/crud/registry';
import { PERSONA } from '@/lib/crud/persona';

export default async function DataPage() {
  const session = await requirePage('dashboard');
  const [grants, menus] = await Promise.all([
    prisma.menuPeran.findMany({ where: { peran: { key: { in: session.peran } } }, select: { menu: { select: { key: true } } } }),
    prisma.menu.findMany({ select: { key: true, label: true, urutan: true, icon: true } }),
  ]);
  const allowed = new Set(grants.map((grant) => grant.menu.key));
  const semua = ENTITIES.filter((entity) => entity.menu === 'dashboard' || allowed.has(entity.menu));
  // Persona ditarik keluar dari kelompok modulnya: ini pintu masuk yang paling
  // sering dipakai operator, jadi ditaruh paling atas dengan penjelasannya.
  const kunciPersona = new Set(PERSONA.map((item) => item.key));
  const persona = PERSONA.filter((item) => semua.some((entity) => entity.key === item.key));
  const entities = semua.filter((entity) => !kunciPersona.has(entity.key));
  const menuInfo = new Map(menus.map((menu) => [menu.key, menu]));

  const grup = new Map<string, typeof entities>();
  for (const entity of entities) {
    if (!grup.has(entity.menu)) grup.set(entity.menu, []);
    grup.get(entity.menu)!.push(entity);
  }
  const kelompok = [...grup.entries()].sort((a, b) => (menuInfo.get(a[0])?.urutan ?? 999) - (menuInfo.get(b[0])?.urutan ?? 999));

  return <Shell session={session} active="data" title="Kelola Data">
    <div className="card"><h3>Kelola data operasional</h3><p className="muted">Di sini Anda bisa menambah, mengubah, dan menghapus data. Daftarnya dikelompokkan per modul, dan Anda hanya melihat data yang menunya boleh Anda akses. Semua perubahan otomatis tercatat di audit log.</p></div>
    {persona.length > 0 && <div className="card" style={{ marginTop: 16 }}>
      <h4 style={{ margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <IkonMenu menuKey="induk" path={menuInfo.get('induk')?.icon} size={18} />
        Data orang per peran
      </h4>
      <p className="muted" style={{ margin: '0 0 12px', fontSize: 12.5 }}>Pintasan satu-layar: identitas dan baris perannya dibuat sekaligus, tanpa perlu menyalin ID Orang antar menu.</p>
      <div className="grid g2">
        {persona.map((item) => <Link className="card" style={{ textDecoration: 'none' }} href={`/data/${item.key}`} key={item.key}>
          <strong style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <IkonMenu menuKey="induk" path={menuInfo.get('induk')?.icon} size={16} />
            {item.label}
          </strong>
          <p className="muted" style={{ margin: '6px 0 0', fontSize: 12.5 }}>{item.ringkas}</p>
        </Link>)}
      </div>
    </div>}
    {kelompok.map(([menuKey, items]) => <div className="card" key={menuKey} style={{ marginTop: 16 }}>
      <h4 style={{ margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <IkonMenu menuKey={menuKey} path={menuInfo.get(menuKey)?.icon} size={18} />
        {menuInfo.get(menuKey)?.label ?? menuKey}
      </h4>
      <div className="grid g3">
        {items.map((entity) => <Link className="card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }} href={`/data/${entity.key}`} key={entity.key}>
          <IkonMenu menuKey={menuKey} path={menuInfo.get(menuKey)?.icon} size={16} />
          <strong>{entity.label}</strong>
        </Link>)}
      </div>
    </div>)}
  </Shell>;
}
