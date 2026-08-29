import Link from 'next/link';
import { notFound } from 'next/navigation';
import { IkonMenu } from '@/components/templates/Shell';
import { requirePage } from '@/lib/access';
import { prisma } from '@/lib/prisma';
import { CrudPanel } from '@/components/CrudPanel';
import { Pagination, LimitPicker, FilterBar, bacaHalaman, bacaLimit, satu, filterQuery } from '@/components';
import { getEntity } from '@/lib/crud/registry';
import { listRows, countRows, toClientEntity } from '@/lib/crud/engine';
import { RingkasanSantri } from '../ringkasan-santri';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function EntityPage({ params, searchParams }: { params: Promise<{ entity: string }>; searchParams: SearchParams }) {
  const { entity: key } = await params;
  const entity = getEntity(key);
  if (!entity) notFound();
  // The registry names the menu, so the existing grant check gates CRUD too.
  await requirePage(entity.menu);
  const sp = await searchParams;
  const halaman = bacaHalaman(sp);
  const limit = bacaLimit(sp);
  const filters: Record<string, string> = {};
  const q = satu(sp.q);
  if (q) filters.q = q;
  for (const field of entity.fields) {
    // Tanpa parameter di URL, filter berbawaan (mis. Status = Mukim) yang
    // berlaku; "Semua" mengirim nilai eksplisit untuk membatalkannya.
    const value = satu(sp[field.name]) || field.filterDefault;
    if (value) filters[field.name] = value;
  }
  const [rows, total, menuInfo, clientEntity] = await Promise.all([
    listRows(entity, halaman, limit, filters),
    countRows(entity, filters),
    prisma.menu.findUnique({ where: { key: entity.menu }, select: { icon: true } }),
    toClientEntity(entity),
  ]);
  const totalHalaman = Math.max(1, Math.ceil(total / limit));
  const fq = filterQuery(filters);
  return <>
    <Link href="/data" className="muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
      <IkonMenu menuKey={entity.menu} path={menuInfo?.icon} size={15} /> &larr; Kembali ke Kelola Data
    </Link>
    {key === 'santri' && <RingkasanSantri filters={filters} />}
    <FilterBar entity={clientEntity} hrefBase={`/data/${key}`} filters={filters} limit={limit} />
    <CrudPanel entity={clientEntity} rows={rows} />
    <Pagination
      halaman={halaman}
      totalHalaman={totalHalaman}
      total={total}
      jumlahBaris={rows.length}
      ukuranHalaman={limit}
      buatHref={(p) => `/data/${key}?halaman=${p}&limit=${limit}${fq}`}
      ekstra={<LimitPicker limit={limit} hrefBase={`/data/${key}`} query={fq} />}
    />
  </>;
}
