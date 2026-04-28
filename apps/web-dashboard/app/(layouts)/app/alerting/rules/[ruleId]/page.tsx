import { AlertRuleDetailPageView } from '../../_components/alerting-ui';

export default async function AlertingRuleDetailPage({
  params,
}: {
  params: Promise<{ ruleId: string }>;
}) {
  const { ruleId } = await params;
  return <AlertRuleDetailPageView ruleId={ruleId} />;
}
