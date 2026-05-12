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
import { buildDeadLetterTriageApiPath, TriageItemCard } from './alerting-ui';

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



