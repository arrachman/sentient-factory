import type { Metadata } from 'next';
import { ClientsPage } from '@/features/admin-clients/ui/clients-page';

export const metadata: Metadata = { title: 'Klien' };

export default function AdminClientsRoute() {
  return <ClientsPage />;
}
