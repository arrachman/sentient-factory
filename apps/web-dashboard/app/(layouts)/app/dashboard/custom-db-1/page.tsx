'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Eye, SquarePen } from 'lucide-react';
import { Sortable, SortableItem } from '@/components/ui/sortable-list';
import type { ChartType, DashboardWidget } from './_types';
import {
  normalizeChartType,
  resolveChartDataLimit,
  resolveInitialChartDataLimit,
} from './_lib/chart-data';
import {
  buildWidgetRows,
  resolveResizePreset,
  resolveResizePresetFromDelta,
  resolveResizeSpan,
  resolveWidgetSpanClass,
} from './_lib/layout';
import { DashboardMessage } from './_components/dashboard-message';
import { WidgetChartCard } from './_components/widget-chart-card';
import { EditWidgetDialog } from './_components/edit-widget-dialog';
import { useDashboardData } from './_components/use-dashboard-data';

export function CustomDashboardPage({ dashboardKey = 'custom-db-1' }: { dashboardKey?: string }) {
  const { catalog, setCatalog, loading, error, setError, queryResults, loadCatalog, scheduleSilentRefresh } =
    useDashboardData(dashboardKey);
  const [pageMode, setPageMode] = useState<'view' | 'edit'>('view');
  const [deletingWidgetId, setDeletingWidgetId] = useState<string | null>(null);
  const [duplicatingWidgetId, setDuplicatingWidgetId] = useState<string | null>(null);
  const [editingWidget, setEditingWidget] = useState<DashboardWidget | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSpanClassName, setEditSpanClassName] = useState('xl:col-span-6');
  const [editChartType, setEditChartType] = useState<ChartType>('bar');
  const [editDefaultLimit, setEditDefaultLimit] = useState('12');
  const [savingWidgetId, setSavingWidgetId] = useState<string | null>(null);
  const [resizingWidgetId, setResizingWidgetId] = useState<string | null>(null);
  const [resizePreview, setResizePreview] = useState<{ widgetId: string; size: '25' | '50' | '75' | '100' } | null>(null);
  const resizePreviewFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!editingWidget || !catalog) return;
    const latestWidget = catalog.widgets.find((w) => w.widget_id === editingWidget.widget_id);
    if (latestWidget) setEditingWidget(latestWidget);
  }, [catalog, editingWidget]);

  useEffect(() => {
    if (pageMode === 'view') setEditingWidget(null);
  }, [pageMode]);

  async function handleDeleteWidget(widgetId: string) {
    setDeletingWidgetId(widgetId); setError('');
    try {
      const response = await fetch(`/api/dashboard/custom-db/widget/${widgetId}`, { method: 'DELETE' });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) throw new Error(payload?.message || 'Failed to delete widget.');
      scheduleSilentRefresh();
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to delete widget.'); }
    finally { setDeletingWidgetId(null); }
  }

  async function handleDuplicateWidget(widgetId: string) {
    setDuplicatingWidgetId(widgetId); setError('');
    try {
      const response = await fetch(`/api/dashboard/custom-db/widget/${widgetId}`, { method: 'POST' });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) throw new Error(payload?.message || 'Failed to duplicate widget.');
      scheduleSilentRefresh();
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to duplicate widget.'); }
    finally { setDuplicatingWidgetId(null); }
  }

  function openEditWidget(widget: DashboardWidget) {
    setEditingWidget(widget);
    setEditTitle(widget.title);
    setEditDescription(widget.description || '');
    setEditSpanClassName(widget.span_class_name || 'xl:col-span-6');
    const normalizedChartType = normalizeChartType(widget.chart_type);
    setEditChartType(normalizedChartType);
    setEditDefaultLimit(String(resolveInitialChartDataLimit(normalizedChartType, widget.queries[0]?.default_limit)));
  }

  async function handleSaveWidgetEdit() {
    if (!editingWidget || !editTitle.trim()) { setError('Widget title is required.'); return; }
    setSavingWidgetId(editingWidget.widget_id); setError('');
    try {
      const normalizedLimit = Number.parseInt(editDefaultLimit, 10);
      const maxLimit = resolveChartDataLimit(editChartType, null);
      const nextDefaultLimit =
        Number.isFinite(normalizedLimit) && normalizedLimit > 0 ? Math.min(normalizedLimit, maxLimit) : maxLimit;
      const response = await fetch(`/api/dashboard/custom-db/widget/${editingWidget.widget_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle.trim(), description: editDescription.trim(), spanClassName: editSpanClassName,
          chartType: editingWidget.widget_kind === 'chart' ? editChartType : undefined,
          defaultLimit: editingWidget.widget_kind === 'chart' ? nextDefaultLimit : undefined,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) throw new Error(payload?.message || 'Failed to update widget.');
      setEditingWidget(null);
      setCatalog((current) =>
        current
          ? {
              ...current,
              widgets: current.widgets.map((w) =>
                w.widget_id === editingWidget.widget_id
                  ? {
                      ...w, title: editTitle.trim(), description: editDescription.trim(), span_class_name: editSpanClassName,
                      chart_type: editingWidget.widget_kind === 'chart' ? editChartType : w.chart_type,
                      queries: w.queries.map((q, i) =>
                        i === 0 ? { ...q, default_limit: editingWidget.widget_kind === 'chart' ? nextDefaultLimit : q.default_limit } : q,
                      ),
                    }
                  : w,
              ),
            }
          : current,
      );
      scheduleSilentRefresh();
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to update widget.'); }
    finally { setSavingWidgetId(null); }
  }

  async function handleMoveWidget(widget: DashboardWidget, direction: 'up' | 'down') {
    if (!catalog?.widgets?.length) return;
    const widgets = [...catalog.widgets].sort((l, r) => (l.widget_order ?? 0) - (r.widget_order ?? 0));
    const currentIndex = widgets.findIndex((w) => w.widget_id === widget.widget_id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= widgets.length) return;
    const current = widgets[currentIndex];
    const target = widgets[targetIndex];
    setSavingWidgetId(widget.widget_id); setError('');
    try {
      const [r1, r2] = await Promise.all([
        fetch(`/api/dashboard/custom-db/widget/${current.widget_id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ widgetOrder: target.widget_order ?? targetIndex + 1 }) }),
        fetch(`/api/dashboard/custom-db/widget/${target.widget_id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ widgetOrder: current.widget_order ?? currentIndex + 1 }) }),
      ]);
      const [p1, p2] = await Promise.all([r1.json().catch(() => null), r2.json().catch(() => null)]);
      if (!r1.ok || !p1?.success) throw new Error(p1?.message || 'Failed to reorder widget.');
      if (!r2.ok || !p2?.success) throw new Error(p2?.message || 'Failed to reorder widget.');
      scheduleSilentRefresh();
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to reorder widget.'); }
    finally { setSavingWidgetId(null); }
  }

  async function handleReorderWidgets(activeIndex: number, overIndex: number) {
    if (!catalog?.widgets?.length || activeIndex === overIndex) return;
    const widgets = [...catalog.widgets].sort((l, r) => (l.widget_order ?? 0) - (r.widget_order ?? 0));
    if (activeIndex < 0 || overIndex < 0 || activeIndex >= widgets.length || overIndex >= widgets.length) return;
    const reordered = [...widgets];
    const [moved] = reordered.splice(activeIndex, 1);
    reordered.splice(overIndex, 0, moved);
    const withOrder = reordered.map((w, i) => ({ ...w, widget_order: i + 1 }));
    setCatalog((current) => current ? { ...current, widgets: withOrder } : current);
    setSavingWidgetId(moved.widget_id); setError('');
    try {
      const responses = await Promise.all(
        withOrder.map((w) =>
          fetch(`/api/dashboard/custom-db/widget/${w.widget_id}`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ widgetOrder: w.widget_order }),
          }).then(async (r) => ({ ok: r.ok, payload: await r.json().catch(() => null) })),
        ),
      );
      const failed = responses.find((r) => !r.ok || !r.payload?.success);
      if (failed) throw new Error(failed.payload?.message || 'Failed to reorder widget.');
      scheduleSilentRefresh();
    } catch (err) {
      await loadCatalog({ silent: true });
      setError(err instanceof Error ? err.message : 'Failed to reorder widget.');
    } finally { setSavingWidgetId(null); }
  }

  async function handleResizeWidget(widgetId: string, size: '25' | '50' | '75' | '100') {
    const nextSpanClassName = resolveResizeSpan(size);
    setCatalog((current) =>
      current ? { ...current, widgets: current.widgets.map((w) => w.widget_id === widgetId ? { ...w, span_class_name: nextSpanClassName } : w) } : current,
    );
    setSavingWidgetId(widgetId); setError('');
    try {
      const response = await fetch(`/api/dashboard/custom-db/widget/${widgetId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ spanClassName: nextSpanClassName }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) throw new Error(payload?.message || 'Failed to resize widget.');
      scheduleSilentRefresh();
    } catch (err) {
      await loadCatalog({ silent: true });
      setError(err instanceof Error ? err.message : 'Failed to resize widget.');
    } finally { setResizingWidgetId(null); setResizePreview(null); setSavingWidgetId(null); }
  }

  function handleCornerResizeStart(event: React.PointerEvent<HTMLButtonElement>, widget: DashboardWidget) {
    event.preventDefault(); event.stopPropagation();
    const startX = event.clientX;
    const currentPreset = resolveResizePreset(widget.span_class_name);
    setResizingWidgetId(widget.widget_id);
    setResizePreview({ widgetId: widget.widget_id, size: currentPreset });
    const handlePointerMove = (e: PointerEvent) => {
      const nextPreset = resolveResizePresetFromDelta(currentPreset, e.clientX - startX);
      if (resizePreviewFrameRef.current !== null) window.cancelAnimationFrame(resizePreviewFrameRef.current);
      resizePreviewFrameRef.current = window.requestAnimationFrame(() => {
        setResizePreview((c) => c?.widgetId === widget.widget_id && c.size === nextPreset ? c : { widgetId: widget.widget_id, size: nextPreset });
      });
    };
    const handlePointerUp = (e: PointerEvent) => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      if (resizePreviewFrameRef.current !== null) { window.cancelAnimationFrame(resizePreviewFrameRef.current); resizePreviewFrameRef.current = null; }
      const nextPreset = resolveResizePresetFromDelta(currentPreset, e.clientX - startX);
      if (nextPreset !== currentPreset) { void handleResizeWidget(widget.widget_id, nextPreset); return; }
      setResizingWidgetId(null); setResizePreview(null);
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp, { once: true });
  }

  if (loading) return <div className="p-6"><DashboardMessage text="Loading dashboard..." /></div>;

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
          {error}
        </div>
      </div>
    );
  }

  if (!catalog) return null;

  const sortedWidgets = useMemo(
    () => [...catalog.widgets].sort((l, r) => (l.widget_order ?? 0) - (r.widget_order ?? 0)),
    [catalog.widgets],
  );
  const widgetRows = useMemo(() => buildWidgetRows(sortedWidgets), [sortedWidgets]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{catalog.title}</h1>
          {catalog.description ? <p className="text-sm text-slate-500 dark:text-slate-400">{catalog.description}</p> : null}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={pageMode === 'edit'}
          title={pageMode === 'edit' ? 'Edit Mode' : 'View Only'}
          aria-label={pageMode === 'edit' ? 'Edit Mode' : 'View Only'}
          onClick={() => setPageMode((c) => (c === 'edit' ? 'view' : 'edit'))}
          className={`inline-flex h-11 w-[78px] cursor-pointer items-center rounded-full border p-1 shadow-sm transition ${
            pageMode === 'edit'
              ? 'justify-end border-sky-300 bg-sky-100 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300'
              : 'justify-start border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'
          }`}
        >
          <span className={`inline-flex size-9 items-center justify-center rounded-full transition ${pageMode === 'edit' ? 'bg-[#009EF7] text-white' : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950'}`}>
            {pageMode === 'edit' ? <SquarePen className="size-4" /> : <Eye className="size-4" />}
          </span>
        </button>
      </div>

      {pageMode === 'edit' ? (
        <Sortable
          value={sortedWidgets}
          getItemValue={(w) => w.widget_id}
          onValueChange={() => undefined}
          strategy="grid"
          onMove={({ activeIndex, overIndex }) => { void handleReorderWidgets(activeIndex, overIndex); }}
          className="grid gap-6 rounded-3xl border border-dashed border-slate-200/70 p-3 transition data-[dragging=true]:border-[#009EF7]/50 data-[dragging=true]:bg-sky-50/30 dark:border-slate-800/80 dark:data-[dragging=true]:border-sky-500/40 dark:data-[dragging=true]:bg-sky-950/10 xl:grid-cols-12"
        >
          {sortedWidgets.map((widget, index) => (
            <SortableItem
              key={widget.widget_id}
              value={widget.widget_id}
              className={`${resolveWidgetSpanClass(resizePreview?.widgetId === widget.widget_id ? resolveResizeSpan(resizePreview.size) : widget.span_class_name)} transition-all duration-200 ease-out will-change-[grid-column]`}
            >
              <WidgetChartCard
                dashboardKey={dashboardKey} widget={widget} result={queryResults[widget.widget_id]} lazyRender={false}
                deleting={deletingWidgetId === widget.widget_id} duplicating={duplicatingWidgetId === widget.widget_id}
                saving={savingWidgetId === widget.widget_id} canMoveUp={index > 0} canMoveDown={index < sortedWidgets.length - 1}
                showActions dragEnabled resizeEnabled resizing={resizingWidgetId === widget.widget_id}
                resizePreviewSize={resizePreview?.widgetId === widget.widget_id ? resizePreview.size : null}
                onCornerResizeStart={(event) => handleCornerResizeStart(event, widget)}
                onMoveUp={() => void handleMoveWidget(widget, 'up')} onMoveDown={() => void handleMoveWidget(widget, 'down')}
                onEdit={() => openEditWidget(widget)} onDuplicate={() => void handleDuplicateWidget(widget.widget_id)}
                onDelete={() => void handleDeleteWidget(widget.widget_id)}
              />
            </SortableItem>
          ))}
        </Sortable>
      ) : (
        <section className="space-y-6">
          {widgetRows.map((row, rowIndex) => (
            <div key={`widget-row-${rowIndex}`} className="grid gap-6 xl:grid-cols-12">
              {row.map((widget) => {
                const widgetIndex = sortedWidgets.findIndex((w) => w.widget_id === widget.widget_id);
                return (
                  <div key={widget.widget_id} className={`${resolveWidgetSpanClass(widget.span_class_name)} transition-all duration-200 ease-out will-change-[grid-column]`}>
                    <WidgetChartCard
                      dashboardKey={dashboardKey} widget={widget} result={queryResults[widget.widget_id]} lazyRender
                      deleting={deletingWidgetId === widget.widget_id} duplicating={duplicatingWidgetId === widget.widget_id}
                      saving={savingWidgetId === widget.widget_id} canMoveUp={widgetIndex > 0}
                      canMoveDown={widgetIndex < sortedWidgets.length - 1}
                      showActions={false} dragEnabled={false} resizeEnabled={false} resizing={false} resizePreviewSize={null}
                      onCornerResizeStart={() => undefined} onMoveUp={() => undefined} onMoveDown={() => undefined}
                      onEdit={() => undefined} onDuplicate={() => undefined} onDelete={() => undefined}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </section>
      )}

      <EditWidgetDialog
        open={pageMode === 'edit' && Boolean(editingWidget)}
        onOpenChange={(open) => (!open && !savingWidgetId ? setEditingWidget(null) : undefined)}
        editingWidget={editingWidget}
        editTitle={editTitle}
        editDescription={editDescription}
        editSpanClassName={editSpanClassName}
        editChartType={editChartType}
        editDefaultLimit={editDefaultLimit}
        savingWidgetId={savingWidgetId}
        dashboardKey={dashboardKey}
        queryResults={queryResults}
        setEditTitle={setEditTitle}
        setEditDescription={setEditDescription}
        setEditSpanClassName={setEditSpanClassName}
        setEditChartType={setEditChartType}
        setEditDefaultLimit={setEditDefaultLimit}
        setEditingWidget={setEditingWidget}
        onSave={() => void handleSaveWidgetEdit()}
      />
    </div>
  );
}

export default function CustomDb1DashboardPage() {
  return <CustomDashboardPage dashboardKey="custom-db-1" />;
}
