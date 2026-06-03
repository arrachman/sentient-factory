'use client';

/**
 * Freight Payable (PP) — list + coming-soon form.
 * URL: /purchasing/freight-payables · /new · /:id.
 * Backend: pur_invoices (freight cost payable to 3rd party).
 */

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { ErpListLayout, type ListPaginationConfig, type SummaryConfig } from '@/components/organisms/erp-list-layout';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty, CodeLinkCell } from '@/components/organisms/table';
import { RowActionsMenu, RowContextMenu, type RowActionItem } from '@/components/molecules/row-actions-menu';
import { type TrxFormPageProps, trxNewRoute, trxEditRoute } from '@/lib/trx-route';
import { useErpList } from '@/lib/use-erp-list';
import { useListPagination } from '@/lib/use-list-pagination';
import { formatNumber } from '@/lib/format';
import { statusBadgeVariant, statusLabel } from '@/lib/status';
import { listPurInvoices, type ErpPurInvoice } from '@/lib/api/pur-invoices';

const BASE = '/purchasing/freight-payables';

export function ErpFreightPayablesPage({ formMode, onNavigate }: TrxFormPageProps = {}) {
  const mode: 'list' | 'form' = formMode ? 'form' : 'list';
  const goList = React.useCallback(() => onNavigate?.(BASE), [onNavigate]);
  const [search, setSearch] = React.useState('');
  const { page, pageSize, setPage, setPageSize } = useListPagination('pur-freight-payables');
  const [debouncedSearch, setDebouncedSearch] = React.useState(search);
  React.useEffect(() => { const t = setTimeout(() => setDebouncedSearch(search), 300); return () => clearTimeout(t); }, [search]);

  const { rows, meta, loading, error, reload } = useErpList(
    () => listPurInvoices({ page, limit: pageSize, search: debouncedSearch || undefined, sortBy: 'docDate', sortDir: 'desc' }),
    [page, pageSize, debouncedSearch],
  );
  React.useEffect(() => { setPage(1); }, [debouncedSearch, pageSize]);

  const [focused, setFocused] = React.useState(-1);
  const openEdit = (r: ErpPurInvoice) => onNavigate?.(trxEditRoute(BASE, r.id));
  const rowActions = (r: ErpPurInvoice): RowActionItem[] => [{ label: 'Lihat', onSelect: () => openEdit(r) }];

  if (mode === 'form') {
    return (
      <div className="page">
        <div className="page-header">
          <h1 className="page-title flex items-center gap-2">
            <button className="iconbtn" onClick={goList} style={{ fontSize: 18, lineHeight: 1 }}>←</button>
            Biaya Pengiriman Terutang <span className="code-tag">PP</span>
          </h1>
        </div>
        <div className="page-body p-8 text-center text-muted">
          <div className="text-lg font-medium mb-2">Form Freight Payable — coming soon</div>
          <div className="text-sm">Form ini me-reuse endpoint Faktur Pembelian (pur_invoices).</div>
          <button className="btn mt-4" onClick={goList}>← Kembali ke daftar</button>
        </div>
      </div>
    );
  }

  const totalRows = meta?.total ?? 0;
  const pageCount = meta?.totalPages ?? 1;
  const summary: SummaryConfig = { metricLabel: 'Σ Biaya Pengiriman', rowCount: rows.length, totalCount: totalRows };
  const pagination: ListPaginationConfig = { page, pageCount, pageSize, totalRows, onPage: setPage, onPageSize: setPageSize };

  return (
    <ErpListLayout title="Biaya Pengiriman Terutang (PP)" code="PP" loading={loading} error={error}
      search={search} onSearch={setSearch} onAdd={() => onNavigate?.(trxNewRoute(BASE))} onRefresh={reload}
      toolbar={null} summary={summary} pagination={pagination}
      keyboardRows={{ rowCount: rows.length, focusedIndex: focused, onFocusChange: setFocused, onToggle: () => null, onOpen: (i) => rows[i] && openEdit(rows[i]) }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No Transaksi</TableHead><TableHead>Tanggal</TableHead>
            <TableHead>Supplier</TableHead><TableHead>Uraian</TableHead>
            <TableHead style={{ textAlign: 'right' }}>Total</TableHead>
            <TableHead>Status</TableHead><TableHead style={{ width: 44 }} />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? <TableEmpty colSpan={7} /> : rows.map((r, i) => {
            const actions = rowActions(r);
            return (
              <RowContextMenu key={r.id} items={actions}>
                <TableRow style={focused === i ? { boxShadow: 'inset 2px 0 0 var(--primary)' } : undefined} className="cursor-pointer">
                  <CodeLinkCell code={r.docNumber} onOpen={() => openEdit(r)} />
                  <TableCell>{r.docDate.slice(0, 10)}</TableCell>
                  <TableCell>{r.supplier?.name ?? '—'}</TableCell>
                  <TableCell>{r.description ?? '—'}</TableCell>
                  <TableCell className="tabular-nums" style={{ textAlign: 'right' }}>{formatNumber(Number(r.grandTotal), 2)}</TableCell>
                  <TableCell><Badge variant={statusBadgeVariant(r.status)} dot>{statusLabel(r.status)}</Badge></TableCell>
                  <TableCell><RowActionsMenu items={actions} /></TableCell>
                </TableRow>
              </RowContextMenu>
            );
          })}
        </TableBody>
      </Table>
    </ErpListLayout>
  );
}
