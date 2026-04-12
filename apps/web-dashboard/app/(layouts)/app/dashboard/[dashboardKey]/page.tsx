import { CustomDashboardPage } from '../custom-db-1/page';

export default async function DynamicCustomDashboardPage({
  params,
}: {
  params: Promise<{ dashboardKey: string }>;
}) {
  const { dashboardKey } = await params;
  return <CustomDashboardPage dashboardKey={dashboardKey} />;
}
