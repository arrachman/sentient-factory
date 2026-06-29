import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { EhsNav } from '@/components/molecules/ehs-nav';
import { EhsIncidentsPage } from '@/components/pages/ehs-incidents-page';

export const metadata: Metadata = { title: 'Incidents' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <EhsNav />
        <EhsIncidentsPage />
      </div>
    </AppShell>
  );
}
