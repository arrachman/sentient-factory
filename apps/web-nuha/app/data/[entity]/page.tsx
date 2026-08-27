import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Shell, IkonMenu } from '@/components/templates/Shell';
import { requirePage } from '@/lib/access';
import { prisma } from '@/lib/prisma';
import { CrudPanel } from '@/components/CrudPanel';
import { Pagination, LimitPicker, bacaHalaman, bacaLimit } from '@/components';
import { getEntity } from '@/lib/crud/registry';
import { listRows, countRows, toClientEntity } from '@/lib/crud/engine';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function EntityPage({ params, searchParams }: { params: Promise<{ entity: string }>; searchParams: SearchParams }) {
  const { entity: key } = await params;
  const entity = getEntity(key);
  if (!entity) notFound();
  // The registry names the menu, so the existing grant check gates CRUD too.
  const session = await requirePage(entity.menu);
  const sp = await searchParams;
  const halaman = bacaHalaman(sp);
  const limit = bacaLimit(sp);
  const [rows, total, menuInfo, clientEntity] = await Promise.all([
    listRows(entity, halaman, limit),
    countRows(entity),
    prisma.menu.findUnique({ where: { key: entity.menu }, select: { icon: true } }),
    toClientEntity(entity),
  ]);
  const totalHalaman = Math.max(1, Math.ceil(total / limit));
  return <Shell session={session} active="data" title={entity.label}>
    <Link href="/data" className="muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
      <IkonMenu menuKey={entity.menu} path={menuInfo?.icon} size={15} /> &larr; Kembali ke Kelola Data
    </Link>
    <CrudPanel entity={clientEntity} rows={rows} />
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
      <LimitPicker limit={limit} hrefBase={`/data/${key}`} />
    </div>
    <Pagination
      halaman={halaman}
      totalHalaman={totalHalaman}
      total={total}
      jumlahBaris={rows.length}
      ukuranHalaman={limit}
      buatHref={(p) => `/data/${key}?halaman=${p}&limit=${limit}`}
    />
  </Shell>;
}
