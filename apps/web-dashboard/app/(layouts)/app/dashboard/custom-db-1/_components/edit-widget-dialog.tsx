'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { normalizeChartType, resolveChartDataLimit } from '../_lib/chart-data';
import { LAYOUT_OPTIONS, LayoutPreview } from '../_lib/layout';
import type { ChartType, DashboardWidget, QueryResult } from '../_types';
import { WidgetChartCard } from './widget-chart-card';

type EditWidgetDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingWidget: DashboardWidget | null;
  editTitle: string;
  editDescription: string;
  editSpanClassName: string;
  editChartType: ChartType;
  editDefaultLimit: string;
  savingWidgetId: string | null;
  dashboardKey: string;
  queryResults: Record<string, QueryResult>;
  setEditTitle: (value: string) => void;
  setEditDescription: (value: string) => void;
  setEditSpanClassName: (value: string) => void;
  setEditChartType: (value: ChartType) => void;
  setEditDefaultLimit: (value: string) => void;
  setEditingWidget: (widget: DashboardWidget | null) => void;
  onSave: () => void;
};

export function EditWidgetDialog({
  open,
  onOpenChange,
  editingWidget,
  editTitle,
  editDescription,
  editSpanClassName,
  editChartType,
  editDefaultLimit,
  savingWidgetId,
  dashboardKey,
  queryResults,
  setEditTitle,
  setEditDescription,
  setEditSpanClassName,
  setEditChartType,
  setEditDefaultLimit,
  setEditingWidget,
  onSave,
}: EditWidgetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl rounded-xl border-0 p-0 shadow-[0px_0px_30px_0px_rgba(76,87,125,0.18)]">
        <DialogHeader className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <DialogTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Edit Widget</DialogTitle>
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
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
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
                        setEditDefaultLimit(String(Number.isFinite(currentLimit) && currentLimit > 0 ? Math.min(currentLimit, nextMaxLimit) : nextMaxLimit));
                      }}
                    >
                      <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"><SelectValue /></SelectTrigger>
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
                        onClick={() => { const v = Number.parseInt(editDefaultLimit, 10); setEditDefaultLimit(String(Number.isFinite(v) && v > 1 ? v - 1 : 1)); }}
                        disabled={(Number.parseInt(editDefaultLimit, 10) || 1) <= 1}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                        aria-label="Decrease chart data limit"
                      >-</button>
                      <input
                        type="number"
                        min={1}
                        max={resolveChartDataLimit(editChartType, null)}
                        value={editDefaultLimit}
                        onChange={(event) => {
                          const raw = event.target.value;
                          if (!raw.trim()) { setEditDefaultLimit(''); return; }
                          const parsed = Number.parseInt(raw, 10);
                          const maxLimit = resolveChartDataLimit(editChartType, null);
                          setEditDefaultLimit(String(Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, maxLimit) : maxLimit));
                        }}
                        className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-center text-sm text-slate-900 outline-none focus:border-[#009EF7] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                      />
                      <button
                        type="button"
                        onClick={() => { const v = Number.parseInt(editDefaultLimit, 10); const maxLimit = resolveChartDataLimit(editChartType, null); setEditDefaultLimit(String(Math.min((Number.isFinite(v) && v > 0 ? v : 1) + 1, maxLimit))); }}
                        disabled={(Number.parseInt(editDefaultLimit, 10) || 0) >= resolveChartDataLimit(editChartType, null)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                        aria-label="Increase chart data limit"
                      >+</button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Maximum per chart: pie/donut 6, line/area 12, scatter 24, bar 20.</p>
                    {(Number.parseInt(editDefaultLimit, 10) || 0) >= resolveChartDataLimit(editChartType, null) ? (
                      <p className="text-xs font-medium text-amber-600 dark:text-amber-400">Maximum limit reached for this chart type.</p>
                    ) : null}
                  </div>
                </>
              ) : null}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/60">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Live Preview</div>
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
          >Cancel</Button>
          <Button
            type="button"
            onClick={onSave}
            disabled={Boolean(savingWidgetId) || !editTitle.trim()}
            className="rounded-lg bg-[#009EF7] text-white hover:bg-[#07a5ff] disabled:opacity-50"
          >{savingWidgetId ? 'Saving...' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
