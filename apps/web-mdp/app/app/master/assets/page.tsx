import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { AssetsPage } from '@/components/pages/assets-page';

export const metadata: Metadata = { title: 'Master · Aset' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <AssetsPage />
      </div>
    </AppShell>
  );
}
