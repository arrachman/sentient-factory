import { HrAttendanceReviewDetailPageView } from '../../_components/hr-attendance-reviews-page-view';

export default async function HrAttendanceReviewDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  return <HrAttendanceReviewDetailPageView eventId={eventId} />;
}
