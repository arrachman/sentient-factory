import type { Metadata } from 'next';
import { ClientsPage } from '@/features/admin-clients/ui/clients-page';

export const metadata: Metadata = { title: 'Klien' };

export default function ResepsionisClientsRoute() {
  return <ClientsPage basePath="/resepsionis/clients" />;
}
