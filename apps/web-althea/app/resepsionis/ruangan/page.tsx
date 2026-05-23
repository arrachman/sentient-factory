import type { Metadata } from 'next';
import { OwnerRuanganPage } from '@/features/owner-dashboard/ui/owner-ruangan-page';

export const metadata: Metadata = { title: 'Pemakaian Ruangan' };

export default function ResepsionisRuanganRoute() {
  return <OwnerRuanganPage />;
}
