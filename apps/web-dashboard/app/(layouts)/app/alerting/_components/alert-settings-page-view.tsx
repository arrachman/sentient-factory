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

