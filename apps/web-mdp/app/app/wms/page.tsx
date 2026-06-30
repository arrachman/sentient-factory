import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { WmsNav } from '@/components/molecules/wms-nav';
import { WmsTasksPage } from '@/components/pages/wms-tasks-page';

export const metadata: Metadata = { title: 'WMS · Tasks' };

export default function Page() {
  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <WmsNav />
        <div className="min-h-0 flex-1">
          <WmsTasksPage />
        </div>
      </div>
    </AppShell>
  );
}
