import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClientDetailPage } from '@/features/admin-clients/ui/client-detail-page';

export const metadata: Metadata = { title: 'Detail Klien' };

export default async function ResepsionisClientDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const clientId = Number(id);
  if (!Number.isInteger(clientId) || clientId <= 0) notFound();
  return (
    <ClientDetailPage
      clientId={clientId}
      basePath="/resepsionis/clients"
      schedulePath="/resepsionis/daftar-jadwal"
    />
  );
}
