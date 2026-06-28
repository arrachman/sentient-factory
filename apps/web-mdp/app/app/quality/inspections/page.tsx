import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { QmsNav } from '@/components/molecules/qms-nav';
import { QmsInspectionsPage } from '@/components/pages/qms-inspections-page';

export const metadata: Metadata = { title: 'QMS · Inspections' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <QmsNav />
        <QmsInspectionsPage />
      </div>
    </AppShell>
  );
}
