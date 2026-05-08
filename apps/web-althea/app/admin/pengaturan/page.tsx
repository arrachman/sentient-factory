import type { Metadata } from 'next';
import { PengaturanPage } from '@/features/admin-pengaturan/ui/pengaturan-page';

export const metadata: Metadata = { title: 'Pengaturan' };

export default function AdminPengaturanRoute() {
  return <PengaturanPage />;
}
