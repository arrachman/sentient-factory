import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { MntNav } from '@/components/molecules/mnt-nav';
import { MntSparePartsPage } from '@/components/pages/mnt-spare-parts-page';

export const metadata: Metadata = { title: 'CMMS · Spare Parts' };

export default function Page() {
  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <MntNav />
        <div className="min-h-0 flex-1">
          <MntSparePartsPage />
        </div>
      </div>
    </AppShell>
  );
}
