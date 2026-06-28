import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { QmsNav } from '@/components/molecules/qms-nav';
import { QmsNonconformancesPage } from '@/components/pages/qms-nonconformances-page';

export const metadata: Metadata = { title: 'QMS · NCR' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <QmsNav />
        <QmsNonconformancesPage />
      </div>
    </AppShell>
  );
}
