import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { EhsNav } from '@/components/molecules/ehs-nav';
import { EhsIncidentsPage } from '@/components/pages/ehs-incidents-page';

export const metadata: Metadata = { title: 'Incidents' };

export default function Page() {
  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <EhsNav />
        <div className="min-h-0 flex-1">
          <EhsIncidentsPage />
        </div>
      </div>
    </AppShell>
  );
}
