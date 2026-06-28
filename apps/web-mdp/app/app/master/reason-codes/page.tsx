import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { ReasonCodesPage } from '@/components/pages/reason-codes-page';

export const metadata: Metadata = { title: 'Master · Reason Code' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <ReasonCodesPage />
      </div>
    </AppShell>
  );
}
