import type { Metadata } from 'next';
import { BookingPage } from '@/features/admin-booking/ui/booking-page';

export const metadata: Metadata = { title: 'Booking' };

export default function AdminBookingRoute() {
  return <BookingPage />;
}
