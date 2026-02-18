'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';

type ProvinceOption = {
  id?: string | number;
  uuid?: string | number;
  name?: string;
};

type CityOption = {
  id?: string | number;
  uuid?: string | number;
  name?: string;
  province?: {
    id?: string | number;
    uuid?: string | number;
    name?: string;
  } | null;
};

type WarehouseOption = {
  id?: string | number;
  uuid?: string | number;
  name: string;
};

type SupplierOption = {
  id?: string | number;
  uuid?: string | number;
  code?: string;
  name?: string;
};

type MonitoringRow = {
  uuid: string;
  doNumber: string;
  createdAt?: string | null;
  doReceivedDate?: string | null;
  bu?: string | null;
  destinationCity?: {
    uuid?: string;
    name?: string;
    province?: {
      uuid?: string;
      name?: string;
    } | null;
  } | null;
  stdLeadTimeDays?: number;
  shippingDate?: string | null;
  standardReceivedDate?: string | null;
  actualReceivedDate?: string | null;
  receivedBy?: string | null;
  doScanReturnDate?: string | null;
  kpiDeliveryStatus?: string | null;
  stdReturnDoDays?: number;
  stdDoReturnDate?: string | null;
  kpiDoReturnStatus?: string | null;
  totalItemTypes?: string | number | DecimalLike | null;
  totalQtyPcs?: string | number | DecimalLike | null;
  totalKg?: string | number | DecimalLike | null;
  sourceSuppliers?: Array<{ id: string; name: string }>;
  sourceWarehouses?: Array<{ id: string; name: string }>;
  status?: string | null;
  customer?: {
    name?: string;
  } | null;
};

type DecimalLike = {
  s?: number;
  e?: number;
  d?: number[];
};

type FilterState = {
  warehouseId: string;
  supplierId: string;
  provinceId: string;
  cityId: string;
  status: string;
  doReceivedDate: string;
};

const initialFilter: FilterState = {
  warehouseId: '',
  supplierId: '',
  provinceId: '',
  cityId: '',
  status: '',
  doReceivedDate: '',
};

const STATUS_OPTIONS = ['OPEN', 'DELIVERY', 'DELIVERED', 'COMPLETED'] as const;

function getTokenFromCookie() {
  return (
    document.cookie
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith('sf_token='))
      ?.slice('sf_token='.length) || ''
  );
}

