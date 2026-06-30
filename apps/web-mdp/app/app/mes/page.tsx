import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { MesNav } from '@/components/molecules/mes-nav';
import { ProductionOrdersPage } from '@/components/pages/production-orders-page';

export const metadata: Metadata = { title: 'MES · Production Orders' };

export default function MesPage() {
  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <MesNav />
        <div className="min-h-0 flex-1">
          <ProductionOrdersPage />
        </div>
      </div>
    </AppShell>
  );
}
