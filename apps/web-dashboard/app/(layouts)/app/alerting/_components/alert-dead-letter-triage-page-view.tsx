'use client';

import Link from 'next/link';
import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type {
  AlertDeadLetterTriageAuditSummary,
  AlertDeadLetterTriageFilterContext,
  AlertDeadLetterTriagePolicy,
  AlertDeadLetterTriageRecord,
  AlertDeadLetterTriageSummary,
  AlertTriageSavedViewRecord,
} from './types';
import { Shell } from './_shared';
import { TriageItemCard } from './triage-item-card';
import { TriageSummaryPanel } from './triage-summary-panel';
import { TriageSavedViews } from './triage-saved-views';
import { TriageFiltersBar } from './triage-filters-bar';

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
      <TriageSummaryPanel summary={summary} auditSummary={auditSummary} />
      <TriageSavedViews
        savedViews={savedViews}
        editingSavedViewId={editingSavedViewId}
        setEditingSavedViewId={setEditingSavedViewId}
        savedViewName={savedViewName}
        setSavedViewName={setSavedViewName}
        savedViewShared={savedViewShared}
        setSavedViewShared={setSavedViewShared}
        savedViewDefault={savedViewDefault}
        setSavedViewDefault={setSavedViewDefault}
        viewActionLoadingId={viewActionLoadingId}
        applySavedView={applySavedView}
        toggleSavedViewState={toggleSavedViewState}
        deleteSavedView={deleteSavedView}
        persistSavedView={persistSavedView}
        resetSavedViewEditor={resetSavedViewEditor}
      />
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
          <TriageFiltersBar
            search={search}
            setSearch={setSearch}
            triageStatusFilter={triageStatusFilter}
            setTriageStatusFilter={setTriageStatusFilter}
            acknowledgedFilter={acknowledgedFilter}
            setAcknowledgedFilter={setAcknowledgedFilter}
            slaStatusFilter={slaStatusFilter}
            setSlaStatusFilter={setSlaStatusFilter}
            moduleFilter={moduleFilter}
            setModuleFilter={setModuleFilter}
            stageFilter={stageFilter}
            setStageFilter={setStageFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
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


