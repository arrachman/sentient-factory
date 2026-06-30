import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { QmsNav } from '@/components/molecules/qms-nav';
import { QmsCapaActionsPage } from '@/components/pages/qms-capa-actions-page';

export const metadata: Metadata = { title: 'QMS · CAPA' };

export default function Page() {
  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <QmsNav />
        <div className="min-h-0 flex-1">
          <QmsCapaActionsPage />
        </div>
      </div>
    </AppShell>
  );
}
