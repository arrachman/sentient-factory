import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { MntNav } from '@/components/molecules/mnt-nav';
import { MntPmSchedulesPage } from '@/components/pages/mnt-pm-schedules-page';

export const metadata: Metadata = { title: 'CMMS · PM Schedules' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <MntNav />
        <MntPmSchedulesPage />
      </div>
    </AppShell>
  );
}
