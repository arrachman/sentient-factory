'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
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
  uuid: string;
  name: string;
};

type CityOption = {
  uuid: string;
  name: string;
  province?: {
    uuid?: string;
    name?: string;
  } | null;
};

type WarehouseOption = {
  uuid: string;
  name: string;
};

type SupplierOption = {
  uuid: string;
  code: string;
  name: string;
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
  totalQtyPcs?: string | number | null;
  totalKg?: string | number | null;
  sourceSuppliers?: Array<{ id: string; name: string }>;
  sourceWarehouses?: Array<{ id: string; name: string }>;
  customer?: {
    name?: string;
  } | null;
};

type FilterState = {
  warehouseId: string;
  supplierId: string;
  provinceId: string;
  cityId: string;
  doReceivedDate: string;
};

const initialFilter: FilterState = {
  warehouseId: '',
  supplierId: '',
  provinceId: '',
  cityId: '',
  doReceivedDate: '',
};

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

function fmtExcelDate(value?: string | null) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
}

function fmtNumber(value?: string | number | null) {
  const n = Number(value ?? 0);
  if (Number.isNaN(n)) {
    return '0';
  }
  return n.toLocaleString('id-ID');
}

function mapKpi(value?: string | null) {
  if (!value) {
    return '-';
  }

  if (value.toUpperCase() === 'ONTIME') {
    return 'ON TIME';
  }

  if (value.toUpperCase() === 'LATE') {
    return 'LATE';
  }

  return value;
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

      const mappedWarehouseIdRaw =
        profilePayload?.data?.warehouseId ?? profilePayload?.data?.user?.warehouseId ?? '';
      const mappedWarehouseId = String(mappedWarehouseIdRaw).trim();
      const defaultWarehouseId =
        mappedWarehouseId && mappedWarehouseId !== 'null' && mappedWarehouseId !== 'undefined'
          ? mappedWarehouseId
          : '';

      if (defaultWarehouseId) {
        setFilters((prev) => ({
          ...prev,
          warehouseId: prev.warehouseId || defaultWarehouseId,
        }));
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
      if (filters.warehouseId) {
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
  }, [filters, headers]);

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
    const selected = provinces.find((item) => item.uuid === filters.provinceId);
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

      const dataRows = rows.map((row, index) => [
        index + 1,
        row.doNumber || '',
        fmtExcelDate(row.createdAt),
        row.bu || '',
        fmtExcelDate(row.doReceivedDate),
        row.customer?.name || '',
        row.destinationCity?.name || '',
        Number(row.stdLeadTimeDays ?? 0),
        fmtExcelDate(row.shippingDate),
        fmtExcelDate(row.standardReceivedDate),
        fmtExcelDate(row.actualReceivedDate),
        row.receivedBy || '',
        fmtExcelDate(row.doScanReturnDate),
        '',
        mapKpi(row.kpiDeliveryStatus),
        fmtExcelDate(row.doScanReturnDate),
        Number(row.stdReturnDoDays ?? 0),
        fmtExcelDate(row.stdDoReturnDate),
        mapKpi(row.kpiDoReturnStatus),
        Number(row.totalQtyPcs ?? 0),
        Number(row.totalKg ?? 0),
      ]);

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
            Monitor DO and delivery with Warehouse, Supplier, Province, City, and DO Received Date filters.ab
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="space-y-2">
            <Label>Warehouse</Label>
            <AutocompleteSelect
              value={filters.warehouseId}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, warehouseId: value }))}
              options={warehouses.map((warehouse) => ({
                value: warehouse.uuid,
                label: warehouse.name,
              }))}
              placeholder={loadingOptions ? 'Loading...' : 'All warehouses'}
              searchPlaceholder="Search warehouse..."
              emptyText="No warehouse found"
              disabled={loadingOptions}
            />
          </div>

          <div className="space-y-2">
            <Label>Supplier</Label>
            <AutocompleteSelect
              value={filters.supplierId}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, supplierId: value }))}
              options={suppliers.map((supplier) => ({
                value: supplier.uuid,
                label: `${supplier.code} - ${supplier.name}`,
              }))}
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
              options={provinces.map((province) => ({
                value: province.uuid,
                label: province.name,
              }))}
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
              options={cities.map((city) => ({
                value: city.uuid,
                label: city.name,
              }))}
              placeholder="All cities"
              searchPlaceholder="Search city..."
              emptyText="No city found"
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
            onClick={() => setFilters(initialFilter)}
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
                  <TableHead>DO Received Date</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Province</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Total Items</TableHead>
                  <TableHead className="text-right">Total KG</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!loading && rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                      No report data found.
                    </TableCell>
                  </TableRow>
                ) : null}

                {rows.map((row, index) => (
                  <TableRow key={row.uuid}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.doNumber || '-'}</TableCell>
                    <TableCell>{fmtDate(row.doReceivedDate)}</TableCell>
                    <TableCell>{row.destinationCity?.name || '-'}</TableCell>
                    <TableCell>{row.destinationCity?.province?.name || '-'}</TableCell>
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
                    <TableCell className="text-right">{fmtNumber(row.totalQtyPcs)}</TableCell>
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
