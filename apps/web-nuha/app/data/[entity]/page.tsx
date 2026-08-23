import { notFound } from 'next/navigation';
import { Shell } from '@/components/Shell';
import { requirePage } from '@/lib/access';
import { CrudPanel } from '@/components/CrudPanel';
import { getEntity } from '@/lib/crud/registry';
import { listRows, toClientEntity } from '@/lib/crud/engine';

export default async function EntityPage({ params }: { params: Promise<{ entity: string }> }) {
  const { entity: key } = await params;
  const entity = getEntity(key);
  if (!entity) notFound();
  // The registry names the menu, so the existing grant check gates CRUD too.
  const session = await requirePage(entity.menu);
  const rows = await listRows(entity);
  return <Shell session={session} active={entity.menu} title={entity.label}>
    <CrudPanel entity={toClientEntity(entity)} rows={rows} />
  </Shell>;
}
