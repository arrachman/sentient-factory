import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { MesNav } from '@/components/molecules/mes-nav';
import { LaborLogsPage } from '@/components/pages/labor-logs-page';

export const metadata: Metadata = { title: 'MES · Labor Logs' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <MesNav />
        <LaborLogsPage />
      </div>
    </AppShell>
  );
}
