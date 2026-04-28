import { AlertDetailPageView } from '../../_components/alerting-ui';

export default async function AlertingEventPage({
  params,
}: {
  params: Promise<{ alertId: string }>;
}) {
  const { alertId } = await params;
  return <AlertDetailPageView alertId={alertId} />;
}
