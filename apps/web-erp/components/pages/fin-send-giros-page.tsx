'use client';

/**
 * F2 Finance — Send Giros (RG) page (master + nested lines, skeleton CRUD).
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
  listSendGiros,
  createSendGiro,
  updateSendGiro,
  deleteSendGiro,
} from '@/lib/api/fin-send-giros';
import type { ErpSendGiro } from '@/lib/api/fin-send-giros';
import type { ErpDocumentStatus } from '@/lib/api/fin-journal-entries';
import {
  SendGiroFormFields,
  defaultSendGiroForm,
  fromSendGiro,
  toSendGiroPayload,
  type SendGiroFormData,
} from './fin-send-giros-form';

export function ErpSendGirosPage() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const { page, pageSize, setPage, setPageSize } =
    useListPagination('fin-send-giros');

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
      listSendGiros({
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
  const [editing, setEditing] = React.useState<ErpSendGiro | null>(null);
  const [form, setForm] = React.useState<SendGiroFormData>(
    defaultSendGiroForm,
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
    metricLabel: 'Σ send giros',
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
    setForm(defaultSendGiroForm());
    setOpen(true);
  };

  const openEdit = (r: ErpSendGiro) => {
    setEditing(r);
    setForm(fromSendGiro(r));
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateSendGiro(editing.id, toSendGiroPayload(form));
        notify('Receipt giro diperbarui', 'success');
      } else {
        await createSendGiro(toSendGiroPayload(form));
        notify('Receipt giro dibuat', 'success');
      }
      setOpen(false);
      reload();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (r: ErpSendGiro) => {
    confirmAction({
      title: 'Hapus send giro?',
      message: `${r.docNumber} akan dihapus permanen.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await deleteSendGiro(r.id);
          notify('Receipt giro dihapus', 'success');
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
        title="Send Giro"
        code="SG"
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
                <TableHead>No. Giro</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
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
                    <TableCell className="mono">{r.giroNumber}</TableCell>
                    <TableCell>{r.entryDate.slice(0, 10)}</TableCell>
                    <TableCell>{r.giroBank}</TableCell>
                    <TableCell>{r.dueDate.slice(0, 10)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={r.status === 'POSTED' ? 'success' : 'default'}
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
              {editing ? 'Edit Send Giro' : 'Tambah Send Giro'}
            </ModalTitle>
          </ModalHeader>
          <SendGiroFormFields data={form} onChange={setForm} />
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
