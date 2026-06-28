import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { QmsNav } from '@/components/molecules/qms-nav';
import { QmsResultsPage } from '@/components/pages/qms-results-page';

export const metadata: Metadata = { title: 'QMS · Results' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <QmsNav />
        <QmsResultsPage />
      </div>
    </AppShell>
  );
}
