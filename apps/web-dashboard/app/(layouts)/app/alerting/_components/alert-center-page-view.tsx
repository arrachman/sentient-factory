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

export function AlertCenterPageView() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | AlertSeverity>('all');
  const [moduleFilter, setModuleFilter] = useState<(typeof moduleOptions)[number]>('All Modules');
  const [events, setEvents] = useState<AlertEventRecord[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [analytics, setAnalytics] = useState<AlertAnalyticsPayload | null>(null);

  async function updateEventStatus(eventId: number, nextStatus: AlertStatus) {
    setActionLoadingId(eventId);
    setEventsError('');
    try {
      const response = await fetch(`/api/alerting/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !payload?.data) {
        throw new Error(payload?.message || 'Failed to update alert event.');
      }
      setEvents((current) =>
        current.map((item) => (item.event_id === eventId ? (payload.data as AlertEventRecord) : item)),
      );
    } catch (error) {
      setEventsError(error instanceof Error ? error.message : 'Failed to update alert event.');
    } finally {
      setActionLoadingId(null);
    }
  }

  useEffect(() => {
    let cancelled = false;
    setEventsLoading(true);
    setEventsError('');
    const moduleQuery = moduleFilter === 'All Modules' ? 'all' : moduleFilter.toLowerCase();
    fetch(`/api/alerting/events?module=${encodeURIComponent(moduleQuery)}`, { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
          throw new Error(payload?.message || 'Failed to load alert events.');
        }
        if (cancelled) return;
        setEvents(payload.data as AlertEventRecord[]);
      })
      .catch((error) => {
        if (cancelled) return;
        setEvents([]);
        setEventsError(error instanceof Error ? error.message : 'Failed to load alert events.');
      })
      .finally(() => {
        if (!cancelled) setEventsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [moduleFilter]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/alerting/analytics', { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success || !payload?.data) {
          throw new Error(payload?.message || 'Failed to load alert analytics.');
        }
        if (!cancelled) {
          setAnalytics(payload.data as AlertAnalyticsPayload);
        }
      })
      .catch(() => {
        if (!cancelled) setAnalytics(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const alertSummaryItems = useMemo(() => {
    const activeAlerts = events.filter((item) => item.status === 'open').length;
    const criticalAlerts = events.filter((item) => item.severity === 'critical').length;
    const reviewedAlerts = events.filter((item) => item.status === 'acknowledged').length;
    const resolvedAlerts = events.filter((item) => item.status === 'resolved').length;
    return [
      { label: 'Active Alerts', value: String(activeAlerts), delta: `${events.length} alert events` },
      { label: 'Critical Alerts', value: String(criticalAlerts), delta: 'severity = critical' },
      { label: 'Reviewed Alerts', value: String(reviewedAlerts), delta: 'status acknowledged' },
      { label: 'Resolved Alerts', value: String(resolvedAlerts), delta: 'status resolved' },
    ];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((item) => {
      const moduleLabel = moduleLabelFromKey(item.module_key);
      const haystack = `${item.title} ${item.description || ''} ${item.metric_label || ''} ${formatDimensions(item.event_payload)}`.toLowerCase();
      const matchesSearch = !search || haystack.includes(search.toLowerCase());
      const matchesSeverity = severityFilter === 'all' || item.severity === severityFilter;
      const matchesModule = moduleFilter === 'All Modules' || moduleLabel === moduleFilter;
      return matchesSearch && matchesSeverity && matchesModule;
    });
  }, [events, moduleFilter, search, severityFilter]);

  return (
    <Shell
      title="Alert Center"
      description="Monitor real alert events that were captured by the alerting domain."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/app/alerting/ops">Open Ops</Link>
          </Button>
          <Button asChild>
            <Link href="/app/alerting/rules/create">
              <Plus className="mr-2 size-4" />
              Create Rule
            </Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {alertSummaryItems.map((item) => {
          const Icon = summaryIcon(item.label);
          return (
            <Card key={item.label} className="overflow-hidden border-slate-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-3">
                  <CardDescription>{item.label}</CardDescription>
                  <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
                    <Icon className="size-4" />
                  </div>
                </div>
                <CardTitle className="text-3xl">{item.value}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{item.delta}</CardContent>
            </Card>
          );
        })}
      </div>

      {analytics ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Noisy Rules</CardTitle>
              <CardDescription>Top rules by event volume in the last 24 hours.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics.noisy_rules.map((rule) => (
                <div key={rule.rule_id} className="rounded-xl border px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">{rule.rule_name}</span>
                    <Badge variant="outline">{rule.event_count_24h} events / 24h</Badge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Module: {moduleLabelFromKey(rule.module_key)} · Open: {rule.open_count_24h} · Last: {rule.last_detected_at ? String(rule.last_detected_at).replace('T', ' ').slice(0, 19) : '-'}
                  </div>
                </div>
              ))}
              {!analytics.noisy_rules.length ? (
                <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
                  No noisy rule pattern has been detected yet.
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Unresolved By Module</CardTitle>
              <CardDescription>Operational backlog across modules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics.unresolved_by_module.map((item) => (
                <div key={item.module_key} className="flex items-center justify-between rounded-xl border px-4 py-3">
                  <span className="font-medium">{moduleLabelFromKey(item.module_key)}</span>
                  <Badge variant="outline">{item.unresolved_count}</Badge>
                </div>
              ))}
              {!analytics.unresolved_by_module.length ? (
                <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
                  No unresolved alerts remain right now.
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {analytics ? (
        <Card>
          <CardHeader>
            <CardTitle>Rule Effectiveness</CardTitle>
            <CardDescription>Rules with the most execution history and alert output.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.rule_effectiveness.map((rule) => (
              <div key={rule.rule_id} className="rounded-xl border px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{rule.rule_name}</span>
                  <Badge variant="outline">{rule.total_runs} runs</Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Module: {moduleLabelFromKey(rule.module_key)} · Triggered Events: {rule.triggered_events} · Avg/Run: {rule.avg_events_per_run.toFixed(2)} · Resolution: {rule.resolution_rate.toFixed(2)}% · Delivery Success: {rule.delivery_success_rate.toFixed(2)}% · Last Run: {rule.last_run_at ? String(rule.last_run_at).replace('T', ' ').slice(0, 19) : '-'}
                </div>
              </div>
            ))}
            {!analytics.rule_effectiveness.length ? (
              <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
                Rule effectiveness data is not available yet.
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Alert Events</CardTitle>
            <CardDescription>
              This page is now backed by real rows from `alert_event`, not `metric_insight_snapshot`.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="w-[240px] pl-9"
                placeholder="Search event, metric, or scope..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <Select value={severityFilter} onValueChange={(value) => setSeverityFilter(value as 'all' | AlertSeverity)}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={moduleFilter} onValueChange={(value) => setModuleFilter(value as (typeof moduleOptions)[number])}>
              <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {moduleOptions.map((item) => (
                  <SelectItem key={item} value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {eventsError ? <div className="mb-4 text-sm text-rose-600 dark:text-rose-400">{eventsError}</div> : null}
          <table className="w-full min-w-[980px] text-sm">
            <thead className="border-b text-left text-muted-foreground">
              <tr>
                <th className="px-2 py-3 font-medium">Event</th>
                <th className="px-2 py-3 font-medium">Module</th>
                <th className="px-2 py-3 font-medium">Severity</th>
                <th className="px-2 py-3 font-medium">Status</th>
                <th className="px-2 py-3 font-medium">Detected</th>
                <th className="px-2 py-3 font-medium">Scope</th>
                <th className="px-2 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((item) => {
                return (
                  <tr key={item.event_id} className="border-b last:border-b-0">
                    <td className="px-2 py-4">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.metric_label || item.rule_name}</div>
                    </td>
                    <td className="px-2 py-4">{moduleLabelFromKey(item.module_key)}</td>
                    <td className="px-2 py-4">
                      <Badge variant="outline" className={severityBadgeClass(item.severity)}>{item.severity}</Badge>
                    </td>
                    <td className="px-2 py-4">
                      <Badge variant="outline" className={cn('capitalize', statusBadgeClass(item.status))}>{item.status}</Badge>
                    </td>
                    <td className="px-2 py-4">{item.detected_at ? String(item.detected_at).replace('T', ' ').slice(0, 19) : '-'}</td>
                    <td className="px-2 py-4">{formatDimensions(item.event_payload)}</td>
                    <td className="px-2 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/app/alerting/events/${item.event_id}`}>View</Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionLoadingId === item.event_id || item.status !== 'open'}
                          onClick={() => updateEventStatus(item.event_id, 'acknowledged')}
                        >
                          {actionLoadingId === item.event_id ? 'Updating...' : 'Acknowledge'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={actionLoadingId === item.event_id || item.status === 'resolved'}
                          onClick={() => updateEventStatus(item.event_id, 'resolved')}
                        >
                          {actionLoadingId === item.event_id ? 'Updating...' : 'Resolve'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {eventsLoading ? <div className="py-10 text-center text-sm text-muted-foreground">Loading alert events...</div> : null}
          {!eventsLoading && !filteredEvents.length ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No alert events match the current search and filter combination.
            </div>
          ) : null}
        </CardContent>
      </Card>
    </Shell>
  );
}



