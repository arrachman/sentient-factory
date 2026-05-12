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


