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

