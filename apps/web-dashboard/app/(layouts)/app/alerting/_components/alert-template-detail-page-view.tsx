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


