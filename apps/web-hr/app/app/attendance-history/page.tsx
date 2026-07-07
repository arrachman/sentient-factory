import type { Metadata } from 'next';
import { AttendanceHistoryView } from '@/components/pages/attendance-history-view';

export const metadata: Metadata = { title: 'Riwayat Absensi' };

export default function Page() {
  return <AttendanceHistoryView />;
}
