'use client';

/**
 * Request for Quotation (RFQ) — list + form. URL: /purchasing/rfqs · /new · /:id.
 * Lines = invited suppliers (pur_rfq_suppliers). The form displays a "coming soon"
 * message for the line editor; the list is fully functional.
 */

import * as React from 'react';
import { Icon } from '@/components/ui/icons';
import { Badge } from '@/components/ui/badge';
import {
  ErpListLayout, type ListPaginationConfig, type SummaryConfig,
} from '@/components/organisms/erp-list-layout';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty, CodeLinkCell,
} from '@/components/organisms/table';
import { RowActionsMenu, RowContextMenu, type RowActionItem } from '@/components/molecules/row-actions-menu';
import { confirmAction, notify } from '@/lib/feedback';
import { cashBankWorkflowActions } from '@/lib/fin-cash-bank-workflow';
import { trxNewRoute, trxEditRoute, type TrxFormPageProps } from '@/lib/trx-route';
import { useErpList } from '@/lib/use-erp-list';
import { useListPagination } from '@/lib/use-list-pagination';
import { statusBadgeVariant, statusLabel } from '@/lib/status';
import {
  listPurRfqs, deletePurRfq, transitionPurRfq, type ErpPurRfq,
} from '@/lib/api/pur-rfqs';

const BASE = '/purchasing/rfqs';

export function ErpRfqsPage({ formMode, recordId, onNavigate }: TrxFormPageProps = {}) {
  const mode: 'list' | 'form' = formMode ? 'form' : 'list';

  const goList = React.useCallback(() => onNavigate?.(BASE), [onNavigate]);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const { page, pageSize, setPage, setPageSize } = useListPagination('pur-rfqs');

  const [debouncedSearch, setDebouncedSearch] = React.useState(search);
  React.useEffect(() => { const t = setTimeout(() => setDebouncedSearch(search), 300); return () => clearTimeout(t); }, [search]);

  const { rows, meta, loading, error, reload } = useErpList(
    () => listPurRfqs({ page, limit: pageSize, search: debouncedSearch || undefined, status: (statusFilter || undefined) as ErpPurRfq['status'] | undefined, sortBy: 'docDate', sortDir: 'desc' }),
    [page, pageSize, debouncedSearch, statusFilter],
  );

  React.useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter, pageSize]);

  const [focused, setFocused] = React.useState(-1);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const totalRows = meta?.total ?? 0;
  const pageCount = meta?.totalPages ?? 1;

  const openEdit = (r: ErpPurRfq) => onNavigate?.(trxEditRoute(BASE, r.id));

  const handleDelete = (r: ErpPurRfq) => {
    confirmAction({
      title: 'Hapus RFQ?', message: `${r.docNumber} akan dihapus permanen.`,
      variant: 'danger', confirmLabel: 'Hapus', confirmIcon: 'trash',
      onConfirm: async () => {
        try { await deletePurRfq(r.id); notify('RFQ dihapus', 'success'); reload(); }
        catch (e: unknown) { notify(e instanceof Error ? e.message : 'Gagal', 'danger'); }
      },
    });
  };

  const runTransition = async (r: ErpPurRfq, action: string) => {
    let reason: string | undefined;
    if (action === 'REJECT') { reason = window.prompt('Alasan menolak?') ?? undefined; if (!reason) return; }
    try { await transitionPurRfq(r.id, action as never, reason); notify(`Berhasil: ${r.docNumber}`, 'success'); reload(); }
    catch (e: unknown) { notify(e instanceof Error ? e.message : 'Gagal', 'danger'); }
  };

  const rowActions = (r: ErpPurRfq): RowActionItem[] => [
    { label: 'Lihat', onSelect: () => openEdit(r) },
    ...cashBankWorkflowActions(r.status as never, (a) => runTransition(r, a)),
    { label: 'Hapus', onSelect: () => handleDelete(r), danger: true, separatorBefore: true },
  ];

  // Form mode: RFQ line editor (supplier list) belum ada; tampilkan pesan sementara.
  if (mode === 'form') {
    return (
      <div className="page">
        <div className="page-header">
          <h1 className="page-title flex items-center gap-2">
            <button className="iconbtn" onClick={goList} title="Kembali" style={{ fontSize: 18, lineHeight: 1 }}>←</button>
            Permintaan Penawaran <span className="code-tag">RFQ</span>
            <span className="text-xs text-muted font-normal ml-2">— {recordId ? `#${recordId}` : 'baru'}</span>
          </h1>
        </div>
        <div className="page-body p-8 text-center text-muted">
          <div className="text-lg font-medium mb-2">Form RFQ — coming soon</div>
          <div className="text-sm">Editor undangan supplier sedang disiapkan.</div>
          <button className="btn mt-4" onClick={goList}>← Kembali ke daftar</button>
        </div>
      </div>
    );
  }

  const summary: SummaryConfig = { metricLabel: 'Σ RFQ', rowCount: rows.length, totalCount: totalRows };
  const pagination: ListPaginationConfig = { page, pageCount, pageSize, totalRows, onPage: setPage, onPageSize: setPageSize };
  const toggleSel = (id: string) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <ErpListLayout title="Permintaan Penawaran (RFQ)" code="RFQ" loading={loading} error={error}
      search={search} onSearch={setSearch} onAdd={() => onNavigate?.(trxNewRoute(BASE))} onRefresh={reload}
      toolbar={null} summary={summary} pagination={pagination}
      keyboardRows={{ rowCount: rows.length, focusedIndex: focused, onFocusChange: setFocused, onToggle: (i) => rows[i] && toggleSel(rows[i].id), onOpen: (i) => rows[i] && openEdit(rows[i]) }}>
      {selected.size > 0 && (
        <div className="bulk-bar flex items-center gap-3 px-3 py-2 mb-2 rounded-md bg-secondary text-sm">
          <strong>{selected.size}</strong> baris dipilih
          <button className="btn ghost sm" onClick={() => setSelected(new Set())}>Batal pilihan</button>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: 36 }} />
            <TableHead>No Transaksi</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Berlaku Hingga</TableHead>
            <TableHead>Uraian</TableHead>
            <TableHead>Undangan Supplier</TableHead>
            <TableHead>Status</TableHead>
            <TableHead style={{ width: 44 }} />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? <TableEmpty colSpan={8} /> : rows.map((r, i) => {
            const actions = rowActions(r);
            return (
              <RowContextMenu key={r.id} items={actions}>
                <TableRow style={focused === i ? { boxShadow: 'inset 2px 0 0 var(--primary)' } : undefined} className="cursor-pointer">
                  <TableCell style={{ textAlign: 'center' }}><input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleSel(r.id)} /></TableCell>
                  <CodeLinkCell code={r.docNumber} onOpen={() => openEdit(r)} />
                  <TableCell>{r.docDate.slice(0, 10)}</TableCell>
                  <TableCell>{r.validTo ? r.validTo.slice(0, 10) : '—'}</TableCell>
                  <TableCell>{r.description ?? '—'}</TableCell>
                  <TableCell>{r.suppliers.length} supplier</TableCell>
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
