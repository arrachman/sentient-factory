import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { ShiftsPage } from '@/components/pages/shifts-page';

export const metadata: Metadata = { title: 'Master · Shift' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <ShiftsPage />
      </div>
    </AppShell>
  );
}
