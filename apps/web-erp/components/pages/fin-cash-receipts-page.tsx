'use client';

/**
 * Kas Masuk (Cash Receipt / CR) — list (§2.7) + master-detail form.
 * Atomic tier: Page. List ↔ form view toggle (legacy back-arrow UX).
 */

import * as React from 'react';
import { Icon } from '@/components/ui/icons';
import { Badge } from '@/components/ui/badge';
import {
  ErpListLayout,
  type FilterConfig,
  type ListPaginationConfig,
  type SummaryConfig,
} from '@/components/organisms/erp-list-layout';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
  CodeLinkCell,
} from '@/components/organisms/table';
import { Input } from '@/components/ui/input';
import {
  RowActionsMenu,
  RowContextMenu,
  type RowActionItem,
} from '@/components/molecules/row-actions-menu';
import { confirmAction, notify } from '@/lib/feedback';
import { useErpList } from '@/lib/use-erp-list';
import { useListPagination } from '@/lib/use-list-pagination';
import { formatNumber } from '@/lib/format';
import { statusBadgeVariant, statusLabel } from '@/lib/status';
import {
  listCashReceipts,
  createCashReceipt,
  updateCashReceipt,
  deleteCashReceipt,
  getCashReceipt,
  transitionCashReceipt,
  type CashBankTransition,
  type ErpCashReceipt,
  type ErpDocumentStatus,
} from '@/lib/api/fin-cash-receipts';
import {
  CashReceiptForm,
  defaultCashReceiptForm,
  fromCashReceipt,
  toCashReceiptPayload,
  type CashReceiptFormData,
} from './fin-cash-receipts-form';

/** Workflow actions offered per status (§2.7 state machine). */
function workflowActions(
  status: ErpDocumentStatus,
  run: (a: CashBankTransition) => void,
): RowActionItem[] {
  switch (status) {
    case 'DRAFT':
    case 'REJECTED':
      return [{ label: 'Ajukan', onSelect: () => run('SUBMIT') }];
    case 'NEED_APPROVE':
      return [
        { label: 'Setujui', onSelect: () => run('APPROVE') },
        { label: 'Tolak', onSelect: () => run('REJECT') },
      ];
    case 'APPROVED':
      return [
        { label: 'Posting', onSelect: () => run('POST') },
        { label: 'Reopen', onSelect: () => run('REOPEN') },
      ];
    case 'POSTED':
      return [{ label: 'Reopen', onSelect: () => run('REOPEN') }];
    default:
      return [];
  }
}

