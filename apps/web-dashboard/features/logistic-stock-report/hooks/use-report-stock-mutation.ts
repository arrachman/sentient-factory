import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchStockMutationReport } from '@/features/logistic-stock-report/api/stock-report';
import { useStockReportOptions } from '@/features/logistic-stock-report/hooks/use-stock-report-options';
import { buildStockMutationReportExcel } from '@/features/logistic-stock-report/model/excel';
import type { MutationRow } from '@/features/logistic-stock-report/model/types';
import { createExportFilename, downloadBufferAsXlsx, pickEntityId, toEntityId } from '@/features/logistic-stock-report/model/utils';

export function useReportStockMutation() {
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

  const [rows, setRows] = useState<MutationRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const nextRows = await fetchStockMutationReport(
        {
          filters,
          isAdminRole,
          lockedWarehouseId,
        },
        headers,
      );
      setRows(nextRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stock mutation report');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [filters, headers, isAdminRole, lockedWarehouseId]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const warehouseNameById = useMemo(() => {
    const map = new Map<string, string>();
    warehouses.forEach((warehouse) => {
      const name = String(warehouse.name ?? '').trim();
      if (!name) {
        return;
      }

      const entityId = pickEntityId(warehouse);
      const id = toEntityId(warehouse.id);
      const uuid = toEntityId(warehouse.uuid);
      if (entityId) {
        map.set(entityId, name);
      }
      if (id) {
        map.set(id, name);
      }
      if (uuid) {
        map.set(uuid, name);
      }
    });
    return map;
  }, [warehouses]);

  const exportToExcel = useCallback(async () => {
    if (rows.length === 0) {
      setError('Report is empty. Nothing to export.');
      return;
    }

    setExporting(true);
    setError('');
    try {
      const buffer = await buildStockMutationReportExcel(rows);
      downloadBufferAsXlsx(buffer, createExportFilename('report-stock-mutation'));
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
    warehouseNameById,
    fetchReport,
    exportToExcel,
    resetFilters: onResetFilters,
  };
}
