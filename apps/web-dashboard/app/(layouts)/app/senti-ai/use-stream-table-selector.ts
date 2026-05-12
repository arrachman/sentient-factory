'use client';

import { useCallback } from 'react';
import type { ResultViewKey, SelectedStreamChart, SelectedStreamTable } from './_types';
import { buildDashboardVisualizationBlocks } from './_utils-result';
import { extractAiResultFromWorkflowPayload, parseStreamDataChart, parseStreamDataTable } from './_utils-stream';

interface StreamTableSelectorOptions {
  activeStreamDataEntryId: string | null;
  setActiveStreamDataEntryId: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedStreamTable: React.Dispatch<React.SetStateAction<SelectedStreamTable | null>>;
  setSelectedStreamChart: React.Dispatch<React.SetStateAction<SelectedStreamChart | null>>;
  setSelectedDashboardBlockId: React.Dispatch<React.SetStateAction<string | null>>;
  setResultView: React.Dispatch<React.SetStateAction<ResultViewKey>>;
  restoreRightPanelWidth: () => void;
}

export function useStreamTableSelector({
  activeStreamDataEntryId,
  setActiveStreamDataEntryId,
  setSelectedStreamTable,
  setSelectedStreamChart,
  setSelectedDashboardBlockId,
  setResultView,
  restoreRightPanelWidth,
}: StreamTableSelectorOptions) {
  const handleOpenStreamDataTable = useCallback(
    (entryId: string, payload: string) => {
      if (activeStreamDataEntryId === entryId) {
        setActiveStreamDataEntryId(null);
        setSelectedStreamTable(null);
        setSelectedStreamChart(null);
        setSelectedDashboardBlockId(null);
        return;
      }
      const payloadResult = extractAiResultFromWorkflowPayload(payload);
      const payloadDashboardBlocks = buildDashboardVisualizationBlocks(payloadResult);
      const primaryDashboardBlock =
        payloadDashboardBlocks.find((block) => block.chart) ?? payloadDashboardBlocks[0] ?? null;
      if (primaryDashboardBlock) {
        setActiveStreamDataEntryId(entryId);
        setSelectedDashboardBlockId(primaryDashboardBlock.id);
        setSelectedStreamTable(primaryDashboardBlock.table);
        setSelectedStreamChart(primaryDashboardBlock.chart);
        if (primaryDashboardBlock.table || primaryDashboardBlock.chart) {
          restoreRightPanelWidth();
        }
        setResultView(primaryDashboardBlock.chart ? 'chart' : 'table');
        return;
      }
      const nextTable = parseStreamDataTable(payload);
      const nextChart = parseStreamDataChart(payload);
      if (!nextTable) return;
      setActiveStreamDataEntryId(entryId);
      setSelectedDashboardBlockId(null);
      setSelectedStreamTable(nextTable);
      setSelectedStreamChart(nextChart);
      if (nextTable || nextChart) restoreRightPanelWidth();
      setResultView(nextChart ? 'chart' : 'table');
    },
    [activeStreamDataEntryId, restoreRightPanelWidth],
  );

  return { handleOpenStreamDataTable };
}
