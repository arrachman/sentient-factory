import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { MntNav } from '@/components/molecules/mnt-nav';
import { MntWorkOrdersPage } from '@/components/pages/mnt-work-orders-page';

export const metadata: Metadata = { title: 'CMMS · Work Orders' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <MntNav />
        <MntWorkOrdersPage />
      </div>
    </AppShell>
  );
}
