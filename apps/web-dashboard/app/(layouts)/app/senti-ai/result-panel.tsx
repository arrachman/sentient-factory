'use client';

import { Pin } from 'lucide-react';
import {
  OrderStatusCard,
  TimeseriesCard,
  TopAmountCard,
} from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardHeading,
  CardTitle,
} from '@/components/ui/card';
import type {
  DashboardVisualizationBlock,
  ResultViewKey,
  SelectedStreamChart,
  SelectedStreamTable,
} from './_types';
import { formatColumnLabel, formatCompactNumber, formatTableCellValue } from './_utils-format';
import { PinDialog, type PinDialogProps } from './ai-dialogs';
import { ChartResultIcon, TableResultIcon } from './result-icons';

const resultViews: Array<{ key: ResultViewKey; label: string; icon: typeof TableResultIcon }> = [
  { key: 'table', label: 'Table', icon: TableResultIcon },
  { key: 'chart', label: 'Chart', icon: ChartResultIcon },
];

interface AiQueryResultColumn {
  name: string;
}

export interface ResultPanelProps {
  resultView: ResultViewKey;
  setResultView: React.Dispatch<React.SetStateAction<ResultViewKey>>;
  hasSubmittedPrompt: boolean;
  previewStreamChart: SelectedStreamChart | null;
  previewStreamTable: SelectedStreamTable | null;
  dashboardVisualizationBlocks: DashboardVisualizationBlock[];
  activeDashboardBlock: DashboardVisualizationBlock | null;
  setSelectedDashboardBlockId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedTableRightAlignedColumns: Set<string>;
  queryResultColumns: AiQueryResultColumn[];
  queryResultRows: Record<string, unknown>[];
  queryResultRightAlignedColumns: Set<string>;
  managerChartData: { date: string; value: number }[];
  managerChartSeries: { key: string; label: string; color: string }[];
  managerChartStatusItems: { key: string; label: string; value: number; color: string }[];
  managerTopRows: { initials: string; name: string; code: string; amount: string }[];
  openPinDialog: () => void;
  canPinActiveWidget: boolean;
  pinDialogProps: PinDialogProps;
}

