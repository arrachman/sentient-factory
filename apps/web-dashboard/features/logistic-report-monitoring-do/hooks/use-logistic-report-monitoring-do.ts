import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  CityOption,
  FilterState,
  MonitoringRow,
  ProvinceOption,
  SupplierOption,
  WarehouseOption,
} from '@/features/logistic-report-monitoring-do/model/types';
import { initialFilter } from '@/features/logistic-report-monitoring-do/model/types';
import {
  downloadBufferAsXlsx,
  extractRoleNames,
  pickIdFromUnknown,
  toEntityId,
} from '@/features/logistic-report-monitoring-do/model/utils';
import { buildMonitoringDoExcelBuffer } from '@/features/logistic-report-monitoring-do/model/excel';
import { createExportFilename } from '@/features/logistic-stock-report/model/utils';
import { getClientToken } from '@/shared/auth/token.client';

export function useLogisticReportMonitoringDo() {
  const [filters, setFilters] = useState<FilterState>(initialFilter);
  const [rows, setRows] = useState<MonitoringRow[]>([]);
  const [lockedWarehouseId, setLockedWarehouseId] = useState('');
  const [isAdminRole, setIsAdminRole] = useState(false);

  const [warehouses, setWarehouses] = useState<WarehouseOption[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [provinces, setProvinces] = useState<ProvinceOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  const token = useMemo(() => getClientToken(), []);

  const headers = useMemo(
    () =>
      token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    [token],
  );

  const fetchOptions = useCallback(async () => {
    setLoadingOptions(true);
    setError('');
    try {
      const [profileRes, warehouseRes, supplierRes, provinceRes] = await Promise.all([
        fetch('/api/auth/me', {
          cache: 'no-store',
          headers,
        }),
        fetch('/api/master-data-warehouses?page=1&limit=100', {
          cache: 'no-store',
          headers,
        }),
        fetch('/api/master-data-contacts?page=1&limit=100&type=supplier', {
          cache: 'no-store',
          headers,
        }),
        fetch('/api/master-data-provinces?page=1&limit=100', {
          cache: 'no-store',
          headers,
        }),
      ]);

      const [profilePayload, warehousePayload, supplierPayload, provincePayload] = await Promise.all([
        profileRes.json().catch(() => null),
        warehouseRes.json().catch(() => null),
        supplierRes.json().catch(() => null),
        provinceRes.json().catch(() => null),
      ]);

      if (!profileRes.ok || !profilePayload?.success) {
        throw new Error(profilePayload?.message || 'Failed to load current user');
      }
      if (!warehouseRes.ok || !warehousePayload?.success) {
        throw new Error(warehousePayload?.message || 'Failed to load warehouse options');
      }
      if (!supplierRes.ok || !supplierPayload?.success) {
        throw new Error(supplierPayload?.message || 'Failed to load supplier options');
      }
      if (!provinceRes.ok || !provincePayload?.success) {
        throw new Error(provincePayload?.message || 'Failed to load province options');
      }

      setWarehouses(Array.isArray(warehousePayload.data) ? warehousePayload.data : []);
      setSuppliers(Array.isArray(supplierPayload.data) ? supplierPayload.data : []);
      setProvinces(Array.isArray(provincePayload.data) ? provincePayload.data : []);

      const profileData = profilePayload?.data ?? {};
      const roleNames = extractRoleNames([
        ...(Array.isArray(profileData?.roles) ? profileData.roles : []),
        ...(Array.isArray(profileData?.user?.roles) ? profileData.user.roles : []),
      ]);
      const hasAdminRole = roleNames.includes('admin') || roleNames.includes('super_admin');
      setIsAdminRole(hasAdminRole);

      const warehouseCandidates = [
        profileData?.warehouseId,
        profileData?.user?.warehouseId,
        profileData?.warehouse?.id,
        profileData?.user?.warehouse?.id,
        profileData?.warehouseUuid,
        profileData?.user?.warehouseUuid,
        profileData?.warehouse?.uuid,
        profileData?.user?.warehouse?.uuid,
      ]
        .map((value) => toEntityId(value))
        .filter(Boolean);
      const optionIds = new Set(
        (Array.isArray(warehousePayload.data) ? warehousePayload.data : [])
          .map((warehouse: WarehouseOption) => pickIdFromUnknown(warehouse))
          .filter(Boolean),
      );
      const profileWarehouseName = String(
        profileData?.warehouse?.name ?? profileData?.user?.warehouse?.name ?? '',
      )
        .trim()
        .toLowerCase();
      const warehouseByName = (Array.isArray(warehousePayload.data) ? warehousePayload.data : []).find(
        (warehouse: WarehouseOption) =>
          profileWarehouseName &&
          String(warehouse?.name ?? '').trim().toLowerCase() === profileWarehouseName,
      );
      const defaultWarehouseId =
        warehouseCandidates.find((candidate) => optionIds.has(candidate)) ||
        pickIdFromUnknown(warehouseByName) ||
        '';

      if (defaultWarehouseId && !hasAdminRole) {
        setLockedWarehouseId(defaultWarehouseId);
        setFilters((prev) => ({
          ...prev,
          warehouseId: defaultWarehouseId,
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

  const fetchCities = useCallback(async () => {
    try {
      const query = new URLSearchParams({
        page: '1',
        limit: '100',
      });

      if (filters.provinceId) {
        query.set('provinceId', filters.provinceId);
      }

      const response = await fetch(`/api/master-data-cities?${query.toString()}`, {
        cache: 'no-store',
        headers,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load city options');
      }

      const nextCities: CityOption[] = Array.isArray(payload.data) ? payload.data : [];
      setCities(nextCities);
    } catch {
      setCities([]);
    }
  }, [filters.provinceId, headers]);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams();
      if (!isAdminRole && lockedWarehouseId) {
        query.set('warehouseId', lockedWarehouseId);
      } else if (filters.warehouseId) {
        query.set('warehouseId', filters.warehouseId);
      }
      if (filters.supplierId) {
        query.set('supplierId', filters.supplierId);
      }
      if (filters.provinceId) {
        query.set('provinceId', filters.provinceId);
      }
      if (filters.cityId) {
        query.set('cityId', filters.cityId);
      }
      if (filters.status) {
        query.set('status', filters.status);
      }
      if (filters.doReceivedDate) {
        query.set('doReceivedDateFrom', filters.doReceivedDate);
        query.set('doReceivedDateTo', filters.doReceivedDate);
      }

      const response = await fetch(`/api/outbound/report-monitoring-do?${query.toString()}`, {
        cache: 'no-store',
        headers,
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load monitoring report');
      }

      setRows(Array.isArray(payload?.data) ? payload.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load monitoring report');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [filters, headers, isAdminRole, lockedWarehouseId]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const selectedProvinceName = useMemo(() => {
    const selected = provinces.find(
      (item) => pickIdFromUnknown(item, ['provinceId']) === filters.provinceId,
    );
    return selected?.name || 'All Provinces';
  }, [filters.provinceId, provinces]);

  const exportToExcel = useCallback(async () => {
    if (!rows.length) {
      setError('Report is empty. Nothing to export.');
      return;
    }

    setExporting(true);
    setError('');

    try {
      const buffer = await buildMonitoringDoExcelBuffer(rows, selectedProvinceName);
      downloadBufferAsXlsx(buffer, createExportFilename('monitoring-do-delivery'));
    } finally {
      setExporting(false);
    }
  }, [rows, selectedProvinceName]);

  return {
    filters,
    setFilters,
    rows,
    lockedWarehouseId,
    isAdminRole,
    warehouses,
    suppliers,
    provinces,
    cities,
    loading,
    loadingOptions,
    exporting,
    error,
    setError,
    fetchReport,
    selectedProvinceName,
    exportToExcel,
  };
}
