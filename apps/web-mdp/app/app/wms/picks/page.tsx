import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { WmsNav } from '@/components/molecules/wms-nav';
import { WmsPicksPage } from '@/components/pages/wms-picks-page';

export const metadata: Metadata = { title: 'WMS · Picks' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <WmsNav />
        <WmsPicksPage />
      </div>
    </AppShell>
  );
}
