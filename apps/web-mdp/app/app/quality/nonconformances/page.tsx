import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { QmsNav } from '@/components/molecules/qms-nav';
import { QmsNonconformancesPage } from '@/components/pages/qms-nonconformances-page';

export const metadata: Metadata = { title: 'QMS · NCR' };

export default function Page() {
  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <QmsNav />
        <div className="min-h-0 flex-1">
          <QmsNonconformancesPage />
        </div>
      </div>
    </AppShell>
  );
}
