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

export function NotificationLogsPageView() {
  const [logs, setLogs] = useState<AlertDeliveryLogRecord[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState('');
  const [observability, setObservability] = useState<AlertDeliveryObservabilityPayload | null>(null);
  const [requeueLoadingId, setRequeueLoadingId] = useState<number | null>(null);

  async function loadLogs() {
    setLogsLoading(true);
    setLogsError('');
    try {
      const response = await fetch('/api/alerting/delivery-logs', { cache: 'no-store' });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to load notification logs.');
      }
      setLogs(payload.data as AlertDeliveryLogRecord[]);
    } catch (error) {
      setLogs([]);
      setLogsError(error instanceof Error ? error.message : 'Failed to load notification logs.');
    } finally {
      setLogsLoading(false);
    }
  }

  async function loadObservability() {
    try {
      const response = await fetch('/api/alerting/delivery-observability', { cache: 'no-store' });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !payload?.data) {
        throw new Error(payload?.message || 'Failed to load delivery observability.');
      }
      setObservability(payload.data as AlertDeliveryObservabilityPayload);
    } catch {
      setObservability(null);
    }
  }

  async function requeueDelivery(deliveryId: number) {
    setRequeueLoadingId(deliveryId);
    setLogsError('');
    try {
      const response = await fetch(`/api/alerting/delivery-logs/${deliveryId}/requeue`, { method: 'POST' });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to requeue delivery log.');
      }
      await Promise.all([loadLogs(), loadObservability()]);
    } catch (error) {
      setLogsError(error instanceof Error ? error.message : 'Failed to requeue delivery log.');
    } finally {
      setRequeueLoadingId(null);
    }
  }

  useEffect(() => {
    let cancelled = false;
    void loadLogs();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    void loadObservability();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Shell
      title="Notification Logs"
      description="Audit delivery events before provider integration goes live."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/app/alerting/triage">Open Triage</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/app/alerting/ops">Open Alert Ops</Link>
          </Button>
        </div>
      }
    >
      {observability ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {[
            { label: 'Total Logs', value: observability.summary.total_logs },
            { label: 'Delivered', value: observability.summary.delivered_logs },
            { label: 'Queued', value: observability.summary.queued_logs },
            { label: 'Failed', value: observability.summary.failed_logs },
            { label: 'Dead Lettered', value: observability.summary.dead_lettered_logs },
            { label: 'Retried', value: observability.summary.retried_logs },
          ].map((item) => (
            <Card key={item.label}>
              <CardHeader className="pb-2">
                <CardDescription>{item.label}</CardDescription>
                <CardTitle className="text-3xl">{item.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : null}

      {observability ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Delivery By Channel</CardTitle>
              <CardDescription>Success and queue profile per channel type.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {observability.by_channel.map((item) => (
                <div key={item.channel_type} className="rounded-xl border px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">{item.channel_type}</span>
                    <Badge variant="outline">{item.total_logs} total</Badge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Delivered: {item.delivered_logs} · Failed: {item.failed_logs} · Queued: {item.queued_logs}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Retries</CardTitle>
              <CardDescription>Deliveries waiting for the next retry window.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {observability.pending_retries.map((item) => (
                <div key={item.delivery_id} className="rounded-xl border px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">Delivery #{item.delivery_id}</span>
                    <Badge variant="outline">{item.retry_count}/{item.max_retries}</Badge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {item.channel_type} · {item.target_value}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Next Retry: {item.next_retry_at ? String(item.next_retry_at).replace('T', ' ').slice(0, 19) : '-'}
                  </div>
                </div>
              ))}
              {!observability.pending_retries.length ? (
                <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
                  No pending retries are waiting right now.
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {observability ? (
        <Card>
          <CardHeader>
            <CardTitle>Dead Letter Dashboard</CardTitle>
            <CardDescription>Deliveries that exhausted retry attempts and need manual recovery.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {observability.dead_letters.map((item) => (
              <div key={item.delivery_id} className="rounded-xl border px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">Delivery #{item.delivery_id}</span>
                  <Badge variant="outline">{item.retry_count}/{item.max_retries}</Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {item.channel_type} · {item.target_value}
                </div>
                <div className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                  {item.dead_letter_reason || 'No dead-letter reason recorded.'}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Dead Lettered At: {item.dead_lettered_at ? String(item.dead_lettered_at).replace('T', ' ').slice(0, 19) : '-'}
                </div>
              </div>
            ))}
            {!observability.dead_letters.length ? (
              <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
                No dead-letter deliveries are waiting for action.
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Delivery History</CardTitle>
          <CardDescription>These rows now come from the real `alert_delivery_log` table.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {logsError ? <div className="mb-4 text-sm text-rose-600 dark:text-rose-400">{logsError}</div> : null}
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b text-left text-muted-foreground">
              <tr>
                <th className="px-2 py-3 font-medium">Event</th>
                <th className="px-2 py-3 font-medium">Channel</th>
                <th className="px-2 py-3 font-medium">Recipient</th>
                <th className="px-2 py-3 font-medium">Status</th>
                <th className="px-2 py-3 font-medium">Retry</th>
                <th className="px-2 py-3 font-medium">Sent At</th>
                <th className="px-2 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.delivery_log_id} className="border-b last:border-b-0">
                  <td className="px-2 py-4">
                    <div className="font-medium">{log.event_title}</div>
                    <div className="text-xs text-muted-foreground">{log.event_key}</div>
                  </td>
                  <td className="px-2 py-4">{log.channel_type}</td>
                  <td className="px-2 py-4">
                    <div>{log.target_label || '-'}</div>
                    <div className="text-xs text-muted-foreground">{log.target_value}</div>
                  </td>
                  <td className="px-2 py-4">
                    <Badge variant="outline" className={cn('capitalize', statusBadgeClass(log.delivery_status))}>{log.delivery_status}</Badge>
                    {log.error_message ? (
                      <div className="mt-1 text-xs text-rose-600 dark:text-rose-400">{log.error_message}</div>
                    ) : null}
                    {log.dead_letter_reason ? (
                      <div className="mt-1 text-xs text-amber-600 dark:text-amber-400">{log.dead_letter_reason}</div>
                    ) : null}
                  </td>
                  <td className="px-2 py-4">
                    <div>{log.retry_count}/{log.max_retries}</div>
                    <div className="text-xs text-muted-foreground">
                      {log.next_retry_at ? `Next: ${log.next_retry_at.replace('T', ' ').slice(0, 19)}` : '-'}
                    </div>
                  </td>
                  <td className="px-2 py-4">{(log.sent_at || log.queued_at || '-').replace('T', ' ').slice(0, 19)}</td>
                  <td className="px-2 py-4">
                    {['failed', 'dead-lettered'].includes(log.delivery_status) ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={requeueLoadingId === log.delivery_log_id}
                        onClick={() => requeueDelivery(log.delivery_log_id)}
                      >
                        {requeueLoadingId === log.delivery_log_id ? 'Requeueing...' : 'Requeue'}
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logsLoading ? <div className="py-10 text-center text-sm text-muted-foreground">Loading delivery logs...</div> : null}
          {!logsLoading && !logs.length ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No delivery logs have been written yet.
            </div>
          ) : null}
        </CardContent>
      </Card>
    </Shell>
  );
}

