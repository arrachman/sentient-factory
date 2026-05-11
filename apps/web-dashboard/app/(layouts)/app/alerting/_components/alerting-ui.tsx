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
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
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


function moduleLabelFromKey(moduleKey: string) {
  switch ((moduleKey || '').toLowerCase()) {
    case 'sales':
      return 'Sales';
    case 'finance':
      return 'Finance';
    case 'warehouse':
      return 'Warehouse';
    case 'purchasing':
      return 'Purchasing';
    default:
      return moduleKey || 'Unknown';
  }
}

function normalizeTemplateChannel(channel: string | null | undefined): 'wa-group' | 'wa-personal' | 'email' | null {
  const value = String(channel || '').trim().toLowerCase();
  if (value === 'wa-group' || value === 'wa-personal' || value === 'email') {
    return value;
  }
  return null;
}

function severityFromAnomalyLevel(level: string | null | undefined): AlertSeverity {
  switch ((level || '').toLowerCase()) {
    case 'critical':
      return 'critical';
    case 'high':
      return 'high';
    case 'medium':
      return 'medium';
    default:
      return 'low';
  }
}

function alertStatusFromInsightStatus(status: string | null | undefined): AlertStatus {
  switch ((status || '').toLowerCase()) {
    case 'reviewed':
      return 'acknowledged';
    case 'archived':
      return 'resolved';
    default:
      return 'open';
  }
}

function formatDimensions(dimensions: Record<string, unknown>) {
  const entries = Object.entries(dimensions || {}).filter(([, value]) => value !== null && value !== undefined && value !== '');
  if (!entries.length) return 'Overall metric scope';
  return entries.map(([key, value]) => `${key}: ${String(value)}`).join(', ');
}


