import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { MntNav } from '@/components/molecules/mnt-nav';
import { MntSparePartsPage } from '@/components/pages/mnt-spare-parts-page';

export const metadata: Metadata = { title: 'CMMS · Spare Parts' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <MntNav />
        <MntSparePartsPage />
      </div>
    </AppShell>
  );
}
