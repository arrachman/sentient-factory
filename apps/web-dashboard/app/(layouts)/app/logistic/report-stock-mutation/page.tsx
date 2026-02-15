'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Button } from '@/components/ui/button';
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

type WarehouseOption = {
  uuid: string;
  name: string;
};

type SupplierOption = {
  uuid: string;
  code: string;
  name: string;
};

type ItemOption = {
  uuid: string;
  code: string;
  name: string;
};

type MutationRow = {
  itemId: string;
  warehouseId: string;
  supplierNames?: string[];
  description: string;
  batchNumber: string;
  expiryDate?: string | null;
  total: number;
  actualToday: number;
  actualThreeMonths: number;
  actualSixMonths: number;
  expire: string;
  remarks: string;
};

type FilterState = {
  warehouseId: string;
  supplierId: string;
  itemId: string;
};

const initialFilter: FilterState = {
  warehouseId: '',
  supplierId: '',
  itemId: '',
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

function fmtNumber(value?: number) {
  const n = Number(value ?? 0);
  if (Number.isNaN(n)) {
    return '0';
  }
  return n.toLocaleString('id-ID');
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

export default function ReportStockMutationPage() {
  const [filters, setFilters] = useState<FilterState>(initialFilter);
  const [rows, setRows] = useState<MutationRow[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseOption[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [items, setItems] = useState<ItemOption[]>([]);

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
      const [warehouseRes, supplierRes, itemRes] = await Promise.all([
        fetch('/api/master-data-warehouses?page=1&limit=100', {
          cache: 'no-store',
          headers,
        }),
        fetch('/api/master-data-contacts?page=1&limit=100&type=supplier', {
          cache: 'no-store',
          headers,
        }),
        fetch('/api/master-data-items?page=1&limit=200', {
          cache: 'no-store',
          headers,
        }),
      ]);

      const [warehousePayload, supplierPayload, itemPayload] = await Promise.all([
        warehouseRes.json().catch(() => null),
        supplierRes.json().catch(() => null),
        itemRes.json().catch(() => null),
      ]);

      if (!warehouseRes.ok || !warehousePayload?.success) {
        throw new Error(warehousePayload?.message || 'Failed to load warehouse options');
      }
      if (!supplierRes.ok || !supplierPayload?.success) {
        throw new Error(supplierPayload?.message || 'Failed to load supplier options');
      }
      if (!itemRes.ok || !itemPayload?.success) {
        throw new Error(itemPayload?.message || 'Failed to load item options');
      }

      setWarehouses(Array.isArray(warehousePayload.data) ? warehousePayload.data : []);
      setSuppliers(Array.isArray(supplierPayload.data) ? supplierPayload.data : []);
      setItems(Array.isArray(itemPayload.data) ? itemPayload.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load options');
    } finally {
      setLoadingOptions(false);
    }
  }, [headers]);

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
      if (filters.itemId) {
        query.set('itemId', filters.itemId);
      }

      const response = await fetch(`/api/outbound/report-stock-mutation?${query.toString()}`, {
        cache: 'no-store',
        headers,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load stock mutation report');
      }

      setRows(Array.isArray(payload?.data) ? payload.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stock mutation report');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [filters, headers]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const exportToExcel = async () => {
    if (!rows.length) {
      setError('Report is empty. Nothing to export.');
      return;
    }

    setExporting(true);
    setError('');

    try {
      const ExcelJS = (await import('exceljs')).default;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Stock Mutation Report');
      worksheet.columns = [
        { width: 8 },
        { width: 34 },
        { width: 20 },
        { width: 14 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 16 },
        { width: 24 },
      ];

      worksheet.getCell(1, 1).value = 'DETAIL STOCK PERTANGGAL :';
      worksheet.getCell(1, 1).font = { bold: true };
      worksheet.mergeCells(1, 1, 1, 10);

      worksheet.getRow(3).height = 22;
      worksheet.getRow(4).height = 22;

      worksheet.mergeCells(3, 1, 4, 1);
      worksheet.mergeCells(3, 2, 4, 2);
      worksheet.mergeCells(3, 3, 3, 5);
      worksheet.mergeCells(3, 6, 3, 8);
      worksheet.mergeCells(3, 9, 4, 9);
      worksheet.mergeCells(3, 10, 4, 10);

      worksheet.getCell(3, 1).value = 'No.';
      worksheet.getCell(3, 2).value = 'Description';
      worksheet.getCell(3, 3).value = 'Stock Card';
      worksheet.getCell(3, 6).value = 'Actual Stock';
      worksheet.getCell(3, 9).value = 'Expire';
      worksheet.getCell(3, 10).value = 'Remarks';

      worksheet.getCell(4, 3).value = 'No. Batch';
      worksheet.getCell(4, 4).value = 'Exp. Dated';
      worksheet.getCell(4, 5).value = 'Total';
      worksheet.getCell(4, 6).value = 'To day';
      worksheet.getCell(4, 7).value = '3 Mth';
      worksheet.getCell(4, 8).value = '6 Mth';

      for (let col = 1; col <= 10; col += 1) {
        worksheet.getCell(3, col).font = { bold: true };
        worksheet.getCell(3, col).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell(3, col).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEFEFEF' },
        };
        worksheet.getCell(4, col).font = { bold: true };
        worksheet.getCell(4, col).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell(4, col).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEFEFEF' },
        };
      }

      let rowCursor = 5;
      rows.forEach((row, index) => {
        worksheet.getRow(rowCursor).values = [
          index + 1,
          row.description || '',
          row.batchNumber || '',
          fmtExcelDate(row.expiryDate),
          Number(row.total ?? 0),
          Number(row.actualToday ?? 0),
          Number(row.actualThreeMonths ?? 0),
          Number(row.actualSixMonths ?? 0),
          row.expire || '',
          row.remarks || '',
        ];
        rowCursor += 1;
      });

      for (let r = 3; r < rowCursor; r += 1) {
        for (let c = 1; c <= 10; c += 1) {
          const cell = worksheet.getCell(r, c);
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          if (r >= 5 && (c === 1 || c === 3 || c === 4 || c === 5 || c === 6 || c === 7 || c === 8)) {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          }
        }
      }

      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const buffer = await workbook.xlsx.writeBuffer();
      downloadBufferAsXlsx(buffer as ArrayBuffer, `report-stock-mutation-${y}${m}${d}.xlsx`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Report Stock Mutation</ToolbarPageTitle>
          <ToolbarDescription>
            Detail stok per batch dengan kategori actual stock dan status expire.
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
            <Label>Item</Label>
            <AutocompleteSelect
              value={filters.itemId}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, itemId: value }))}
              options={items.map((item) => ({
                value: item.uuid,
                label: `${item.code} - ${item.name}`,
              }))}
              placeholder={loadingOptions ? 'Loading...' : 'All items'}
              searchPlaceholder="Search item..."
              emptyText="No item found"
              disabled={loadingOptions}
            />
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <Button type="button" onClick={fetchReport} disabled={loading}>
            Show Data
          </Button>
          <Button type="button" variant="outline" onClick={() => setFilters(initialFilter)} disabled={loading}>
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
                  <TableHead>No.</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>No. Batch</TableHead>
                  <TableHead>Exp. Dated</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">To day</TableHead>
                  <TableHead className="text-right">3 Mth</TableHead>
                  <TableHead className="text-right">6 Mth</TableHead>
                  <TableHead>Expire</TableHead>
                  <TableHead>Remarks</TableHead>
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
                  <TableRow key={`${row.itemId}-${row.warehouseId}-${row.batchNumber}-${index}`}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.description || '-'}</TableCell>
                    <TableCell>{row.batchNumber || '-'}</TableCell>
                    <TableCell>{fmtDate(row.expiryDate)}</TableCell>
                    <TableCell className="text-right">{fmtNumber(row.total)}</TableCell>
                    <TableCell className="text-right">{fmtNumber(row.actualToday)}</TableCell>
                    <TableCell className="text-right">{fmtNumber(row.actualThreeMonths)}</TableCell>
                    <TableCell className="text-right">{fmtNumber(row.actualSixMonths)}</TableCell>
                    <TableCell>{row.expire || '-'}</TableCell>
                    <TableCell>{row.remarks || '-'}</TableCell>
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