function severityBadgeClass(severity: AlertSeverity) {
  switch (severity) {
    case 'critical':
      return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'high':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'medium':
      return 'bg-sky-100 text-sky-700 border-sky-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

function statusBadgeClass(status: string) {
  switch (status) {
    case 'open':
      return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'acknowledged':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'resolved':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'muted':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'connected':
    case 'delivered':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'sent':
    case 'queued':
      return 'bg-sky-100 text-sky-700 border-sky-200';
    case 'failed':
      return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'draft':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

function summaryIcon(label: string) {
  switch (label) {
    case 'Active Alerts':
      return BellRing;
    case 'Critical Alerts':
      return Siren;
    case 'Notifications Sent':
      return CheckCircle2;
    default:
      return TriangleAlert;
  }
}

function Shell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="container space-y-7 pb-10">
      <Toolbar>
        <div>
          <ToolbarHeading>
            <ToolbarPageTitle>{title}</ToolbarPageTitle>
            <ToolbarDescription>{description}</ToolbarDescription>
          </ToolbarHeading>
        </div>
        {actions ? <ToolbarActions>{actions}</ToolbarActions> : null}
      </Toolbar>
      {children}
    </div>
  );
}


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



export function AlertRulesPageView() {
  const [moduleFilter, setModuleFilter] = useState<(typeof moduleOptions)[number]>('All Modules');
  const [rules, setRules] = useState<AlertRuleRecord[]>([]);
  const [rulesLoading, setRulesLoading] = useState(false);
  const [rulesError, setRulesError] = useState('');
  const [runLoadingId, setRunLoadingId] = useState<number | null>(null);
  const [ruleStateLoadingId, setRuleStateLoadingId] = useState<number | null>(null);
  const [ruleDeleteLoadingId, setRuleDeleteLoadingId] = useState<number | null>(null);
  const [rulePendingDelete, setRulePendingDelete] = useState<AlertRuleRecord | null>(null);

  const loadRules = async (moduleValue: (typeof moduleOptions)[number], signal?: AbortSignal) => {
    setRulesLoading(true);
    setRulesError('');
    const moduleQuery = moduleValue === 'All Modules' ? 'all' : moduleValue.toLowerCase();
    try {
      const response = await fetch(`/api/alerting/rules?module=${encodeURIComponent(moduleQuery)}`, {
        cache: 'no-store',
        signal,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to load alert rules.');
      }
      setRules(payload.data as AlertRuleRecord[]);
    } catch (error) {
      if (signal?.aborted) return;
      setRules([]);
      setRulesError(error instanceof Error ? error.message : 'Failed to load alert rules.');
    } finally {
      if (!signal?.aborted) setRulesLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadRules(moduleFilter, controller.signal);
    return () => {
      controller.abort();
    };
  }, [moduleFilter]);

  const runRule = async (ruleId: number) => {
    setRunLoadingId(ruleId);
    setRulesError('');
    try {
      const response = await fetch(`/api/alerting/rules/${ruleId}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to run alert rule.');
      }
      await loadRules(moduleFilter);
    } catch (error) {
      setRulesError(error instanceof Error ? error.message : 'Failed to run alert rule.');
    } finally {
      setRunLoadingId(null);
    }
  };

  const toggleRuleState = async (rule: AlertRuleRecord) => {
    setRuleStateLoadingId(rule.rule_id);
    setRulesError('');
    try {
      const response = await fetch(`/api/alerting/rules/${rule.rule_id}/state`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !rule.is_active }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to update rule state.');
      }
      setRules(payload.data as AlertRuleRecord[]);
    } catch (error) {
      setRulesError(error instanceof Error ? error.message : 'Failed to update rule state.');
    } finally {
      setRuleStateLoadingId(null);
    }
  };

  const deleteRule = async (rule: AlertRuleRecord) => {
    setRuleDeleteLoadingId(rule.rule_id);
    setRulesError('');
    try {
      const response = await fetch(`/api/alerting/rules/${rule.rule_id}`, {
        method: 'DELETE',
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to delete alert rule.');
      }
      setRules(payload.data as AlertRuleRecord[]);
    } catch (error) {
      setRulesError(error instanceof Error ? error.message : 'Failed to delete alert rule.');
    } finally {
      setRuleDeleteLoadingId(null);
    }
  };

  return (
    <Shell
      title="Alert Rules"
      description="Manage the persisted alert rules that will later drive scheduled evaluation and notification delivery."
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <Select value={moduleFilter} onValueChange={(value) => setModuleFilter(value as (typeof moduleOptions)[number])}>
            <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {moduleOptions.map((item) => (
                <SelectItem key={item} value={item}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/app/alerting/rules/create">
              <Plus className="mr-2 size-4" />
              Create Rule
            </Link>
          </Button>
        </div>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Persisted Alert Rules</CardTitle>
          <CardDescription>These rows now come from the real `alert_rule` and `alert_rule_recipient` tables.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {rulesError ? <div className="mb-4 text-sm text-rose-600 dark:text-rose-400">{rulesError}</div> : null}
          <table className="w-full min-w-[900px] text-sm">
            <thead className="border-b text-left text-muted-foreground">
              <tr>
                <th className="px-2 py-3 font-medium">Rule</th>
                <th className="px-2 py-3 font-medium">Module</th>
                <th className="px-2 py-3 font-medium">Severity</th>
                <th className="px-2 py-3 font-medium">Schedule</th>
                <th className="px-2 py-3 font-medium">Recipients</th>
                <th className="px-2 py-3 font-medium">Status</th>
                <th className="px-2 py-3 font-medium">Last Run</th>
                <th className="px-2 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.rule_id} className="border-b last:border-b-0">
                  <td className="px-2 py-4">
                    <div className="font-medium">{rule.rule_name}</div>
                    <div className="text-xs text-muted-foreground">{rule.metric_label || rule.rule_key}</div>
                  </td>
                  <td className="px-2 py-4">{moduleLabelFromKey(rule.module_key)}</td>
                  <td className="px-2 py-4">
                    <Badge variant="outline" className={severityBadgeClass(rule.severity)}>{rule.severity}</Badge>
                  </td>
                  <td className="px-2 py-4">{rule.schedule_value}</td>
                  <td className="px-2 py-4">{rule.recipients.map((item) => item.target_label).join(', ') || '-'}</td>
                  <td className="px-2 py-4">
                    <Badge variant="outline" className={statusBadgeClass(rule.is_active ? 'connected' : 'draft')}>
                      {rule.is_active ? 'active' : 'inactive'}
                    </Badge>
                  </td>
                  <td className="px-2 py-4">{rule.last_run_at ? String(rule.last_run_at).replace('T', ' ').slice(0, 19) : '-'}</td>
                  <td className="px-2 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/app/alerting/rules/${rule.rule_id}`}>View</Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/app/alerting/rules/create?ruleId=${rule.rule_id}`}>Edit</Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={runLoadingId === rule.rule_id || !rule.is_active}
                        onClick={() => runRule(rule.rule_id)}
                      >
                        {runLoadingId === rule.rule_id ? 'Running...' : 'Run Now'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={ruleStateLoadingId === rule.rule_id}
                        onClick={() => toggleRuleState(rule)}
                      >
                        {ruleStateLoadingId === rule.rule_id ? 'Saving...' : rule.is_active ? 'Deactivate' : 'Reactivate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={ruleDeleteLoadingId === rule.rule_id}
                        onClick={() => setRulePendingDelete(rule)}
                      >
                        {ruleDeleteLoadingId === rule.rule_id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rulesLoading ? <div className="py-10 text-center text-sm text-muted-foreground">Loading alert rules...</div> : null}
          {!rulesLoading && !rules.length ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No alert rules have been created yet.
            </div>
          ) : null}
        </CardContent>
      </Card>
      <AlertDialog open={Boolean(rulePendingDelete)} onOpenChange={(open) => { if (!open) setRulePendingDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Alert Rule</AlertDialogTitle>
            <AlertDialogDescription>
              {rulePendingDelete
                ? `This will archive rule "${rulePendingDelete.rule_name}" and remove it from the active rule list.`
                : 'This action will delete the selected alert rule.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={ruleDeleteLoadingId !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!rulePendingDelete || ruleDeleteLoadingId !== null}
              onClick={(event) => {
                event.preventDefault();
                if (!rulePendingDelete) return;
                void deleteRule(rulePendingDelete).then(() => setRulePendingDelete(null));
              }}
            >
              {ruleDeleteLoadingId !== null ? 'Deleting...' : 'Delete Rule'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Shell>
  );
}


export function CreateAlertRulePageView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sourceTypeFromQuery = searchParams.get('sourceType');
  const ruleId = searchParams.get('ruleId');
  const templateIdFromQuery = searchParams.get('templateId');
  const dashboardKey = searchParams.get('dashboardKey');
  const widgetId = searchParams.get('widgetId');
  const widgetTitle = searchParams.get('widgetTitle');
  const [selectedSourceType, setSelectedSourceType] = useState(sourceTypeFromQuery || 'dashboard-widget');
  const [selectedModule, setSelectedModule] = useState('sales');
  const [templates, setTemplates] = useState<AlertTemplateRecord[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(templateIdFromQuery || '');
  const [templateActionMessage, setTemplateActionMessage] = useState('');
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetricOption[]>([]);
  const [businessMetricsLoading, setBusinessMetricsLoading] = useState(false);
  const [businessMetricsError, setBusinessMetricsError] = useState('');
  const [selectedBusinessMetricKey, setSelectedBusinessMetricKey] = useState('');
  const [systemMetrics, setSystemMetrics] = useState<SystemMetricOption[]>([]);
  const [systemMetricsLoading, setSystemMetricsLoading] = useState(false);
  const [systemMetricsError, setSystemMetricsError] = useState('');
  const [selectedSystemMetricKey, setSelectedSystemMetricKey] = useState('');
  const [savedQueries, setSavedQueries] = useState<SavedQueryOption[]>([]);
  const [savedQueriesLoading, setSavedQueriesLoading] = useState(false);
  const [savedQueriesError, setSavedQueriesError] = useState('');
  const [selectedSavedQueryPromptId, setSelectedSavedQueryPromptId] = useState('');
  const [manualFrom, setManualFrom] = useState('public.obt_sales_receivable');
  const [manualSelect, setManualSelect] = useState('invoice_amount');
  const [manualFilterKey, setManualFilterKey] = useState('branch');
  const [manualFilterValue, setManualFilterValue] = useState('Surabaya');
  const [aiPrompt, setAiPrompt] = useState('Show overdue receivable total above 200 million by branch.');
  const [selectedConditionMappingKey, setSelectedConditionMappingKey] = useState('');
  const [ruleName, setRuleName] = useState(widgetTitle || '');
  const [conditionSummary, setConditionSummary] = useState('');
  const [severity, setSeverity] = useState<AlertSeverity>('critical');
  const [scheduleValue, setScheduleValue] = useState('15m');
  const [primaryChannel, setPrimaryChannel] = useState<'wa-group' | 'wa-personal' | 'email'>('wa-group');
  const [recipientText, setRecipientText] = useState('Ops Alert Group');
  const [messageTemplate, setMessageTemplate] = useState('[Critical] Daily sales dropped more than 20% versus yesterday. Please review branch performance and top customer contribution.');
  const [saveError, setSaveError] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [ruleDetailLoading, setRuleDetailLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setTemplatesLoading(true);
    setTemplatesError('');
    fetch('/api/alerting/templates', { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
          throw new Error(payload?.message || 'Failed to load alert templates.');
        }
        if (cancelled) return;
        setTemplates(payload.data as AlertTemplateRecord[]);
      })
      .catch((error) => {
        if (cancelled) return;
        setTemplates([]);
        setTemplatesError(error instanceof Error ? error.message : 'Failed to load alert templates.');
      })
      .finally(() => {
        if (!cancelled) setTemplatesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (selectedSourceType !== 'business-metric') return;
    let cancelled = false;
    setBusinessMetricsLoading(true);
    setBusinessMetricsError('');
    fetch(`/api/alerting/metric-builder-context?module=${encodeURIComponent(selectedModule)}`, { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) throw new Error(payload?.message || 'Failed to load business metrics.');
        if (cancelled) return;
        const metrics = payload.data as BusinessMetricOption[];
        setBusinessMetrics(metrics);
        const nextMetricKey = metrics.some((item) => item.metric_key === selectedBusinessMetricKey)
          ? selectedBusinessMetricKey
          : (metrics[0]?.metric_key || '');
        setSelectedBusinessMetricKey(nextMetricKey);
        const nextMetric = metrics.find((item) => item.metric_key === nextMetricKey) || metrics[0] || null;
        const nextCondition = nextMetric?.condition_mappings.find((item) => item.ui_condition_key === selectedConditionMappingKey)
          || nextMetric?.condition_mappings.find((item) => item.is_default)
          || nextMetric?.condition_mappings[0]
          || null;
        setSelectedConditionMappingKey(nextCondition?.ui_condition_key || '');
      })
      .catch((error) => {
        if (cancelled) return;
        setBusinessMetrics([]);
        setSelectedBusinessMetricKey('');
        setSelectedConditionMappingKey('');
        setBusinessMetricsError(error instanceof Error ? error.message : 'Failed to load business metrics.');
      })
      .finally(() => { if (!cancelled) setBusinessMetricsLoading(false); });
    return () => { cancelled = true; };
  }, [selectedSourceType, selectedModule, selectedBusinessMetricKey, selectedConditionMappingKey]);

  useEffect(() => {
    if (selectedSourceType !== 'business-metric') return;
    const nextMetric = businessMetrics.find((item) => item.metric_key === selectedBusinessMetricKey) || null;
    const nextCondition = nextMetric?.condition_mappings.find((item) => item.ui_condition_key === selectedConditionMappingKey)
      || nextMetric?.condition_mappings.find((item) => item.is_default)
      || nextMetric?.condition_mappings[0]
      || null;
    if ((nextCondition?.ui_condition_key || '') !== selectedConditionMappingKey) {
      setSelectedConditionMappingKey(nextCondition?.ui_condition_key || '');
    }
  }, [selectedSourceType, businessMetrics, selectedBusinessMetricKey, selectedConditionMappingKey]);

  useEffect(() => {
    if (selectedSourceType !== 'system-metric') return;
    let cancelled = false;
    setSystemMetricsLoading(true);
    setSystemMetricsError('');
    fetch(`/api/alerting/system-metrics?module=${encodeURIComponent(selectedModule)}`, { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) throw new Error(payload?.message || 'Failed to load system metrics.');
        if (cancelled) return;
        const metrics = payload.data as SystemMetricOption[];
        setSystemMetrics(metrics);
        setSelectedSystemMetricKey((current) => current && metrics.some((item) => item.metric_key === current) ? current : (metrics[0]?.metric_key || ''));
      })
      .catch((error) => {
        if (cancelled) return;
        setSystemMetrics([]);
        setSelectedSystemMetricKey('');
        setSystemMetricsError(error instanceof Error ? error.message : 'Failed to load system metrics.');
      })
      .finally(() => { if (!cancelled) setSystemMetricsLoading(false); });
    return () => { cancelled = true; };
  }, [selectedSourceType, selectedModule]);

  useEffect(() => {
    if (selectedSourceType !== 'saved-query') return;
    let cancelled = false;
    setSavedQueriesLoading(true);
    setSavedQueriesError('');
    fetch('/api/alerting/saved-queries?channel=manager_dashboard&limit=12', { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) throw new Error(payload?.message || 'Failed to load saved queries.');
        if (cancelled) return;
        const queries = payload.data as SavedQueryOption[];
        setSavedQueries(queries);
        setSelectedSavedQueryPromptId((current) => current && queries.some((item) => item.prompt_id == current) ? current : (queries[0]?.prompt_id || ''));
      })
      .catch((error) => {
        if (cancelled) return;
        setSavedQueries([]);
        setSelectedSavedQueryPromptId('');
        setSavedQueriesError(error instanceof Error ? error.message : 'Failed to load saved queries.');
      })
      .finally(() => { if (!cancelled) setSavedQueriesLoading(false); });
    return () => { cancelled = true; };
  }, [selectedSourceType]);

  const selectedBusinessMetric = businessMetrics.find((item) => item.metric_key === selectedBusinessMetricKey) || null;
  const selectedSystemMetric = systemMetrics.find((item) => item.metric_key === selectedSystemMetricKey) || null;
  const selectedSavedQuery = savedQueries.find((item) => item.prompt_id === selectedSavedQueryPromptId) || null;
  const selectableTemplates = templates.filter((item) => item.is_active);
  const selectedTemplate = templates.find((item) => String(item.template_id) === selectedTemplateId) || null;
  const selectedConditionMapping = selectedBusinessMetric?.condition_mappings.find((item) => item.ui_condition_key === selectedConditionMappingKey)
    || selectedBusinessMetric?.condition_mappings.find((item) => item.is_default)
    || selectedBusinessMetric?.condition_mappings[0]
    || null;
  const templateSourceWarning = selectedTemplate?.source_ref
    ? selectedTemplate.source_type === 'business-metric' && !businessMetricsLoading && selectedSourceType === 'business-metric' && businessMetrics.length > 0 && !businessMetrics.some((item) => item.metric_key === selectedTemplate.source_ref)
      ? `Template source "${selectedTemplate.source_ref}" is not available in the current business metric registry.`
      : selectedTemplate.source_type === 'system-metric' && !systemMetricsLoading && selectedSourceType === 'system-metric' && systemMetrics.length > 0 && !systemMetrics.some((item) => item.metric_key === selectedTemplate.source_ref)
        ? `Template source "${selectedTemplate.source_ref}" is not available in the current system metric registry.`
        : selectedTemplate.source_type === 'saved-query' && !savedQueriesLoading && selectedSourceType === 'saved-query' && savedQueries.length > 0 && !savedQueries.some((item) => item.prompt_id === selectedTemplate.source_ref)
          ? `Template source "${selectedTemplate.source_ref}" is not available in the saved query registry.`
          : ''
    : '';

  function applyTemplateDefaults(template: AlertTemplateRecord, mode: 'create' | 'edit') {
    const nextPrimaryChannel = normalizeTemplateChannel(template.recommended_channels[0]) || 'wa-group';
    setTemplateLoading(true);
    setTemplateActionMessage('');
    try {
      if (mode === 'create' && !widgetId) {
        setSelectedModule(template.module_key || 'sales');
        if (template.source_type) setSelectedSourceType(template.source_type);
        if (template.source_type === 'business-metric') {
          setSelectedBusinessMetricKey(template.source_ref || '');
        } else if (template.source_type === 'system-metric') {
          setSelectedSystemMetricKey(template.source_ref || '');
        } else if (template.source_type === 'saved-query') {
          setSelectedSavedQueryPromptId(template.source_ref || '');
        } else if (template.source_type === 'manual-rule-source') {
          setManualFrom(template.source_ref || 'public.obt_sales_receivable');
        } else if (template.source_type === 'ai-query') {
          setAiPrompt(template.source_ref || aiPrompt);
        }
      }

      setSeverity(template.severity || 'critical');
      setScheduleValue(template.schedule_value || '15m');
      setConditionSummary(template.condition_summary || '');
      setMessageTemplate(template.message_template || '');
      setPrimaryChannel(nextPrimaryChannel);
      setRecipientText((template.default_recipients || []).join(', '));
      setTemplateActionMessage(
        mode === 'edit'
          ? `Applied defaults from template "${template.name}" without changing source identity.`
          : `Template "${template.name}" loaded into the rule form.`,
      );
    } finally {
      setTemplateLoading(false);
    }
  }

  useEffect(() => {
    if (!ruleId) return;
    let cancelled = false;
    setRuleDetailLoading(true);
    setSaveError('');
    fetch(`/api/alerting/rules/${ruleId}`, { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success || !payload?.data) {
          throw new Error(payload?.message || 'Failed to load alert rule detail.');
        }
        if (cancelled) return;
        const detail = payload.data as AlertRuleDetailRecord;
        setSelectedSourceType(detail.source_type || 'dashboard-widget');
        setSelectedModule(detail.module_key || 'sales');
        setRuleName(detail.rule_name || '');
        setConditionSummary(detail.condition_summary || '');
        setSeverity((detail.severity as AlertSeverity) || 'critical');
        setScheduleValue(detail.schedule_value || '15m');
        setPrimaryChannel((detail.primary_channel as 'wa-group' | 'wa-personal' | 'email') || 'wa-group');
        setMessageTemplate(detail.message_template || '');
        setRecipientText(detail.recipients.map((item) => item.target_label).join(', '));
        setSelectedBusinessMetricKey(detail.source_type === 'business-metric' ? (detail.source_ref || '') : '');
        setSelectedSystemMetricKey(detail.source_type === 'system-metric' ? (detail.source_ref || '') : '');
        setSelectedSavedQueryPromptId(detail.source_type === 'saved-query' ? (detail.source_ref || '') : '');
        setSelectedConditionMappingKey(detail.condition_mapping_key || '');
        setManualFrom(String(detail.source_context?.manualFrom || 'public.obt_sales_receivable'));
        setManualSelect(String(detail.source_context?.manualSelect || 'invoice_amount'));
        setManualFilterKey(String(detail.source_context?.manualFilterKey || 'branch'));
        setManualFilterValue(String(detail.source_context?.manualFilterValue || 'Surabaya'));
        setAiPrompt(String(detail.source_context?.aiPrompt || ''));
      })
      .catch((error) => {
        if (cancelled) return;
        setSaveError(error instanceof Error ? error.message : 'Failed to load alert rule detail.');
      })
      .finally(() => {
        if (!cancelled) setRuleDetailLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ruleId]);

  useEffect(() => {
    if (!templateIdFromQuery || !selectedTemplate) return;
    if (ruleId) {
      setTemplateActionMessage(`Template "${selectedTemplate.name}" is ready. Use "Apply Template Defaults" to merge it into the existing rule.`);
      return;
    }
    applyTemplateDefaults(selectedTemplate, 'create');
  }, [templateIdFromQuery, selectedTemplate, ruleId]);

  useEffect(() => {
    if (!selectedTemplate || !selectedTemplateId) return;
    if (selectedTemplateId === templateIdFromQuery) return;
    if (ruleId) {
      setTemplateActionMessage(`Template "${selectedTemplate.name}" selected. Apply defaults explicitly to keep the existing rule baseline intact.`);
      return;
    }
    applyTemplateDefaults(selectedTemplate, 'create');
  }, [selectedTemplateId, selectedTemplate, ruleId, templateIdFromQuery]);

  useEffect(() => {
    if (ruleName.trim()) return;
    if (widgetTitle) {
      setRuleName(`Alert for ${widgetTitle}`);
      return;
    }
    if (selectedBusinessMetric?.label) {
      setRuleName(`${selectedBusinessMetric.label} Alert`);
      return;
    }
    if (selectedSystemMetric?.label) {
      setRuleName(`${selectedSystemMetric.label} Alert`);
      return;
    }
    if (selectedSavedQuery?.title) {
      setRuleName(`${selectedSavedQuery.title} Alert`);
    }
  }, [ruleName, widgetTitle, selectedBusinessMetric, selectedSystemMetric, selectedSavedQuery]);

  useEffect(() => {
    if (conditionSummary.trim()) return;
    if (selectedConditionMapping?.example_condition) {
      setConditionSummary(selectedConditionMapping.example_condition);
    } else {
      setConditionSummary('Trigger when the selected metric matches the configured condition.');
    }
  }, [selectedConditionMapping, conditionSummary]);

  async function handleSaveRule() {
    setSaveError('');
    setSaveLoading(true);
    try {
      const recipients = recipientText
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => ({
          channel_type: primaryChannel,
          target_label: item,
          target_value:
            primaryChannel === 'email'
              ? item.includes('@')
                ? item
                : item.toLowerCase().replace(/\s+/g, '.') + '@fr-labs.my.id'
              : primaryChannel === 'wa-group'
                ? item.toLowerCase().replace(/\s+/g, '-')
                : item,
        }));

      const payload = {
        ruleName: ruleName.trim() || 'Untitled Alert Rule',
        moduleKey: selectedModule,
        sourceType: selectedSourceType,
        sourceRef:
          selectedSourceType === 'business-metric'
            ? selectedBusinessMetric?.metric_key
            : selectedSourceType === 'system-metric'
              ? selectedSystemMetric?.metric_key
              : selectedSourceType === 'saved-query'
                ? selectedSavedQuery?.prompt_id
                : selectedSourceType === 'dashboard-widget'
                  ? widgetId
                  : selectedSourceType === 'manual-rule-source'
                    ? manualFrom
                    : aiPrompt,
        metricId: selectedBusinessMetric?.metric_id ?? null,
        systemMetricRef: selectedSourceType === 'system-metric' ? selectedSystemMetric?.metric_key : selectedBusinessMetric?.system_metric_ref,
        semanticRef: selectedBusinessMetric?.semantic_ref ?? null,
        conditionMappingId: selectedConditionMapping?.mapping_id ?? null,
        conditionMappingKey: selectedConditionMapping?.ui_condition_key ?? null,
        conditionOperatorKey: selectedConditionMapping?.operator_key ?? null,
        comparisonType: selectedBusinessMetric?.comparison_type ?? null,
        valueType: selectedBusinessMetric?.value_type ?? selectedSystemMetric?.value_type ?? null,
        scheduleType: 'preset',
        scheduleValue,
        severity,
        primaryChannel,
        conditionSummary,
        conditionConfig: selectedConditionMapping?.input_config ?? {},
        sourceContext: {
          dashboardKey,
          widgetId,
          widgetTitle,
          manualFrom,
          manualSelect,
          manualFilterKey,
          manualFilterValue,
          savedQueryPromptId: selectedSavedQuery?.prompt_id ?? null,
          aiPrompt: selectedSourceType === 'ai-query' ? aiPrompt : null,
        },
        messageTemplate,
        recipients,
      };

      const response = await fetch(ruleId ? `/api/alerting/rules/${ruleId}` : '/api/alerting/rules', {
        method: ruleId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to save alert rule.');
      }
      router.push('/app/alerting/rules');
      router.refresh();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save alert rule.');
    } finally {
      setSaveLoading(false);
    }
  }

  return (
    <Shell
      title="Create Alert Rule"
      description={ruleId ? 'Edit an existing alert rule and persist updates to the alerting domain.' : 'Wizard-style form for alert rule setup with business metric registry as the first live source.'}
      actions={
        <Button asChild variant="outline">
          <Link href="/app/alerting/rules">Back to Rules</Link>
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_420px]">
        {widgetId ? (
          <Card className="xl:col-span-2 border-amber-200 bg-amber-50/70 dark:border-amber-900/40 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle>Alert Source Context</CardTitle>
              <CardDescription>This rule was started from a pinned dashboard widget.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm md:grid-cols-4">
              <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Source Type</div><div className="mt-1 font-medium text-slate-900 dark:text-slate-100">{sourceTypeFromQuery ?? 'dashboard-widget'}</div></div>
              <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Dashboard</div><div className="mt-1 font-medium text-slate-900 dark:text-slate-100">{dashboardKey ?? '-'}</div></div>
              <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Widget ID</div><div className="mt-1 font-medium text-slate-900 dark:text-slate-100">{widgetId}</div></div>
              <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Widget Title</div><div className="mt-1 font-medium text-slate-900 dark:text-slate-100">{widgetTitle ?? '-'}</div></div>
            </CardContent>
          </Card>
        ) : null}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. What to Monitor</CardTitle>
              <CardDescription>Select the source and target metric.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium">Template</div>
                  {ruleId && selectedTemplate ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={templateLoading}
                      onClick={() => applyTemplateDefaults(selectedTemplate, 'edit')}
                    >
                      {templateLoading ? 'Applying...' : 'Apply Template Defaults'}
                    </Button>
                  ) : null}
                </div>
                <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId} disabled={templatesLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder={templatesLoading ? 'Loading templates...' : 'Select template'} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectableTemplates.map((template) => (
                      <SelectItem key={template.template_id} value={String(template.template_id)}>
                        {template.name}{template.is_default ? ' (Default)' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {templatesError ? <div className="text-sm text-rose-600 dark:text-rose-400">{templatesError}</div> : null}
                {selectedTemplate ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
                    <div className="font-medium text-slate-900 dark:text-slate-100">{selectedTemplate.name}</div>
                    <div className="mt-1">Schedule: {selectedTemplate.schedule_value || '-'} · Primary Channel: {normalizeTemplateChannel(selectedTemplate.recommended_channels[0]) || '-'}</div>
                    <div className="mt-1">Recipients Default: {selectedTemplate.default_recipients.join(', ') || '-'}</div>
                  </div>
                ) : null}
                {templateSourceWarning ? <div className="text-sm text-amber-600 dark:text-amber-400">{templateSourceWarning}</div> : null}
                {templateActionMessage ? <div className="text-sm text-muted-foreground">{templateActionMessage}</div> : null}
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Source Type</div>
                <Select value={selectedSourceType} onValueChange={setSelectedSourceType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard-widget">Dashboard Widget</SelectItem>
                    <SelectItem value="manual-rule-source">Manual Rule Builder</SelectItem>
                    <SelectItem value="business-metric">Business Metric</SelectItem>
                    <SelectItem value="saved-query">Saved Query</SelectItem>
                    <SelectItem value="ai-query">AI Query</SelectItem>
                    <SelectItem value="system-metric">System Metric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Module</div>
                <Select value={selectedModule} onValueChange={setSelectedModule}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="purchasing">Purchasing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedSourceType === 'business-metric' ? (
                <>
                  <div className="space-y-2 md:col-span-2">
                    <div className="text-sm font-medium">Business Metric</div>
                    <Select
                      value={selectedBusinessMetricKey}
                      onValueChange={setSelectedBusinessMetricKey}
                      disabled={businessMetricsLoading || businessMetrics.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={businessMetricsLoading ? 'Loading business metrics...' : 'Select business metric'} />
                      </SelectTrigger>
                      <SelectContent>
                        {businessMetrics.map((metric) => (
                          <SelectItem key={metric.metric_key} value={metric.metric_key}>
                            {metric.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {businessMetricsError ? <div className="text-sm text-rose-600 dark:text-rose-400">{businessMetricsError}</div> : null}
                  </div>
                  {selectedBusinessMetric ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:col-span-2 dark:border-slate-800 dark:bg-slate-950/50">
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Metric Key</div><div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{selectedBusinessMetric.metric_key}</div></div>
                        <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Comparison Type</div><div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{selectedBusinessMetric.comparison_type || '-'}</div></div>
                        <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Semantic</div><div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{selectedBusinessMetric.semantic_label || selectedBusinessMetric.semantic_ref || '-'}</div></div>
                        <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">System Metric</div><div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{selectedBusinessMetric.system_metric_label || selectedBusinessMetric.system_metric_ref || '-'}</div></div>
                      </div>
                      {selectedBusinessMetric.business_definition ? (
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{selectedBusinessMetric.business_definition}</p>
                      ) : null}
                      <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        <div className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Metric Context</div>
                          <div className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                            <div><span className="font-medium text-slate-900 dark:text-slate-100">Dimensions:</span> {selectedBusinessMetric.supported_dimensions.join(', ') || '-'}</div>
                            <div><span className="font-medium text-slate-900 dark:text-slate-100">Value Type:</span> {selectedBusinessMetric.value_type}{selectedBusinessMetric.unit ? ` · ${selectedBusinessMetric.unit}` : ''}</div>
                            <div><span className="font-medium text-slate-900 dark:text-slate-100">Default Filters:</span> {JSON.stringify(selectedBusinessMetric.default_filters)}</div>
                          </div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Business Goal</div>
                          {selectedBusinessMetric.goals[0] ? (
                            <div className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                              <div><span className="font-medium text-slate-900 dark:text-slate-100">Stakeholder:</span> {selectedBusinessMetric.goals[0].stakeholder_role}</div>
                              <div><span className="font-medium text-slate-900 dark:text-slate-100">Goal:</span> {selectedBusinessMetric.goals[0].goal_statement}</div>
                              {selectedBusinessMetric.goals[0].business_question ? <div><span className="font-medium text-slate-900 dark:text-slate-100">Question:</span> {selectedBusinessMetric.goals[0].business_question}</div> : null}
                            </div>
                          ) : (
                            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">No business goal has been registered for this metric yet.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : null}

              {selectedSourceType == 'system-metric' ? (
                <>
                  <div className="space-y-2 md:col-span-2">
                    <div className="text-sm font-medium">System Metric</div>
                    <Select value={selectedSystemMetricKey} onValueChange={setSelectedSystemMetricKey} disabled={systemMetricsLoading || systemMetrics.length === 0}>
                      <SelectTrigger><SelectValue placeholder={systemMetricsLoading ? 'Loading system metrics...' : 'Select system metric'} /></SelectTrigger>
                      <SelectContent>{systemMetrics.map((metric) => <SelectItem key={metric.metric_key} value={metric.metric_key}>{metric.label}</SelectItem>)}</SelectContent>
                    </Select>
                    {systemMetricsError ? <div className="text-sm text-rose-600 dark:text-rose-400">{systemMetricsError}</div> : null}
                  </div>
                  {selectedSystemMetric ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:col-span-2 dark:border-slate-800 dark:bg-slate-950/50">
                      <div className="grid gap-3 md:grid-cols-2">
                        <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Metric Key</div><div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{selectedSystemMetric.metric_key}</div></div>
                        <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Aggregation</div><div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{selectedSystemMetric.aggregation_type || '-'}</div></div>
                        <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Source Table</div><div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{selectedSystemMetric.source_table || '-'}</div></div>
                        <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Dimensions</div><div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{selectedSystemMetric.supported_dimensions.join(', ') || '-'}</div></div>
                      </div>
                      {selectedSystemMetric.description ? <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{selectedSystemMetric.description}</p> : null}
                    </div>
                  ) : null}
                </>
              ) : null}

              {selectedSourceType === 'saved-query' ? (
                <>
                  <div className="space-y-2 md:col-span-2">
                    <div className="text-sm font-medium">Saved Query</div>
                    <Select
                      value={selectedSavedQueryPromptId}
                      onValueChange={setSelectedSavedQueryPromptId}
                      disabled={savedQueriesLoading || savedQueries.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={savedQueriesLoading ? 'Loading saved queries...' : 'Select saved query'}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {savedQueries.map((item) => (
                          <SelectItem key={item.prompt_id} value={item.prompt_id}>
                            {item.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {savedQueriesError ? (
                      <div className="text-sm text-rose-600 dark:text-rose-400">{savedQueriesError}</div>
                    ) : null}
                    {!savedQueriesLoading && !savedQueriesError && savedQueries.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                        No saved AI queries with SQL were found in the current history. Save a Senti AI result with SQL first, then reuse it here.
                      </div>
                    ) : null}
                  </div>
                  {selectedSavedQuery ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:col-span-2 dark:border-slate-800 dark:bg-slate-950/50">
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Session</div>
                          <div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                            {selectedSavedQuery.session_id}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Mode</div>
                          <div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                            {selectedSavedQuery.mode || '-'}
                          </div>
                        </div>
                      </div>
                      {selectedSavedQuery.prompt ? (
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                          {selectedSavedQuery.prompt}
                        </p>
                      ) : null}
                      <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs text-slate-100">
                        {selectedSavedQuery.query_sql}
                      </pre>
                    </div>
                  ) : null}
                </>
              ) : null}

              {selectedSourceType == 'manual-rule-source' ? (
                <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
                  <div className="space-y-2"><div className="text-sm font-medium">From</div><Input value={manualFrom} onChange={(event) => setManualFrom(event.target.value)} /></div>
                  <div className="space-y-2"><div className="text-sm font-medium">Select</div><Input value={manualSelect} onChange={(event) => setManualSelect(event.target.value)} /></div>
                  <div className="space-y-2"><div className="text-sm font-medium">Key Filter</div><Input value={manualFilterKey} onChange={(event) => setManualFilterKey(event.target.value)} /></div>
                  <div className="space-y-2"><div className="text-sm font-medium">Value Filter</div><Input value={manualFilterValue} onChange={(event) => setManualFilterValue(event.target.value)} /></div>
                </div>
              ) : null}

              {selectedSourceType == 'ai-query' ? (
                <div className="space-y-2 md:col-span-2">
                  <div className="text-sm font-medium">AI Prompt</div>
                  <Textarea value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} />
                  <p className="text-xs text-slate-500 dark:text-slate-400">This source will generate a query from prompt and save it as the rule source in the next phase.</p>
                </div>
              ) : null}

              {selectedSourceType == 'dashboard-widget' ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-4 text-sm text-slate-500 md:col-span-2 dark:border-slate-800 dark:text-slate-400">
                  Dashboard Widget source keeps the rule tied to a pinned dashboard widget.
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Condition</CardTitle>
              <CardDescription>Condition choices are derived from semantic ref, comparison type, and value type.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">Condition Type</div>
                <Select
                  value={selectedConditionMapping?.ui_condition_key || selectedConditionMappingKey}
                  onValueChange={setSelectedConditionMappingKey}
                  disabled={selectedSourceType !== 'business-metric' || !selectedBusinessMetric || selectedBusinessMetric.condition_mappings.length === 0}
                >
                  <SelectTrigger><SelectValue placeholder="Select condition type" /></SelectTrigger>
                  <SelectContent>
                    {selectedBusinessMetric?.condition_mappings.map((mapping) => (
                      <SelectItem key={mapping.mapping_id} value={mapping.ui_condition_key}>
                        {mapping.ui_condition_label}
                      </SelectItem>
                    )) || [
                      <SelectItem key="threshold" value="threshold">Threshold Exceeded</SelectItem>,
                      <SelectItem key="trend-anomaly" value="trend-anomaly">Trend Anomaly</SelectItem>,
                    ]}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Severity</div>
                <Select value={severity} onValueChange={(value) => setSeverity(value as AlertSeverity)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedBusinessMetric && selectedConditionMapping ? (
                <>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 md:col-span-2 dark:border-slate-800 dark:bg-slate-950/40">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Operator</div><div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{selectedConditionMapping.operator_label}</div></div>
                      <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Input Config</div><div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{JSON.stringify(selectedConditionMapping.input_config)}</div></div>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <div className="text-sm font-medium">Condition Summary</div>
                    <Input value={conditionSummary} onChange={(event) => setConditionSummary(event.target.value)} />
                  </div>
                </>
              ) : (
                <div className="space-y-2 md:col-span-2">
                  <div className="text-sm font-medium">Condition Summary</div>
                  <Input value={conditionSummary} onChange={(event) => setConditionSummary(event.target.value)} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Schedule & Delivery</CardTitle>
              <CardDescription>Preset schedules keep the first version simple and user friendly.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">Schedule</div>
                <Select value={scheduleValue} onValueChange={setScheduleValue}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15m">Every 15 minutes</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily 08:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Primary Channel</div>
                <Select value={primaryChannel} onValueChange={(value) => setPrimaryChannel(value as 'wa-group' | 'wa-personal' | 'email')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wa-group">WhatsApp Group</SelectItem>
                    <SelectItem value="wa-personal">WhatsApp Personal</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>4. Notify Who</CardTitle>
              <CardDescription>Recipient targets will be stored into `alert_rule_recipient`.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Rule Name</div>
                <Input value={ruleName} onChange={(event) => setRuleName(event.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Recipients</div>
                <Input value={recipientText} onChange={(event) => setRecipientText(event.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Message Template</div>
                <Textarea value={messageTemplate} onChange={(event) => setMessageTemplate(event.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
             <CardTitle>5. Preview & Save</CardTitle>
              <CardDescription>The save action now persists into the real alert rule tables in PostgreSQL.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Summary: Monitor selected source, run {scheduleValue}, send to {primaryChannel}, severity {severity}.</p>
              {ruleDetailLoading ? <div className="text-sm text-muted-foreground">Loading rule detail...</div> : null}
              {saveError ? <div className="text-sm text-rose-600 dark:text-rose-400">{saveError}</div> : null}
              <Button className="w-full" onClick={handleSaveRule} disabled={saveLoading || !ruleName.trim()}>
                {saveLoading ? 'Saving...' : ruleId ? 'Save Changes' : 'Save Rule'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}

export function AlertTemplatesPageView() {
  const [templates, setTemplates] = useState<AlertTemplateRecord[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState('');
  const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);
  const [templateSaveLoading, setTemplateSaveLoading] = useState(false);
  const [templateDeleteLoadingId, setTemplateDeleteLoadingId] = useState<number | null>(null);
  const [templateToggleLoadingId, setTemplateToggleLoadingId] = useState<number | null>(null);
  const [templatePendingDelete, setTemplatePendingDelete] = useState<AlertTemplateRecord | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateModule, setTemplateModule] = useState('sales');
  const [templateSeverity, setTemplateSeverity] = useState<AlertSeverity>('critical');
  const [templateChannels, setTemplateChannels] = useState('wa-group, email');
  const [templateDefaultRecipients, setTemplateDefaultRecipients] = useState('Ops Alert Group, Sales Manager');
  const [templateSchedule, setTemplateSchedule] = useState('15m');
  const [templateCondition, setTemplateCondition] = useState('');
  const [templateMessage, setTemplateMessage] = useState('');
  const [templateSourceType, setTemplateSourceType] = useState('business-metric');
  const [templateSourceRef, setTemplateSourceRef] = useState('');
  const [templateIsDefault, setTemplateIsDefault] = useState(false);

  const loadTemplates = async () => {
    setTemplatesLoading(true);
    setTemplatesError('');
    try {
      const response = await fetch('/api/alerting/templates', { cache: 'no-store' });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to load alert templates.');
      }
      setTemplates(payload.data as AlertTemplateRecord[]);
    } catch (error) {
      setTemplates([]);
      setTemplatesError(error instanceof Error ? error.message : 'Failed to load alert templates.');
    } finally {
      setTemplatesLoading(false);
    }
  };

  useEffect(() => {
    void loadTemplates();
  }, []);

  const resetTemplateForm = () => {
    setEditingTemplateId(null);
    setTemplateName('');
    setTemplateDescription('');
    setTemplateModule('sales');
    setTemplateSeverity('critical');
    setTemplateChannels('wa-group, email');
    setTemplateDefaultRecipients('Ops Alert Group, Sales Manager');
    setTemplateSchedule('15m');
    setTemplateCondition('');
    setTemplateMessage('');
    setTemplateSourceType('business-metric');
    setTemplateSourceRef('');
    setTemplateIsDefault(false);
  };

  const handleEditTemplate = (template: AlertTemplateRecord) => {
    setEditingTemplateId(template.template_id);
    setTemplateName(template.name);
    setTemplateDescription(template.description || '');
    setTemplateModule(template.module_key);
    setTemplateSeverity(template.severity);
    setTemplateChannels(template.recommended_channels.join(', '));
    setTemplateDefaultRecipients(template.default_recipients.join(', '));
    setTemplateSchedule(template.schedule_value || '');
    setTemplateCondition(template.condition_summary || '');
    setTemplateMessage(template.message_template || '');
    setTemplateSourceType(template.source_type || 'business-metric');
    setTemplateSourceRef(template.source_ref || '');
    setTemplateIsDefault(template.is_default);
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim() || !templateModule.trim()) return;
    setTemplateSaveLoading(true);
    setTemplatesError('');
    try {
      const recommendedChannels = templateChannels
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
      const defaultRecipients = templateDefaultRecipients
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
      const response = await fetch(
        editingTemplateId ? `/api/alerting/templates/${editingTemplateId}` : '/api/alerting/templates',
        {
          method: editingTemplateId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: templateName.trim(),
            description: templateDescription.trim(),
            moduleKey: templateModule,
            severity: templateSeverity,
            recommendedChannels,
            defaultRecipients,
            sourceType: templateSourceType.trim() || null,
            sourceRef: templateSourceRef.trim() || null,
            scheduleValue: templateSchedule.trim() || null,
            conditionSummary: templateCondition.trim() || null,
            messageTemplate: templateMessage.trim() || null,
            isDefault: templateIsDefault,
          }),
        },
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || `Failed to ${editingTemplateId ? 'update' : 'create'} alert template.`);
      }
      setTemplates(payload.data as AlertTemplateRecord[]);
      resetTemplateForm();
    } catch (error) {
      setTemplatesError(error instanceof Error ? error.message : `Failed to ${editingTemplateId ? 'update' : 'create'} alert template.`);
    } finally {
      setTemplateSaveLoading(false);
    }
  };

  const handleDeleteTemplate = async (template: AlertTemplateRecord) => {
    setTemplateDeleteLoadingId(template.template_id);
    setTemplatesError('');
    try {
      const response = await fetch(`/api/alerting/templates/${template.template_id}`, {
        method: 'DELETE',
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to delete alert template.');
      }
      setTemplates(payload.data as AlertTemplateRecord[]);
      if (editingTemplateId === template.template_id) {
        resetTemplateForm();
      }
    } catch (error) {
      setTemplatesError(error instanceof Error ? error.message : 'Failed to delete alert template.');
    } finally {
      setTemplateDeleteLoadingId(null);
    }
  };

  const handleToggleTemplateState = async (template: AlertTemplateRecord) => {
    setTemplateToggleLoadingId(template.template_id);
    setTemplatesError('');
    try {
      const response = await fetch(`/api/alerting/templates/${template.template_id}/state`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !template.is_active }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to update alert template state.');
      }
      setTemplates(payload.data as AlertTemplateRecord[]);
    } catch (error) {
      setTemplatesError(error instanceof Error ? error.message : 'Failed to update alert template state.');
    } finally {
      setTemplateToggleLoadingId(null);
    }
  };

  return (
    <Shell title="Alert Templates" description="Preset templates make rule creation faster for business users.">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {templatesError ? <div className="md:col-span-2 xl:col-span-3 text-sm text-rose-600 dark:text-rose-400">{templatesError}</div> : null}
          {templates.map((template) => (
            <Card key={template.template_id} className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-base">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={severityBadgeClass(template.severity)}>{template.severity}</Badge>
                  {template.is_default ? <Badge variant="outline">Default</Badge> : null}
                </div>
                <div className="text-xs text-muted-foreground">Module: {moduleLabelFromKey(template.module_key)}</div>
                <div className="text-xs text-muted-foreground">Recommended: {template.recommended_channels.join(', ') || '-'}</div>
                <div className="text-xs text-muted-foreground">Default Recipients: {template.default_recipients.join(', ') || '-'}</div>
                <div className="text-xs text-muted-foreground">State: {template.is_active ? 'Active' : 'Inactive'}</div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" asChild disabled={!template.is_active}>
                    <Link href={`/app/alerting/rules/create?templateId=${encodeURIComponent(String(template.template_id))}`}>
                      Use Template
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/app/alerting/templates/${template.template_id}`}>View</Link>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEditTemplate(template)}>Edit</Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={templateToggleLoadingId === template.template_id}
                    onClick={() => handleToggleTemplateState(template)}
                  >
                    {templateToggleLoadingId === template.template_id
                      ? 'Saving...'
                      : template.is_active ? 'Deactivate' : 'Reactivate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={templateDeleteLoadingId === template.template_id}
                    onClick={() => setTemplatePendingDelete(template)}
                  >
                    {templateDeleteLoadingId === template.template_id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {templatesLoading ? <div className="md:col-span-2 xl:col-span-3 text-sm text-muted-foreground">Loading templates...</div> : null}
          {!templatesLoading && !templates.length ? (
            <div className="md:col-span-2 xl:col-span-3 rounded-xl border border-dashed px-4 py-8 text-sm text-muted-foreground">
              No alert templates have been created yet.
            </div>
          ) : null}
        </div>
        <Card className="h-fit border-slate-200">
          <CardHeader>
            <CardTitle>{editingTemplateId ? 'Edit Alert Template' : 'Create Alert Template'}</CardTitle>
            <CardDescription>Persist reusable presets for faster rule creation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Template Name</div>
              <Input value={templateName} onChange={(event) => setTemplateName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Description</div>
              <Textarea value={templateDescription} onChange={(event) => setTemplateDescription(event.target.value)} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">Module</div>
                <Select value={templateModule} onValueChange={setTemplateModule}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="purchasing">Purchasing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Severity</div>
                <Select value={templateSeverity} onValueChange={(value) => setTemplateSeverity(value as AlertSeverity)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">Source Type</div>
                <Input value={templateSourceType} onChange={(event) => setTemplateSourceType(event.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Source Ref</div>
                <Input value={templateSourceRef} onChange={(event) => setTemplateSourceRef(event.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Recommended Channels</div>
              <Input value={templateChannels} onChange={(event) => setTemplateChannels(event.target.value)} placeholder="wa-group, email" />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Default Recipients</div>
              <Input value={templateDefaultRecipients} onChange={(event) => setTemplateDefaultRecipients(event.target.value)} placeholder="Ops Alert Group, Sales Manager" />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Schedule</div>
              <Input value={templateSchedule} onChange={(event) => setTemplateSchedule(event.target.value)} placeholder="15m / hourly / daily" />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Condition Summary</div>
              <Input value={templateCondition} onChange={(event) => setTemplateCondition(event.target.value)} />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Message Template</div>
              <Textarea value={templateMessage} onChange={(event) => setTemplateMessage(event.target.value)} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-800">
              <div>
                <div className="text-sm font-medium">Default Template For Module</div>
                <div className="text-xs text-muted-foreground">Only one active default template is kept per module.</div>
              </div>
              <Switch checked={templateIsDefault} onCheckedChange={setTemplateIsDefault} />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleSaveTemplate} disabled={templateSaveLoading || !templateName.trim()}>
                {templateSaveLoading ? 'Saving...' : editingTemplateId ? 'Save Template' : 'Create Template'}
              </Button>
              {editingTemplateId ? (
                <Button variant="outline" onClick={resetTemplateForm} disabled={templateSaveLoading}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={Boolean(templatePendingDelete)} onOpenChange={(open) => { if (!open) setTemplatePendingDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Alert Template</AlertDialogTitle>
            <AlertDialogDescription>
              {templatePendingDelete
                ? `This will deactivate template "${templatePendingDelete.name}" and hide it from the active template list.`
                : 'This action will deactivate the selected template.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={templateDeleteLoadingId !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!templatePendingDelete || templateDeleteLoadingId !== null}
              onClick={(event) => {
                event.preventDefault();
                if (!templatePendingDelete) return;
                void handleDeleteTemplate(templatePendingDelete).then(() => setTemplatePendingDelete(null));
              }}
            >
              {templateDeleteLoadingId !== null ? 'Deleting...' : 'Delete Template'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Shell>
  );
}

export function NotificationChannelsPageView() {
  const [channels, setChannels] = useState<PersistedAlertChannelRecord[]>([]);
  const [deliveryStatus, setDeliveryStatus] = useState<AlertDeliveryStatusPayload | null>(null);
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [channelsError, setChannelsError] = useState('');
  const [channelActionMessage, setChannelActionMessage] = useState('');
  const [testSendLoadingId, setTestSendLoadingId] = useState<number | null>(null);
  const [channelDeleteLoadingId, setChannelDeleteLoadingId] = useState<number | null>(null);
  const [channelToggleLoadingId, setChannelToggleLoadingId] = useState<number | null>(null);
  const [channelPendingDelete, setChannelPendingDelete] = useState<PersistedAlertChannelRecord | null>(null);
  const [channelSaveLoading, setChannelSaveLoading] = useState(false);
  const [editingChannelId, setEditingChannelId] = useState<number | null>(null);
  const [showInactiveChannels, setShowInactiveChannels] = useState(false);
  const [channelType, setChannelType] = useState<NotificationChannel['type']>('WhatsApp Personal');
  const [channelLabel, setChannelLabel] = useState('');
  const [channelTarget, setChannelTarget] = useState('');
  const [channelStatus, setChannelStatus] = useState<NotificationChannel['status']>('draft');
  const [channelOwnership, setChannelOwnership] = useState<NotificationChannel['ownership']>('standalone');
  const [ownerLabel, setOwnerLabel] = useState<(typeof internalUserOptions)[number]>(internalUserOptions[0]);
  const [channelTeamKey, setChannelTeamKey] = useState('');

  const loadChannels = async () => {
    setChannelsLoading(true);
    setChannelsError('');
    try {
      const response = await fetch('/api/alerting/channels', { cache: 'no-store' });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to load notification channels.');
      }
      setChannels(payload.data as PersistedAlertChannelRecord[]);
    } catch (error) {
      setChannels([]);
      setChannelsError(error instanceof Error ? error.message : 'Failed to load notification channels.');
    } finally {
      setChannelsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetch('/api/alerting/delivery-status', { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success || !payload?.data) {
          throw new Error(payload?.message || 'Failed to load delivery status.');
        }
        if (!cancelled) {
          setDeliveryStatus(payload.data as AlertDeliveryStatusPayload);
        }
      })
      .catch(() => {
        if (!cancelled) setDeliveryStatus(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    void loadChannels();
  }, []);

  const grouped = useMemo(
    () => ({
      personal: channels.filter((item) => item.channel_type === 'wa-personal' && (showInactiveChannels || item.is_active)),
      group: channels.filter((item) => item.channel_type === 'wa-group' && (showInactiveChannels || item.is_active)),
      email: channels.filter((item) => item.channel_type === 'email' && (showInactiveChannels || item.is_active)),
    }),
    [channels, showInactiveChannels],
  );

  async function handleSaveChannel() {
    const label = channelLabel.trim();
    const target = channelTarget.trim();
    if (!label || !target) {
      return;
    }
    setChannelsError('');
    setChannelSaveLoading(true);
    const normalizedChannelType =
      channelType === 'WhatsApp Personal' ? 'wa-personal'
      : channelType === 'WhatsApp Group' ? 'wa-group'
      : 'email';
    try {
      const response = await fetch(
        editingChannelId ? `/api/alerting/channels/${editingChannelId}` : '/api/alerting/channels',
        {
          method: editingChannelId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channelType: normalizedChannelType,
            label,
            targetValue: target,
            ownershipType: channelOwnership,
            ownerLabel: channelOwnership === 'internal_user' ? ownerLabel : '',
            teamKey: channelTeamKey.trim(),
            status: channelStatus,
          }),
        },
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || `Failed to ${editingChannelId ? 'update' : 'create'} notification channel.`);
      }
      setChannels(payload.data as PersistedAlertChannelRecord[]);
      setEditingChannelId(null);
      setChannelLabel('');
      setChannelTarget('');
      setChannelStatus('draft');
      setChannelOwnership('standalone');
      setOwnerLabel(internalUserOptions[0]);
      setChannelTeamKey('');
    } catch (error) {
      setChannelsError(error instanceof Error ? error.message : `Failed to ${editingChannelId ? 'update' : 'create'} notification channel.`);
    } finally {
      setChannelSaveLoading(false);
    }
  }

  async function handleTestSend(channelId: number) {
    setChannelsError('');
    setChannelActionMessage('');
    setTestSendLoadingId(channelId);
    try {
      const response = await fetch(`/api/alerting/channels/${channelId}/test-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !payload?.data) {
        throw new Error(payload?.message || 'Failed to send test notification.');
      }
      setChannelActionMessage(
        `Test send queued and processed. Event #${payload.data.event_id}, delivery #${payload.data.delivery_id}.`,
      );
    } catch (error) {
      setChannelsError(error instanceof Error ? error.message : 'Failed to send test notification.');
    } finally {
      setTestSendLoadingId(null);
    }
  }

  async function handleDeleteChannel(channel: PersistedAlertChannelRecord) {
    setChannelsError('');
    setChannelActionMessage('');
    setChannelDeleteLoadingId(channel.channel_id);
    try {
      const response = await fetch(`/api/alerting/channels/${channel.channel_id}`, {
        method: 'DELETE',
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to delete notification channel.');
      }
      setChannels(payload.data as PersistedAlertChannelRecord[]);
      if (editingChannelId === channel.channel_id) {
        resetChannelForm();
      }
      setChannelActionMessage(`Channel "${channel.label}" deleted.`);
    } catch (error) {
      setChannelsError(error instanceof Error ? error.message : 'Failed to delete notification channel.');
    } finally {
      setChannelDeleteLoadingId(null);
    }
  }

  async function handleToggleChannelState(channel: PersistedAlertChannelRecord) {
    setChannelsError('');
    setChannelActionMessage('');
    setChannelToggleLoadingId(channel.channel_id);
    try {
      const response = await fetch(`/api/alerting/channels/${channel.channel_id}/state`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !channel.is_active }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to update channel state.');
      }
      setChannels(payload.data as PersistedAlertChannelRecord[]);
      setChannelActionMessage(`Channel "${channel.label}" ${channel.is_active ? 'deactivated' : 'reactivated'}.`);
    } catch (error) {
      setChannelsError(error instanceof Error ? error.message : 'Failed to update channel state.');
    } finally {
      setChannelToggleLoadingId(null);
    }
  }

  function handleEditChannel(channel: PersistedAlertChannelRecord) {
    setEditingChannelId(channel.channel_id);
    setChannelType(
      channel.channel_type === 'wa-personal'
        ? 'WhatsApp Personal'
        : channel.channel_type === 'wa-group'
          ? 'WhatsApp Group'
          : 'Email',
    );
    setChannelLabel(channel.label);
    setChannelTarget(channel.target_value);
    setChannelStatus(channel.status);
    setChannelOwnership(channel.ownership_type);
    setOwnerLabel((channel.owner_label as (typeof internalUserOptions)[number]) || internalUserOptions[0]);
    setChannelTeamKey(typeof channel.metadata?.team === 'string' ? channel.metadata.team : '');
  }

  function resetChannelForm() {
    setEditingChannelId(null);
    setChannelType('WhatsApp Personal');
    setChannelLabel('');
    setChannelTarget('');
    setChannelStatus('draft');
    setChannelOwnership('standalone');
    setOwnerLabel(internalUserOptions[0]);
    setChannelTeamKey('');
  }

  return (
    <Shell title="Notification Channels" description="Manage destination channels for WhatsApp personal, WhatsApp group, and email.">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Tabs defaultValue="personal" className="space-y-4">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-800">
            <div>
              <div className="text-sm font-medium">Show Inactive Channels</div>
              <div className="text-xs text-muted-foreground">Inactive channels stay hidden by default, but can still be reactivated here.</div>
            </div>
            <Switch checked={showInactiveChannels} onCheckedChange={setShowInactiveChannels} />
          </div>
          <TabsList>
            <TabsTrigger value="personal">WhatsApp Personal</TabsTrigger>
            <TabsTrigger value="group">WhatsApp Group</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>
          {channelsError ? <div className="text-sm text-rose-600 dark:text-rose-400">{channelsError}</div> : null}
          {channelActionMessage ? <div className="text-sm text-muted-foreground">{channelActionMessage}</div> : null}
          <TabsContent value="personal" className="grid gap-4 md:grid-cols-2">
            {grouped.personal.map((item) => (
              <ChannelCard
                key={item.channel_id}
                icon={<MessageCircleMore className="size-4" />}
                deliveryState={deliveryStatus?.channels.find((channel) => channel.channel_type === 'wa-personal') || null}
                label={item.label}
                target={item.target_value}
                status={item.status}
                ownership={item.ownership_type}
                ownerLabel={item.owner_label || undefined}
                onEdit={() => handleEditChannel(item)}
                onTestSend={() => handleTestSend(item.channel_id)}
                testSendLoading={testSendLoadingId === item.channel_id}
                isActive={item.is_active}
                onToggleActive={() => handleToggleChannelState(item)}
                toggleLoading={channelToggleLoadingId === item.channel_id}
                onDelete={() => setChannelPendingDelete(item)}
                deleteLoading={channelDeleteLoadingId === item.channel_id}
              />
            ))}
          </TabsContent>
          <TabsContent value="group" className="grid gap-4 md:grid-cols-2">
            {grouped.group.map((item) => (
              <ChannelCard
                key={item.channel_id}
                icon={<MessageSquareMore className="size-4" />}
                deliveryState={deliveryStatus?.channels.find((channel) => channel.channel_type === 'wa-group') || null}
                label={item.label}
                target={item.target_value}
                status={item.status}
                ownership={item.ownership_type}
                ownerLabel={item.owner_label || undefined}
                onEdit={() => handleEditChannel(item)}
                onTestSend={() => handleTestSend(item.channel_id)}
                testSendLoading={testSendLoadingId === item.channel_id}
                isActive={item.is_active}
                onToggleActive={() => handleToggleChannelState(item)}
                toggleLoading={channelToggleLoadingId === item.channel_id}
                onDelete={() => setChannelPendingDelete(item)}
                deleteLoading={channelDeleteLoadingId === item.channel_id}
              />
            ))}
          </TabsContent>
          <TabsContent value="email" className="grid gap-4 md:grid-cols-2">
            {grouped.email.map((item) => (
              <ChannelCard
                key={item.channel_id}
                icon={<Mail className="size-4" />}
                deliveryState={deliveryStatus?.channels.find((channel) => channel.channel_type === 'email') || null}
                label={item.label}
                target={item.target_value}
                status={item.status}
                ownership={item.ownership_type}
                ownerLabel={item.owner_label || undefined}
                onEdit={() => handleEditChannel(item)}
                onTestSend={() => handleTestSend(item.channel_id)}
                testSendLoading={testSendLoadingId === item.channel_id}
                isActive={item.is_active}
                onToggleActive={() => handleToggleChannelState(item)}
                toggleLoading={channelToggleLoadingId === item.channel_id}
                onDelete={() => setChannelPendingDelete(item)}
                deleteLoading={channelDeleteLoadingId === item.channel_id}
              />
            ))}
          </TabsContent>
          {channelsLoading ? <div className="text-sm text-muted-foreground">Loading channels...</div> : null}
        </Tabs>

        <Card className="h-fit border-slate-200">
          <CardHeader>
            <CardTitle>{editingChannelId ? 'Edit User Notification Channel' : 'Create User Notification Channel'}</CardTitle>
            <CardDescription>
              Persisted flow for a recipient channel. It can stay standalone, or it can be bound to an internal user from the app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Channel Type</div>
              <Select value={channelType} onValueChange={(value) => setChannelType(value as NotificationChannel['type'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="WhatsApp Personal">WhatsApp Personal</SelectItem>
                  <SelectItem value="WhatsApp Group">WhatsApp Group</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Ownership</div>
              <Select value={channelOwnership} onValueChange={(value) => setChannelOwnership(value as NotificationChannel['ownership'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="standalone">Standalone Channel</SelectItem>
                  <SelectItem value="internal_user">Bound To Internal User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {channelOwnership === 'internal_user' ? (
              <div className="space-y-2">
                <div className="text-sm font-medium">Internal User</div>
                <Select value={ownerLabel} onValueChange={(value) => setOwnerLabel(value as (typeof internalUserOptions)[number])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {internalUserOptions.map((item) => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
            <div className="space-y-2">
              <div className="text-sm font-medium">Label</div>
              <Input value={channelLabel} onChange={(event) => setChannelLabel(event.target.value)} placeholder="Finance Lead / Ops Alert Group / Management Distribution" />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Team Key</div>
              <Input
                value={channelTeamKey}
                onChange={(event) => setChannelTeamKey(event.target.value)}
                placeholder="finance-core / ops-l2 / warehouse-night-shift"
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Target</div>
              <Input value={channelTarget} onChange={(event) => setChannelTarget(event.target.value)} placeholder={channelType === 'Email' ? 'name@company.com' : channelType === 'WhatsApp Group' ? 'ops-alert-group' : '+62812xxxxxxx'} />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Initial Status</div>
              <Select value={channelStatus} onValueChange={(value) => setChannelStatus(value as NotificationChannel['status'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="connected">Connected</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-muted-foreground">
              Proper concept: store this as a standalone notification channel first. Add optional user binding for owner routing, and use `team key` only when this channel should be matched by team-based escalation policy.
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleSaveChannel} disabled={channelSaveLoading || !channelLabel.trim() || !channelTarget.trim()}>
                {channelSaveLoading ? 'Saving...' : editingChannelId ? 'Save Channel' : 'Create Channel'}
              </Button>
              {editingChannelId ? (
                <Button variant="outline" onClick={resetChannelForm} disabled={channelSaveLoading}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={Boolean(channelPendingDelete)} onOpenChange={(open) => { if (!open) setChannelPendingDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notification Channel</AlertDialogTitle>
            <AlertDialogDescription>
              {channelPendingDelete
                ? `This will deactivate channel "${channelPendingDelete.label}" and remove it from the active channel list.`
                : 'This action will deactivate the selected notification channel.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={channelDeleteLoadingId !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!channelPendingDelete || channelDeleteLoadingId !== null}
              onClick={(event) => {
                event.preventDefault();
                if (!channelPendingDelete) return;
                void handleDeleteChannel(channelPendingDelete).then(() => setChannelPendingDelete(null));
              }}
            >
              {channelDeleteLoadingId !== null ? 'Deleting...' : 'Delete Channel'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Shell>
  );
}

function ChannelCard({
  label,
  target,
  status,
  ownership,
  ownerLabel,
  icon,
  deliveryState,
  onEdit,
  onTestSend,
  testSendLoading = false,
  isActive = true,
  onToggleActive,
  toggleLoading = false,
  onDelete,
  deleteLoading = false,
}: {
  label: string;
  target: string;
  status: string;
  ownership: NotificationChannel['ownership'];
  ownerLabel?: string;
  icon: ReactNode;
  deliveryState?: AlertDeliveryStatusRecord | null;
  onEdit?: () => void;
  onTestSend?: () => void;
  testSendLoading?: boolean;
  isActive?: boolean;
  onToggleActive?: () => void;
  toggleLoading?: boolean;
  onDelete?: () => void;
  deleteLoading?: boolean;
}) {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">{icon}{label}</CardTitle>
        <CardDescription>{target}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="outline" className={statusBadgeClass(status)}>{status}</Badge>
          <span className="text-xs text-muted-foreground">
            {deliveryState ? `${deliveryState.provider_mode} / ${deliveryState.provider_name}` : 'No provider status'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{ownership === 'internal_user' ? 'Bound to internal user' : 'Standalone channel'}</Badge>
          {ownerLabel ? <Badge variant="outline">{ownerLabel}</Badge> : null}
          <Badge variant="outline" className={isActive ? statusBadgeClass('connected') : statusBadgeClass('draft')}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
          {deliveryState ? (
            <Badge variant="outline" className={deliveryState.is_configured ? statusBadgeClass('connected') : statusBadgeClass('draft')}>
              {deliveryState.is_configured ? 'Configured' : 'Dry Run'}
            </Badge>
          ) : null}
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={onTestSend} disabled={!onTestSend || testSendLoading || !isActive}>
            {testSendLoading ? 'Sending...' : 'Test Send'}
          </Button>
          <Button size="sm" variant="outline" onClick={onEdit} disabled={!onEdit}>Edit</Button>
          <Button size="sm" variant="outline" onClick={onToggleActive} disabled={!onToggleActive || toggleLoading}>
            {toggleLoading ? 'Saving...' : isActive ? 'Deactivate' : 'Reactivate'}
          </Button>
          <Button size="sm" variant="outline" onClick={onDelete} disabled={!onDelete || deleteLoading}>
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


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

export function AlertOpsPageView() {
  const [ops, setOps] = useState<AlertOpsPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pairingPhoneNumber, setPairingPhoneNumber] = useState('');
  const [pairingLoading, setPairingLoading] = useState(false);
  const [pairingResult, setPairingResult] = useState<BaileysPairingPayload | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [qrImageError, setQrImageError] = useState('');
  const { copyToClipboard, isCopied } = useCopyToClipboard({
    onCopy: () => toast.success('Pairing token copied'),
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetch('/api/alerting/ops', { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success || !payload?.data) {
          throw new Error(payload?.message || 'Failed to load alert ops overview.');
        }
        if (!cancelled) {
          setOps(payload.data as AlertOpsPayload);
        }
      })
      .catch((fetchError) => {
        if (!cancelled) {
          setOps(null);
          setError(fetchError instanceof Error ? fetchError.message : 'Failed to load alert ops overview.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const refreshOps = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/alerting/ops', { cache: 'no-store' });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !payload?.data) {
        throw new Error(payload?.message || 'Failed to load alert ops overview.');
      }
      setOps(payload.data as AlertOpsPayload);
    } catch (fetchError) {
      setOps(null);
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load alert ops overview.');
    } finally {
      setLoading(false);
    }
  };

  const startBaileysPairing = async () => {
    setPairingLoading(true);
    setPairingResult(null);
    setQrImageUrl(null);
    setQrImageError('');
    setError('');
    try {
      const response = await fetch('/api/alerting/provider-health/baileys/pairing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: pairingPhoneNumber.trim() || undefined }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !payload?.data) {
        throw new Error(payload?.message || 'Failed to start Baileys pairing flow.');
      }
      setPairingResult(payload.data as BaileysPairingPayload);
      await refreshOps();
    } catch (pairingError) {
      setPairingResult(null);
      setError(pairingError instanceof Error ? pairingError.message : 'Failed to start Baileys pairing flow.');
    } finally {
      setPairingLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const qrValue = pairingResult?.qr?.trim() || '';
    if (!qrValue) {
      setQrImageUrl(null);
      setQrImageError('');
      return () => {
        active = false;
      };
    }

    QRCode.toDataURL(qrValue, {
      margin: 1,
      width: 280,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((value) => {
        if (!active) return;
        setQrImageUrl(value);
        setQrImageError('');
      })
      .catch((qrError) => {
        if (!active) return;
        setQrImageUrl(null);
        setQrImageError(qrError instanceof Error ? qrError.message : 'Failed to render QR code.');
      });

    return () => {
      active = false;
    };
  }, [pairingResult?.qr]);

  const analytics = ops?.analytics;
  const observability = ops?.delivery_observability;
  const deliveryStatus = ops?.delivery_status;
  const providerHealth = ops?.provider_health;

  return (
    <Shell
      title="Alert Ops"
      description="Operational health for rules, delivery, retries, and provider readiness."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/app/alerting/triage">Open Triage</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/app/alerting/escalation">Escalation Policy</Link>
          </Button>
          <Button variant="outline" onClick={refreshOps} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh Ops'}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/app/alerting/logs">Open Logs</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/app/alerting/settings">Open Settings</Link>
          </Button>
        </div>
      }
    >
      {error ? <div className="text-sm text-rose-600 dark:text-rose-400">{error}</div> : null}
      {loading ? <div className="text-sm text-muted-foreground">Loading alert ops overview...</div> : null}

      {ops ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            { label: 'Open Events', value: ops.highlights.open_events },
            { label: 'Dead Lettered Logs', value: ops.highlights.dead_lettered_logs },
            { label: 'Overdue Triage', value: ops.highlights.overdue_triage_items },
            { label: 'Configured Channels', value: ops.highlights.configured_channels },
            { label: 'Dry-Run Channels', value: ops.highlights.dry_run_channels },
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

      {ops?.triage ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Triage SLA</CardTitle>
              <CardDescription>
                Warning after {ops.triage.policy.warning_after_minutes} minutes, critical after {ops.triage.policy.critical_after_minutes} minutes.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-4">
              <div className="rounded-xl border px-4 py-3">
                <div className="text-xs text-muted-foreground">Open</div>
                <div className="text-2xl font-semibold">{ops.triage.summary.open_items}</div>
              </div>
              <div className="rounded-xl border px-4 py-3">
                <div className="text-xs text-muted-foreground">Investigating</div>
                <div className="text-2xl font-semibold">{ops.triage.summary.investigating_items}</div>
              </div>
              <div className="rounded-xl border px-4 py-3">
                <div className="text-xs text-muted-foreground">Overdue</div>
                <div className="text-2xl font-semibold text-amber-700">{ops.triage.summary.overdue_items}</div>
              </div>
              <div className="rounded-xl border px-4 py-3">
                <div className="text-xs text-muted-foreground">Critical</div>
                <div className="text-2xl font-semibold text-rose-700">{ops.triage.summary.critical_items}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stage Progression</CardTitle>
              <CardDescription>Operational visibility of escalation progress across configured stages.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border px-4 py-3">
                <div className="text-xs text-muted-foreground">Staged Items</div>
                <div className="text-2xl font-semibold">{ops.triage.summary.staged_items}</div>
              </div>
              <div className="rounded-xl border px-4 py-3">
                <div className="text-xs text-muted-foreground">Pending Next Stage</div>
                <div className="text-2xl font-semibold text-amber-700">{ops.triage.summary.pending_next_stage_items}</div>
              </div>
              <div className="rounded-xl border px-4 py-3">
                <div className="text-xs text-muted-foreground">Final Stage</div>
                <div className="text-2xl font-semibold text-slate-700">{ops.triage.summary.final_stage_items}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {ops?.triage?.audit_summary ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Triage Audit Activity</CardTitle>
              <CardDescription>Operational actions taken on dead-letter triage items.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-4">
              <div className="rounded-xl border px-4 py-3">
                <div className="text-xs text-muted-foreground">Total Entries</div>
                <div className="text-2xl font-semibold">{ops.triage.audit_summary.total_entries}</div>
              </div>
              <div className="rounded-xl border px-4 py-3">
                <div className="text-xs text-muted-foreground">Ack / Unack</div>
                <div className="text-2xl font-semibold">
                  {ops.triage.audit_summary.acknowledge_actions}/{ops.triage.audit_summary.unacknowledge_actions}
                </div>
              </div>
              <div className="rounded-xl border px-4 py-3">
                <div className="text-xs text-muted-foreground">Assignments</div>
                <div className="text-2xl font-semibold">{ops.triage.audit_summary.assignment_actions}</div>
              </div>
              <div className="rounded-xl border px-4 py-3">
                <div className="text-xs text-muted-foreground">Latest Action</div>
                <div className="text-sm font-medium">
                  {ops.triage.audit_summary.latest_action_at
                    ? ops.triage.audit_summary.latest_action_at.replace('T', ' ').slice(0, 19)
                    : '-'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audit Breakdown</CardTitle>
              <CardDescription>Top triage actions and operators over the recent filtered set.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">By Action</div>
                {ops.triage.audit_summary.action_breakdown.slice(0, 5).map((entry) => (
                  <div key={entry.action_type} className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm">
                    <span>{entry.action_type}</span>
                    <span className="font-medium">{entry.count}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Top Actors</div>
                {ops.triage.audit_summary.top_actors.length ? ops.triage.audit_summary.top_actors.map((entry) => (
                  <div key={entry.actor} className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm">
                    <span>{entry.actor}</span>
                    <span className="font-medium">{entry.action_count}</span>
                  </div>
                )) : (
                  <div className="rounded-xl border border-dashed px-3 py-3 text-sm text-muted-foreground">
                    No triage actors recorded yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {deliveryStatus ? (
        <Card>
          <CardHeader>
            <CardTitle>Provider Readiness</CardTitle>
            <CardDescription>Backend delivery mode per channel.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {deliveryStatus.channels.map((channel) => (
              <div key={channel.channel_type} className="rounded-xl border px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{channel.channel_type}</span>
                  <Badge variant="outline" className={channel.is_configured ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-700'}>
                    {channel.provider_mode}
                  </Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Provider: {channel.provider_name || '-'} · {channel.is_configured ? 'Configured' : 'Fallback / Dry Run'}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {providerHealth ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Baileys Session Health</CardTitle>
              <CardDescription>Runtime readiness for WhatsApp delivery through Baileys.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border px-4 py-3">
                <span className="font-medium">Status</span>
                <Badge variant="outline" className={providerHealth.baileys.session_ready ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}>
                  {providerHealth.baileys.status_label}
                </Badge>
              </div>
              <div className="rounded-xl border px-4 py-3 text-sm text-muted-foreground">
                Enabled: {providerHealth.baileys.enabled ? 'Yes' : 'No'}
              </div>
              <div className="rounded-xl border px-4 py-3 text-sm text-muted-foreground">
                Auth Directory: {providerHealth.baileys.auth_dir || '-'}
              </div>
              <div className="rounded-xl border px-4 py-3 text-sm text-muted-foreground">
                Auth Dir Exists: {providerHealth.baileys.auth_dir_exists ? 'Yes' : 'No'} · Files: {providerHealth.baileys.auth_file_count}
              </div>
              <div className="rounded-xl border px-4 py-3 text-sm text-muted-foreground">
                Creds Present: {providerHealth.baileys.creds_present ? 'Yes' : 'No'} · Session Ready: {providerHealth.baileys.session_ready ? 'Yes' : 'No'}
              </div>
              <div className="rounded-xl border px-4 py-3 text-sm text-muted-foreground">
                Last Auth Update: {providerHealth.baileys.last_auth_update_at ? providerHealth.baileys.last_auth_update_at.replace('T', ' ').slice(0, 19) : '-'}
              </div>
              {providerHealth.baileys.pairing_required ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  Pairing is still required. Populate `ALERTING_WA_BAILEYS_AUTH_DIR`, enable Baileys, then complete the WhatsApp auth flow in runtime before expecting real delivery.
                </div>
              ) : null}
              <div className="space-y-2 rounded-xl border px-4 py-3">
                <div className="text-sm font-medium">Start Pairing</div>
                <Input
                  value={pairingPhoneNumber}
                  onChange={(event) => setPairingPhoneNumber(event.target.value)}
                  placeholder="62812xxxxxxx for pairing code, or leave blank for QR token"
                />
                <Button size="sm" onClick={startBaileysPairing} disabled={pairingLoading || !providerHealth.baileys.enabled}>
                  {pairingLoading ? 'Starting Pairing...' : 'Start Baileys Pairing'}
                </Button>
                {!providerHealth.baileys.enabled ? (
                  <div className="text-xs text-muted-foreground">
                    Enable `ALERTING_WA_BAILEYS_ENABLED=true` first.
                  </div>
                ) : null}
              </div>
              {pairingResult ? (
                <div className="rounded-xl border px-4 py-3">
                  <div className="text-sm font-medium">Pairing Result</div>
                  <div className="mt-2 text-xs text-muted-foreground">{pairingResult.message}</div>
                  {pairingResult.pairing_code ? (
                    <div className="mt-2 space-y-2">
                      <div className="rounded-lg bg-slate-50 px-3 py-2 font-mono text-sm text-slate-900">
                        {pairingResult.pairing_code}
                      </div>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(pairingResult.pairing_code || '')}>
                        {isCopied ? 'Copied' : 'Copy Pairing Code'}
                      </Button>
                    </div>
                  ) : null}
                  {pairingResult.qr ? (
                    <div className="mt-2 space-y-3">
                      {qrImageUrl ? (
                        <div className="flex justify-center rounded-xl border bg-white p-3">
                          {/* next/image is not necessary here; QR is already a data URL payload */}
                          <img src={qrImageUrl} alt="Baileys pairing QR" className="h-72 w-72" />
                        </div>
                      ) : null}
                      {qrImageError ? (
                        <div className="text-xs text-amber-600 dark:text-amber-400">{qrImageError}</div>
                      ) : null}
                      <div className="rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs text-slate-900 break-all">
                        {pairingResult.qr}
                      </div>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(pairingResult.qr || '')}>
                        {isCopied ? 'Copied' : 'Copy QR Token'}
                      </Button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SMTP Health</CardTitle>
              <CardDescription>Runtime readiness for email delivery through SMTP.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border px-4 py-3">
                <span className="font-medium">Status</span>
                <Badge variant="outline" className={providerHealth.smtp.configured ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-700'}>
                  {providerHealth.smtp.configured ? 'configured' : 'not-configured'}
                </Badge>
              </div>
              <div className="rounded-xl border px-4 py-3 text-sm text-muted-foreground">
                Host: {providerHealth.smtp.host || '-'} · Port: {providerHealth.smtp.port || '-'}
              </div>
              <div className="rounded-xl border px-4 py-3 text-sm text-muted-foreground">
                Secure: {providerHealth.smtp.secure ? 'Yes' : 'No'} · From: {providerHealth.smtp.from || '-'}
              </div>
              <div className="rounded-xl border px-4 py-3 text-sm text-muted-foreground">
                Auth Credentials Present: {providerHealth.smtp.has_auth ? 'Yes' : 'No'}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {providerHealth ? (
        <Card>
          <CardHeader>
            <CardTitle>Provider Session State</CardTitle>
            <CardDescription>Current persisted session state per provider/channel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {providerHealth.session_states.map((state) => (
              <div key={state.session_state_id} className="rounded-xl border px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">
                    {state.provider_name} · {state.channel_type}
                  </span>
                  <Badge variant="outline" className={statusBadgeClass(state.session_status)}>
                    {state.session_status}
                  </Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Session Key: {state.session_key}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Message: {state.status_message || '-'}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Pairing Mode: {state.pairing_mode || '-'} · Phone: {state.phone_number || '-'}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Last Health: {state.last_health_check_at ? state.last_health_check_at.replace('T', ' ').slice(0, 19) : '-'} · Last Pairing: {state.last_pairing_result_at ? state.last_pairing_result_at.replace('T', ' ').slice(0, 19) : '-'}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Last Connected: {state.last_connected_at ? state.last_connected_at.replace('T', ' ').slice(0, 19) : '-'} · Last Disconnected: {state.last_disconnected_at ? state.last_disconnected_at.replace('T', ' ').slice(0, 19) : '-'}
                </div>
              </div>
            ))}
            {!providerHealth.session_states.length ? (
              <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
                No provider session state has been persisted yet.
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {providerHealth ? (
        <Card>
          <CardHeader>
            <CardTitle>Recent Pairing Attempts</CardTitle>
            <CardDescription>Latest Baileys pairing activity captured in audit storage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {providerHealth.recent_pairing_attempts.map((attempt) => (
              <div key={attempt.audit_id} className="rounded-xl border px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">
                    {attempt.action_type} {attempt.pairing_mode ? `· ${attempt.pairing_mode}` : ''}
                  </span>
                  <Badge variant="outline" className={statusBadgeClass(attempt.status)}>
                    {attempt.status}
                  </Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Actor: {attempt.created_by || '-'} · Time: {attempt.created_at ? attempt.created_at.replace('T', ' ').slice(0, 19) : '-'}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Phone: {attempt.phone_number || '-'} · Channel: {attempt.channel_type}
                </div>
                {attempt.error_message ? (
                  <div className="mt-1 text-xs text-rose-600 dark:text-rose-400">{attempt.error_message}</div>
                ) : null}
              </div>
            ))}
            {!providerHealth.recent_pairing_attempts.length ? (
              <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
                No pairing attempts have been recorded yet.
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {analytics ? (
        <Card>
          <CardHeader>
            <CardTitle>Rule Effectiveness</CardTitle>
            <CardDescription>Resolution, acknowledgement, and delivery quality by rule.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.rule_effectiveness.map((rule) => (
              <div key={rule.rule_id} className="rounded-xl border px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{rule.rule_name}</span>
                  <Badge variant="outline">{rule.total_runs} runs</Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Module: {moduleLabelFromKey(rule.module_key)} · Success Runs: {rule.successful_runs} · Events: {rule.total_events} · Deliveries: {rule.total_deliveries}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Ack: {rule.acknowledgement_rate.toFixed(2)}% · Resolved: {rule.resolution_rate.toFixed(2)}% · Delivery Success: {rule.delivery_success_rate.toFixed(2)}%
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Open: {rule.open_events} · Acked: {rule.acknowledged_events} · Resolved: {rule.resolved_events} · Failed Delivery: {rule.failed_deliveries} · Dead Lettered: {rule.dead_lettered_deliveries}
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

      {observability ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Pending Retries</CardTitle>
              <CardDescription>Queued deliveries waiting for the next retry window.</CardDescription>
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

          <Card>
            <CardHeader>
              <CardTitle>Dead Letters</CardTitle>
              <CardDescription>Deliveries that need manual recovery or provider diagnosis.</CardDescription>
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
                </div>
              ))}
              {!observability.dead_letters.length ? (
                <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
                  No dead-letter deliveries are waiting for action.
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </Shell>
  );
}

export function AlertEscalationPoliciesPageView() {
  const [policies, setPolicies] = useState<AlertEscalationPolicyRecord[]>([]);
  const [channels, setChannels] = useState<PersistedAlertChannelRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [toggleLoadingId, setToggleLoadingId] = useState<number | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null);
  const [editingPolicyId, setEditingPolicyId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AlertEscalationPolicyRecord | null>(null);
  const [moduleKey, setModuleKey] = useState('finance');
  const [escalationLevel, setEscalationLevel] = useState<'warning' | 'critical'>('critical');
  const [targetType, setTargetType] = useState<'channel' | 'role' | 'team'>('channel');
  const [targetRef, setTargetRef] = useState('');
  const [priority, setPriority] = useState('10');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [policiesResponse, channelsResponse] = await Promise.all([
        fetch('/api/alerting/escalation-policies', { cache: 'no-store' }),
        fetch('/api/alerting/channels', { cache: 'no-store' }),
      ]);
      const [policiesPayload, channelsPayload] = await Promise.all([
        policiesResponse.json().catch(() => null),
        channelsResponse.json().catch(() => null),
      ]);

      if (!policiesResponse.ok || !policiesPayload?.success || !Array.isArray(policiesPayload?.data)) {
        throw new Error(policiesPayload?.message || 'Failed to load escalation policies.');
      }
      if (!channelsResponse.ok || !channelsPayload?.success || !Array.isArray(channelsPayload?.data)) {
        throw new Error(channelsPayload?.message || 'Failed to load notification channels.');
      }

      setPolicies(policiesPayload.data as AlertEscalationPolicyRecord[]);
      setChannels(channelsPayload.data as PersistedAlertChannelRecord[]);
    } catch (loadError) {
      setPolicies([]);
      setChannels([]);
      setError(loadError instanceof Error ? loadError.message : 'Failed to load escalation policies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const resetForm = () => {
    setEditingPolicyId(null);
    setModuleKey('finance');
    setEscalationLevel('critical');
    setTargetType('channel');
    setTargetRef('');
    setPriority('10');
  };

  const handleEditPolicy = (policy: AlertEscalationPolicyRecord) => {
    setEditingPolicyId(policy.policy_id);
    setModuleKey(policy.module_key);
    setEscalationLevel(policy.escalation_level);
    setTargetType(policy.target_type);
    setTargetRef(policy.target_ref);
    setPriority(String(policy.priority));
  };

  const handleSavePolicy = async () => {
    if (!moduleKey.trim() || !escalationLevel.trim() || !targetRef.trim()) return;
    setSaveLoading(true);
    setError('');
    try {
      const response = await fetch(
        editingPolicyId ? `/api/alerting/escalation-policies/${editingPolicyId}` : '/api/alerting/escalation-policies',
        {
          method: editingPolicyId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            moduleKey,
            escalationLevel,
            targetType,
            targetRef: targetRef.trim(),
            priority: Number.parseInt(priority, 10) || 10,
          }),
        },
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || `Failed to ${editingPolicyId ? 'update' : 'create'} escalation policy.`);
      }
      setPolicies(payload.data as AlertEscalationPolicyRecord[]);
      resetForm();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : `Failed to ${editingPolicyId ? 'update' : 'create'} escalation policy.`);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleTogglePolicy = async (policy: AlertEscalationPolicyRecord) => {
    setToggleLoadingId(policy.policy_id);
    setError('');
    try {
      const response = await fetch(`/api/alerting/escalation-policies/${policy.policy_id}/state`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !policy.is_active }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to update escalation policy state.');
      }
      setPolicies(payload.data as AlertEscalationPolicyRecord[]);
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Failed to update escalation policy state.');
    } finally {
      setToggleLoadingId(null);
    }
  };

  const handleDeletePolicy = async (policy: AlertEscalationPolicyRecord) => {
    setDeleteLoadingId(policy.policy_id);
    setError('');
    try {
      const response = await fetch(`/api/alerting/escalation-policies/${policy.policy_id}`, { method: 'DELETE' });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to delete escalation policy.');
      }
      setPolicies(payload.data as AlertEscalationPolicyRecord[]);
      if (editingPolicyId === policy.policy_id) {
        resetForm();
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete escalation policy.');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const availableChannels = channels.filter((channel) => channel.is_active);

  return (
    <Shell
      title="Escalation Policy"
      description="Manage module and severity routing for triage escalation without editing seed SQL."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => void loadData()} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh Policies'}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/app/alerting/triage">Open Triage</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/app/alerting/settings">Open Settings</Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {error ? <div className="md:col-span-2 xl:col-span-3 text-sm text-rose-600 dark:text-rose-400">{error}</div> : null}
          {policies.map((policy) => (
            <Card key={policy.policy_id} className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-base">
                  {moduleLabelFromKey(policy.module_key)} · {policy.escalation_level}
                </CardTitle>
                <CardDescription>
                  {policy.target_type} → {policy.target_ref}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={statusBadgeClass(policy.escalation_level)}>
                    {policy.escalation_level}
                  </Badge>
                  <Badge variant="outline" className={policy.is_active ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-700'}>
                    {policy.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">Priority / Stage Order: {policy.priority}</div>
                <div className="text-xs text-muted-foreground">
                  Created: {policy.created_at ? policy.created_at.replace('T', ' ').slice(0, 19) : '-'}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditPolicy(policy)}>Edit</Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={toggleLoadingId === policy.policy_id}
                    onClick={() => handleTogglePolicy(policy)}
                  >
                    {toggleLoadingId === policy.policy_id ? 'Saving...' : policy.is_active ? 'Deactivate' : 'Reactivate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={deleteLoadingId === policy.policy_id}
                    onClick={() => setPendingDelete(policy)}
                  >
                    {deleteLoadingId === policy.policy_id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {loading ? <div className="md:col-span-2 xl:col-span-3 text-sm text-muted-foreground">Loading escalation policies...</div> : null}
          {!loading && !policies.length ? (
            <div className="md:col-span-2 xl:col-span-3 rounded-xl border border-dashed px-4 py-8 text-sm text-muted-foreground">
              No escalation policies have been configured yet.
            </div>
          ) : null}
        </div>

        <Card className="h-fit border-slate-200">
          <CardHeader>
            <CardTitle>{editingPolicyId ? 'Edit Escalation Policy' : 'Create Escalation Policy'}</CardTitle>
            <CardDescription>Control which target receives overdue triage escalation by module and severity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">Module</div>
                <Select value={moduleKey} onValueChange={setModuleKey}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modules</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="purchasing">Purchasing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Escalation Level</div>
                <Select value={escalationLevel} onValueChange={(value) => setEscalationLevel(value as 'warning' | 'critical')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">Target Type</div>
                <Select value={targetType} onValueChange={(value) => setTargetType(value as 'channel' | 'role' | 'team')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="channel">Channel</SelectItem>
                    <SelectItem value="role">Role</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Priority / Stage Order</div>
                <Input value={priority} onChange={(event) => setPriority(event.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Target Reference</div>
              {targetType === 'channel' ? (
                <Select value={targetRef} onValueChange={setTargetRef}>
                  <SelectTrigger><SelectValue placeholder="Select active channel" /></SelectTrigger>
                  <SelectContent>
                    {availableChannels.map((channel) => (
                      <SelectItem key={channel.channel_id} value={channel.channel_key}>
                        {channel.label} ({channel.channel_type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={targetRef}
                  onChange={(event) => setTargetRef(event.target.value)}
                  placeholder={targetType === 'role' ? 'Finance Manager' : 'finance-core'}
                />
              )}
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-muted-foreground">
              Lower priority runs earlier. Example: stage `10` for team, stage `20` for management.
            </div>

            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleSavePolicy} disabled={saveLoading || !targetRef.trim()}>
                {saveLoading ? 'Saving...' : editingPolicyId ? 'Save Policy' : 'Create Policy'}
              </Button>
              {editingPolicyId ? (
                <Button variant="outline" onClick={resetForm} disabled={saveLoading}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => { if (!open) setPendingDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Escalation Policy</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `This will deactivate and hide the policy ${moduleLabelFromKey(pendingDelete.module_key)} · ${pendingDelete.escalation_level} -> ${pendingDelete.target_ref}.`
                : 'This action will deactivate the selected escalation policy.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoadingId !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!pendingDelete || deleteLoadingId !== null}
              onClick={(event) => {
                event.preventDefault();
                if (!pendingDelete) return;
                void handleDeletePolicy(pendingDelete).then(() => setPendingDelete(null));
              }}
            >
              {deleteLoadingId !== null ? 'Deleting...' : 'Delete Policy'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Shell>
  );
}

export function AlertSettingsPageView() {
  const [deliveryStatus, setDeliveryStatus] = useState<AlertDeliveryStatusPayload | null>(null);
  const [runtimeSettings, setRuntimeSettings] = useState<AlertRuntimeSettingRecord[]>([]);
  const [actionLoading, setActionLoading] = useState<'scheduler' | 'delivery' | 'triage' | null>(null);
  const [actionMessage, setActionMessage] = useState('');
  const [settingsSaveLoading, setSettingsSaveLoading] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');
  const [quietHoursInput, setQuietHoursInput] = useState('');
  const [dedupWindowInput, setDedupWindowInput] = useState('');
  const [retryPolicyInput, setRetryPolicyInput] = useState('');
  const [triageSlaInput, setTriageSlaInput] = useState('');
  const [triageEscalationInput, setTriageEscalationInput] = useState('');
  const [triageEscalationChannelInput, setTriageEscalationChannelInput] = useState('');
  const [triageEscalationCooldownInput, setTriageEscalationCooldownInput] = useState('');
  const [triageAutoCloseOnRecovery, setTriageAutoCloseOnRecovery] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/alerting/delivery-status', { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success || !payload?.data) {
          throw new Error(payload?.message || 'Failed to load delivery status.');
        }
        if (!cancelled) setDeliveryStatus(payload.data as AlertDeliveryStatusPayload);
      })
      .catch(() => {
        if (!cancelled) setDeliveryStatus(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/alerting/settings', { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
          throw new Error(payload?.message || 'Failed to load alert settings.');
        }
        if (!cancelled) setRuntimeSettings(payload.data as AlertRuntimeSettingRecord[]);
      })
      .catch(() => {
        if (!cancelled) setRuntimeSettings([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const quietHours = runtimeSettings.find((item) => item.setting_key === 'quiet_hours')?.value_text || '23:00 - 06:00 UTC';
  const dedupWindow = runtimeSettings.find((item) => item.setting_key === 'dedup_window_minutes')?.value_text || '30 minutes';
  const retryPolicy = runtimeSettings.find((item) => item.setting_key === 'retry_policy')?.value_text || '3 attempts with exponential backoff';
  const triageSla = runtimeSettings.find((item) => item.setting_key === 'triage_sla_minutes')?.value_text || '60 minutes';
  const triageEscalation = runtimeSettings.find((item) => item.setting_key === 'triage_escalation_policy')?.value_text || 'Warning at SLA, critical at 2x SLA';
  const triageEscalationChannel =
    runtimeSettings.find((item) => item.setting_key === 'triage_escalation_channel_key')?.value_text || 'channel-ops-alert-group';
  const triageEscalationCooldown =
    runtimeSettings.find((item) => item.setting_key === 'triage_escalation_cooldown_minutes')?.value_text || '60 minutes';
  const triageAutoCloseOnRecoverySetting =
    runtimeSettings.find((item) => item.setting_key === 'triage_auto_close_on_recovery');
  const triageAutoCloseEnabled =
    typeof triageAutoCloseOnRecoverySetting?.value_json?.enabled === 'boolean'
      ? Boolean(triageAutoCloseOnRecoverySetting.value_json.enabled)
      : String(triageAutoCloseOnRecoverySetting?.value_text || '').trim().toLowerCase() === 'enabled';

  useEffect(() => {
    setQuietHoursInput(quietHours);
    setDedupWindowInput(dedupWindow);
    setRetryPolicyInput(retryPolicy);
    setTriageSlaInput(triageSla);
    setTriageEscalationInput(triageEscalation);
    setTriageEscalationChannelInput(triageEscalationChannel);
    setTriageEscalationCooldownInput(triageEscalationCooldown);
    setTriageAutoCloseOnRecovery(triageAutoCloseEnabled);
  }, [quietHours, dedupWindow, retryPolicy, triageSla, triageEscalation, triageEscalationChannel, triageEscalationCooldown, triageAutoCloseEnabled]);

  const runOperation = async (operation: 'scheduler' | 'delivery' | 'triage') => {
    setActionLoading(operation);
    setActionMessage('');
    try {
      const path =
        operation === 'triage'
          ? '/api/alerting/triage/escalation/run'
          : `/api/alerting/${operation}/run`;
      const response = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || `Failed to run ${operation}.`);
      }
      setActionMessage(
        operation === 'scheduler'
          ? `Scheduler processed ${payload.data?.processed_rule_count ?? 0} rule(s).`
          : operation === 'delivery'
            ? `Delivery worker processed ${payload.data?.processed_delivery_count ?? 0} log(s).`
            : `Triage escalation processed ${payload.data?.processed_item_count ?? 0} item(s) and escalated ${payload.data?.escalated_count ?? 0}.`,
      );
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : `Failed to run ${operation}.`);
    } finally {
      setActionLoading(null);
    }
  };

  const saveSetting = async (settingKey: string, valueText: string, valueJson: Record<string, unknown>) => {
    const response = await fetch(`/api/alerting/settings/${settingKey}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valueText, valueJson }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
      throw new Error(payload?.message || `Failed to update ${settingKey}.`);
    }
    setRuntimeSettings(payload.data as AlertRuntimeSettingRecord[]);
  };

  const handleSaveSettings = async () => {
    setSettingsSaveLoading(true);
    setSettingsMessage('');
    try {
      const triageSlaMinutes = Number.parseInt(triageSlaInput, 10);
      const escalationNumbers = triageEscalationInput.match(/\d+/g)?.map((value) => Number.parseInt(value, 10)) || [];
      const warningAfterMinutes = escalationNumbers[0] || (Number.isFinite(triageSlaMinutes) ? triageSlaMinutes : 60);
      const criticalAfterMinutes = escalationNumbers[1] || warningAfterMinutes * 2;
      await saveSetting('quiet_hours', quietHoursInput.trim(), { value: quietHoursInput.trim() });
      await saveSetting('dedup_window_minutes', dedupWindowInput.trim(), { value: dedupWindowInput.trim() });
      await saveSetting('retry_policy', retryPolicyInput.trim(), { value: retryPolicyInput.trim() });
      await saveSetting('triage_sla_minutes', triageSlaInput.trim(), {
        minutes: Number.isFinite(triageSlaMinutes) ? triageSlaMinutes : 60,
      });
      await saveSetting('triage_escalation_policy', triageEscalationInput.trim(), {
        warning_after_minutes: warningAfterMinutes,
        critical_after_minutes: criticalAfterMinutes,
      });
      await saveSetting('triage_escalation_channel_key', triageEscalationChannelInput.trim(), {
        channel_key: triageEscalationChannelInput.trim(),
      });
      await saveSetting('triage_escalation_cooldown_minutes', triageEscalationCooldownInput.trim(), {
        minutes: Number.parseInt(triageEscalationCooldownInput, 10) || 60,
      });
      await saveSetting('triage_auto_close_on_recovery', triageAutoCloseOnRecovery ? 'enabled' : 'disabled', {
        enabled: triageAutoCloseOnRecovery,
      });
      setSettingsMessage('Alert settings saved.');
    } catch (error) {
      setSettingsMessage(error instanceof Error ? error.message : 'Failed to save alert settings.');
    } finally {
      setSettingsSaveLoading(false);
    }
  };

  return (
    <Shell
      title="Settings"
      description="Default presets for alerting, retry policy, quiet hours, and severity visualization."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/app/alerting/escalation">Escalation Policy</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/app/alerting/ops">Open Alert Ops</Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Execution Defaults</CardTitle>
            <CardDescription>Scheduler and delivery worker now run from backend intervals and can also be triggered manually.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SettingRow
              icon={<Clock3 className="size-4" />}
              title="Scheduler Interval"
              description={`${deliveryStatus?.scheduler_interval_ms ? `${Math.round(deliveryStatus.scheduler_interval_ms / 1000)}s` : '60s'} backend worker interval`}
            />
            <Separator />
            <div className="space-y-2">
              <div className="text-sm font-medium">Quiet Hours</div>
              <Input value={quietHoursInput} onChange={(event) => setQuietHoursInput(event.target.value)} />
            </div>
            <Separator />
            <SettingRow
              icon={<BellRing className="size-4" />}
              title="Delivery Interval"
              description={`${deliveryStatus?.delivery_interval_ms ? `${Math.round(deliveryStatus.delivery_interval_ms / 1000)}s` : '30s'} backend worker interval`}
            />
            <Separator />
            <SettingRow
              icon={<TriangleAlert className="size-4" />}
              title="Triage Escalation Interval"
              description={`${deliveryStatus?.triage_escalation_interval_ms ? `${Math.round(deliveryStatus.triage_escalation_interval_ms / 1000)}s` : '60s'} backend worker interval`}
            />
            <Separator />
            <div className="space-y-2">
              <div className="text-sm font-medium">Default Dedup Window</div>
              <Input value={dedupWindowInput} onChange={(event) => setDedupWindowInput(event.target.value)} />
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="text-sm font-medium">Retry Policy</div>
              <Input value={retryPolicyInput} onChange={(event) => setRetryPolicyInput(event.target.value)} />
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="text-sm font-medium">Triage SLA</div>
              <Input value={triageSlaInput} onChange={(event) => setTriageSlaInput(event.target.value)} />
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="text-sm font-medium">Triage Escalation Policy</div>
              <Input value={triageEscalationInput} onChange={(event) => setTriageEscalationInput(event.target.value)} />
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="text-sm font-medium">Triage Escalation Channel</div>
              <Input value={triageEscalationChannelInput} onChange={(event) => setTriageEscalationChannelInput(event.target.value)} />
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="text-sm font-medium">Triage Escalation Cooldown</div>
              <Input value={triageEscalationCooldownInput} onChange={(event) => setTriageEscalationCooldownInput(event.target.value)} />
            </div>
            <Separator />
            <div className="flex items-center justify-between rounded-xl border px-3 py-3">
              <div>
                <div className="text-sm font-medium">Auto Close Triage On Recovery</div>
                <div className="text-xs text-muted-foreground">
                  Resolve triage automatically when a requeued delivery succeeds.
                </div>
              </div>
              <Switch checked={triageAutoCloseOnRecovery} onCheckedChange={setTriageAutoCloseOnRecovery} />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button size="sm" variant="outline" disabled={actionLoading === 'scheduler'} onClick={() => runOperation('scheduler')}>
                {actionLoading === 'scheduler' ? 'Running Scheduler...' : 'Run Scheduler Now'}
              </Button>
              <Button size="sm" variant="outline" disabled={actionLoading === 'delivery'} onClick={() => runOperation('delivery')}>
                {actionLoading === 'delivery' ? 'Running Delivery...' : 'Run Delivery Now'}
              </Button>
              <Button size="sm" variant="outline" disabled={actionLoading === 'triage'} onClick={() => runOperation('triage')}>
                {actionLoading === 'triage' ? 'Running Triage...' : 'Run Triage Escalation Now'}
              </Button>
              <Button size="sm" disabled={settingsSaveLoading} onClick={handleSaveSettings}>
                {settingsSaveLoading ? 'Saving Settings...' : 'Save Settings'}
              </Button>
            </div>
            {actionMessage ? <div className="text-sm text-muted-foreground">{actionMessage}</div> : null}
            {settingsMessage ? <div className="text-sm text-muted-foreground">{settingsMessage}</div> : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Severity Mapping</CardTitle>
            <CardDescription>Severity colors stay static, while provider readiness now reflects backend configuration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(['low', 'medium', 'high', 'critical'] as const).map((severity) => (
              <div key={severity} className="flex items-center justify-between rounded-xl border px-3 py-2">
                <Badge variant="outline" className={severityBadgeClass(severity)}>{severity}</Badge>
                <span className="text-sm text-muted-foreground">
                  {deliveryStatus?.channels?.filter((item) => item.is_configured).length
                    ? `${deliveryStatus.channels.filter((item) => item.is_configured).length} channel(s) configured`
                    : 'All channels currently fall back to dry run'}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}

function buildDeadLetterTriageApiPath(filters?: {
  deliveryId?: number | null;
  triageStatus?: string;
  acknowledged?: string;
  slaStatus?: string;
  moduleKey?: string;
  stage?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.deliveryId) params.set('deliveryId', String(filters.deliveryId));
  if (filters?.triageStatus && filters.triageStatus !== 'all') params.set('triageStatus', filters.triageStatus);
  if (filters?.acknowledged && filters.acknowledged !== 'all') params.set('acknowledged', filters.acknowledged);
  if (filters?.slaStatus && filters.slaStatus !== 'all') params.set('slaStatus', filters.slaStatus);
  if (filters?.moduleKey && filters.moduleKey !== 'all') params.set('moduleKey', filters.moduleKey);
  if (filters?.stage && filters.stage !== 'all') params.set('stage', filters.stage);
  if (filters?.search?.trim()) params.set('search', filters.search.trim());
  if (filters?.sortBy && filters.sortBy !== 'dead_lettered_at') params.set('sortBy', filters.sortBy);
  if (filters?.sortOrder && filters.sortOrder !== 'desc') params.set('sortOrder', filters.sortOrder);

  const query = params.toString();
  return query ? `/api/alerting/dead-letter-triage?${query}` : '/api/alerting/dead-letter-triage';
}

function TriageItemCard({
  item,
  savingId,
  onUpdate,
  onRequeue,
  showDetailLink = true,
}: {
  item: AlertDeadLetterTriageRecord;
  savingId: number | null;
  onUpdate: (
    deliveryId: number,
    next: { triageStatus: string; assignedTo?: string; note?: string; acknowledge?: boolean; unacknowledge?: boolean },
  ) => Promise<void>;
  onRequeue: (deliveryId: number) => Promise<void>;
  showDetailLink?: boolean;
}) {
  return (
    <div className="rounded-xl border px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-medium">{item.event_title || `Delivery #${item.delivery_id}`}</div>
          <div className="text-xs text-muted-foreground">
            {item.rule_name || '-'} · {moduleLabelFromKey(item.module_key || '')} · {item.channel_type} · {item.target_value}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={statusBadgeClass(item.delivery_status)}>{item.delivery_status}</Badge>
          <Badge variant="outline" className={statusBadgeClass(item.triage_status)}>{item.triage_status}</Badge>
          <Badge variant="outline" className={statusBadgeClass(item.sla_status)}>{item.sla_status}</Badge>
          {item.acknowledged_at ? <Badge variant="outline">acknowledged</Badge> : null}
          {showDetailLink ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/app/alerting/triage/${item.delivery_id}`}>View Detail</Link>
            </Button>
          ) : null}
        </div>
      </div>
      <div className="mt-3 text-xs text-amber-600 dark:text-amber-400">
        {item.dead_letter_reason || item.error_message || 'No failure reason recorded.'}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        Retry: {item.retry_count}/{item.max_retries} · Dead Lettered At: {item.dead_lettered_at ? item.dead_lettered_at.replace('T', ' ').slice(0, 19) : '-'}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        Age: {item.age_minutes}m · SLA Due: {item.sla_due_at ? item.sla_due_at.replace('T', ' ').slice(0, 19) : '-'} · Escalation: {item.escalation_level}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        Escalated: {item.escalation_count} time(s) · Last Escalated: {item.last_escalated_at ? item.last_escalated_at.replace('T', ' ').slice(0, 19) : '-'} · Last Level: {item.last_escalation_level || '-'}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        Acknowledged: {item.acknowledged_at ? item.acknowledged_at.replace('T', ' ').slice(0, 19) : '-'}
        {item.acknowledged_by ? ` · by ${item.acknowledged_by}` : ''}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        Stage: {item.current_stage_index !== null ? `${item.current_stage_index + 1}/${item.stage_count}` : item.stage_count ? `Pending 1/${item.stage_count}` : 'No policy stage'}
        {item.current_stage_priority !== null ? ` · Current Priority ${item.current_stage_priority}` : ''}
        {item.is_final_stage ? ' · Final stage reached' : ''}
        {item.repeating_final_stage ? ' · Reminder mode' : ''}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        Next Stage: {item.has_next_stage && item.next_stage_index !== null ? `${item.next_stage_index + 1}/${item.stage_count}` : 'None'}
        {item.next_stage_priority !== null ? ` · Priority ${item.next_stage_priority}` : ''}
      </div>
      {item.next_stage_targets.length ? (
        <div className="mt-1 text-xs text-muted-foreground">
          Next Targets: {item.next_stage_targets.map((target) => `${target.target_type}:${target.target_ref}`).join(', ')}
        </div>
      ) : null}
      {item.escalation_timeline.length ? (
        <div className="mt-3 rounded-xl border border-dashed px-3 py-3">
          <div className="text-xs font-medium text-slate-900 dark:text-slate-100">Escalation Timeline</div>
          <div className="mt-2 space-y-2">
            {item.escalation_timeline.map((entry) => (
              <div key={entry.escalation_delivery_id} className="text-xs text-muted-foreground">
                <span className="font-medium text-slate-900 dark:text-slate-100">Stage {entry.stage_index + 1}</span>
                {entry.stage_priority ? ` · Priority ${entry.stage_priority}` : ''}
                {entry.repeating_final_stage ? ' · Reminder' : ''}
                {` · ${entry.channel_type}:${entry.target_value} · ${entry.delivery_status}`}
                {entry.routing_source ? ` · ${entry.routing_source}` : ''}
                {entry.requested_at ? ` · ${entry.requested_at.replace('T', ' ').slice(0, 19)}` : ''}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {item.triage_audit_timeline.length ? (
        <div className="mt-3 rounded-xl border border-dashed px-3 py-3">
          <div className="text-xs font-medium text-slate-900 dark:text-slate-100">Triage Audit Trail</div>
          <div className="mt-2 space-y-2">
            {item.triage_audit_timeline.map((entry) => (
              <div key={entry.audit_id} className="text-xs text-muted-foreground">
                <span className="font-medium text-slate-900 dark:text-slate-100">{entry.action_type}</span>
                {entry.previous_triage_status || entry.next_triage_status
                  ? ` · ${entry.previous_triage_status || '-'} -> ${entry.next_triage_status || '-'}`
                  : ''}
                {entry.created_by ? ` · ${entry.created_by}` : ''}
                {entry.created_at ? ` · ${entry.created_at.replace('T', ' ').slice(0, 19)}` : ''}
                {entry.next_assigned_to ? ` · assignee ${entry.next_assigned_to}` : ''}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="space-y-2">
          <div className="text-sm font-medium">Assignee</div>
          <Input
            defaultValue={item.assigned_to || ''}
            onBlur={(event) => {
              const nextValue = event.currentTarget.value.trim();
              if (nextValue === (item.assigned_to || '')) return;
              void onUpdate(item.delivery_id, {
                triageStatus: item.triage_status,
                assignedTo: nextValue,
                note: item.note || '',
              });
            }}
            placeholder="ops engineer"
          />
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Triage Status</div>
          <Select
            value={item.triage_status}
            onValueChange={(value) => {
              void onUpdate(item.delivery_id, {
                triageStatus: value,
                assignedTo: item.assigned_to || '',
                note: item.note || '',
              });
            }}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="requeued">Requeued</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-xs text-muted-foreground">
            Explicit `Acknowledge` pauses escalation reminders. `Investigating` is now workflow status only.
          </div>
        </div>
        <div className="flex items-end">
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={savingId === item.delivery_id}
              onClick={() =>
                void onUpdate(item.delivery_id, {
                  triageStatus: item.triage_status,
                  assignedTo: item.assigned_to || '',
                  note: item.note || '',
                  acknowledge: !item.acknowledged_at,
                  unacknowledge: Boolean(item.acknowledged_at),
                })
              }
            >
              {savingId === item.delivery_id ? 'Processing...' : item.acknowledged_at ? 'Unacknowledge' : 'Acknowledge'}
            </Button>
            <Button
              variant="outline"
              disabled={savingId === item.delivery_id || !['failed', 'dead-lettered'].includes(item.delivery_status)}
              onClick={() => void onRequeue(item.delivery_id)}
            >
              {savingId === item.delivery_id ? 'Processing...' : 'Requeue Delivery'}
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="text-sm font-medium">Note</div>
        <Textarea
          defaultValue={item.note || ''}
          onBlur={(event) => {
            const nextValue = event.currentTarget.value.trim();
            if (nextValue === (item.note || '')) return;
            void onUpdate(item.delivery_id, {
              triageStatus: item.triage_status,
              assignedTo: item.assigned_to || '',
              note: nextValue,
            });
          }}
          placeholder="Provider rejected delivery due to invalid session or target."
        />
      </div>
    </div>
  );
}

export function AlertDeadLetterTriagePageView() {
  const [items, setItems] = useState<AlertDeadLetterTriageRecord[]>([]);
  const [savedViews, setSavedViews] = useState<AlertTriageSavedViewRecord[]>([]);
  const [summary, setSummary] = useState<AlertDeadLetterTriageSummary | null>(null);
  const [policy, setPolicy] = useState<AlertDeadLetterTriagePolicy | null>(null);
  const [auditSummary, setAuditSummary] = useState<AlertDeadLetterTriageAuditSummary | null>(null);
  const [filterContext, setFilterContext] = useState<AlertDeadLetterTriageFilterContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [triageStatusFilter, setTriageStatusFilter] = useState('all');
  const [acknowledgedFilter, setAcknowledgedFilter] = useState('all');
  const [slaStatusFilter, setSlaStatusFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dead_lettered_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [savedViewName, setSavedViewName] = useState('');
  const [savedViewShared, setSavedViewShared] = useState(false);
  const [savedViewDefault, setSavedViewDefault] = useState(false);
  const [editingSavedViewId, setEditingSavedViewId] = useState<number | null>(null);
  const [viewActionLoadingId, setViewActionLoadingId] = useState<number | null>(null);

  const triageApiPath = useMemo(
    () =>
      buildDeadLetterTriageApiPath({
        triageStatus: triageStatusFilter,
        acknowledged: acknowledgedFilter,
        slaStatus: slaStatusFilter,
        moduleKey: moduleFilter,
        stage: stageFilter,
        search: deferredSearch,
        sortBy,
        sortOrder,
      }),
    [acknowledgedFilter, deferredSearch, moduleFilter, slaStatusFilter, sortBy, sortOrder, stageFilter, triageStatusFilter],
  );

  const loadItems = async (path = triageApiPath) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(path, { cache: 'no-store' });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to load dead-letter triage items.');
      }
      setItems(payload.data as AlertDeadLetterTriageRecord[]);
      setSummary((payload?.summary as AlertDeadLetterTriageSummary | undefined) || null);
      setPolicy((payload?.policy as AlertDeadLetterTriagePolicy | undefined) || null);
      setAuditSummary((payload?.audit_summary as AlertDeadLetterTriageAuditSummary | undefined) || null);
      setFilterContext((payload?.filter_context as AlertDeadLetterTriageFilterContext | undefined) || null);
    } catch (fetchError) {
      setItems([]);
      setSummary(null);
      setPolicy(null);
      setAuditSummary(null);
      setFilterContext(null);
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load dead-letter triage items.');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedViews = async () => {
    try {
      const response = await fetch('/api/alerting/triage-saved-views', { cache: 'no-store' });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to load triage saved views.');
      }
      setSavedViews(payload.data as AlertTriageSavedViewRecord[]);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load triage saved views.');
      setSavedViews([]);
    }
  };

  useEffect(() => {
    void loadItems();
    void loadSavedViews();
  }, [triageApiPath]);

  const applySavedView = (view: AlertTriageSavedViewRecord) => {
    const filters = view.filters_json || {};
    setSavedViewName(view.name);
    setSavedViewShared(Boolean(view.is_shared));
    setSavedViewDefault(Boolean(view.is_default));
    setEditingSavedViewId(view.view_id);
    setSearch(String(filters.search || ''));
    setTriageStatusFilter(String(filters.triageStatus || filters.triage_status || 'all'));
    setAcknowledgedFilter(String(filters.acknowledged || 'all'));
    setSlaStatusFilter(String(filters.slaStatus || filters.sla_status || 'all'));
    setModuleFilter(String(filters.moduleKey || filters.module_key || 'all'));
    setStageFilter(String(filters.stage || 'all'));
    setSortBy(view.sort_by || 'dead_lettered_at');
    setSortOrder(view.sort_order || 'desc');
  };

  const resetSavedViewEditor = () => {
    setSavedViewName('');
    setSavedViewShared(false);
    setSavedViewDefault(false);
    setEditingSavedViewId(null);
  };

  const persistSavedView = async () => {
    if (!savedViewName.trim()) {
      setError('Saved view name is required.');
      return;
    }
    setError('');
    setViewActionLoadingId(editingSavedViewId || -1);
    try {
      const body = {
        name: savedViewName.trim(),
        isShared: savedViewShared,
        isDefault: savedViewDefault,
        filtersJson: {
          triageStatus: triageStatusFilter,
          acknowledged: acknowledgedFilter,
          slaStatus: slaStatusFilter,
          moduleKey: moduleFilter,
          stage: stageFilter,
          search,
        },
        sortBy,
        sortOrder,
      };
      const endpoint = editingSavedViewId
        ? `/api/alerting/triage-saved-views/${editingSavedViewId}`
        : '/api/alerting/triage-saved-views';
      const method = editingSavedViewId ? 'PATCH' : 'POST';
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to save triage view.');
      }
      setSavedViews(payload.data as AlertTriageSavedViewRecord[]);
      resetSavedViewEditor();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save triage view.');
    } finally {
      setViewActionLoadingId(null);
    }
  };

  const toggleSavedViewState = async (viewId: number, isActive: boolean) => {
    setError('');
    setViewActionLoadingId(viewId);
    try {
      const response = await fetch(`/api/alerting/triage-saved-views/${viewId}/state`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to update triage view state.');
      }
      setSavedViews(payload.data as AlertTriageSavedViewRecord[]);
    } catch (stateError) {
      setError(stateError instanceof Error ? stateError.message : 'Failed to update triage view state.');
    } finally {
      setViewActionLoadingId(null);
    }
  };

  const deleteSavedView = async (viewId: number) => {
    setError('');
    setViewActionLoadingId(viewId);
    try {
      const response = await fetch(`/api/alerting/triage-saved-views/${viewId}`, { method: 'DELETE' });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to delete triage view.');
      }
      setSavedViews(payload.data as AlertTriageSavedViewRecord[]);
      if (editingSavedViewId === viewId) {
        resetSavedViewEditor();
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete triage view.');
    } finally {
      setViewActionLoadingId(null);
    }
  };

  const updateTriage = async (
    deliveryId: number,
    next: { triageStatus: string; assignedTo?: string; note?: string; acknowledge?: boolean; unacknowledge?: boolean },
  ) => {
    setSavingId(deliveryId);
    setError('');
    try {
      const response = await fetch(`/api/alerting/dead-letter-triage/${deliveryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to update dead-letter triage item.');
      }
      setItems(payload.data as AlertDeadLetterTriageRecord[]);
      setSummary((payload?.summary as AlertDeadLetterTriageSummary | undefined) || null);
      setPolicy((payload?.policy as AlertDeadLetterTriagePolicy | undefined) || null);
      setAuditSummary((payload?.audit_summary as AlertDeadLetterTriageAuditSummary | undefined) || null);
      setFilterContext((payload?.filter_context as AlertDeadLetterTriageFilterContext | undefined) || null);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Failed to update dead-letter triage item.');
    } finally {
      setSavingId(null);
    }
  };

  const requeueItem = async (deliveryId: number) => {
    setSavingId(deliveryId);
    setError('');
    try {
      const response = await fetch(`/api/alerting/delivery-logs/${deliveryId}/requeue`, { method: 'POST' });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to requeue delivery log.');
      }
      await loadItems();
    } catch (requeueError) {
      setError(requeueError instanceof Error ? requeueError.message : 'Failed to requeue delivery log.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <Shell
      title="Dead-Letter Triage"
      description="Assign, investigate, and recover delivery failures that require manual action."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => void loadItems()} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh Triage'}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/app/alerting/escalation">Escalation Policy</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/app/alerting/logs">Open Logs</Link>
          </Button>
        </div>
      }
    >
      {error ? <div className="text-sm text-rose-600 dark:text-rose-400">{error}</div> : null}
      {summary ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            { label: 'Filtered Items', value: summary.total_items },
            { label: 'Overdue', value: summary.overdue_items + summary.critical_items },
            { label: 'Critical', value: summary.critical_items },
            { label: 'Acknowledged', value: summary.acknowledged_items },
            { label: 'Unassigned', value: summary.unassigned_items },
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
      {auditSummary ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Audit Entries', value: auditSummary.total_entries },
            { label: 'Ack / Unack', value: `${auditSummary.acknowledge_actions}/${auditSummary.unacknowledge_actions}` },
            { label: 'Assignments', value: auditSummary.assignment_actions },
            { label: 'Requeues', value: auditSummary.requeue_actions },
          ].map((item) => (
            <Card key={item.label}>
              <CardHeader className="pb-2">
                <CardDescription>{item.label}</CardDescription>
                <CardTitle className="text-2xl">{item.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : null}
      {auditSummary ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Audit Breakdown</CardTitle>
              <CardDescription>Action pattern inside the currently filtered queue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {auditSummary.action_breakdown.length ? auditSummary.action_breakdown.slice(0, 6).map((entry) => (
                <div key={entry.action_type} className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm">
                  <span>{entry.action_type}</span>
                  <span className="font-medium">{entry.count}</span>
                </div>
              )) : (
                <div className="rounded-xl border border-dashed px-4 py-4 text-sm text-muted-foreground">
                  No audit activity in the current filter set.
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Actors</CardTitle>
              <CardDescription>Who touched this queue most often in the filtered view.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {auditSummary.top_actors.length ? auditSummary.top_actors.map((entry) => (
                <div key={entry.actor} className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm">
                  <span>{entry.actor}</span>
                  <span className="font-medium">{entry.action_count}</span>
                </div>
              )) : (
                <div className="rounded-xl border border-dashed px-4 py-4 text-sm text-muted-foreground">
                  No actor activity recorded yet.
                </div>
              )}
              {auditSummary.activity_last_7d.length ? (
                <div className="rounded-xl border px-3 py-3 text-xs text-muted-foreground">
                  Last 7d: {auditSummary.activity_last_7d.map((entry) => `${entry.date}:${entry.count}`).join(' · ')}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>Saved Views</CardTitle>
          <CardDescription>Persist reusable triage filter presets for your operational queue.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 xl:grid-cols-[1.2fr,0.8fr]">
            <div className="space-y-3">
              {savedViews.length ? savedViews.map((view) => (
                <div key={view.view_id} className="rounded-xl border px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-medium">{view.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {view.is_shared ? 'Shared' : 'Private'}
                        {view.is_default ? ' · Default' : ''}
                        {view.owner_actor ? ` · ${view.owner_actor}` : ' · System'}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => applySavedView(view)}>Apply</Button>
                      {view.is_owned_by_current_user ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={viewActionLoadingId === view.view_id}
                            onClick={() => {
                              setEditingSavedViewId(view.view_id);
                              setSavedViewName(view.name);
                              setSavedViewShared(view.is_shared);
                              setSavedViewDefault(view.is_default);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={viewActionLoadingId === view.view_id}
                            onClick={() => void toggleSavedViewState(view.view_id, !view.is_active)}
                          >
                            {view.is_active ? 'Deactivate' : 'Reactivate'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={viewActionLoadingId === view.view_id}
                            onClick={() => void deleteSavedView(view.view_id)}
                          >
                            Delete
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Sort: {view.sort_by} / {view.sort_order} · Filters: {Object.entries(view.filters_json || {}).filter(([, value]) => String(value || '').trim() && String(value) !== 'all').map(([key, value]) => `${key}=${String(value)}`).join(', ') || 'none'}
                  </div>
                </div>
              )) : (
                <div className="rounded-xl border border-dashed px-4 py-4 text-sm text-muted-foreground">
                  No saved triage views yet.
                </div>
              )}
            </div>
            <div className="space-y-3 rounded-xl border px-4 py-4">
              <div className="font-medium">{editingSavedViewId ? 'Edit Saved View' : 'Save Current Filters'}</div>
              <Input value={savedViewName} onChange={(event) => setSavedViewName(event.currentTarget.value)} placeholder="Critical finance queue" />
              <div className="flex items-center justify-between rounded-xl border px-3 py-2">
                <span className="text-sm">Shared with other operators</span>
                <Switch checked={savedViewShared} onCheckedChange={setSavedViewShared} />
              </div>
              <div className="flex items-center justify-between rounded-xl border px-3 py-2">
                <span className="text-sm">Set as my default view</span>
                <Switch checked={savedViewDefault} onCheckedChange={setSavedViewDefault} />
              </div>
              <div className="text-xs text-muted-foreground">
                Current preset captures triage status, ack state, SLA state, module, stage, search, and sort order.
              </div>
              <div className="flex gap-2">
                <Button onClick={() => void persistSavedView()} disabled={viewActionLoadingId !== null}>
                  {editingSavedViewId ? 'Update View' : 'Save View'}
                </Button>
                {editingSavedViewId ? (
                  <Button variant="outline" onClick={resetSavedViewEditor} disabled={viewActionLoadingId !== null}>
                    Cancel
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Triage Queue</CardTitle>
          <CardDescription>
            Dead-lettered deliveries and manually tracked follow-up items.
            {policy ? ` SLA ${policy.sla_minutes}m, warning ${policy.warning_after_minutes}m, critical ${policy.critical_after_minutes}m.` : ''}
            {filterContext?.search ? ` Search "${filterContext.search}".` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Input value={search} onChange={(event) => setSearch(event.currentTarget.value)} placeholder="Search event, rule, target, owner..." />
            <Select value={triageStatusFilter} onValueChange={setTriageStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Triage Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="requeued">Requeued</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={acknowledgedFilter} onValueChange={setAcknowledgedFilter}>
              <SelectTrigger><SelectValue placeholder="Acknowledgement" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ack States</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="unacknowledged">Unacknowledged</SelectItem>
              </SelectContent>
            </Select>
            <Select value={slaStatusFilter} onValueChange={setSlaStatusFilter}>
              <SelectTrigger><SelectValue placeholder="SLA State" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All SLA States</SelectItem>
                <SelectItem value="healthy">Healthy</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger><SelectValue placeholder="Module" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="warehouse">Warehouse</SelectItem>
                <SelectItem value="purchasing">Purchasing</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger><SelectValue placeholder="Stage" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="none">No Stage Policy</SelectItem>
                <SelectItem value="staged">Has Stage Policy</SelectItem>
                <SelectItem value="pending">Pending Next Stage</SelectItem>
                <SelectItem value="final">Final Stage</SelectItem>
                <SelectItem value="reminder">Reminder Mode</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger><SelectValue placeholder="Sort By" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dead_lettered_at">Dead Lettered At</SelectItem>
                <SelectItem value="age_minutes">Age Minutes</SelectItem>
                <SelectItem value="sla_due_at">SLA Due At</SelectItem>
                <SelectItem value="triage_updated_at">Updated At</SelectItem>
                <SelectItem value="escalation_count">Escalation Count</SelectItem>
                <SelectItem value="event_title">Event Title</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger><SelectValue placeholder="Sort Order" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearch('');
                setTriageStatusFilter('all');
                setAcknowledgedFilter('all');
                setSlaStatusFilter('all');
                setModuleFilter('all');
                setStageFilter('all');
                setSortBy('dead_lettered_at');
                setSortOrder('desc');
              }}
            >
              Reset Filters
            </Button>
          </div>
          {items.map((item) => (
            <TriageItemCard
              key={item.delivery_id}
              item={item}
              savingId={savingId}
              onUpdate={updateTriage}
              onRequeue={requeueItem}
            />
          ))}
          {!loading && !items.length ? (
            <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
              No dead-letter triage items match the current filters.
            </div>
          ) : null}
        </CardContent>
      </Card>
    </Shell>
  );
}

export function AlertDeadLetterTriageDetailPageView({ deliveryId }: { deliveryId: string }) {
  const [item, setItem] = useState<AlertDeadLetterTriageRecord | null>(null);
  const [summary, setSummary] = useState<AlertDeadLetterTriageSummary | null>(null);
  const [policy, setPolicy] = useState<AlertDeadLetterTriagePolicy | null>(null);
  const [auditSummary, setAuditSummary] = useState<AlertDeadLetterTriageAuditSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<number | null>(null);
  const detailPath = useMemo(
    () => buildDeadLetterTriageApiPath({ deliveryId: Number(deliveryId) || null }),
    [deliveryId],
  );

  const loadItem = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(detailPath, { cache: 'no-store' });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to load dead-letter triage detail.');
      }
      const nextItem = ((payload.data as AlertDeadLetterTriageRecord[]) || [])[0] || null;
      setItem(nextItem);
      setSummary((payload?.summary as AlertDeadLetterTriageSummary | undefined) || null);
      setPolicy((payload?.policy as AlertDeadLetterTriagePolicy | undefined) || null);
      setAuditSummary((payload?.audit_summary as AlertDeadLetterTriageAuditSummary | undefined) || null);
    } catch (fetchError) {
      setItem(null);
      setSummary(null);
      setPolicy(null);
      setAuditSummary(null);
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load dead-letter triage detail.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItem();
  }, [detailPath]);

  const updateTriage = async (
    nextDeliveryId: number,
    next: { triageStatus: string; assignedTo?: string; note?: string; acknowledge?: boolean; unacknowledge?: boolean },
  ) => {
    setSavingId(nextDeliveryId);
    setError('');
    try {
      const response = await fetch(`/api/alerting/dead-letter-triage/${nextDeliveryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to update dead-letter triage detail.');
      }
      const nextItem = ((payload.data as AlertDeadLetterTriageRecord[]) || [])[0] || null;
      setItem(nextItem);
      setSummary((payload?.summary as AlertDeadLetterTriageSummary | undefined) || null);
      setPolicy((payload?.policy as AlertDeadLetterTriagePolicy | undefined) || null);
      setAuditSummary((payload?.audit_summary as AlertDeadLetterTriageAuditSummary | undefined) || null);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Failed to update dead-letter triage detail.');
    } finally {
      setSavingId(null);
    }
  };

  const requeueItem = async (nextDeliveryId: number) => {
    setSavingId(nextDeliveryId);
    setError('');
    try {
      const response = await fetch(`/api/alerting/delivery-logs/${nextDeliveryId}/requeue`, { method: 'POST' });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to requeue delivery log.');
      }
      await loadItem();
    } catch (requeueError) {
      setError(requeueError instanceof Error ? requeueError.message : 'Failed to requeue delivery log.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <Shell
      title="Triage Detail"
      description="Detailed operational view for a single dead-letter triage item."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/app/alerting/triage">Back to Triage</Link>
          </Button>
          <Button variant="outline" onClick={() => void loadItem()} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh Detail'}
          </Button>
        </div>
      }
    >
      {error ? <div className="text-sm text-rose-600 dark:text-rose-400">{error}</div> : null}
      {item && summary ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Delivery ID', value: item.delivery_id },
            { label: 'SLA Status', value: item.sla_status },
            { label: 'Escalation Count', value: item.escalation_count },
            { label: 'Audit Entries', value: auditSummary?.total_entries || 0 },
          ].map((entry) => (
            <Card key={entry.label}>
              <CardHeader className="pb-2">
                <CardDescription>{entry.label}</CardDescription>
                <CardTitle className="text-2xl">{entry.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : null}
      {policy ? (
        <Card>
          <CardHeader>
            <CardTitle>Triage Policy Context</CardTitle>
            <CardDescription>
              SLA {policy.sla_minutes}m, warning {policy.warning_after_minutes}m, critical {policy.critical_after_minutes}m.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Item</CardTitle>
          <CardDescription>Same operational actions as queue view, focused on one delivery.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {item ? (
            <TriageItemCard
              item={item}
              savingId={savingId}
              onUpdate={updateTriage}
              onRequeue={requeueItem}
              showDetailLink={false}
            />
          ) : !loading ? (
            <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
              No triage item found for delivery `{deliveryId}`.
            </div>
          ) : null}
        </CardContent>
      </Card>
    </Shell>
  );
}

function SettingRow({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-lg bg-muted p-2">{icon}</div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}


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

export function AlertTemplateDetailPageView({ templateId }: { templateId: string }) {
  const [template, setTemplate] = useState<AlertTemplateRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetch(`/api/alerting/templates/${templateId}`, { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success || !payload?.data) {
          throw new Error(payload?.message || 'Failed to load alert template detail.');
        }
        if (cancelled) return;
        setTemplate(payload.data as AlertTemplateRecord);
      })
      .catch((err) => {
        if (cancelled) return;
        setTemplate(null);
        setError(err instanceof Error ? err.message : 'Failed to load alert template detail.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [templateId]);

  return (
    <Shell
      title="Alert Template Detail"
      description="Review the persisted template, default channels, and autofill defaults used by rule creation."
      actions={
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/app/alerting/templates">Back to Templates</Link>
          </Button>
          {template ? (
            <Button asChild>
              <Link href={`/app/alerting/rules/create?templateId=${template.template_id}`}>Use Template</Link>
            </Button>
          ) : null}
        </div>
      }
    >
      {error ? <div className="text-sm text-rose-600 dark:text-rose-400">{error}</div> : null}
      {loading ? <div className="text-sm text-muted-foreground">Loading alert template detail...</div> : null}
      {!loading && !template ? <div className="text-sm text-muted-foreground">No alert template found for this id.</div> : null}
      {template ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px]">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle>{template.name}</CardTitle>
                <Badge variant="outline" className={severityBadgeClass(template.severity)}>{template.severity}</Badge>
                {template.is_default ? <Badge variant="outline">Default</Badge> : null}
                <Badge variant="outline" className={statusBadgeClass(template.is_active ? 'connected' : 'draft')}>
                  {template.is_active ? 'active' : 'inactive'}
                </Badge>
              </div>
              <CardDescription>{template.description || template.template_key}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <DetailRow label="Module" value={moduleLabelFromKey(template.module_key)} />
              <DetailRow label="Source Type" value={template.source_type || '-'} />
              <DetailRow label="Source Ref" value={template.source_ref || '-'} />
              <DetailRow label="Schedule" value={template.schedule_value || '-'} />
              <DetailRow label="Condition Summary" value={template.condition_summary || '-'} />
              <DetailRow label="Sort Order" value={String(template.sort_order)} />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Channels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {template.recommended_channels.map((channel) => (
                  <div key={channel} className="rounded-xl border px-4 py-3 text-sm">
                    {channel}
                  </div>
                ))}
                {!template.recommended_channels.length ? (
                  <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
                    No recommended channels configured for this template.
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Default Recipients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {template.default_recipients.map((recipient) => (
                  <div key={recipient} className="rounded-xl border px-4 py-3 text-sm">
                    {recipient}
                  </div>
                ))}
                {!template.default_recipients.length ? (
                  <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
                    No default recipients configured for this template.
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Message Template</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {template.message_template || 'No message template configured.'}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </Shell>
  );
}


function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border px-3 py-2">
      <div className="text-muted-foreground">{label}</div>
      <div className="font-medium text-right">{value}</div>
    </div>
  );
}
