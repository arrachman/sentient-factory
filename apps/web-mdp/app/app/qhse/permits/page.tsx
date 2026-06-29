import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { EhsNav } from '@/components/molecules/ehs-nav';
import { EhsPermitsPage } from '@/components/pages/ehs-permits-page';

export const metadata: Metadata = { title: 'Permits' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <EhsNav />
        <EhsPermitsPage />
      </div>
    </AppShell>
  );
}
