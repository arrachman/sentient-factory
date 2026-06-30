import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { OeeDashboardPage } from '@/components/pages/oee-dashboard-page';

export const metadata: Metadata = { title: 'OEE Overlay' };

export default function OeePage() {
  return (
    <AppShell>
      <OeeDashboardPage />
    </AppShell>
  );
}
