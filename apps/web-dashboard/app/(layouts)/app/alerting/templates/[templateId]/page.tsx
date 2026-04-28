import { AlertTemplateDetailPageView } from '../../_components/alerting-ui';

export default async function AlertTemplateDetailPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  return <AlertTemplateDetailPageView templateId={templateId} />;
}
