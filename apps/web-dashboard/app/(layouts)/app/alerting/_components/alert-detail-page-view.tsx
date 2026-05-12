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

export function AlertDetailPageView({ alertId }: { alertId: string }) {
  const [event, setEvent] = useState<AlertEventRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetch(`/api/alerting/events?eventId=${encodeURIComponent(alertId)}`, { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
          throw new Error(payload?.message || 'Failed to load alert detail.');
        }
        if (cancelled) return;
        setEvent((payload.data as AlertEventRecord[])[0] || null);
      })
      .catch((err) => {
        if (cancelled) return;
        setEvent(null);
        setError(err instanceof Error ? err.message : 'Failed to load alert detail.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [alertId]);

  const severity = event?.severity || 'medium';
  const status = event?.status || 'open';

  return (
    <Shell
      title="Alert Detail"
      description="Review the persisted alert event and its current delivery evidence."
      actions={
        <Button asChild variant="outline">
          <Link href="/app/alerting/center">Back to Alert Center</Link>
        </Button>
      }
    >
      {error ? <div className="text-sm text-rose-600 dark:text-rose-400">{error}</div> : null}
      {loading ? <div className="text-sm text-muted-foreground">Loading alert detail...</div> : null}
      {!loading && !event ? <div className="text-sm text-muted-foreground">No alert event found for this id.</div> : null}
      {event ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px]">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle>{event.title}</CardTitle>
                <Badge variant="outline" className={severityBadgeClass(severity)}>{severity}</Badge>
                <Badge variant="secondary">{status}</Badge>
              </div>
              <CardDescription>{event.description || event.metric_label || event.rule_name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <DetailRow label="Module" value={moduleLabelFromKey(event.module_key)} />
              <DetailRow label="Rule" value={event.rule_name} />
              <DetailRow label="Metric" value={event.metric_label || '-'} />
              <DetailRow label="Detected At" value={event.detected_at ? String(event.detected_at).replace('T', ' ').slice(0, 19) : '-'} />
              <DetailRow label="Scope" value={formatDimensions(event.event_payload)} />
              <DetailRow label="Source Ref" value={event.source_ref || '-'} />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Suggested Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2"><CircleAlert className="mt-0.5 size-4 text-amber-500" /> Review the affected scope and validate whether the rule threshold still matches current business expectation.</div>
                <div className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 size-4 text-emerald-500" /> Confirm delivery completion before closing the event.</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Payload</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs text-slate-100">{JSON.stringify(event.event_payload, null, 2)}</pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {event.deliveries.map((delivery, index) => (
                  <div key={`${delivery.channel_type}-${delivery.target_value}-${index}`} className="rounded-xl border px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{delivery.channel_type}</span>
                      <Badge variant="outline" className={statusBadgeClass(delivery.delivery_status)}>{delivery.delivery_status}</Badge>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">{delivery.target_value}</div>
                  </div>
                ))}
                {!event.deliveries.length ? (
                  <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
                    No delivery records are available for this alert event yet.
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

