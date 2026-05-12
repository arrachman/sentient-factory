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

