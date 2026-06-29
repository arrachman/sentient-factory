import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { EhsNav } from '@/components/molecules/ehs-nav';
import { EhsAuditsPage } from '@/components/pages/ehs-audits-page';

export const metadata: Metadata = { title: 'Audits' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <EhsNav />
        <EhsAuditsPage />
      </div>
    </AppShell>
  );
}