export function ResultPanel({
  resultView,
  setResultView,
  hasSubmittedPrompt,
  previewStreamChart,
  previewStreamTable,
  dashboardVisualizationBlocks,
  activeDashboardBlock,
  setSelectedDashboardBlockId,
  selectedTableRightAlignedColumns,
  queryResultColumns,
  queryResultRows,
  queryResultRightAlignedColumns,
  managerChartData,
  managerChartSeries,
  managerChartStatusItems,
  managerTopRows,
  openPinDialog,
  canPinActiveWidget,
  pinDialogProps,
}: ResultPanelProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1 rounded-xl bg-transparent p-0.5">
          {resultViews.map((view) => (
            <button
              key={view.key}
              type="button"
              onClick={() => setResultView(view.key)}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs transition ${
                resultView === view.key
                  ? 'bg-[#009EF7] font-medium text-white shadow-[0px_8px_20px_-8px_rgba(0,158,247,0.55)]'
                  : 'text-[#7E8299] hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <view.icon className={`size-4 shrink-0 ${resultView === view.key ? 'opacity-100' : 'opacity-85'}`} />
              {view.label}
            </button>
          ))}
        </div>
      </div>

      <Card className="min-h-[420px] rounded-xl border border-slate-100 bg-white shadow-[0px_0px_20px_0px_rgba(76,87,125,0.06)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_0_24px_0_rgba(2,6,23,0.45)]">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardHeading>
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {resultView === 'chart'
                  ? (previewStreamChart?.title ?? 'Chart Preview')
                  : (previewStreamTable?.title ?? 'Table Preview')}
              </CardTitle>
            </CardHeading>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={openPinDialog}
              disabled={!canPinActiveWidget}
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              <Pin className="size-3.5" />
              Pin Dashboard
            </Button>
          </div>
          {dashboardVisualizationBlocks.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {dashboardVisualizationBlocks.map((block) => (
                <button
                  key={block.id}
                  type="button"
                  onClick={() => setSelectedDashboardBlockId(block.id)}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs transition ${
                    activeDashboardBlock?.id === block.id
                      ? 'bg-[#009EF7] font-medium text-white shadow-[0px_8px_20px_-8px_rgba(0,158,247,0.55)]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  {block.title}
                </button>
              ))}
            </div>
          ) : null}
        </CardHeader>
        <CardContent>
          {resultView === 'chart' && (!hasSubmittedPrompt || !previewStreamChart) ? (
            <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-200 bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fbfd_100%)] px-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-[linear-gradient(180deg,_rgba(2,6,23,0.98)_0%,_rgba(15,23,42,0.92)_100%)] dark:text-slate-400">
              <div className="pointer-events-none absolute inset-x-0 top-8 flex justify-center opacity-90">
                <div className="relative h-40 w-56">
                  <div className="absolute inset-x-8 bottom-4 h-20 rounded-[24px] bg-slate-100 shadow-[0_24px_40px_-32px_rgba(76,87,125,0.35)] dark:bg-slate-900" />
                  <div className="absolute left-8 top-8 h-24 w-16 rounded-2xl bg-white shadow-[0px_0px_20px_0px_rgba(76,87,125,0.08)] dark:bg-slate-950" />
                  <div className="absolute right-8 top-0 h-28 w-28 rounded-[28px] bg-white shadow-[0px_0px_20px_0px_rgba(76,87,125,0.08)] dark:bg-slate-950" />
                  <div className="absolute left-12 top-12 h-14 w-8 rounded-full bg-sky-100 dark:bg-sky-500/10" />
                  <div className="absolute left-[7.25rem] top-[2.9rem] h-10 w-16 rounded-full bg-slate-100 dark:bg-slate-900" />
                  <div className="absolute right-[2.75rem] top-8 h-16 w-3 rounded-full bg-sky-300 dark:bg-sky-400/40" />
                  <div className="absolute right-[4rem] top-12 h-12 w-3 rounded-full bg-sky-200 dark:bg-sky-500/25" />
                  <div className="absolute right-[5.25rem] top-[4.4rem] h-8 w-3 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="absolute right-10 top-[2.3rem] h-6 w-16 rounded-full border border-dashed border-sky-200 dark:border-sky-500/20" />
                </div>
              </div>
              <div className="relative max-w-md space-y-3">
                <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {hasSubmittedPrompt
                    ? activeDashboardBlock?.title
                      ? `Chart tidak tersedia untuk ${activeDashboardBlock.title}`
                      : 'Chart tidak tersedia'
                    : 'Preview your metrics visually'}
                </div>
                <div>
                  {hasSubmittedPrompt
                    ? previewStreamTable
                      ? 'Blok yang sedang dipilih hanya mendukung tabel dan tidak memiliki visual chart.'
                      : 'Belum ada data chart dari stream untuk ditampilkan.'
                    : 'Jalankan analisis atau buka data stream untuk mengubah hasil menjadi visual yang siap dipresentasikan.'}
                </div>
              </div>
            </div>
          ) : null}

          {hasSubmittedPrompt && previewStreamChart && resultView === 'chart' ? (
            <div className="space-y-4">
              <TimeseriesCard
                title={previewStreamChart.title}
                subtitle="Stream preview"
                data={managerChartData}
                series={managerChartSeries}
                variant="area"
                chartHeightClass="h-[300px]"
                cardClassName="border-border/80"
                legendAlign="start"
                metricValue={formatCompactNumber(previewStreamChart.values.reduce((sum, value) => sum + value, 0))}
                metricDelta={previewStreamChart.values.length}
                metricDeltaLabel={previewStreamChart.valueLabel}
                yAxisTickFormatter={formatCompactNumber}
              />
              <OrderStatusCard
                title="Distribution"
                subtitle={previewStreamChart.valueLabel}
                items={managerChartStatusItems}
                valueFormatter={formatCompactNumber}
              />
              <TopAmountCard
                title="Top Breakdown"
                subtitle={previewStreamChart.title}
                rows={managerTopRows}
              />
            </div>
          ) : null}

          {hasSubmittedPrompt && resultView === 'table' ? (
            <div className="space-y-3">
              {previewStreamTable ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_18px_35px_-30px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_20px_42px_-34px_rgba(2,6,23,0.95)]">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200/70 text-[13px] dark:divide-slate-800/80">
                      <thead className="bg-slate-50/90 dark:bg-slate-900/90">
                        <tr>
                          {previewStreamTable.columns.map((column) => {
                            const alignRight = selectedTableRightAlignedColumns.has(column);
                            return (
                              <th
                                key={column}
                                className={`whitespace-nowrap px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 ${
                                  alignRight ? 'text-right tabular-nums' : 'text-left'
                                }`}
                              >
                                {formatColumnLabel(column)}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/70">
                        {previewStreamTable.rows.map((row, rowIndex) => (
                          <tr key={`stream-row-${rowIndex}`} className="bg-white transition hover:bg-slate-50/80 dark:bg-slate-950 dark:hover:bg-slate-900/80">
                            {previewStreamTable.columns.map((column) => {
                              const alignRight = selectedTableRightAlignedColumns.has(column);
                              return (
                                <td
                                  key={`${rowIndex}-${column}`}
                                  className={`whitespace-nowrap px-3 py-2 font-normal text-slate-700 dark:text-slate-200 ${
                                    alignRight ? 'text-right tabular-nums' : 'text-left'
                                  }`}
                                >
                                  {formatTableCellValue(row[column] ?? '-')}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : queryResultColumns.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_18px_35px_-30px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_20px_42px_-34px_rgba(2,6,23,0.95)]">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200/70 text-[13px] dark:divide-slate-800/80">
                      <thead className="bg-slate-50/90 dark:bg-slate-900/90">
                        <tr>
                          {queryResultColumns.map((column) => {
                            const alignRight = queryResultRightAlignedColumns.has(column.name);
                            return (
                              <th
                                key={column.name}
                                className={`whitespace-nowrap px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 ${
                                  alignRight ? 'text-right tabular-nums' : 'text-left'
                                }`}
                              >
                                {formatColumnLabel(column.name)}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/70">
                        {queryResultRows.map((row, rowIndex) => (
                          <tr key={`query-row-${rowIndex}`} className="bg-white transition hover:bg-slate-50/80 dark:bg-slate-950 dark:hover:bg-slate-900/80">
                            {queryResultColumns.map((column) => {
                              const alignRight = queryResultRightAlignedColumns.has(column.name);
                              return (
                                <td
                                  key={`${rowIndex}-${column.name}`}
                                  className={`whitespace-nowrap px-3 py-2 font-normal text-slate-700 dark:text-slate-200 ${
                                    alignRight ? 'text-right tabular-nums' : 'text-left'
                                  }`}
                                >
                                  {formatTableCellValue(String(row[column.name] ?? '-'))}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500 shadow-[0px_0px_20px_0px_rgba(76,87,125,0.03)] dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
                  Belum ada data tabel untuk ditampilkan.
                </div>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>
      <PinDialog {...pinDialogProps} />
    </div>
  );
}
