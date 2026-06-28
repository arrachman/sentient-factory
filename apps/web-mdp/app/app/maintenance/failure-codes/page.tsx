import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { MntNav } from '@/components/molecules/mnt-nav';
import { MntFailureCodesPage } from '@/components/pages/mnt-failure-codes-page';

export const metadata: Metadata = { title: 'CMMS · Failure Codes' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <MntNav />
        <MntFailureCodesPage />
      </div>
    </AppShell>
  );
}
