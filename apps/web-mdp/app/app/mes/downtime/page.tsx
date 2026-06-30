import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { MesNav } from '@/components/molecules/mes-nav';
import { DowntimeEventsPage } from '@/components/pages/downtime-events-page';

export const metadata: Metadata = { title: 'MES · Downtime Events' };

export default function Page() {
  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <MesNav />
        <div className="min-h-0 flex-1">
          <DowntimeEventsPage />
        </div>
      </div>
    </AppShell>
  );
}
