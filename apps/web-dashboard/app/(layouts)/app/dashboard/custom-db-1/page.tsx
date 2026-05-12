'use client';

import Link from 'next/link';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, BellRing, Copy, Eye, GripVertical, LoaderCircle, Pencil, SquarePen, Trash2 } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  Sector,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sortable, SortableItem, SortableItemHandle } from '@/components/ui/sortable-list';
import type {
  ChartDatum,
  ChartType,
  DashboardCatalog,
  DashboardWidget,
  NormalizedBarDatum,
  QueryResult,
  ScatterVisualDatum,
} from './_types';
import {
  CHART_COLORS,
  buildChartData,
  buildNormalizedBarData,
  buildScatterVisualData,
  formatChartNumber,
  formatDonutTotal,
  limitChartData,
  normalizeChartType,
  resolveChartDataLimit,
  resolveInitialChartDataLimit,
  truncateChartLabel,
} from './_lib/chart-data';
import { renderDonutLabels, renderPieLabels, renderRoseSliceShape } from './_lib/chart-labels';
import {
  LAYOUT_OPTIONS,
  LayoutPreview,
  buildWidgetRows,
  normalizeLayoutValue,
  resolveResizePreset,
  resolveResizePresetFromDelta,
  resolveResizeSpan,
  resolveWidgetSpanClass,
} from './_lib/layout';

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export function CustomDashboardPage({ dashboardKey = 'custom-db-1' }: { dashboardKey?: string }) {
  const [catalog, setCatalog] = useState<DashboardCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageMode, setPageMode] = useState<'view' | 'edit'>('view');
  const [queryResults, setQueryResults] = useState<Record<string, QueryResult>>({});
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
  const silentRefreshTimeoutRef = useRef<number | null>(null);
  async function loadQueryResults(
    nextCatalog: DashboardCatalog,
    options?: { signal?: { cancelled: boolean }; silent?: boolean },
  ) {
    if (!nextCatalog.widgets?.length) {
      if (!options?.signal?.cancelled) {
        setQueryResults({});
      }
      return;
    }

    try {
      const params = Object.fromEntries(
        nextCatalog.filters.map((filter) => [filter.query_param_name, String(filter.default_value ?? '')]),
      );

      const results = await Promise.all(
        nextCatalog.widgets.map(async (widget) => {
          const primaryQuery =
            widget.queries.find((query) => query.query_key === widget.widget_key || widget.is_primary) ?? widget.queries[0];

          if (!primaryQuery) {
            return null;
          }

          const response = await fetch(`/api/dashboard/custom-db/${dashboardKey}/query/${primaryQuery.query_key}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ params }),
          });
          const payload = await response.json().catch(() => null);

          if (!response.ok || !payload?.success || !payload?.data) {
            throw new Error(payload?.message || `Failed to load chart ${widget.title}.`);
          }

          return [widget.widget_id, payload.data as QueryResult] as const;
        }),
      );

      if (!options?.signal?.cancelled) {
        setQueryResults(
          Object.fromEntries(results.filter((entry): entry is readonly [string, QueryResult] => Boolean(entry))),
        );
      }
    } catch (err) {
      if (!options?.signal?.cancelled && !options?.silent) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard charts.');
      }
    }
  }

  async function loadCatalog(options?: { signal?: { cancelled: boolean }; silent?: boolean }) {
    if (!options?.silent) {
      setLoading(true);
      setError('');
    }

    try {
      const response = await fetch(`/api/dashboard/custom-db/${dashboardKey}`, {
        cache: 'no-store',
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.success || !payload?.data) {
        throw new Error(payload?.message || 'Failed to load custom dashboard.');
      }

      if (!options?.signal?.cancelled) {
        const nextCatalog = payload.data as DashboardCatalog;
        setCatalog(nextCatalog);
        await loadQueryResults(nextCatalog, options);
      }
    } catch (err) {
      if (!options?.signal?.cancelled && !options?.silent) {
        setError(err instanceof Error ? err.message : 'Failed to load custom dashboard.');
      }
    } finally {
      if (!options?.signal?.cancelled && !options?.silent) {
        setLoading(false);
      }
    }
  }

  function scheduleSilentRefresh(delayMs = 220) {
    if (typeof document !== 'undefined' && document.hidden) {
      return;
    }

    if (silentRefreshTimeoutRef.current !== null) {
      window.clearTimeout(silentRefreshTimeoutRef.current);
    }

    silentRefreshTimeoutRef.current = window.setTimeout(() => {
      silentRefreshTimeoutRef.current = null;
      void loadCatalog({ silent: true });
    }, delayMs);
  }

  useEffect(() => {
    const signal = { cancelled: false };
    void loadCatalog({ signal });

    const intervalId = window.setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) {
        return;
      }
      void loadCatalog({ signal, silent: true });
    }, REFRESH_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        void loadCatalog({ signal, silent: true });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      signal.cancelled = true;
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (resizePreviewFrameRef.current !== null) {
        window.cancelAnimationFrame(resizePreviewFrameRef.current);
        resizePreviewFrameRef.current = null;
      }
      if (silentRefreshTimeoutRef.current !== null) {
        window.clearTimeout(silentRefreshTimeoutRef.current);
        silentRefreshTimeoutRef.current = null;
      }
    };
  }, [dashboardKey]);

  useEffect(() => {
    if (!editingWidget || !catalog) {
      return;
    }

    const latestWidget = catalog.widgets.find((widget) => widget.widget_id === editingWidget.widget_id);
    if (latestWidget) {
      setEditingWidget(latestWidget);
    }
  }, [catalog, editingWidget]);

  useEffect(() => {
    if (pageMode === 'view') {
      setEditingWidget(null);
    }
  }, [pageMode]);

  async function handleDeleteWidget(widgetId: string) {
    setDeletingWidgetId(widgetId);
    setError('');

    try {
      const response = await fetch(`/api/dashboard/custom-db/widget/${widgetId}`, {
        method: 'DELETE',
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to delete widget.');
      }
      scheduleSilentRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete widget.');
    } finally {
      setDeletingWidgetId(null);
    }
  }

  async function handleDuplicateWidget(widgetId: string) {
    setDuplicatingWidgetId(widgetId);
    setError('');

    try {
      const response = await fetch(`/api/dashboard/custom-db/widget/${widgetId}`, {
        method: 'POST',
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to duplicate widget.');
      }
      scheduleSilentRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate widget.');
    } finally {
      setDuplicatingWidgetId(null);
    }
  }

  function openEditWidget(widget: DashboardWidget) {
    setEditingWidget(widget);
    setEditTitle(widget.title);
    setEditDescription(widget.description || '');
    setEditSpanClassName(widget.span_class_name || 'xl:col-span-6');
    const normalizedChartType = normalizeChartType(widget.chart_type);
    setEditChartType(normalizedChartType);
    const primaryQuery = widget.queries[0];
    setEditDefaultLimit(String(resolveInitialChartDataLimit(normalizedChartType, primaryQuery?.default_limit)));
  }

  async function handleSaveWidgetEdit() {
    if (!editingWidget || !editTitle.trim()) {
      setError('Widget title is required.');
      return;
    }

    setSavingWidgetId(editingWidget.widget_id);
    setError('');

    try {
      const normalizedLimit = Number.parseInt(editDefaultLimit, 10);
      const maxLimit = resolveChartDataLimit(editChartType, null);
      const nextDefaultLimit =
        Number.isFinite(normalizedLimit) && normalizedLimit > 0
          ? Math.min(normalizedLimit, maxLimit)
          : maxLimit;
      const response = await fetch(`/api/dashboard/custom-db/widget/${editingWidget.widget_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim(),
          spanClassName: editSpanClassName,
          chartType: editingWidget.widget_kind === 'chart' ? editChartType : undefined,
          defaultLimit:
            editingWidget.widget_kind === 'chart'
              ? nextDefaultLimit
              : undefined,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to update widget.');
      }
      setEditingWidget(null);
      setCatalog((current) =>
        current
          ? {
              ...current,
              widgets: current.widgets.map((widget) =>
                widget.widget_id === editingWidget.widget_id
                  ? {
                      ...widget,
                      title: editTitle.trim(),
                      description: editDescription.trim(),
                      span_class_name: editSpanClassName,
                      chart_type: editingWidget.widget_kind === 'chart' ? editChartType : widget.chart_type,
                      queries: widget.queries.map((query, index) =>
                        index === 0
                          ? {
                              ...query,
                              default_limit:
                                editingWidget.widget_kind === 'chart' ? nextDefaultLimit : query.default_limit,
                            }
                          : query,
                      ),
                    }
                  : widget,
              ),
            }
          : current,
      );
      scheduleSilentRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update widget.');
    } finally {
      setSavingWidgetId(null);
    }
  }

  async function handleMoveWidget(widget: DashboardWidget, direction: 'up' | 'down') {
    if (!catalog?.widgets?.length) {
      return;
    }

    const widgets = [...catalog.widgets].sort(
      (left, right) => (left.widget_order ?? 0) - (right.widget_order ?? 0),
    );
    const currentIndex = widgets.findIndex((item) => item.widget_id === widget.widget_id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= widgets.length) {
      return;
    }

    const current = widgets[currentIndex];
    const target = widgets[targetIndex];
    const currentOrder = current.widget_order ?? currentIndex + 1;
    const targetOrder = target.widget_order ?? targetIndex + 1;

    setSavingWidgetId(widget.widget_id);
    setError('');

    try {
      const [firstResponse, secondResponse] = await Promise.all([
        fetch(`/api/dashboard/custom-db/widget/${current.widget_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ widgetOrder: targetOrder }),
        }),
        fetch(`/api/dashboard/custom-db/widget/${target.widget_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ widgetOrder: currentOrder }),
        }),
      ]);

      const firstPayload = await firstResponse.json().catch(() => null);
      const secondPayload = await secondResponse.json().catch(() => null);
      if (!firstResponse.ok || !firstPayload?.success) {
        throw new Error(firstPayload?.message || 'Failed to reorder widget.');
      }
      if (!secondResponse.ok || !secondPayload?.success) {
        throw new Error(secondPayload?.message || 'Failed to reorder widget.');
      }
      scheduleSilentRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder widget.');
    } finally {
      setSavingWidgetId(null);
    }
  }

  async function handleReorderWidgets(activeIndex: number, overIndex: number) {
    if (!catalog?.widgets?.length || activeIndex === overIndex) {
      return;
    }

    const widgets = [...catalog.widgets].sort(
      (left, right) => (left.widget_order ?? 0) - (right.widget_order ?? 0),
    );
    if (
      activeIndex < 0 ||
      overIndex < 0 ||
      activeIndex >= widgets.length ||
      overIndex >= widgets.length
    ) {
      return;
    }

    const reorderedWidgets = [...widgets];
    const [movedWidget] = reorderedWidgets.splice(activeIndex, 1);
    reorderedWidgets.splice(overIndex, 0, movedWidget);

    const widgetsWithOrder = reorderedWidgets.map((widget, index) => ({
      ...widget,
      widget_order: index + 1,
    }));

    setCatalog((current) =>
      current
        ? {
            ...current,
            widgets: widgetsWithOrder,
          }
        : current,
    );
    setSavingWidgetId(movedWidget.widget_id);
    setError('');

    try {
      const responses = await Promise.all(
        widgetsWithOrder.map((widget) =>
          fetch(`/api/dashboard/custom-db/widget/${widget.widget_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ widgetOrder: widget.widget_order }),
          }).then(async (response) => ({
            ok: response.ok,
            payload: await response.json().catch(() => null),
          })),
        ),
      );

      const failed = responses.find((entry) => !entry.ok || !entry.payload?.success);
      if (failed) {
        throw new Error(failed.payload?.message || 'Failed to reorder widget.');
      }
      scheduleSilentRefresh();
    } catch (err) {
      await loadCatalog({ silent: true });
      setError(err instanceof Error ? err.message : 'Failed to reorder widget.');
    } finally {
      setSavingWidgetId(null);
    }
  }

  async function handleResizeWidget(widgetId: string, size: '25' | '50' | '75' | '100') {
    const nextSpanClassName = resolveResizeSpan(size);

    setCatalog((current) =>
      current
        ? {
            ...current,
            widgets: current.widgets.map((widget) =>
              widget.widget_id === widgetId
                ? {
                    ...widget,
                    span_class_name: nextSpanClassName,
                  }
                : widget,
            ),
          }
        : current,
    );
    setSavingWidgetId(widgetId);
    setError('');

    try {
      const response = await fetch(`/api/dashboard/custom-db/widget/${widgetId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spanClassName: nextSpanClassName,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to resize widget.');
      }
      scheduleSilentRefresh();
    } catch (err) {
      await loadCatalog({ silent: true });
      setError(err instanceof Error ? err.message : 'Failed to resize widget.');
    } finally {
      setResizingWidgetId(null);
      setResizePreview(null);
      setSavingWidgetId(null);
    }
  }

  function handleCornerResizeStart(
    event: React.PointerEvent<HTMLButtonElement>,
    widget: DashboardWidget,
  ) {
    event.preventDefault();
    event.stopPropagation();

    const startX = event.clientX;
    const currentPreset = resolveResizePreset(widget.span_class_name);
    setResizingWidgetId(widget.widget_id);
    setResizePreview({ widgetId: widget.widget_id, size: currentPreset });

    const handlePointerMove = (pointerMoveEvent: PointerEvent) => {
      const deltaX = pointerMoveEvent.clientX - startX;
      const nextPreset = resolveResizePresetFromDelta(currentPreset, deltaX);
      if (resizePreviewFrameRef.current !== null) {
        window.cancelAnimationFrame(resizePreviewFrameRef.current);
      }
      resizePreviewFrameRef.current = window.requestAnimationFrame(() => {
        setResizePreview((current) =>
          current?.widgetId === widget.widget_id && current.size === nextPreset
            ? current
            : { widgetId: widget.widget_id, size: nextPreset },
        );
      });
    };

    const handlePointerUp = (pointerUpEvent: PointerEvent) => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      if (resizePreviewFrameRef.current !== null) {
        window.cancelAnimationFrame(resizePreviewFrameRef.current);
        resizePreviewFrameRef.current = null;
      }
      const deltaX = pointerUpEvent.clientX - startX;
      const nextPreset = resolveResizePresetFromDelta(currentPreset, deltaX);
      if (nextPreset !== currentPreset) {
        void handleResizeWidget(widget.widget_id, nextPreset);
        return;
      }

      setResizingWidgetId(null);
      setResizePreview(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp, { once: true });
  }

  if (loading) {
    return (
      <div className="p-6">
        <DashboardMessage text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
          {error}
        </div>
      </div>
    );
  }

  if (!catalog) {
    return null;
  }

  const sortedWidgets = useMemo(
    () =>
      [...catalog.widgets].sort(
        (left, right) => (left.widget_order ?? 0) - (right.widget_order ?? 0),
      ),
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
          onClick={() => setPageMode((current) => (current === 'edit' ? 'view' : 'edit'))}
          className={`inline-flex h-11 w-[78px] cursor-pointer items-center rounded-full border p-1 shadow-sm transition ${
            pageMode === 'edit'
              ? 'justify-end border-sky-300 bg-sky-100 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300'
              : 'justify-start border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'
          }`}
        >
          <span
            className={`inline-flex size-9 items-center justify-center rounded-full transition ${
              pageMode === 'edit'
                ? 'bg-[#009EF7] text-white'
                : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950'
            }`}
          >
            {pageMode === 'edit' ? <SquarePen className="size-4" /> : <Eye className="size-4" />}
          </span>
        </button>
      </div>
      {pageMode === 'edit' ? (
        <Sortable
          value={sortedWidgets}
          getItemValue={(widget) => widget.widget_id}
          onValueChange={() => undefined}
          strategy="grid"
          onMove={({ activeIndex, overIndex }) => {
            void handleReorderWidgets(activeIndex, overIndex);
          }}
        className="grid gap-6 rounded-3xl border border-dashed border-slate-200/70 p-3 transition data-[dragging=true]:border-[#009EF7]/50 data-[dragging=true]:bg-sky-50/30 dark:border-slate-800/80 dark:data-[dragging=true]:border-sky-500/40 dark:data-[dragging=true]:bg-sky-950/10 xl:grid-cols-12"
      >
          {sortedWidgets.map((widget, index) => (
            <SortableItem
              key={widget.widget_id}
              value={widget.widget_id}
              className={`${resolveWidgetSpanClass(
                resizePreview?.widgetId === widget.widget_id
                  ? resolveResizeSpan(resizePreview.size)
                  : widget.span_class_name,
              )} transition-all duration-200 ease-out will-change-[grid-column]`}
            >
              <WidgetChartCard
                dashboardKey={dashboardKey}
                widget={widget}
                result={queryResults[widget.widget_id]}
                lazyRender={false}
                deleting={deletingWidgetId === widget.widget_id}
                duplicating={duplicatingWidgetId === widget.widget_id}
                saving={savingWidgetId === widget.widget_id}
                canMoveUp={index > 0}
                canMoveDown={index < sortedWidgets.length - 1}
                showActions
                dragEnabled
                resizeEnabled
                resizing={resizingWidgetId === widget.widget_id}
                resizePreviewSize={resizePreview?.widgetId === widget.widget_id ? resizePreview.size : null}
                onCornerResizeStart={(event) => handleCornerResizeStart(event, widget)}
                onMoveUp={() => void handleMoveWidget(widget, 'up')}
                onMoveDown={() => void handleMoveWidget(widget, 'down')}
                onEdit={() => openEditWidget(widget)}
                onDuplicate={() => void handleDuplicateWidget(widget.widget_id)}
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
                const widgetIndex = sortedWidgets.findIndex((item) => item.widget_id === widget.widget_id);

                return (
                  <div
                    key={widget.widget_id}
                    className={`${resolveWidgetSpanClass(widget.span_class_name)} transition-all duration-200 ease-out will-change-[grid-column]`}
                  >
                    <WidgetChartCard
                      dashboardKey={dashboardKey}
                      widget={widget}
                      result={queryResults[widget.widget_id]}
                      lazyRender
                      deleting={deletingWidgetId === widget.widget_id}
                      duplicating={duplicatingWidgetId === widget.widget_id}
                      saving={savingWidgetId === widget.widget_id}
                      canMoveUp={widgetIndex > 0}
                      canMoveDown={widgetIndex < sortedWidgets.length - 1}
                      showActions={false}
                      dragEnabled={false}
                      resizeEnabled={false}
                      resizing={false}
                      resizePreviewSize={null}
                      onCornerResizeStart={() => undefined}
                      onMoveUp={() => undefined}
                      onMoveDown={() => undefined}
                      onEdit={() => undefined}
                      onDuplicate={() => undefined}
                      onDelete={() => undefined}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </section>
      )}
      <Dialog
        open={pageMode === 'edit' && Boolean(editingWidget)}
        onOpenChange={(open) => (!open && !savingWidgetId ? setEditingWidget(null) : undefined)}
      >
        <DialogContent className="max-w-5xl rounded-xl border-0 p-0 shadow-[0px_0px_30px_0px_rgba(76,87,125,0.18)]">
          <DialogHeader className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <DialogTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Edit Widget
            </DialogTitle>
          </DialogHeader>
          <DialogBody className="px-5 py-4">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Title</div>
                  <input
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#009EF7] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Description</div>
                  <textarea
                    value={editDescription}
                    onChange={(event) => setEditDescription(event.target.value)}
                    className="min-h-[92px] w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-[#009EF7] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Layout</div>
                  <Select value={editSpanClassName} onValueChange={setEditSpanClassName}>
                    <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LAYOUT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <LayoutPreview value={editSpanClassName} />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pair `Split Left Narrow (25:75)` with `Split Right Wide (75:25)` on the next widget in the same row.
                  </p>
                </div>
                {editingWidget?.widget_kind === 'chart' ? (
                  <>
                    <div className="space-y-1">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Chart Type</div>
                      <Select
                        value={editChartType}
                        onValueChange={(value) => {
                          const nextType = normalizeChartType(value);
                          const nextMaxLimit = resolveChartDataLimit(nextType, null);
                          const currentLimit = Number.parseInt(editDefaultLimit, 10);
                          setEditChartType(nextType);
                          setEditDefaultLimit(
                            String(
                              Number.isFinite(currentLimit) && currentLimit > 0
                                ? Math.min(currentLimit, nextMaxLimit)
                                : nextMaxLimit,
                            ),
                          );
                        }}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bar">Bar</SelectItem>
                          <SelectItem value="vertical_bar">Vertical Bar</SelectItem>
                          <SelectItem value="horizontal_bar">Horizontal Bar</SelectItem>
                          <SelectItem value="line">Line</SelectItem>
                          <SelectItem value="area">Area</SelectItem>
                          <SelectItem value="pie">Pie</SelectItem>
                          <SelectItem value="donut">Donut</SelectItem>
                          <SelectItem value="scatter">Scatter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                <div className="space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Chart Data Limit</div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const currentLimit = Number.parseInt(editDefaultLimit, 10);
                        const nextValue = Number.isFinite(currentLimit) && currentLimit > 1 ? currentLimit - 1 : 1;
                        setEditDefaultLimit(String(nextValue));
                      }}
                      disabled={(Number.parseInt(editDefaultLimit, 10) || 1) <= 1}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                      aria-label="Decrease chart data limit"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={resolveChartDataLimit(editChartType, null)}
                      value={editDefaultLimit}
                      onChange={(event) => {
                        const raw = event.target.value;
                        if (!raw.trim()) {
                          setEditDefaultLimit('');
                          return;
                        }
                        const parsed = Number.parseInt(raw, 10);
                        const maxLimit = resolveChartDataLimit(editChartType, null);
                        setEditDefaultLimit(String(Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, maxLimit) : maxLimit));
                      }}
                      className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-center text-sm text-slate-900 outline-none focus:border-[#009EF7] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const currentLimit = Number.parseInt(editDefaultLimit, 10);
                        const maxLimit = resolveChartDataLimit(editChartType, null);
                        const baseValue = Number.isFinite(currentLimit) && currentLimit > 0 ? currentLimit : 1;
                        setEditDefaultLimit(String(Math.min(baseValue + 1, maxLimit)));
                      }}
                      disabled={(Number.parseInt(editDefaultLimit, 10) || 0) >= resolveChartDataLimit(editChartType, null)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                      aria-label="Increase chart data limit"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Maximum per chart: pie/donut 6, line/area 12, scatter 24, bar 20.
                  </p>
                  {(Number.parseInt(editDefaultLimit, 10) || 0) >= resolveChartDataLimit(editChartType, null) ? (
                    <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                      Maximum limit reached for this chart type.
                    </p>
                  ) : null}
                </div>
              </>
            ) : null}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/60">
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Live Preview
                </div>
                {editingWidget ? (
                  <WidgetChartCard
                    dashboardKey={dashboardKey}
                    widget={{
                      ...editingWidget,
                      title: editTitle.trim() || editingWidget.title,
                      description: editDescription.trim(),
                      chart_type: editingWidget.widget_kind === 'chart' ? editChartType : editingWidget.chart_type,
                      span_class_name: editSpanClassName,
                      queries: editingWidget.queries.map((query, index) =>
                        index === 0
                          ? {
                              ...query,
                              default_limit:
                                editingWidget.widget_kind === 'chart'
                                  ? Number.isFinite(Number.parseInt(editDefaultLimit, 10)) && Number.parseInt(editDefaultLimit, 10) > 0
                                    ? Math.min(Number.parseInt(editDefaultLimit, 10), resolveChartDataLimit(editChartType, null))
                                    : resolveChartDataLimit(editChartType, null)
                                  : query.default_limit,
                            }
                          : query,
                      ),
                    }}
                    result={queryResults[editingWidget.widget_id]}
                    lazyRender={false}
                    showActions={false}
                    resizeEnabled={false}
                    resizing={false}
                    resizePreviewSize={null}
                    canMoveUp={false}
                    canMoveDown={false}
                    onCornerResizeStart={() => undefined}
                    onMoveUp={() => undefined}
                    onMoveDown={() => undefined}
                    onEdit={() => undefined}
                    onDuplicate={() => undefined}
                    onDelete={() => undefined}
                  />
                ) : null}
              </div>
            </div>
          </DialogBody>
          <DialogFooter className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditingWidget(null)}
              disabled={Boolean(savingWidgetId)}
              className="rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void handleSaveWidgetEdit()}
              disabled={Boolean(savingWidgetId) || !editTitle.trim()}
              className="rounded-lg bg-[#009EF7] text-white hover:bg-[#07a5ff] disabled:opacity-50"
            >
              {savingWidgetId ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CustomDb1DashboardPage() {
  return <CustomDashboardPage dashboardKey="custom-db-1" />;
}

function DashboardMessage({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <LoaderCircle className="size-4 animate-spin" />
      <span>{text}</span>
    </div>
  );
}


function WidgetChartCard({
  dashboardKey,
  widget,
  result,
  lazyRender = false,
  deleting,
  duplicating,
  saving,
  showActions = true,
  dragEnabled = false,
  resizeEnabled = false,
  resizing = false,
  resizePreviewSize = null,
  canMoveUp,
  canMoveDown,
  onCornerResizeStart,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  dashboardKey: string;
  widget: DashboardWidget;
  result?: QueryResult;
  lazyRender?: boolean;
  deleting?: boolean;
  duplicating?: boolean;
  saving?: boolean;
  showActions?: boolean;
  dragEnabled?: boolean;
  resizeEnabled?: boolean;
  resizing?: boolean;
  resizePreviewSize?: '25' | '50' | '75' | '100' | null;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onCornerResizeStart: (event: React.PointerEvent<HTMLButtonElement>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const chartType = normalizeChartType(widget.chart_type);
  const primaryQuery = widget.queries[0];
  const chartDataLimit = resolveChartDataLimit(chartType, primaryQuery?.default_limit);
  const prefersTable = widget.widget_kind === 'table' || widget.widget_kind === 'list' || widget.widget_kind === 'summary' || widget.widget_kind === 'metric';
  const createAlertHref = `/app/alerting/rules/create?sourceType=dashboard-widget&dashboardKey=${encodeURIComponent(dashboardKey)}&widgetId=${encodeURIComponent(widget.widget_id)}&widgetTitle=${encodeURIComponent(widget.title)}`;
  const [cardRef, isVisible] = useViewportVisibility({
    enabled: lazyRender,
    rootMargin: '240px 0px',
  });
  const shouldRenderVisualization = !lazyRender || isVisible;
  const chartData = useMemo(() => {
    if (!result || prefersTable || !shouldRenderVisualization) {
      return null;
    }

    return buildChartData(result.columns, result.rows);
  }, [prefersTable, result, shouldRenderVisualization]);
  const limitedChartData = useMemo(() => {
    if (!chartData?.length) {
      return null;
    }

    return limitChartData(chartData, chartType, chartDataLimit);
  }, [chartData, chartDataLimit, chartType]);

  return (
    <article
      ref={cardRef}
      className={`relative rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition data-[dragging=true]:rotate-[1deg] data-[dragging=true]:border-[#009EF7]/60 data-[dragging=true]:shadow-[0_20px_60px_-25px_rgba(0,158,247,0.45)] dark:border-slate-800 dark:bg-slate-950 dark:data-[dragging=true]:border-sky-500/50 ${
        resizing ? 'border-[#009EF7]/60 shadow-[0_20px_60px_-25px_rgba(0,158,247,0.35)]' : ''
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{widget.title}</h2>
            <Link
              href={createAlertHref}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 text-xs font-medium text-amber-700 transition hover:bg-amber-100 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300 dark:hover:bg-amber-950/50"
            >
              <BellRing className="size-3.5" />
              Create Alert
            </Link>
          </div>
          {widget.description ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{widget.description}</p> : null}
        </div>
        {showActions ? (
          <div className="flex flex-wrap items-center justify-end gap-2">
            {dragEnabled ? (
              <SortableItemHandle>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                  aria-label={`Drag ${widget.title}`}
                >
                  <GripVertical className="size-4" />
                </button>
              </SortableItemHandle>
            ) : null}
            <button
              type="button"
              onClick={onMoveUp}
              disabled={!canMoveUp || saving}
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100"
              aria-label={`Move ${widget.title} up`}
            >
              <ArrowUp className="size-4" />
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={!canMoveDown || saving}
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100"
              aria-label={`Move ${widget.title} down`}
            >
              <ArrowDown className="size-4" />
            </button>
            <button
              type="button"
              onClick={onEdit}
              disabled={saving}
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100"
              aria-label={`Edit ${widget.title}`}
            >
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              onClick={onDuplicate}
              disabled={duplicating || saving}
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100"
              aria-label={`Duplicate ${widget.title}`}
            >
              {duplicating ? <LoaderCircle className="size-4 animate-spin" /> : <Copy className="size-4" />}
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting || saving}
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-rose-950/30 dark:hover:text-rose-300"
              aria-label={`Delete ${widget.title}`}
            >
              {deleting ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            </button>
          </div>
        ) : null}
      </div>

      {!result ? (
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Widget is not available yet.
        </div>
      ) : !shouldRenderVisualization ? (
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Scroll to render this widget.
        </div>
      ) : prefersTable ? (
        <TableRenderer result={result} />
      ) : !chartData?.length ? (
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Not enough data to visualize this chart.
        </div>
      ) : (
        <MemoizedChartRenderer chartType={chartType} data={limitedChartData ?? []} />
      )}
      {resizeEnabled ? (
        <div className="absolute bottom-2 right-2 flex flex-col items-end gap-1">
          {resizePreviewSize ? (
            <div className="rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white shadow-sm dark:bg-slate-100 dark:text-slate-900">
              {resizePreviewSize}%
            </div>
          ) : null}
          <button
            type="button"
            onPointerDown={onCornerResizeStart}
            disabled={saving}
            className="inline-flex h-7 w-7 cursor-se-resize items-center justify-center rounded-lg border border-slate-200 bg-white/90 text-slate-400 transition hover:border-[#009EF7]/40 hover:text-[#009EF7] disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-500 dark:hover:border-sky-500/40 dark:hover:text-sky-400"
            aria-label={`Resize ${widget.title}`}
            title="Drag horizontally to resize: 25%, 50%, 75%, 100%"
          >
            <span className="pointer-events-none text-xs font-bold leading-none">◢</span>
          </button>
        </div>
      ) : null}
    </article>
  );
}

function useViewportVisibility({
  enabled,
  rootMargin = '0px',
}: {
  enabled: boolean;
  rootMargin?: string;
}) {
  const elementRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setIsVisible(true);
      return;
    }

    const node = elementRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [enabled, rootMargin]);

  return [elementRef, isVisible] as const;
}

function TableRenderer({ result }: { result: QueryResult }) {
  if (!result.columns.length || !result.rows.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        Table data is not available yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200/70 text-[13px] dark:divide-slate-800/80">
          <thead className="bg-slate-50/90 dark:bg-slate-900/90">
            <tr>
              {result.columns.map((column) => (
                <th
                  key={column}
                  className="whitespace-nowrap px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/70">
            {result.rows.slice(0, 12).map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="bg-white dark:bg-slate-950">
                {result.columns.map((column) => (
                  <td
                    key={`${rowIndex}-${column}`}
                    className="whitespace-nowrap px-3 py-2 text-slate-700 dark:text-slate-200"
                  >
                    {String(row[column] ?? '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const MemoizedChartRenderer = memo(function ChartRenderer({
  chartType,
  data,
}: {
  chartType: ChartType;
  data: ChartDatum[];
}) {
  const config = {
    value: {
      label: 'Value',
      color: CHART_COLORS[0],
    },
  };

  if (chartType === 'pie' || chartType === 'donut') {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const maxValue = Math.max(...data.map((item) => item.value), 1);
    return (
      <ChartContainer className="h-[360px] w-full" config={config}>
        <PieChart margin={{ top: 12, right: 32, bottom: 12, left: 32 }}>
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, _name, item) => {
                  const numericValue = typeof value === 'number' ? value : Number(value);
                  const percent = total > 0 ? (numericValue / total) * 100 : 0;
                  return (
                    <div className="space-y-1">
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {String(item?.payload?.label ?? '')}
                      </div>
                      <div className="text-slate-600 dark:text-slate-300">
                        {formatChartNumber(numericValue)} ({percent.toFixed(1)}%)
                      </div>
                    </div>
                  );
                }}
                hideIndicator
                hideLabel
              />
            }
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={chartType === 'donut' ? 86 : 24}
            outerRadius={chartType === 'donut' ? 126 : 110}
            paddingAngle={chartType === 'donut' ? 4 : 2}
            cornerRadius={chartType === 'donut' ? 12 : 4}
            cx="50%"
            cy="52%"
            labelLine={chartType === 'donut' || chartType === 'pie' ? false : {
              stroke: '#94a3b8',
              strokeWidth: 1,
            }}
            label={(props) => {
              if (!props.percent || props.percent < 0.04) {
                return '';
              }
              if (chartType === 'donut') {
                return renderDonutLabels(props);
              }
              if (chartType === 'pie') {
                return renderPieLabels(props);
              }
              return `${String(props.name)} ${Math.round(props.percent * 100)}%`;
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`${entry.label}-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                stroke="rgba(255,255,255,0.92)"
                strokeWidth={2}
              />
            ))}
          </Pie>
          {chartType === 'donut' ? (
            <text
              x="50%"
              y="46%"
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-slate-900 text-[18px] font-medium dark:fill-slate-100"
            >
              Total
            </text>
          ) : null}
          {chartType === 'donut' ? (
            <text
              x="50%"
              y="57%"
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-slate-900 text-[24px] font-semibold tracking-tight dark:fill-slate-50"
            >
              {formatDonutTotal(total)}
            </text>
          ) : null}
        </PieChart>
      </ChartContainer>
    );
  }

  if (chartType === 'scatter') {
    const scatterData = buildScatterVisualData(data);
    return (
      <ChartContainer className="h-[360px] w-full" config={config}>
        <ScatterChart margin={{ left: 8, right: 18, top: 18, bottom: 12 }}>
          <CartesianGrid stroke="rgba(148,163,184,0.22)" strokeDasharray="4 4" />
          <XAxis
            axisLine={false}
            dataKey="x"
            name="X Metric"
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
            tickLine={false}
            tickMargin={10}
            type="number"
          />
          <YAxis
            axisLine={false}
            dataKey="y"
            name="Y Metric"
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
            tickLine={false}
            tickMargin={10}
            type="number"
          />
          <ZAxis dataKey="bubbleSize" range={[80, 320]} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(_value, _name, item) => {
                  const payload = item?.payload as ScatterVisualDatum | undefined;
                  if (!payload) {
                    return null;
                  }

                  return (
                    <div className="space-y-1">
                      <div className="font-medium text-slate-900 dark:text-slate-100">{payload.label}</div>
                      <div className="text-slate-600 dark:text-slate-300">X: {formatChartNumber(payload.x ?? 0)}</div>
                      <div className="text-slate-600 dark:text-slate-300">Y: {formatChartNumber(payload.y ?? 0)}</div>
                      <div className="text-slate-600 dark:text-slate-300">
                        Magnitude: {formatChartNumber(payload.value)}
                      </div>
                      <div className="font-medium" style={{ color: payload.scatterColor }}>
                        {payload.scatterLevel}
                      </div>
                    </div>
                  );
                }}
                hideIndicator
                hideLabel
              />
            }
          />
          <Scatter data={scatterData}>
            {scatterData.map((entry, index) => (
              <Cell
                key={`${entry.label}-${index}`}
                fill={entry.scatterColor}
                fillOpacity={0.88}
                stroke="#ffffff"
                strokeWidth={1.5}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ChartContainer>
    );
  }

  if (chartType === 'line') {
    const lineColors = data.map((_, index) => CHART_COLORS[index % CHART_COLORS.length]);
    return (
      <ChartContainer className="h-[360px] w-full" config={config}>
        <LineChart data={data} margin={{ top: 24, right: 24, bottom: 12, left: 8 }}>
          <defs>
            <linearGradient id="bumpLineGlow" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.16} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="lineSpectrum" x1="0" x2="1" y1="0" y2="0">
              {lineColors.map((color, index) => {
                const offset = lineColors.length === 1 ? 0 : (index / (lineColors.length - 1)) * 100;
                return <stop key={`${color}-${index}`} offset={`${offset}%`} stopColor={color} />;
              })}
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148,163,184,0.18)" strokeDasharray="4 4" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="label"
            tick={({ x, y, payload }) => (
              <text
                x={x}
                y={y}
                dy={14}
                fill="#64748b"
                fontSize="12"
                fontWeight="600"
                textAnchor="middle"
              >
                {truncateChartLabel(String(payload.value), 14)}
              </text>
            )}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
            tickFormatter={(value) => formatChartNumber(Number(value))}
            tickLine={false}
            tickMargin={10}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#bumpLineGlow)"
            strokeWidth={12}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#lineSpectrum)"
            strokeWidth={4}
            dot={(props: any) => {
              const color = lineColors[props.index % lineColors.length] ?? CHART_COLORS[0];
              return (
                <circle
                  key={`line-dot-${props.index}-${props.cx}-${props.cy}`}
                  cx={props.cx}
                  cy={props.cy}
                  r={6}
                  fill="#ffffff"
                  stroke={color}
                  strokeWidth={3}
                />
              );
            }}
            activeDot={(props: any) => {
              const color = lineColors[props.index % lineColors.length] ?? CHART_COLORS[0];
              return (
                <circle
                  key={`line-active-dot-${props.index}-${props.cx}-${props.cy}`}
                  cx={props.cx}
                  cy={props.cy}
                  r={7}
                  fill="#ffffff"
                  stroke={color}
                  strokeWidth={3}
                />
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="transparent"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="value"
              position="top"
              formatter={(value: number) => formatChartNumber(Number(value))}
              content={(props: any) => {
                const value = Number(props.value ?? 0);
                const pointIndex = typeof props.index === 'number' ? props.index : 0;
                const color = lineColors[pointIndex % lineColors.length] ?? '#0f172a';
                return (
                  <text
                    x={props.x}
                    y={(props.y ?? 0) - 10}
                    textAnchor="middle"
                    fill={color}
                    fontSize="12"
                    fontWeight="700"
                  >
                    {formatChartNumber(value)}
                  </text>
                );
              }}
            />
          </Line>
        </LineChart>
      </ChartContainer>
    );
  }

  if (chartType === 'area') {
    const areaColors = data.map((_, index) => CHART_COLORS[index % CHART_COLORS.length]);
    return (
      <ChartContainer className="h-[360px] w-full" config={config}>
        <AreaChart data={data} margin={{ top: 24, right: 24, bottom: 12, left: 8 }}>
          <defs>
            <linearGradient id="areaSpectrum" x1="0" x2="1" y1="0" y2="0">
              {areaColors.map((color, index) => {
                const offset = areaColors.length === 1 ? 0 : (index / (areaColors.length - 1)) * 100;
                return <stop key={`${color}-${index}`} offset={`${offset}%`} stopColor={color} />;
              })}
            </linearGradient>
            <linearGradient id="areaFillSpectrum" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.28} />
              <stop offset="45%" stopColor="#7c3aed" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148,163,184,0.18)" strokeDasharray="4 4" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="label"
            tick={({ x, y, payload }) => (
              <text
                x={x}
                y={y}
                dy={14}
                fill="#64748b"
                fontSize="12"
                fontWeight="600"
                textAnchor="middle"
              >
                {truncateChartLabel(String(payload.value), 14)}
              </text>
            )}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
            tickFormatter={(value) => formatChartNumber(Number(value))}
            tickLine={false}
            tickMargin={10}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="url(#areaSpectrum)"
            fill="url(#areaFillSpectrum)"
            fillOpacity={1}
            strokeWidth={4}
            dot={(props: any) => {
              const color = areaColors[props.index % areaColors.length] ?? CHART_COLORS[0];
              return (
                <circle
                  key={`area-dot-${props.index}-${props.cx}-${props.cy}`}
                  cx={props.cx}
                  cy={props.cy}
                  r={5}
                  fill="#ffffff"
                  stroke={color}
                  strokeWidth={2.5}
                />
              );
            }}
            activeDot={(props: any) => {
              const color = areaColors[props.index % areaColors.length] ?? CHART_COLORS[0];
              return (
                <circle
                  key={`area-active-dot-${props.index}-${props.cx}-${props.cy}`}
                  cx={props.cx}
                  cy={props.cy}
                  r={6}
                  fill="#ffffff"
                  stroke={color}
                  strokeWidth={3}
                />
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="transparent"
            fill="transparent"
            isAnimationActive={false}
            dot={false}
            activeDot={false}
          >
            <LabelList
              dataKey="value"
              position="top"
              content={(props: any) => {
                const value = Number(props.value ?? 0);
                const color = areaColors[props.index % areaColors.length] ?? '#0f172a';
                return (
                  <text
                    x={props.x}
                    y={(props.y ?? 0) - 10}
                    textAnchor="middle"
                    fill={color}
                    fontSize="12"
                    fontWeight="700"
                  >
                    {formatChartNumber(value)}
                  </text>
                );
              }}
            />
          </Area>
        </AreaChart>
      </ChartContainer>
    );
  }

  if (chartType === 'horizontal_bar') {
    const normalizedData = buildNormalizedBarData(data);
    return (
      <ChartContainer className="h-[360px] w-full" config={config}>
        <HorizontalBarRenderer data={normalizedData} />
      </ChartContainer>
    );
  }

  if (chartType === 'vertical_bar') {
    const normalizedData = buildNormalizedBarData(data);
    return (
      <ChartContainer className="h-[360px] w-full" config={config}>
        <VerticalBarRenderer data={normalizedData} />
      </ChartContainer>
    );
  }

  const normalizedData = buildNormalizedBarData(data);
  return (
    <ChartContainer className="h-[360px] w-full" config={config}>
      <HorizontalBarRenderer data={normalizedData} />
    </ChartContainer>
  );
});

function HorizontalBarRenderer({ data }: { data: NormalizedBarDatum[] }) {
  const viewBoxWidth = 720;
  const viewBoxHeight = 320;
  const leftLabelWidth = 186;
  const labelToBarGap = 18;
  const rightPadding = 28;
  const topPadding = 16;
  const bottomPadding = 16;
  const rowGap = 14;
  const availableHeight = viewBoxHeight - topPadding - bottomPadding;
  const rowHeight = Math.max(18, (availableHeight - rowGap * Math.max(data.length - 1, 0)) / Math.max(data.length, 1));
  const trackWidth = viewBoxWidth - leftLabelWidth - rightPadding;

  return (
    <div className="h-[360px] w-full">
      <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="h-full w-full">
        {data.map((entry, index) => {
          const y = topPadding + index * (rowHeight + rowGap);
          const width = (entry.normalizedValue / 100) * trackWidth;
          const color = CHART_COLORS[index % CHART_COLORS.length];
          const radius = Math.min(rowHeight / 2, 999);
          return (
            <g key={`hbar-row-${entry.label}-${index}`}>
              <text
                x={leftLabelWidth - labelToBarGap}
                y={y + rowHeight / 2}
                textAnchor="end"
                dominantBaseline="middle"
                fill="#64748b"
                fontSize="12"
                fontWeight="600"
              >
                {truncateChartLabel(entry.label, 22)}
              </text>
              <rect
                x={leftLabelWidth}
                y={y}
                width={trackWidth}
                height={rowHeight}
                rx={radius}
                ry={radius}
                fill="rgba(148,163,184,0.12)"
              />
              <rect
                x={leftLabelWidth}
                y={y}
                width={Math.max(width, 0)}
                height={rowHeight}
                rx={radius}
                ry={radius}
                fill={color}
              >
                <title>{`${entry.label}: ${formatChartNumber(entry.originalValue)} (${entry.normalizedValue.toFixed(1)}%)`}</title>
              </rect>
              <text
                x={leftLabelWidth + Math.max(width - 10, 12)}
                y={y + rowHeight / 2}
                dominantBaseline="middle"
                textAnchor="end"
                fill="#ffffff"
                fontSize="11"
                fontWeight="700"
              >
                {`${entry.normalizedValue.toFixed(0)}%`}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function VerticalBarRenderer({ data }: { data: NormalizedBarDatum[] }) {
  const viewBoxWidth = 720;
  const viewBoxHeight = 320;
  const topPadding = 20;
  const bottomPadding = 64;
  const leftPadding = 24;
  const rightPadding = 16;
  const chartHeight = viewBoxHeight - topPadding - bottomPadding;
  const chartWidth = viewBoxWidth - leftPadding - rightPadding;
  const gap = 16;
  const barWidth = Math.max(22, (chartWidth - gap * Math.max(data.length - 1, 0)) / Math.max(data.length, 1));

  return (
    <div className="h-[360px] w-full">
      <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="h-full w-full">
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = topPadding + chartHeight - (tick / 100) * chartHeight;
          return (
            <g key={`vbar-grid-${tick}`}>
              <line x1={leftPadding} x2={viewBoxWidth - rightPadding} y1={y} y2={y} stroke="rgba(148,163,184,0.18)" strokeDasharray="4 4" />
              <text x={0} y={y + 4} fill="#64748b" fontSize="12" fontWeight="600">
                {tick}%
              </text>
            </g>
          );
        })}
        {data.map((entry, index) => {
          const color = CHART_COLORS[index % CHART_COLORS.length];
          const x = leftPadding + index * (barWidth + gap);
          const height = (entry.normalizedValue / 100) * chartHeight;
          const y = topPadding + chartHeight - height;
          const radius = Math.min(barWidth / 2, 16);
          return (
            <g key={`vbar-row-${entry.label}-${index}`}>
              <path
                d={[
                  `M ${x} ${topPadding + chartHeight}`,
                  `L ${x} ${y + radius}`,
                  `Q ${x} ${y} ${x + radius} ${y}`,
                  `L ${x + barWidth - radius} ${y}`,
                  `Q ${x + barWidth} ${y} ${x + barWidth} ${y + radius}`,
                  `L ${x + barWidth} ${topPadding + chartHeight}`,
                  'Z',
                ].join(' ')}
                fill={color}
              >
                <title>{`${entry.label}: ${formatChartNumber(entry.originalValue)} (${entry.normalizedValue.toFixed(1)}%)`}</title>
              </path>
              <text
                x={x + barWidth / 2}
                y={Math.min(y + 16, topPadding + chartHeight - 10)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff"
                fontSize="11"
                fontWeight="700"
              >
                {`${entry.normalizedValue.toFixed(0)}%`}
              </text>
              <text
                x={x + barWidth / 2}
                y={viewBoxHeight - 30}
                textAnchor="middle"
                fill="#64748b"
                fontSize="12"
                fontWeight="600"
              >
                {truncateChartLabel(entry.label, 10)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

