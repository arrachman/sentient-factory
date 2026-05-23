import type { Metadata } from 'next';
import { OwnerJadwalPage } from '@/features/owner-dashboard/ui/owner-jadwal-page';

export const metadata: Metadata = { title: 'Jadwal' };

export default function ResepsionisJadwalRoute() {
  return <OwnerJadwalPage />;
}
