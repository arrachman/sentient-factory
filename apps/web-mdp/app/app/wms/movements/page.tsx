import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { WmsNav } from '@/components/molecules/wms-nav';
import { WmsMovementsPage } from '@/components/pages/wms-movements-page';

export const metadata: Metadata = { title: 'WMS · Movements' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <WmsNav />
        <WmsMovementsPage />
      </div>
    </AppShell>
  );
}
