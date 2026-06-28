import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { ProductionOrdersPage } from '@/components/pages/production-orders-page';

export const metadata: Metadata = { title: 'MES · Production Orders' };

export default function MesPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <ProductionOrdersPage />
      </div>
    </AppShell>
  );
}
