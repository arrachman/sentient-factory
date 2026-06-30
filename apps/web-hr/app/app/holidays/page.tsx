import type { Metadata } from 'next';
import { HolidaysView } from '@/components/pages/holidays-view';

export const metadata: Metadata = { title: 'Kalender Libur' };

export default function Page() {
  return <HolidaysView />;
}
