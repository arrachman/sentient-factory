import { HrAttendancePageView } from '../_components/hr-ui';

export default async function HrAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ targetUserId?: string; action?: string }>;
}) {
  const params = await searchParams;
  return (
    <HrAttendancePageView
      initialTargetUserId={params?.targetUserId}
      initialActionMode={params?.action === 'enroll' ? 'enroll' : undefined}
    />
  );
}
