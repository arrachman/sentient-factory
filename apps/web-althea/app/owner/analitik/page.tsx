import type { Metadata } from 'next';
import { OwnerAnalitikPage } from '@/features/owner-dashboard/ui/owner-analitik-page';

export const metadata: Metadata = { title: 'Analitik Owner' };

export default function OwnerAnalitikRoute() {
  return <OwnerAnalitikPage />;
}
