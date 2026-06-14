import type { Metadata } from 'next';
import { ResepsionisDashboardPage } from '@/features/resepsionis-dashboard/ui/resepsionis-dashboard-page';

export const metadata: Metadata = { title: 'Dashboard Resepsionis' };

export default function ResepsionisDashboardRoute() {
  return <ResepsionisDashboardPage />;
}
