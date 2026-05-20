'use client';

/**
 * F2 Finance — Adjustment Journals (AJ) page (master + nested lines, skeleton CRUD).
 * Atomic tier: Page.
 */

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from '@/components/organisms/modal';
import {
  ErpListLayout,
  type ListPaginationConfig,
  type SummaryConfig,
  type FilterConfig,
} from '@/components/organisms/erp-list-layout';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from '@/components/organisms/table';
import { confirmAction, notify } from '@/lib/feedback';
import { useErpList } from '@/lib/use-erp-list';
import { useListPagination } from '@/lib/use-list-pagination';
import {
  listAdjustmentJournals,
  createAdjustmentJournal,
  updateAdjustmentJournal,
  deleteAdjustmentJournal,
} from '@/lib/api/fin-adjustment-journals';
import type { ErpAdjustmentJournal } from '@/lib/api/fin-adjustment-journals';
import type { ErpDocumentStatus } from '@/lib/api/fin-journal-entries';
import {
  AdjustmentJournalFormFields,
  defaultAdjustmentJournalForm,
  fromAdjustmentJournal,
  toAdjustmentJournalPayload,
  type AdjustmentJournalFormData,
} from './fin-adjustment-journals-form';

export function ErpAdjustmentJournalsPage() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const { page, pageSize, setPage, setPageSize } = useListPagination(
    'fin-adjustment-journals',
  );

  const [debouncedSearch, setDebouncedSearch] = React.useState(search);
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const statusParam = (statusFilter || undefined) as
    | ErpDocumentStatus
    | undefined;

  const { rows, meta, loading, error, reload } = useErpList(
    () =>
      listAdjustmentJournals({
        page,
        limit: pageSize,
        search: debouncedSearch || undefined,
        status: statusParam,
      }),
    [page, pageSize, debouncedSearch, statusParam],
  );

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, pageSize]);

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ErpAdjustmentJournal | null>(
    null,
  );
  const [form, setForm] = React.useState<AdjustmentJournalFormData>(
    defaultAdjustmentJournalForm,
  );
  const [saving, setSaving] = React.useState(false);

  const paged = rows;
  const totalRows = meta?.total ?? 0;
  const pageCount = meta?.totalPages ?? 1;

  const ALL = { label: 'Semua', value: '' };
  const filters: FilterConfig[] = [
    {
      key: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        ALL,
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Posted', value: 'POSTED' },
        { label: 'Void', value: 'VOID' },
        { label: 'Cancelled', value: 'CANCELLED' },
      ],
    },
  ];
  const summary: SummaryConfig = {
    metricLabel: 'Σ adjustment journals',
    rowCount: totalRows,
    totalCount: totalRows,
  };
  const pagination: ListPaginationConfig = {
    page,
    pageCount,
    pageSize,
    totalRows,
    onPage: setPage,
    onPageSize: setPageSize,
  };

  const openCreate = () => {
    setEditing(null);
    setForm(defaultAdjustmentJournalForm());
    setOpen(true);
  };

  const openEdit = (r: ErpAdjustmentJournal) => {
    setEditing(r);
    setForm(fromAdjustmentJournal(r));
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateAdjustmentJournal(
          editing.id,
          toAdjustmentJournalPayload(form),
        );
        notify('Adjustment journal diperbarui', 'success');
      } else {
        await createAdjustmentJournal(toAdjustmentJournalPayload(form));
        notify('Adjustment journal dibuat', 'success');
      }
      setOpen(false);
      reload();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (r: ErpAdjustmentJournal) => {
    confirmAction({
      title: 'Hapus adjustment journal?',
      message: `${r.docNumber} akan dihapus permanen.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await deleteAdjustmentJournal(r.id);
          notify('Adjustment journal dihapus', 'success');
          reload();
        } catch (e: unknown) {
          notify(e instanceof Error ? e.message : 'Gagal', 'danger');
        }
      },
    });
  };

  return (
    <>
      <ErpListLayout
        title="Adjustment Journal"
        code="AJ"
        loading={loading}
        error={error}
        search={search}
        onSearch={setSearch}
        onAdd={openCreate}
        onRefresh={reload}
        filters={filters}
        summary={summary}
        pagination={pagination}
      >
        <div className="lines">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Dokumen</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Lines</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableEmpty colSpan={7} />
              ) : (
                paged.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="mono">{r.docNumber}</TableCell>
                    <TableCell>{r.entryDate.slice(0, 10)}</TableCell>
                    <TableCell>{r.partnerId ?? '—'}</TableCell>
                    <TableCell>{r.description}</TableCell>
                    <TableCell className="muted">{r.lines.length}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          r.status === 'POSTED' ? 'success' : 'default'
                        }
                        dot
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          className="btn sm"
                          onClick={() => openEdit(r)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn sm danger"
                          onClick={() => handleDelete(r)}
                        >
                          Hapus
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </ErpListLayout>

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editing
                ? 'Edit Adjustment Journal'
                : 'Tambah Adjustment Journal'}
            </ModalTitle>
          </ModalHeader>
          <AdjustmentJournalFormFields data={form} onChange={setForm} />
          <ModalFooter>
            <button className="btn ghost" onClick={() => setOpen(false)}>
              Batal
            </button>
            <button
              className="btn primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
