'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  BellRing,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Filter,
  Mail,
  MessageCircleMore,
  MessageSquareMore,
  Plus,
  Settings2,
  ShieldAlert,
  Siren,
  TriangleAlert,
} from 'lucide-react';
import QRCode from 'qrcode';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { cn } from '@/lib/utils';
import {
  alertEvents,
  alertRules,
  alertSummary,
  getAlertById,
  notificationLogs,
  type AlertSeverity,
  type AlertStatus,
  type NotificationChannel,
} from '../_lib/mock-data';
import {
  moduleOptions,
  internalUserOptions,
  type AlertAnalyticsPayload,
  type AlertDeadLetterTriageAuditSummary,
  type AlertDeadLetterTriageFilterContext,
  type AlertDeadLetterTriagePolicy,
  type AlertDeadLetterTriageRecord,
  type AlertDeadLetterTriageSummary,
  type AlertDeliveryLogRecord,
  type AlertDeliveryObservabilityPayload,
  type AlertDeliveryStatusPayload,
  type AlertDeliveryStatusRecord,
  type AlertEscalationPolicyRecord,
  type AlertEventRecord,
  type AlertOpsPayload,
  type AlertRuleDetailRecord,
  type AlertRuleRecord,
  type AlertRuntimeSettingRecord,
  type AlertTemplateRecord,
  type AlertTriageSavedViewRecord,
  type BaileysPairingPayload,
  type BusinessMetricGoal,
  type BusinessMetricOption,
  type InternalUserOption,
  type MetricConditionMapping,
  type ModuleOption,
  type PersistedAlertChannelRecord,
  type SavedQueryOption,
  type SystemMetricOption,
} from './types';
import {
  alertStatusFromInsightStatus,
  formatDimensions,
  moduleLabelFromKey,
  normalizeTemplateChannel,
  severityBadgeClass,
  severityFromAnomalyLevel,
  statusBadgeClass,
  summaryIcon,
} from './utils';
import { DetailRow, SettingRow, Shell } from './_shared';

export function AlertRuleDetailPageView({ ruleId }: { ruleId: string }) {
  const [rule, setRule] = useState<AlertRuleDetailRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetch(`/api/alerting/rules/${ruleId}`, { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success || !payload?.data) {
          throw new Error(payload?.message || 'Failed to load alert rule detail.');
        }
        if (cancelled) return;
        setRule(payload.data as AlertRuleDetailRecord);
      })
      .catch((err) => {
        if (cancelled) return;
        setRule(null);
        setError(err instanceof Error ? err.message : 'Failed to load alert rule detail.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ruleId]);

  return (
    <Shell
      title="Alert Rule Detail"
      description="Review the persisted alert rule, source context, and recipient configuration."
      actions={
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/app/alerting/rules">Back to Rules</Link>
          </Button>
          <Button asChild>
            <Link href={`/app/alerting/rules/create?ruleId=${ruleId}`}>Edit Rule</Link>
          </Button>
        </div>
      }
    >
      {error ? <div className="text-sm text-rose-600 dark:text-rose-400">{error}</div> : null}
      {loading ? <div className="text-sm text-muted-foreground">Loading alert rule detail...</div> : null}
      {!loading && !rule ? <div className="text-sm text-muted-foreground">No alert rule found for this id.</div> : null}
      {rule ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px]">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle>{rule.rule_name}</CardTitle>
                <Badge variant="outline" className={severityBadgeClass(rule.severity)}>{rule.severity}</Badge>
                <Badge variant="outline" className={statusBadgeClass(rule.is_active ? 'connected' : 'draft')}>
                  {rule.is_active ? 'active' : 'inactive'}
                </Badge>
              </div>
              <CardDescription>{rule.description || rule.metric_label || rule.rule_key}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <DetailRow label="Module" value={moduleLabelFromKey(rule.module_key)} />
              <DetailRow label="Source Type" value={rule.source_type} />
              <DetailRow label="Source Ref" value={rule.source_ref || '-'} />
              <DetailRow label="Metric" value={rule.metric_label || '-'} />
              <DetailRow label="Schedule" value={rule.schedule_value} />
              <DetailRow label="Primary Channel" value={rule.primary_channel} />
              <DetailRow label="Comparison Type" value={rule.comparison_type || '-'} />
              <DetailRow label="Value Type" value={rule.value_type || '-'} />
              <DetailRow label="Condition Summary" value={rule.condition_summary || '-'} />
              <DetailRow label="Last Run" value={rule.last_run_at ? String(rule.last_run_at).replace('T', ' ').slice(0, 19) : '-'} />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recipients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rule.recipients.map((recipient) => (
                  <div key={recipient.recipient_id} className="rounded-xl border px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{recipient.target_label}</span>
                      <Badge variant="outline">{recipient.channel_type}</Badge>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">{recipient.target_value}</div>
                  </div>
                ))}
                {!rule.recipients.length ? (
                  <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
                    No recipients are configured for this rule.
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Source Context</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs text-slate-100">{JSON.stringify(rule.source_context, null, 2)}</pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Message Template</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {rule.message_template || 'No message template configured.'}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Run History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rule.run_history.map((run) => (
                  <div key={run.run_log_id} className="rounded-xl border px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">Run #{run.run_log_id}</span>
                      <Badge variant="outline" className={statusBadgeClass(run.run_status)}>{run.run_status}</Badge>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Matched: {run.matched_count} · Triggered Events: {run.triggered_event_count}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Started: {run.started_at ? String(run.started_at).replace('T', ' ').slice(0, 19) : '-'}
                      {' · '}
                      Finished: {run.finished_at ? String(run.finished_at).replace('T', ' ').slice(0, 19) : '-'}
                    </div>
                    {run.error_message ? <div className="mt-2 text-xs text-rose-600 dark:text-rose-400">{run.error_message}</div> : null}
                  </div>
                ))}
                {!rule.run_history.length ? (
                  <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
                    No run history is available for this rule yet.
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rule.recent_events.map((event) => (
                  <div key={event.event_id} className="rounded-xl border px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{event.title}</span>
                      <div className="flex gap-2">
                        <Badge variant="outline" className={severityBadgeClass(event.severity as AlertSeverity)}>{event.severity}</Badge>
                        <Badge variant="outline" className={statusBadgeClass(event.status)}>{event.status}</Badge>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {event.detected_at ? String(event.detected_at).replace('T', ' ').slice(0, 19) : '-'}
                    </div>
                    <div className="mt-3">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/app/alerting/events/${event.event_id}`}>Open Event</Link>
                      </Button>
                    </div>
                  </div>
                ))}
                {!rule.recent_events.length ? (
                  <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
                    No events have been generated by this rule yet.
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </Shell>
  );
}

