import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { MesNav } from '@/components/molecules/mes-nav';
import { ProductionOrdersPage } from '@/components/pages/production-orders-page';

export const metadata: Metadata = { title: 'MES · Production Orders' };

export default function MesPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <MesNav />
        <ProductionOrdersPage />
      </div>
    </AppShell>
  );
}
