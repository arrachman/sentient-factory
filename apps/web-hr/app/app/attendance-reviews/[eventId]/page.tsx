import type { Metadata } from 'next';
import { AttendanceReviewDetailView } from '@/components/pages/attendance-review-detail-view';

export const metadata: Metadata = { title: 'Detail Tinjauan Absensi' };

export default async function Page({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  return <AttendanceReviewDetailView eventId={eventId} />;
}
