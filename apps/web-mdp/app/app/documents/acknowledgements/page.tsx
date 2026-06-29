import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { DmsNav } from '@/components/molecules/dms-nav';
import { DmsAcknowledgementsPage } from '@/components/pages/dms-acknowledgements-page';

export const metadata: Metadata = { title: 'Acknowledgements' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <DmsNav />
        <DmsAcknowledgementsPage />
      </div>
    </AppShell>
  );
}