export function ErpCashReceiptsPage() {
  const [mode, setMode] = React.useState<'list' | 'form'>('list');
  const [form, setForm] = React.useState<CashReceiptFormData>(defaultCashReceiptForm);
  const [saving, setSaving] = React.useState(false);

  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');
  const { page, pageSize, setPage, setPageSize } = useListPagination('fin-cash-receipts');

  const [debouncedSearch, setDebouncedSearch] = React.useState(search);
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const statusParam = (statusFilter || undefined) as ErpDocumentStatus | undefined;

  const { rows, meta, loading, error, reload } = useErpList(
    () =>
      listCashReceipts({
        page,
        limit: pageSize,
        search: debouncedSearch || undefined,
        status: statusParam,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        sortBy: 'transactionDate',
        sortDir: 'desc',
      }),
    [page, pageSize, debouncedSearch, statusParam, dateFrom, dateTo],
  );

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, dateFrom, dateTo, pageSize]);

  const [focused, setFocused] = React.useState(-1);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const totalRows = meta?.total ?? 0;
  const pageCount = meta?.totalPages ?? 1;

  const toForm = (data: CashReceiptFormData) => {
    setForm(data);
    setMode('form');
  };
  const openCreate = () => toForm(defaultCashReceiptForm());
  const openEdit = async (r: ErpCashReceipt) => {
    try {
      const full = await getCashReceipt(r.id); // ensure lines + refs
      toForm(fromCashReceipt(full));
    } catch {
      toForm(fromCashReceipt(r));
    }
  };

  const persist = async (closeAfter: boolean, newAfter = false) => {
    if (!form.branchId || !form.bankAccountId || !form.description) {
      notify('Cabang, Akun Kas, dan Uraian wajib diisi.', 'warn');
      return;
    }
    setSaving(true);
    try {
      const payload = toCashReceiptPayload(form);
      if (form.id) {
        await updateCashReceipt(form.id, payload);
        notify('Kas Masuk diperbarui', 'success');
      } else {
        await createCashReceipt(payload);
        notify('Kas Masuk dibuat', 'success');
      }
      reload();
      if (newAfter) setForm(defaultCashReceiptForm());
      else if (closeAfter) setMode('list');
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const runTransition = async (r: ErpCashReceipt, action: CashBankTransition) => {
    let reason: string | undefined;
    if (action === 'REJECT') {
      reason = window.prompt('Alasan menolak dokumen ini?') ?? undefined;
      if (!reason) return;
    }
    const verb: Record<CashBankTransition, string> = {
      SUBMIT: 'mengajukan',
      APPROVE: 'menyetujui',
      REJECT: 'menolak',
      POST: 'memposting',
      REOPEN: 'membuka kembali',
    };
    try {
      await transitionCashReceipt(r.id, action, reason);
      notify(`Berhasil ${verb[action]} ${r.docNumber}`, 'success');
      reload();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal', 'danger');
    }
  };

  const handleDelete = (r: ErpCashReceipt) => {
    confirmAction({
      title: 'Hapus Kas Masuk?',
      message: `${r.docNumber} akan dihapus permanen.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await deleteCashReceipt(r.id);
          notify('Kas Masuk dihapus', 'success');
          reload();
        } catch (e: unknown) {
          notify(e instanceof Error ? e.message : 'Gagal', 'danger');
        }
      },
    });
  };

  const rowActions = (r: ErpCashReceipt): RowActionItem[] => [
    { label: 'Edit / Lihat', onSelect: () => openEdit(r) },
    ...workflowActions(r.status, (a) => runTransition(r, a)),
    { label: 'Hapus', onSelect: () => handleDelete(r), danger: true, separatorBefore: true },
  ];

  // ── form view ───────────────────────────────────────────────────────────────
  if (mode === 'form') {
    return (
      <div className="page">
        <div className="page-header">
          <h1 className="page-title flex items-center gap-2">
            <button className="iconbtn" onClick={() => setMode('list')} title="Kembali" style={{ fontSize: 18, lineHeight: 1 }}>
              ←
            </button>
            Kas Masuk
            <span className="code-tag">CR</span>
          </h1>
        </div>
        <div className="page-body overflow-auto p-4">
          <CashReceiptForm
            data={form}
            onChange={setForm}
            saving={saving}
            onSave={() => persist(true)}
            onSaveNew={() => persist(false, true)}
            onReset={() => setForm(form.id ? form : defaultCashReceiptForm())}
          />
        </div>
      </div>
    );
  }

  // ── list view ─────────────────────────────────────────────────────────────────
  const filters: FilterConfig[] = [
    {
      key: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: 'Semua', value: '' },
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Need Approve', value: 'NEED_APPROVE' },
        { label: 'Approved', value: 'APPROVED' },
        { label: 'Rejected', value: 'REJECTED' },
        { label: 'Posted', value: 'POSTED' },
      ],
    },
  ];
  const summary: SummaryConfig = { metricLabel: 'Σ Kas Masuk', rowCount: rows.length, totalCount: totalRows };
  const pagination: ListPaginationConfig = {
    page,
    pageCount,
    pageSize,
    totalRows,
    onPage: setPage,
    onPageSize: setPageSize,
  };
  const toggleSel = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const dateToolbar = (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <span>Tanggal</span>
      <Input type="date" className="h-7 w-36" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
      <span>s.d</span>
      <Input type="date" className="h-7 w-36" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
    </div>
  );

  return (
    <ErpListLayout
      title="Kas Masuk"
      code="CR"
      loading={loading}
      error={error}
      search={search}
      onSearch={setSearch}
      onAdd={openCreate}
      onRefresh={reload}
      filters={filters}
      toolbar={dateToolbar}
      summary={summary}
      pagination={pagination}
      keyboardRows={{
        rowCount: rows.length,
        focusedIndex: focused,
        onFocusChange: setFocused,
        onToggle: (i) => rows[i] && toggleSel(rows[i].id),
        onOpen: (i) => rows[i] && openEdit(rows[i]),
      }}
    >
      {selected.size > 0 && (
        <div className="bulk-bar flex items-center gap-3 px-3 py-2 mb-2 rounded-md bg-secondary text-sm">
          <strong>{selected.size}</strong> baris dipilih
          <button
            className="btn sm danger"
            onClick={() =>
              confirmAction({
                title: 'Hapus terpilih?',
                message: `${selected.size} Kas Masuk akan dihapus permanen.`,
                variant: 'danger',
                confirmLabel: 'Hapus',
                onConfirm: async () => {
                  await Promise.all([...selected].map((id) => deleteCashReceipt(id).catch(() => null)));
                  notify(`${selected.size} dokumen dihapus`, 'success');
                  setSelected(new Set());
                  reload();
                },
              })
            }
          >
            <Icon name="trash" size={12} /> Hapus
          </button>
          <button className="btn ghost sm" onClick={() => setSelected(new Set())}>
            Batal pilihan
          </button>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: 36 }} />
            <TableHead>No Transaksi</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Terima Dari</TableHead>
            <TableHead>Uraian</TableHead>
            <TableHead style={{ textAlign: 'right' }}>Total</TableHead>
            <TableHead>Uang</TableHead>
            <TableHead style={{ textAlign: 'right' }}>Kurs</TableHead>
            <TableHead>Status</TableHead>
            <TableHead style={{ width: 44 }} />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableEmpty colSpan={10} />
          ) : (
            rows.map((r, i) => {
              const actions = rowActions(r);
              return (
                <RowContextMenu key={r.id} items={actions}>
                  <TableRow
                    style={focused === i ? { boxShadow: 'inset 2px 0 0 var(--primary)' } : undefined}
                    className="cursor-pointer"
                  >
                    <TableCell style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={selected.has(r.id)}
                        onChange={() => toggleSel(r.id)}
                      />
                    </TableCell>
                    <CodeLinkCell code={r.docNumber} onOpen={() => openEdit(r)} />
                    <TableCell>{r.transactionDate.slice(0, 10)}</TableCell>
                    <TableCell>{r.partner?.name ?? r.contactPerson ?? '—'}</TableCell>
                    <TableCell>{r.description}</TableCell>
                    <TableCell className="tabular-nums" style={{ textAlign: 'right' }}>
                      {formatNumber(Number(r.amount), 2)}
                    </TableCell>
                    <TableCell>{r.currency?.code ?? '—'}</TableCell>
                    <TableCell className="tabular-nums" style={{ textAlign: 'right' }}>
                      {formatNumber(Number(r.exchangeRate), 2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(r.status)} dot>
                        {statusLabel(r.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <RowActionsMenu items={actions} />
                    </TableCell>
                  </TableRow>
                </RowContextMenu>
              );
            })
          )}
        </TableBody>
      </Table>
    </ErpListLayout>
  );
}
