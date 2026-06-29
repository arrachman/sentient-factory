import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { PrtNav } from '@/components/molecules/prt-nav';
import { PrtIssuesPage } from '@/components/pages/prt-issues-page';

export const metadata: Metadata = { title: 'Issues' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <PrtNav />
        <PrtIssuesPage />
      </div>
    </AppShell>
  );
}
