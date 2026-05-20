'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  RowActionsMenu,
  RowContextMenu,
  type RowActionItem,
} from '@/components/molecules/row-actions-menu';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from '@/components/organisms/modal';
import {
  ErpListLayout,
  type FilterConfig,
  type SummaryConfig,
  type ListPaginationConfig,
  type KeyboardRowConfig,
} from '@/components/organisms/erp-list-layout';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
  CheckboxHead,
  CheckboxCell,
  CodeLinkCell,
  SortableHead,
} from '@/components/organisms/table';
import { confirmAction, notify } from '@/lib/feedback';
import { useErpList } from '@/lib/use-erp-list';
import { useListPagination } from '@/lib/use-list-pagination';
import {
  listBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  bulkUpdateBranchStatus,
  bulkDeleteBranches,
} from '@/lib/api/branches';
import type { ErpBranch } from '@/lib/api/branches';
import {
  BranchFormFields,
  defaultBranchForm,
  branchFromRecord,
  branchToPayload,
  type BranchForm,
} from './branches-form';
import { AuditHistoryPanel } from '@/components/organisms/audit-history-panel';

export function ErpBranchesPage() {
  const [sortBy, setSortBy] = React.useState('createdAt');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const { page, pageSize, setPage, setPageSize } = useListPagination('branches');

  // Debounce search to avoid hitting API on every keystroke.
  const [debouncedSearch, setDebouncedSearch] = React.useState(search);
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const isActiveParam =
    statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined;

  const { rows, meta, loading, error, reload } = useErpList(
    () =>
      listBranches({
        page,
        limit: pageSize,
        search: debouncedSearch || undefined,
        sortBy,
        sortDir,
        isActive: isActiveParam,
      }),
    [page, pageSize, debouncedSearch, sortBy, sortDir, isActiveParam],
  );

  // Reset to page 1 when filters/search/sort change.
  React.useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter, sortBy, sortDir, pageSize]);

  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ErpBranch | null>(null);
  const [form, setForm] = React.useState<BranchForm>(defaultBranchForm);
  const [saving, setSaving] = React.useState(false);
  const [auditTarget, setAuditTarget] = React.useState<ErpBranch | null>(null);

  React.useEffect(() => { setFocusedIndex(-1); }, [page, debouncedSearch, statusFilter]);

  // Auto-scroll focused row into view
  React.useEffect(() => {
    if (focusedIndex < 0) return;
    document.querySelector('[data-focused="true"]')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [focusedIndex]);

  const paged = rows;
  const totalRows = meta?.total ?? 0;
  const pageCount = meta?.totalPages ?? 1;

  const allSelected = paged.length > 0 && paged.every((r) => selectedIds.has(r.id));
  const someSelected = !allSelected && paged.some((r) => selectedIds.has(r.id));
  const toggleRow = (id: string) =>
    setSelectedIds((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const toggleAll = (checked: boolean) =>
    setSelectedIds((prev) => { const next = new Set(prev); if (checked) paged.forEach((r) => next.add(r.id)); else paged.forEach((r) => next.delete(r.id)); return next; });

  const ALL = { label: 'Semua', value: '' };
  const branchFilters: FilterConfig[] = [
    { key: 'status', label: 'Status', value: statusFilter, onChange: setStatusFilter,
      options: [ALL, { label: 'Aktif', value: 'active' }, { label: 'Nonaktif', value: 'inactive' }] },
  ];
  const hasActiveFilter = search !== '' || statusFilter !== '';
  const branchSummary: SummaryConfig = { metricLabel: 'Σ cabang', rowCount: totalRows, totalCount: totalRows };
  const branchPagination: ListPaginationConfig = { page, pageCount, pageSize, totalRows, onPage: setPage, onPageSize: setPageSize };
  const branchKeyboard: KeyboardRowConfig = {
    rowCount: paged.length,
    focusedIndex,
    onFocusChange: setFocusedIndex,
    onToggle: (i) => toggleRow(paged[i].id),
    onOpen: (i) => openEdit(paged[i]),
  };

  const openCreate = () => { setEditing(null); setForm(defaultBranchForm()); setOpen(true); };
  const openEdit = (b: ErpBranch) => { setEditing(b); setForm(branchFromRecord(b)); setOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) { await updateBranch(editing.id, branchToPayload(form)); notify('Cabang diperbarui', 'success'); }
      else { await createBranch(branchToPayload(form)); notify('Cabang dibuat', 'success'); }
      setOpen(false); reload();
    } catch (e: unknown) { notify(e instanceof Error ? e.message : 'Gagal menyimpan', 'danger'); }
    finally { setSaving(false); }
  };

  const handleDelete = (b: ErpBranch) =>
    confirmAction({
      title: 'Hapus cabang?', message: `${b.code} — ${b.name} akan dihapus permanen.`,
      variant: 'danger', confirmLabel: 'Hapus', confirmIcon: 'trash',
      onConfirm: async () => { try { await deleteBranch(b.id); notify('Cabang dihapus', 'success'); reload(); } catch (e: unknown) { notify(e instanceof Error ? e.message : 'Gagal', 'danger'); } },
    });

  const selectedArr = Array.from(selectedIds);

  const handleBulkStatus = (isActive: boolean) => {
    const label = isActive ? 'aktifkan' : 'nonaktifkan';
    confirmAction({
      title: `${isActive ? 'Aktifkan' : 'Nonaktifkan'} ${selectedArr.length} cabang?`,
      message: `Semua cabang yang dipilih akan di-${label}.`,
      variant: isActive ? 'primary' : 'warn',
      confirmLabel: isActive ? 'Aktifkan' : 'Nonaktifkan',
      onConfirm: async () => {
        try { const { affected } = await bulkUpdateBranchStatus(selectedArr, isActive); notify(`${affected} cabang berhasil di-${label}`, 'success'); setSelectedIds(new Set()); reload(); }
        catch (e: unknown) { notify(e instanceof Error ? e.message : 'Gagal', 'danger'); }
      },
    });
  };

  const handleBulkDelete = () =>
    confirmAction({
      title: `Hapus ${selectedArr.length} cabang?`, message: 'Semua cabang yang dipilih akan dihapus permanen.',
      variant: 'danger', confirmLabel: 'Hapus', confirmIcon: 'trash',
      onConfirm: async () => {
        try { const { affected } = await bulkDeleteBranches(selectedArr); notify(`${affected} cabang dihapus`, 'success'); setSelectedIds(new Set()); reload(); }
        catch (e: unknown) { notify(e instanceof Error ? e.message : 'Gagal', 'danger'); }
      },
    });

  return (
    <>
      <ErpListLayout
        title="Cabang" code="BRN" loading={loading} error={error}
        search={search} onSearch={setSearch} onAdd={openCreate} onRefresh={reload}
        onExport={() => notify('Export belum tersedia', 'warn')}
        filters={branchFilters} summary={branchSummary} pagination={branchPagination}
        keyboardRows={branchKeyboard}
      >
        <div className="lines">
          <Table>
            <TableHeader>
              <TableRow>
                <CheckboxHead checked={someSelected ? 'indeterminate' : allSelected} onCheckedChange={toggleAll} />
                <SortableHead field="code" sortBy={sortBy} sortDir={sortDir} onSort={(f, d) => { setSortBy(f); setSortDir(d); }}>Kode</SortableHead>
                <SortableHead field="name" sortBy={sortBy} sortDir={sortDir} onSort={(f, d) => { setSortBy(f); setSortDir(d); }}>Nama</SortableHead>
                <SortableHead field="city" sortBy={sortBy} sortDir={sortDir} onSort={(f, d) => { setSortBy(f); setSortDir(d); }}>Kota</SortableHead>
                <SortableHead field="phone" sortBy={sortBy} sortDir={sortDir} onSort={(f, d) => { setSortBy(f); setSortDir(d); }}>Telepon</SortableHead>
                <SortableHead field="isActive" sortBy={sortBy} sortDir={sortDir} onSort={(f, d) => { setSortBy(f); setSortDir(d); }}>Status</SortableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableEmpty colSpan={7}>
                  {hasActiveFilter ? 'Tidak ada hasil untuk filter ini' : 'Tidak ada data cabang'}
                </TableEmpty>
              ) : paged.map((b, idx) => {
                const rowActions: RowActionItem[] = [
                  { label: 'Edit', onSelect: () => openEdit(b) },
                  { label: 'Riwayat', onSelect: () => setAuditTarget(b) },
                  { label: 'Hapus', onSelect: () => handleDelete(b), danger: true, separatorBefore: true },
                ];
                return (
                  <RowContextMenu key={b.id} items={rowActions}>
                    <TableRow data-selected={selectedIds.has(b.id)} data-focused={focusedIndex === idx} className="cursor-pointer" onClick={() => setFocusedIndex(idx)}>
                      <CheckboxCell checked={selectedIds.has(b.id)} onCheckedChange={() => toggleRow(b.id)} />
                      <CodeLinkCell code={b.code} onOpen={() => openEdit(b)} />
                      <TableCell>{b.name}</TableCell>
                      <TableCell className="muted">{b.city ?? '—'}</TableCell>
                      <TableCell className="muted">{b.phone ?? '—'}</TableCell>
                      <TableCell>
                        <Badge variant={b.isActive ? 'success' : 'default'} dot className="-ml-[7px]">
                          {b.isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <RowActionsMenu items={rowActions} />
                      </TableCell>
                    </TableRow>
                  </RowContextMenu>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </ErpListLayout>

      {selectedIds.size > 0 && (
        <div className="bulk-bar">
          <span className="count">{selectedIds.size} baris dipilih</span>
          <div className="divider" />
          <button className="ba-btn" onClick={() => handleBulkStatus(true)}>Aktifkan</button>
          <button className="ba-btn" onClick={() => handleBulkStatus(false)}>Nonaktifkan</button>
          <div className="divider" />
          <button className="ba-btn danger" onClick={handleBulkDelete}>Hapus</button>
          <div className="divider" />
          <button className="ba-btn" onClick={() => setSelectedIds(new Set())}>Batal</button>
        </div>
      )}

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader><ModalTitle>{editing ? 'Edit Cabang' : 'Tambah Cabang'}</ModalTitle></ModalHeader>
          <BranchFormFields data={form} onChange={setForm} />
          <ModalFooter>
            <button className="btn ghost" onClick={() => setOpen(false)}>Batal</button>
            <button className="btn primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal open={!!auditTarget} onOpenChange={(v) => { if (!v) setAuditTarget(null); }}>
        <ModalContent size="lg">
          <ModalHeader>
            <ModalTitle>
              Riwayat Perubahan — {auditTarget?.code} {auditTarget?.name}
            </ModalTitle>
          </ModalHeader>
          <div style={{ padding: '0', maxHeight: '60vh', overflowY: 'auto' }}>
            {auditTarget && (
              <AuditHistoryPanel entityName="ErpBranch" entityId={auditTarget.id} />
            )}
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
