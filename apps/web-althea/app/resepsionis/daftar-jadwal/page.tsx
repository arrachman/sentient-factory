import type { Metadata } from 'next';
import { BookingPage } from '@/features/admin-booking/ui/booking-page';

export const metadata: Metadata = { title: 'Daftar Jadwal' };

export default function ResepsionisDaftarJadwalRoute() {
  return <BookingPage canCreate={false} />;
}
