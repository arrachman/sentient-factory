import type { Metadata } from 'next';
import { LayananPage } from '@/features/admin-layanan/ui/layanan-page';

export const metadata: Metadata = { title: 'Layanan' };

export default function AdminLayananRoute() {
  return <LayananPage />;
}
