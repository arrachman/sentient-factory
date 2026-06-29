import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { DmsNav } from '@/components/molecules/dms-nav';
import { DmsDocumentsPage } from '@/components/pages/dms-documents-page';

export const metadata: Metadata = { title: 'Documents' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <DmsNav />
        <DmsDocumentsPage />
      </div>
    </AppShell>
  );
}
