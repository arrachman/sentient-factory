import { AlertDeadLetterTriageDetailPageView } from '../../_components/alerting-ui';

export default async function AlertingTriageDetailPage({
  params,
}: {
  params: Promise<{ deliveryId: string }>;
}) {
  const { deliveryId } = await params;
  return <AlertDeadLetterTriageDetailPageView deliveryId={deliveryId} />;
}
