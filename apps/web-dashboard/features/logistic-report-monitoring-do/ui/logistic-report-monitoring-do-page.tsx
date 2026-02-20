'use client';

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
import { useLogisticReportMonitoringDo } from '@/features/logistic-report-monitoring-do/hooks/use-logistic-report-monitoring-do';
import { initialFilter, STATUS_OPTIONS } from '@/features/logistic-report-monitoring-do/model/types';
import {
  fmtDate,
  fmtNumber,
  outboundStatusBadgeVariant,
  pickIdFromUnknown,
} from '@/features/logistic-report-monitoring-do/model/utils';

export default function ReportMonitoringDoPage() {
  const {
    cities,
    error,
    exportToExcel,
    exporting,
    fetchReport,
    filters,
    isAdminRole,
    loading,
    loadingOptions,
    lockedWarehouseId,
    provinces,
    rows,
    setFilters,
    suppliers,
    warehouses,
  } = useLogisticReportMonitoringDo();

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
              <p className="text-xs text-muted-foreground">Warehouse dikunci berdasarkan user login.</p>
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
