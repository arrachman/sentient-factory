import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { WmsNav } from '@/components/molecules/wms-nav';
import { WmsTasksPage } from '@/components/pages/wms-tasks-page';

export const metadata: Metadata = { title: 'WMS · Tasks' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <WmsNav />
        <WmsTasksPage />
      </div>
    </AppShell>
  );
}
