import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { QmsNav } from '@/components/molecules/qms-nav';
import { QmsPlansPage } from '@/components/pages/qms-plans-page';

export const metadata: Metadata = { title: 'QMS · Inspection Plans' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <QmsNav />
        <QmsPlansPage />
      </div>
    </AppShell>
  );
}
