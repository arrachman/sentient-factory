import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { WmsNav } from '@/components/molecules/wms-nav';
import { WmsHandlingUnitsPage } from '@/components/pages/wms-handling-units-page';

export const metadata: Metadata = { title: 'WMS · Handling Units' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <WmsNav />
        <WmsHandlingUnitsPage />
      </div>
    </AppShell>
  );
}