function fmtDate(value?: string | null) {
      if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function toDateOrNull(value?: string | Date | null) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function fmtExcelDate(value?: string | Date | null) {
  const date = toDateOrNull(value);
  if (!date) {
    return '';
  }

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
}

function addDaysFromDate(value?: string | null, days?: number) {
  const date = toDateOrNull(value);
  if (!date) {
    return null;
  }

  const safeDays = Number.isFinite(days) ? Number(days) : 0;
  const next = new Date(date);
  next.setDate(next.getDate() + safeDays);
  return next;
}

function normalizeDateOnly(value?: string | Date | null) {
  const date = toDateOrNull(value);
  if (!date) {
    return null;
  }
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function computeKpiStatus(actualDate?: string | Date | null, standardDate?: string | Date | null) {
  const actual = normalizeDateOnly(actualDate);
  const standard = normalizeDateOnly(standardDate);
  if (!actual || !standard) {
    return '';
  }
  return actual.getTime() <= standard.getTime() ? 'ONTIME' : 'LATE';
}

function outboundStatusBadgeVariant(status?: string | null) {
  if (status === 'OPEN') {
    return 'warning';
  }
  if (status === 'DELIVERY') {
    return 'info';
  }
  if (status === 'DELIVERED') {
    return 'primary';
  }
  if (status === 'COMPLETED') {
    return 'success';
  }
  return 'secondary';
}

function isDecimalLike(value: unknown): value is DecimalLike {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const candidate = value as DecimalLike;
  return Array.isArray(candidate.d);
}

function decimalLikeToString(value: DecimalLike): string {
  const sign = value.s === -1 ? '-' : '';
  const exponent = Number.isFinite(value.e) ? Number(value.e) : 0;
  const chunks = Array.isArray(value.d) ? value.d : [];

  if (chunks.length === 0) {
    return '0';
  }

  const digits =
    chunks
      .map((chunk, index) => (index === 0 ? String(chunk) : String(chunk).padStart(7, '0')))
      .join('')
      .replace(/^0+/, '') || '0';

  const decimalPos = exponent + 1;
  let normalized = '';

  if (decimalPos <= 0) {
    normalized = `0.${'0'.repeat(Math.abs(decimalPos))}${digits}`;
  } else if (decimalPos >= digits.length) {
    normalized = `${digits}${'0'.repeat(decimalPos - digits.length)}`;
  } else {
    normalized = `${digits.slice(0, decimalPos)}.${digits.slice(decimalPos)}`;
  }

  if (normalized.includes('.')) {
    normalized = normalized.replace(/\.?0+$/, '');
  }

  return `${sign}${normalized || '0'}`;
}

function normalizeNumber(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (isDecimalLike(value)) {
    const parsed = Number(decimalLikeToString(value));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function fmtNumber(value?: unknown) {
  return normalizeNumber(value).toLocaleString('id-ID');
}

function toEntityId(value: unknown) {
  if (value == null) {
    return '';
  }
  const id = String(value).trim();
  if (!id || id === 'null' || id === 'undefined') {
    return '';
  }
  return id;
}

function pickIdFromUnknown(entity: unknown, extraKeys: string[] = []) {
  if (!entity || typeof entity !== 'object') {
    return '';
  }
  const record = entity as Record<string, unknown>;
  const candidates = [
    'id',
    'uuid',
    '_id',
    'warehouseId',
    'supplierId',
    'provinceId',
    'cityId',
    'contactId',
    'warehouse_id',
    'supplier_id',
    'province_id',
    'city_id',
    'contact_id',
    ...extraKeys,
  ];
  for (const key of candidates) {
    const value = toEntityId(record[key]);
    if (value) {
      return value;
    }
  }
  return '';
}

function extractRoleNames(values: unknown[]): string[] {
  return values
    .map((value) => {
      if (!value) {
        return '';
      }
      if (typeof value === 'string') {
        return value;
      }
      if (typeof value === 'object') {
        const roleName = (value as { name?: unknown })?.name;
        if (typeof roleName === 'string') {
          return roleName;
        }
        const nestedRoleName = (value as { role?: { name?: unknown } })?.role?.name;
        if (typeof nestedRoleName === 'string') {
          return nestedRoleName;
        }
      }
      return '';
    })
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

function downloadBufferAsXlsx(buffer: ArrayBuffer, filename: string) {
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export default function ReportMonitoringDoPage() {
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

  const token = useMemo(() => getTokenFromCookie(), []);

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

      const response = await fetch(
        `/api/outbound/report-monitoring-do?${query.toString()}`,
        {
          cache: 'no-store',
          headers,
        },
      );
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

  const exportToExcel = async () => {
    if (!rows.length) {
      setError('Report is empty. Nothing to export.');
      return;
    }

    setExporting(true);
    setError('');

    try {
      const ExcelJS = (await import('exceljs')).default;

      const tableHeader = [
        'No',
        'NOMOR DO',
        'TANGGAL DO',
        'BU (Bagian Usaha)',
        'TANGGAL MASUK DO',
        'MASTER CUSTOMER',
        'DESTINATION',
        'STD LEAD TIME',
        'TANGGAL KIRIM',
        'STANDARD BRG DI TERIMA',
        'AKTUAL BRG  DITERIMA SESUAI DO',
        'DITERIMA OLEH',
        'TANGGAL SCAN DO KEMBALI',
        'TANGGAL DO ASLI DITERIMA CITEUREUP',
        'KPI',
        'TANGGAL DO KEMBALI',
        'STD RETURN DO',
        'STD DO KEMBALI',
        'KPI',
        'TOTAL BARANG',
        'TOTAL KG',
      ];

      const dataRows = rows.map((row, index) => {
        const stdLeadTimeDays = Number(row.stdLeadTimeDays ?? 0);
        const stdReturnDoDays = Number(row.stdReturnDoDays ?? 0);

        const standardReceivedDate = addDaysFromDate(row.shippingDate, stdLeadTimeDays);
        const stdDoReturnDate = addDaysFromDate(row.shippingDate, stdReturnDoDays);

        const kpiDeliveryStatus = computeKpiStatus(row.actualReceivedDate, standardReceivedDate);
        const kpiDoReturnStatus = computeKpiStatus(row.doScanReturnDate, stdDoReturnDate);

        return [
          index + 1,
          row.doNumber || '',
          fmtExcelDate(row.createdAt),
          row.bu || '',
          fmtExcelDate(row.doReceivedDate),
          row.customer?.name || '',
          row.destinationCity?.name || '',
          stdLeadTimeDays,
          fmtExcelDate(row.shippingDate),
          fmtExcelDate(standardReceivedDate),
          fmtExcelDate(row.actualReceivedDate),
          row.receivedBy || '',
          fmtExcelDate(row.doScanReturnDate),
          '',
          kpiDeliveryStatus,
          fmtExcelDate(row.doScanReturnDate),
          stdReturnDoDays,
          fmtExcelDate(stdDoReturnDate),
          kpiDoReturnStatus,
          normalizeNumber(row.totalItemTypes ?? row.totalQtyPcs),
          normalizeNumber(row.totalKg),
        ];
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Monitoring DO');

      worksheet.mergeCells(1, 1, 1, 21);
      worksheet.getCell(1, 1).value = 'MONITORING DO DAN DELIVERY';
      worksheet.getCell(1, 1).font = { bold: true, size: 14 };
      worksheet.getCell(1, 1).alignment = { horizontal: 'center', vertical: 'middle' };

      worksheet.getCell(2, 1).value = 'Provinsi';
      worksheet.getCell(2, 2).value = selectedProvinceName;
      worksheet.getCell(2, 1).font = { bold: true };

      worksheet.getRow(4).values = tableHeader;
      worksheet.getRow(4).font = { bold: true };
      worksheet.getRow(4).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

      dataRows.forEach((row, i) => {
        worksheet.getRow(5 + i).values = row;
      });

      worksheet.columns = [
        { width: 14 },
        { width: 24 },
        { width: 24 },
        { width: 20 },
        { width: 20 },
        { width: 26 },
        { width: 20 },
        { width: 14 },
        { width: 15 },
        { width: 20 },
        { width: 26 },
        { width: 24 },
        { width: 22 },
        { width: 30 },
        { width: 10 },
        { width: 18 },
        { width: 14 },
        { width: 16 },
        { width: 10 },
        { width: 15 },
        { width: 12 },
      ];

      const lastRow = Math.max(4, 4 + dataRows.length);
      for (let rowIndex = 4; rowIndex <= lastRow; rowIndex += 1) {
        for (let col = 1; col <= 21; col += 1) {
          const cell = worksheet.getCell(rowIndex, col);
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          if (rowIndex > 4 && (col === 1 || col === 8 || col === 17 || col === 20 || col === 21)) {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          }
        }
      }

      const headerFill = {
        type: 'pattern' as const,
        pattern: 'solid' as const,
        fgColor: { argb: 'FFEFEFEF' },
      };
      for (let col = 1; col <= 21; col += 1) {
        worksheet.getCell(4, col).fill = headerFill;
      }

      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const buffer = await workbook.xlsx.writeBuffer();
      downloadBufferAsXlsx(buffer as ArrayBuffer, `monitoring-do-delivery-${y}${m}${d}.xlsx`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Report Monitoring DO</ToolbarPageTitle>
          <ToolbarDescription>
            Monitor DO and delivery with Warehouse, Supplier, Province, City, Status, and DO Received Date filters.
          </ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button type="button" variant="outline" onClick={fetchReport} disabled={loading}>
            <RefreshCw className="mr-2 size-4" />
            Refresh
          </Button>
          <Button type="button" onClick={exportToExcel} disabled={exporting || loading || rows.length === 0}>
            <Download className="mr-2 size-4" />
            Export to Excel
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="rounded-lg border bg-card p-5 md:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
          <div className="space-y-2">
            <Label>Warehouse</Label>
            <AutocompleteSelect
              value={filters.warehouseId}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, warehouseId: value }))}
              clearable={isAdminRole}
              options={warehouses.flatMap((warehouse) => {
                const value = pickIdFromUnknown(warehouse);
                if (!value) {
                  return [];
                }
                return {
                  value,
                  label: warehouse.name,
                };
              })}
              placeholder={loadingOptions ? 'Loading...' : 'All warehouses'}
              searchPlaceholder="Search warehouse..."
              emptyText="No warehouse found"
              disabled={loadingOptions || (!isAdminRole && Boolean(lockedWarehouseId))}
            />
            {!isAdminRole && lockedWarehouseId ? (
              <p className="text-xs text-muted-foreground">
                Warehouse dikunci berdasarkan user login.
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label>Supplier</Label>
            <AutocompleteSelect
              value={filters.supplierId}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, supplierId: value }))}
              clearable
              options={suppliers.flatMap((supplier) => {
                const value = pickIdFromUnknown(supplier, ['supplierId', 'contactId']);
                if (!value) {
                  return [];
                }
                const code = String(supplier.code ?? '').trim();
                const name = String(supplier.name ?? '').trim();
                return {
                  value,
                  label: code ? `${code} - ${name}` : name || value,
                };
              })}
              placeholder={loadingOptions ? 'Loading...' : 'All suppliers'}
              searchPlaceholder="Search supplier..."
              emptyText="No supplier found"
              disabled={loadingOptions}
            />
          </div>

          <div className="space-y-2">
            <Label>Province</Label>
            <AutocompleteSelect
              value={filters.provinceId}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, provinceId: value, cityId: '' }))
              }
              clearable
              options={provinces.flatMap((province) => {
                const value = pickIdFromUnknown(province, ['provinceId']);
                if (!value) {
                  return [];
                }
                return {
                  value,
                  label: String(province.name ?? value),
                };
              })}
              placeholder={loadingOptions ? 'Loading...' : 'All provinces'}
              searchPlaceholder="Search province..."
              emptyText="No province found"
              disabled={loadingOptions}
            />
          </div>

          <div className="space-y-2">
            <Label>City</Label>
            <AutocompleteSelect
              value={filters.cityId}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, cityId: value }))}
              clearable
              options={cities.flatMap((city) => {
                const value = pickIdFromUnknown(city, ['cityId']);
                if (!value) {
                  return [];
                }
                return {
                  value,
                  label: String(city.name ?? value),
                };
              })}
              placeholder="All cities"
              searchPlaceholder="Search city..."
              emptyText="No city found"
              disabled={loadingOptions}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <AutocompleteSelect
              value={filters.status}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
              clearable
              options={STATUS_OPTIONS.map((status) => ({
                value: status,
                label: status,
              }))}
              placeholder="All status"
              searchPlaceholder="Search status..."
              emptyText="No status found"
              disabled={loadingOptions}
            />
          </div>

          <div className="space-y-2">
            <Label>DO Received Date</Label>
            <Input
              type="date"
              value={filters.doReceivedDate}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, doReceivedDate: event.target.value }))
              }
            />
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <Button type="button" onClick={fetchReport} disabled={loading}>
            Show Data
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setFilters({
                ...initialFilter,
                warehouseId: isAdminRole ? '' : lockedWarehouseId,
              })
            }
            disabled={loading}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="border-b px-5 py-4 text-sm text-muted-foreground md:px-6">
          {loading ? 'Loading report data...' : `${rows.length} rows found`}
        </div>

        <div className="p-4 md:p-6">
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>DO Number</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Province</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>DO Received Date</TableHead>
                  <TableHead className="text-right">Total Items</TableHead>
                  <TableHead className="text-right">Total KG</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!loading && rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                      No report data found.
                    </TableCell>
                  </TableRow>
                ) : null}

                {rows.map((row, index) => (
                  <TableRow
                    key={`${row.uuid || row.doNumber || 'row'}-${row.doReceivedDate || 'date'}-${index}`}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.doNumber || '-'}</TableCell>
                    <TableCell>
                      {row.sourceWarehouses?.length
                        ? row.sourceWarehouses.map((item) => item.name).join(', ')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {row.sourceSuppliers?.length
                        ? row.sourceSuppliers.map((item) => item.name).join(', ')
                        : '-'}
                    </TableCell>
                    <TableCell>{row.destinationCity?.province?.name || '-'}</TableCell>
                    <TableCell>{row.destinationCity?.name || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={outboundStatusBadgeVariant(row.status)}>{row.status || '-'}</Badge>
                    </TableCell>
                    <TableCell>{fmtDate(row.doReceivedDate)}</TableCell>
                    <TableCell className="text-right">
                      {fmtNumber(row.totalItemTypes ?? row.totalQtyPcs)}
                    </TableCell>
                    <TableCell className="text-right">{fmtNumber(row.totalKg)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
