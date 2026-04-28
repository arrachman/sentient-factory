import { HrAttendanceHistoryPageView } from '../_components/hr-attendance-history-page-view';

export default async function HrAttendanceHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>;
}) {
  const params = await searchParams;
  return <HrAttendanceHistoryPageView initialUserId={params?.userId} />;
}
