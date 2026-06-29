import type { Metadata } from 'next';
import { ReportsView } from '@/components/pages/reports-view';

export const metadata: Metadata = { title: 'Laporan & Export' };

export default function Page() {
  return <ReportsView />;
}
