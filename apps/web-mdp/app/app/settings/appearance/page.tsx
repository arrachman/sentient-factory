import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { AppearancePage } from '@/components/pages/appearance-page';

export const metadata: Metadata = { title: 'Setting · Tampilan' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <AppearancePage />
      </div>
    </AppShell>
  );
}
