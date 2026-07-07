import type { Metadata } from 'next';
import { AttendanceReviewsView } from '@/components/pages/attendance-reviews-view';

export const metadata: Metadata = { title: 'Tinjauan Absensi' };

export default function Page() {
  return <AttendanceReviewsView />;
}
