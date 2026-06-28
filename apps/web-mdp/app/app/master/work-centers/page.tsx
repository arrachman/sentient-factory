import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { WorkCentersPage } from '@/components/pages/work-centers-page';

export const metadata: Metadata = { title: 'Master · Work Center' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <WorkCentersPage />
      </div>
    </AppShell>
  );
}
