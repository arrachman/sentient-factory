import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { DmsNav } from '@/components/molecules/dms-nav';
import { DmsDocumentsPage } from '@/components/pages/dms-documents-page';

export const metadata: Metadata = { title: 'Documents' };

export default function Page() {
  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <DmsNav />
        <div className="min-h-0 flex-1">
          <DmsDocumentsPage />
        </div>
      </div>
    </AppShell>
  );
}
