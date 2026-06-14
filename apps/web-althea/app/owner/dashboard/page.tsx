import type { Metadata } from 'next';
import { OwnerDashboardPage } from '@/features/owner-dashboard/ui/owner-dashboard-page';

export const metadata: Metadata = { title: 'Dashboard Owner' };

export default function OwnerDashboardRoute() {
  return <OwnerDashboardPage />;
}
