import type { Metadata } from 'next';
import { SchedulePage } from '@/features/admin-schedule/ui/schedule-page';

export const metadata: Metadata = { title: 'Jadwal' };

export default function AdminScheduleRoute() {
  return <SchedulePage />;
}
