import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { WorkCalendarsPage } from '@/components/pages/work-calendars-page';

export const metadata: Metadata = { title: 'Master · Work Calendar' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <WorkCalendarsPage />
      </div>
    </AppShell>
  );
}
