import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Shell, IkonMenu } from '@/components/templates/Shell';
import { requirePage } from '@/lib/access';
import { prisma } from '@/lib/prisma';
import { CrudPanel } from '@/components/CrudPanel';
import { Pagination, bacaHalaman } from '@/components';
import { getEntity } from '@/lib/crud/registry';
import { listRows, countRows, toClientEntity } from '@/lib/crud/engine';

const UKURAN_HALAMAN_CRUD = 25;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function EntityPage({ params, searchParams }: { params: Promise<{ entity: string }>; searchParams: SearchParams }) {
  const { entity: key } = await params;
  const entity = getEntity(key);
  if (!entity) notFound();
  // The registry names the menu, so the existing grant check gates CRUD too.
  const session = await requirePage(entity.menu);
  const sp = await searchParams;
  const halaman = bacaHalaman(sp);
  const [rows, total, menuInfo] = await Promise.all([
    listRows(entity, halaman),
    countRows(entity),
    prisma.menu.findUnique({ where: { key: entity.menu }, select: { icon: true } }),
  ]);
  const totalHalaman = Math.max(1, Math.ceil(total / UKURAN_HALAMAN_CRUD));
  return <Shell session={session} active="data" title={entity.label}>
    <Link href="/data" className="muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
      <IkonMenu menuKey={entity.menu} path={menuInfo?.icon} size={15} /> &larr; Kembali ke Kelola Data
    </Link>
    <CrudPanel entity={toClientEntity(entity)} rows={rows} />
    <Pagination
      halaman={halaman}
      totalHalaman={totalHalaman}
      total={total}
      jumlahBaris={rows.length}
      ukuranHalaman={UKURAN_HALAMAN_CRUD}
      buatHref={(p) => `/data/${key}?halaman=${p}`}
    />
  </Shell>;
}
