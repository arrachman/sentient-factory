import type { Metadata } from 'next';
import { SchedulesView } from '@/components/pages/schedules-view';

export const metadata: Metadata = { title: 'Jadwal & Shift' };

export default function Page() {
  return <SchedulesView />;
}
