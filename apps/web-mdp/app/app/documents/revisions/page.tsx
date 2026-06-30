import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { DmsNav } from '@/components/molecules/dms-nav';
import { DmsRevisionsPage } from '@/components/pages/dms-revisions-page';

export const metadata: Metadata = { title: 'Revisions' };

export default function Page() {
  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <DmsNav />
        <div className="min-h-0 flex-1">
          <DmsRevisionsPage />
        </div>
      </div>
    </AppShell>
  );
}
