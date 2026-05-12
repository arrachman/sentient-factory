'use client';

import Link from 'next/link';
import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type {
  AlertDeadLetterTriageAuditSummary,
  AlertDeadLetterTriageFilterContext,
  AlertDeadLetterTriagePolicy,
  AlertDeadLetterTriageRecord,
  AlertDeadLetterTriageSummary,
  AlertTriageSavedViewRecord,
} from './types';
import { moduleLabelFromKey, statusBadgeClass } from './utils';
import { Shell } from './_shared';

export function buildDeadLetterTriageApiPath(filters?: {
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

export function TriageItemCard({
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


