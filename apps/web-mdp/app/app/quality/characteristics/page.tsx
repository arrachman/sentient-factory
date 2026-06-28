import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { QmsNav } from '@/components/molecules/qms-nav';
import { QmsCharacteristicsPage } from '@/components/pages/qms-characteristics-page';

export const metadata: Metadata = { title: 'QMS · Characteristics' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <QmsNav />
        <QmsCharacteristicsPage />
      </div>
    </AppShell>
  );
}
