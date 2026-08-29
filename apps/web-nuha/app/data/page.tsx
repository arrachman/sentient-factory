import { Shell } from '@/components/templates/Shell';
import { PencarianEntitas } from './PencarianEntitas';
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
  const kelompok = [...grup.entries()]
    .sort((a, b) => (menuInfo.get(a[0])?.urutan ?? 999) - (menuInfo.get(b[0])?.urutan ?? 999))
    .map(([menuKey, items]) => ({
      menuKey,
      label: menuInfo.get(menuKey)?.label ?? menuKey,
      icon: menuInfo.get(menuKey)?.icon,
      items: items.map((entity) => ({ key: entity.key, label: entity.label })),
    }));
  const personaKartu = persona.map((item) => ({ ...item, icon: menuInfo.get('induk')?.icon }));

  return <Shell session={session} active="data" title="Kelola Data">
    <div className="card"><h3>Kelola data operasional</h3><p className="muted">Di sini Anda bisa menambah, mengubah, dan menghapus data. Daftarnya dikelompokkan per modul, dan Anda hanya melihat data yang menunya boleh Anda akses. Semua perubahan otomatis tercatat di audit log.</p></div>
    <PencarianEntitas persona={personaKartu} kelompok={kelompok} />
  </Shell>;
}
