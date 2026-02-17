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
  id?: string | number;
  uuid?: string | number;
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

type ReportRow = {
  uuid: string;
  item?: {
    uuid?: string;
    code?: string;
    name?: string;
    uom?: {
      code?: string;
      name?: string;
    } | null;
  } | null;
  warehouse?: {
    uuid?: string;
    code?: string;
    name?: string;
  } | null;
  batch?: {
    uuid?: string;
    batchNumber?: string;
  } | null;
  supplierNames?: string[];
  transactionDate?: string;
  mmfOrDo?: string;
  description?: string;
  inbound?: number;
  outbound?: number;
  balance?: number;
  replenish?: string;
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

function fmtDate(value?: string) {
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

function fmtExcelDate(value?: string) {
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

function formatProductLabel(row?: ReportRow | null) {
  const parts = [
    String(row?.batch?.batchNumber ?? '').trim(),
    String(row?.item?.code ?? '').trim(),
    String(row?.item?.name ?? '').trim(),
    String(row?.item?.uom?.code ?? '').trim(),
  ].filter(Boolean);
  return parts.join(' ');
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

function pickEntityId(entity?: { id?: string | number; uuid?: string | number } | null) {
  return toEntityId(entity?.id ?? entity?.uuid);
}

export default function ReportStockBatchPage() {
  const [filters, setFilters] = useState<FilterState>(initialFilter);
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [lockedWarehouseId, setLockedWarehouseId] = useState('');
  const [isAdminRole, setIsAdminRole] = useState(false);
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
      const [profileRes, warehouseRes, supplierRes, itemRes] = await Promise.all([
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
        fetch('/api/master-data-items?page=1&limit=100', {
          cache: 'no-store',
          headers,
        }),
      ]);

      const [profilePayload, warehousePayload, supplierPayload, itemPayload] = await Promise.all([
        profileRes.json().catch(() => null),
        warehouseRes.json().catch(() => null),
        supplierRes.json().catch(() => null),
        itemRes.json().catch(() => null),
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
      if (!itemRes.ok || !itemPayload?.success) {
        throw new Error(itemPayload?.message || 'Failed to load item options');
      }

      const nextWarehouses: WarehouseOption[] = Array.isArray(warehousePayload.data) ? warehousePayload.data : [];
      setWarehouses(nextWarehouses);
      setSuppliers(Array.isArray(supplierPayload.data) ? supplierPayload.data : []);
      setItems(Array.isArray(itemPayload.data) ? itemPayload.data : []);

      const profileData = profilePayload?.data ?? {};
      const roleNames = [
        ...(Array.isArray(profileData?.roles) ? profileData.roles : []),
        ...(Array.isArray(profileData?.user?.roles) ? profileData.user.roles : []),
      ]
        .map((value) => String(value ?? '').trim().toLowerCase())
        .filter(Boolean);
      const hasAdminRole = roleNames.includes('admin');
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
      const optionIds = new Set(nextWarehouses.map((warehouse) => pickEntityId(warehouse)).filter(Boolean));
      const profileWarehouseName = String(
        profileData?.warehouse?.name ?? profileData?.user?.warehouse?.name ?? '',
      )
        .trim()
        .toLowerCase();
      const warehouseByName = nextWarehouses.find(
        (warehouse) =>
          profileWarehouseName &&
          String(warehouse?.name ?? '').trim().toLowerCase() === profileWarehouseName,
      );
      const defaultWarehouseId =
        warehouseCandidates.find((candidate) => optionIds.has(candidate)) ||
        pickEntityId(warehouseByName) ||
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
      if (filters.itemId) {
        query.set('itemId', filters.itemId);
      }

      const response = await fetch(`/api/outbound/report-stock-batch?${query.toString()}`, {
        cache: 'no-store',
        headers,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load stock batch report');
      }

      setRows(Array.isArray(payload?.data) ? payload.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stock batch report');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [filters, headers, isAdminRole, lockedWarehouseId]);

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
      const worksheet = workbook.addWorksheet('Stock Batch Report');
      worksheet.columns = [
        { width: 14 },
        { width: 20 },
        { width: 32 },
        { width: 14 },
        { width: 14 },
        { width: 14 },
        { width: 14 },
      ];

      const groups = new Map<string, ReportRow[]>();
      rows.forEach((row) => {
        const key = `${row.item?.uuid ?? ''}::${row.batch?.batchNumber ?? ''}::${row.warehouse?.uuid ?? ''}`;
        const current = groups.get(key) ?? [];
        current.push(row);
        groups.set(key, current);
      });

      let rowCursor = 1;
      groups.forEach((groupRows: ReportRow[]) => {
        const first = groupRows[0];
        const productName = formatProductLabel(first);

        worksheet.getCell(rowCursor, 1).value = 'Produk';
        worksheet.getCell(rowCursor, 2).value = productName;
        worksheet.getCell(rowCursor, 1).font = { bold: true };
        worksheet.mergeCells(rowCursor, 2, rowCursor, 7);

        rowCursor += 1;

        rowCursor += 1;

        worksheet.getRow(rowCursor).values = [
          'Tanggal',
          'MMF/DO',
          'Keterangan',
          'Inbound',
          'Outbound',
          'Balance',
          'Replenish',
        ];
        worksheet.getRow(rowCursor).font = { bold: true };
        worksheet.getRow(rowCursor).alignment = { horizontal: 'center', vertical: 'middle' };
        for (let col = 1; col <= 7; col += 1) {
          worksheet.getCell(rowCursor, col).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEFEFEF' },
          };
        }

        rowCursor += 1;

        groupRows.forEach((row) => {
          worksheet.getRow(rowCursor).values = [
            fmtExcelDate(row.transactionDate),
            row.mmfOrDo || '',
            row.description || '',
            Number(row.inbound ?? 0),
            Number(row.outbound ?? 0),
            Number(row.balance ?? 0),
            row.replenish || '',
          ];
          rowCursor += 1;
        });

        rowCursor += 1;
      });

      for (let r = 1; r <= rowCursor; r += 1) {
        for (let c = 1; c <= 7; c += 1) {
          const cell = worksheet.getCell(r, c);
          if (r > 0 && worksheet.getRow(r).values?.length) {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          }
        }
      }

      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const buffer = await workbook.xlsx.writeBuffer();
      downloadBufferAsXlsx(buffer as ArrayBuffer, `report-stock-batch-${y}${m}${d}.xlsx`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Report Stock Batch</ToolbarPageTitle>
          <ToolbarDescription>
            Kartu stok batch berdasarkan filter Warehouse, Supplier, dan Item.
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
              options={warehouses.flatMap((warehouse) => {
                const value = pickEntityId(warehouse);
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
                  <TableHead>Produk</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>MMF/DO</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead className="text-right">Inbound</TableHead>
                  <TableHead className="text-right">Outbound</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Replenish</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!loading && rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      No report data found.
                    </TableCell>
                  </TableRow>
                ) : null}

                {rows.map((row, index) => (
                  <TableRow
                    key={`${String(row.uuid || '')}-${String(row.batch?.batchNumber || '')}-${String(row.transactionDate || '')}-${index}`}
                  >
                    <TableCell>{formatProductLabel(row) || '-'}</TableCell>
                    <TableCell>{fmtDate(row.transactionDate)}</TableCell>
                    <TableCell>{row.mmfOrDo || '-'}</TableCell>
                    <TableCell>{row.description || '-'}</TableCell>
                    <TableCell className="text-right">{fmtNumber(row.inbound)}</TableCell>
                    <TableCell className="text-right">{fmtNumber(row.outbound)}</TableCell>
                    <TableCell className="text-right">{fmtNumber(row.balance)}</TableCell>
                    <TableCell>{row.replenish || '-'}</TableCell>
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
