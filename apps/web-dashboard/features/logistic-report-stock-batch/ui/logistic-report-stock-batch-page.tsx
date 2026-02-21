'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { Button } from '@/components/ui/button';
import { StandardPagination } from '@/components/ui/standard-pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useReportStockBatch } from '@/features/logistic-stock-report/hooks/use-report-stock-batch';
import { fmtDate, fmtNumber, formatProductLabel } from '@/features/logistic-stock-report/model/utils';
import { StockReportFilters } from '@/features/logistic-stock-report/ui/stock-report-filters';
import { MIN_PAGE_LIMIT, PAGE_LIMIT_OPTIONS } from '@/shared/constants/pagination';

export function LogisticReportStockBatchPage() {
  const {
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
    error,
    fetchReport,
    exportToExcel,
    resetFilters,
  } = useReportStockBatch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(MIN_PAGE_LIMIT);
  const totalPages = Math.max(1, Math.ceil(rows.length / limit));

  useEffect(() => {
    setPage((current) => Math.min(Math.max(1, current), totalPages));
  }, [totalPages]);

  const pagedRows = useMemo(() => {
    const start = (page - 1) * limit;
    return rows.slice(start, start + limit);
  }, [limit, page, rows]);

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

      <StockReportFilters
        filters={filters}
        onChange={setFilters}
        warehouses={warehouses}
        suppliers={suppliers}
        items={items}
        loading={loading}
        loadingOptions={loadingOptions}
        isAdminRole={isAdminRole}
        lockedWarehouseId={lockedWarehouseId}
        onShowData={fetchReport}
        onReset={resetFilters}
      />

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
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Supplier</TableHead>
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
                    <TableCell colSpan={11} className="h-24 text-center text-muted-foreground">
                      No report data found.
                    </TableCell>
                  </TableRow>
                ) : null}

                {pagedRows.map((row, index) => (
                  <TableRow
                    key={`${String(row.uuid || '')}-${String(row.batch?.batchNumber || '')}-${String(row.transactionDate || '')}-${index}`}
                  >
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell>{row.warehouse?.name || '-'}</TableCell>
                    <TableCell>{row.supplierNames?.length ? row.supplierNames.join(', ') : '-'}</TableCell>
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
          <StandardPagination
            page={page}
            limit={limit}
            totalPages={totalPages}
            totalItems={rows.length}
            loading={loading}
            onPageChange={(nextPage) => setPage(Math.min(Math.max(1, nextPage), totalPages))}
            onLimitChange={(nextLimit) => {
              if (!PAGE_LIMIT_OPTIONS.includes(nextLimit as (typeof PAGE_LIMIT_OPTIONS)[number])) {
                return;
              }
              setLimit(nextLimit);
              setPage(1);
            }}
          />
        </div>
      </div>
    </div>
  );
}
