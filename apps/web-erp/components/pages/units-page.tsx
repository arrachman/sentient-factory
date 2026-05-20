'use client';

/**
 * F3 Master Data — Unit of Measure page.
 * Lists md_units; supports create, edit, delete.
 * Atomic tier: Page.
 */

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
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
import { listUnits, createUnit, updateUnit, deleteUnit } from '@/lib/api/units';
import type { ErpUnit, CreateUnitPayload } from '@/lib/api/units';

// ─── Form state ───────────────────────────────────────────────────────────────

interface UnitForm {
  code: string;
  name: string;
  isActive: boolean;
}

const defaultForm = (): UnitForm => ({ code: '', name: '', isActive: true });

function fromUnit(u: ErpUnit): UnitForm {
  return { code: u.code, name: u.name, isActive: u.isActive };
}

function toPayload(f: UnitForm): CreateUnitPayload {
  return { code: f.code, name: f.name, isActive: f.isActive };
}

// ─── Form ─────────────────────────────────────────────────────────────────────

function UnitFormFields({
  data,
  onChange,
}: {
  data: UnitForm;
  onChange: (d: UnitForm) => void;
}) {
  const set = (k: keyof UnitForm, v: string | boolean) =>
    onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="uf2-code" required>
        <Input
          id="uf2-code"
          value={data.code}
          onChange={(e) => set('code', e.target.value)}
          placeholder="KG"
        />
      </FormField>
      <FormField label="Nama" htmlFor="uf2-name" required>
        <Input
          id="uf2-name"
          value={data.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Kilogram"
        />
      </FormField>
      <FormField label="Status" htmlFor="uf2-active">
        <BooleanRadio
          id="uf2-active"
          value={data.isActive}
          onValueChange={(v) => set('isActive', v)}
        />
      </FormField>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ErpUnitsPage() {
  const [sortBy, setSortBy] = React.useState('createdAt');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const { page, pageSize, setPage, setPageSize } = useListPagination('units');

  const [debouncedSearch, setDebouncedSearch] = React.useState(search);
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const isActiveParam =
    statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined;

  const { rows, meta, loading, error, reload } = useErpList(
    () =>
      listUnits({
        page,
        limit: pageSize,
        search: debouncedSearch || undefined,
        sortBy,
        sortDir,
        isActive: isActiveParam,
      }),
    [page, pageSize, debouncedSearch, sortBy, sortDir, isActiveParam],
  );

  React.useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter, sortBy, sortDir, pageSize]);

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ErpUnit | null>(null);
  const [form, setForm] = React.useState<UnitForm>(defaultForm);
  const [saving, setSaving] = React.useState(false);

  const paged = rows;
  const totalRows = meta?.total ?? 0;
  const pageCount = meta?.totalPages ?? 1;

  const ALL = { label: 'Semua', value: '' };
  const unitFilters: FilterConfig[] = [
    { key: 'status', label: 'Status', value: statusFilter, onChange: setStatusFilter,
      options: [ALL, { label: 'Aktif', value: 'active' }, { label: 'Nonaktif', value: 'inactive' }] },
  ];
  const unitSummary: SummaryConfig = { metricLabel: 'Σ satuan', rowCount: totalRows, totalCount: totalRows };
  const unitPagination: ListPaginationConfig = { page, pageCount, pageSize, totalRows, onPage: setPage, onPageSize: setPageSize };
  void setSortBy; void setSortDir;

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm());
    setOpen(true);
  };

  const openEdit = (u: ErpUnit) => {
    setEditing(u);
    setForm(fromUnit(u));
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateUnit(editing.id, toPayload(form));
        notify('Satuan diperbarui', 'success');
      } else {
        await createUnit(toPayload(form));
        notify('Satuan dibuat', 'success');
      }
      setOpen(false);
      reload();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (u: ErpUnit) => {
    confirmAction({
      title: 'Hapus satuan?',
      message: `${u.code} — ${u.name} akan dihapus permanen.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await deleteUnit(u.id);
          notify('Satuan dihapus', 'success');
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
        title="Satuan"
        code="UOM"
        loading={loading}
        error={error}
        search={search}
        onSearch={setSearch}
        onAdd={openCreate}
        onRefresh={reload}
        filters={unitFilters}
        summary={unitSummary}
        pagination={unitPagination}
      >
        <div className="lines">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableEmpty colSpan={4} />
              ) : (
                paged.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="mono">{u.code}</TableCell>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>
                      <Badge variant={u.isActive ? 'success' : 'default'} dot>
                        {u.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn sm" onClick={() => openEdit(u)}>
                          Edit
                        </button>
                        <button
                          className="btn sm danger"
                          onClick={() => handleDelete(u)}
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
              {editing ? 'Edit Satuan' : 'Tambah Satuan'}
            </ModalTitle>
          </ModalHeader>
          <UnitFormFields data={form} onChange={setForm} />
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
