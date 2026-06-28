import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { MesNav } from '@/components/molecules/mes-nav';
import { MaterialConsumptionsPage } from '@/components/pages/material-consumptions-page';

export const metadata: Metadata = { title: 'MES · Material Consumptions' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <MesNav />
        <MaterialConsumptionsPage />
      </div>
    </AppShell>
  );
}
