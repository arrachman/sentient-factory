import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { MesNav } from '@/components/molecules/mes-nav';
import { OperationsPage } from '@/components/pages/operations-page';

export const metadata: Metadata = { title: 'MES · Operations' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <MesNav />
        <OperationsPage />
      </div>
    </AppShell>
  );
}
