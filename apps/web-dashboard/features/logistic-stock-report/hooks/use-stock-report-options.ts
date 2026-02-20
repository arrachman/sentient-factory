import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchStockReportOptions } from '@/features/logistic-stock-report/api/stock-report';
import { initialFilter } from '@/features/logistic-stock-report/model/types';
import type { FilterState, ItemOption, SupplierOption, WarehouseOption } from '@/features/logistic-stock-report/model/types';
import { resetReportFilters } from '@/features/logistic-stock-report/model/utils';
import { buildAuthHeader, getClientToken } from '@/shared/auth/token.client';

export function useStockReportOptions() {
  const [filters, setFilters] = useState<FilterState>(initialFilter);
  const [lockedWarehouseId, setLockedWarehouseId] = useState('');
  const [isAdminRole, setIsAdminRole] = useState(false);

  const [warehouses, setWarehouses] = useState<WarehouseOption[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [items, setItems] = useState<ItemOption[]>([]);

  const [loadingOptions, setLoadingOptions] = useState(false);
  const [error, setError] = useState('');

  const token = useMemo(() => getClientToken(), []);
  const headers = useMemo(() => buildAuthHeader(token), [token]);

  const fetchOptions = useCallback(async () => {
    setLoadingOptions(true);
    setError('');

    try {
      const result = await fetchStockReportOptions(headers);
      setWarehouses(result.warehouses);
      setSuppliers(result.suppliers);
      setItems(result.items);
      setIsAdminRole(result.hasAdminRole);

      if (result.defaultWarehouseId && !result.hasAdminRole) {
        setLockedWarehouseId(result.defaultWarehouseId);
        setFilters((prev) => ({
          ...prev,
          warehouseId: result.defaultWarehouseId,
        }));
      } else {
        setLockedWarehouseId('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load options');
    } finally {
      setLoadingOptions(false);
    }
  }, [headers]);

  const onResetFilters = useCallback(() => {
    setFilters((prev) => resetReportFilters(prev, isAdminRole, lockedWarehouseId));
  }, [isAdminRole, lockedWarehouseId]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  return {
    filters,
    setFilters,
    lockedWarehouseId,
    isAdminRole,
    warehouses,
    suppliers,
    items,
    loadingOptions,
    optionsError: error,
    headers,
    refetchOptions: fetchOptions,
    onResetFilters,
  };
}
