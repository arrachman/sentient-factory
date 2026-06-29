import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { PrtNav } from '@/components/molecules/prt-nav';
import { PrtEscalationsPage } from '@/components/pages/prt-escalations-page';

export const metadata: Metadata = { title: 'Escalations' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <PrtNav />
        <PrtEscalationsPage />
      </div>
    </AppShell>
  );
}
