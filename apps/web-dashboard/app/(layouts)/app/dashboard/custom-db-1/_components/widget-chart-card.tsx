'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUp, BellRing, Copy, GripVertical, LoaderCircle, Pencil, Trash2 } from 'lucide-react';
import { SortableItemHandle } from '@/components/ui/sortable-list';
import {
  buildChartData,
  limitChartData,
  normalizeChartType,
  resolveChartDataLimit,
} from '../_lib/chart-data';
import type { DashboardWidget, QueryResult } from '../_types';
import { TableRenderer } from './table-renderer';
import { MemoizedChartRenderer } from './chart-renderer';
import { useViewportVisibility } from './use-viewport-visibility';

export function WidgetChartCard({
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
  const prefersTable =
    widget.widget_kind === 'table' ||
    widget.widget_kind === 'list' ||
    widget.widget_kind === 'summary' ||
    widget.widget_kind === 'metric';
  const createAlertHref = `/app/alerting/rules/create?sourceType=dashboard-widget&dashboardKey=${encodeURIComponent(dashboardKey)}&widgetId=${encodeURIComponent(widget.widget_id)}&widgetTitle=${encodeURIComponent(widget.title)}`;
  const [cardRef, isVisible] = useViewportVisibility({
    enabled: lazyRender,
    rootMargin: '240px 0px',
  });
  const shouldRenderVisualization = !lazyRender || isVisible;
  const chartData = useMemo(() => {
    if (!result || prefersTable || !shouldRenderVisualization) return null;
    return buildChartData(result.columns, result.rows);
  }, [prefersTable, result, shouldRenderVisualization]);
  const limitedChartData = useMemo(() => {
    if (!chartData?.length) return null;
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
                <button type="button" className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100" aria-label={`Drag ${widget.title}`}>
                  <GripVertical className="size-4" />
                </button>
              </SortableItemHandle>
            ) : null}
            <button type="button" onClick={onMoveUp} disabled={!canMoveUp || saving} className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100" aria-label={`Move ${widget.title} up`}>
              <ArrowUp className="size-4" />
            </button>
            <button type="button" onClick={onMoveDown} disabled={!canMoveDown || saving} className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100" aria-label={`Move ${widget.title} down`}>
              <ArrowDown className="size-4" />
            </button>
            <button type="button" onClick={onEdit} disabled={saving} className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100" aria-label={`Edit ${widget.title}`}>
              <Pencil className="size-4" />
            </button>
            <button type="button" onClick={onDuplicate} disabled={duplicating || saving} className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100" aria-label={`Duplicate ${widget.title}`}>
              {duplicating ? <LoaderCircle className="size-4 animate-spin" /> : <Copy className="size-4" />}
            </button>
            <button type="button" onClick={onDelete} disabled={deleting || saving} className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-rose-950/30 dark:hover:text-rose-300" aria-label={`Delete ${widget.title}`}>
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
