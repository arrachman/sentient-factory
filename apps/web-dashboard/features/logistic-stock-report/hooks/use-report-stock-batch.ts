import { useCallback, useEffect, useState } from 'react';
import { fetchStockBatchReport } from '@/features/logistic-stock-report/api/stock-report';
import { useStockReportOptions } from '@/features/logistic-stock-report/hooks/use-stock-report-options';
import { buildStockBatchReportExcel } from '@/features/logistic-stock-report/model/excel';
import type { StockBatchRow } from '@/features/logistic-stock-report/model/types';
import { createExportFilename, downloadBufferAsXlsx } from '@/features/logistic-stock-report/model/utils';

export function useReportStockBatch() {
  const {
    filters,
    setFilters,
    lockedWarehouseId,
    isAdminRole,
    warehouses,
    suppliers,
    items,
    loadingOptions,
    optionsError,
    headers,
    onResetFilters,
  } = useStockReportOptions();

  const [rows, setRows] = useState<StockBatchRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const nextRows = await fetchStockBatchReport(
        {
          filters,
          isAdminRole,
          lockedWarehouseId,
        },
        headers,
      );
      setRows(nextRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stock batch report');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [filters, headers, isAdminRole, lockedWarehouseId]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const exportToExcel = useCallback(async () => {
    if (rows.length === 0) {
      setError('Report is empty. Nothing to export.');
      return;
    }

    setExporting(true);
    setError('');

    try {
      const buffer = await buildStockBatchReportExcel(rows);
      downloadBufferAsXlsx(buffer, createExportFilename('report-stock-batch'));
    } finally {
      setExporting(false);
    }
  }, [rows]);

  return {
    filters,
    setFilters,
    rows,
    loading,
    exporting,
    warehouses,
    suppliers,
    items,
    loadingOptions,
    isAdminRole,
    lockedWarehouseId,
    error: error || optionsError,
    fetchReport,
    exportToExcel,
    resetFilters: onResetFilters,
  };
}
