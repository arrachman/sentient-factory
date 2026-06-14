'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import type { AlertOpsPayload, BaileysPairingPayload } from './types';
import { moduleLabelFromKey, statusBadgeClass } from './utils';
import { Shell } from './_shared';
import { OpsTriageSection } from './ops-triage-section';
import { OpsProviderHealth } from './ops-provider-health';
import { OpsProviderReadiness } from './ops-provider-readiness';

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

      {ops?.triage ? <OpsTriageSection triage={ops.triage} /> : null}
      {deliveryStatus ? <OpsProviderReadiness deliveryStatus={deliveryStatus} /> : null}

      {providerHealth ? (
        <OpsProviderHealth
          providerHealth={providerHealth}
          pairingPhoneNumber={pairingPhoneNumber}
          setPairingPhoneNumber={setPairingPhoneNumber}
          startBaileysPairing={startBaileysPairing}
          pairingLoading={pairingLoading}
          pairingResult={pairingResult}
          qrImageUrl={qrImageUrl}
          qrImageError={qrImageError}
          copyToClipboard={copyToClipboard}
          isCopied={isCopied}
        />
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

