import type { Metadata } from 'next';
import { AttendanceClockView } from '@/components/pages/attendance-clock-view';

export const metadata: Metadata = { title: 'Absensi Saya' };

export default function Page() {
  return <AttendanceClockView />;
}
