'use client';

/**
 * F3 Master Data — Item Category page.
 * Lists md_item_categories; supports create, edit, delete.
 * Shows parent category hierarchy.
 * Atomic tier: Page.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from '@/components/organisms/modal';
import {
  ErpListLayout,
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
import {
  listItemCategories,
  createItemCategory,
  updateItemCategory,
  deleteItemCategory,
} from '@/lib/api/item-categories';
import type {
  ErpItemCategory,
  CreateItemCategoryPayload,
} from '@/lib/api/item-categories';

// ─── Form state ───────────────────────────────────────────────────────────────

interface CatForm {
  code: string;
  name: string;
  parentId: string;
}

const defaultForm = (): CatForm => ({ code: '', name: '', parentId: '' });

function fromCat(c: ErpItemCategory): CatForm {
  return {
    code: c.code,
    name: c.name,
    parentId: c.parentId ?? '',
  };
}

function toPayload(f: CatForm): CreateItemCategoryPayload {
  return {
    code: f.code,
    name: f.name,
    parentId: f.parentId || null,
  };
}

// ─── Form ─────────────────────────────────────────────────────────────────────

function CatFormFields({
  data,
  onChange,
  allRows,
  editingId,
}: {
  data: CatForm;
  onChange: (d: CatForm) => void;
  allRows: ErpItemCategory[];
  editingId?: string;
}) {
  const set = (k: keyof CatForm, v: string) => onChange({ ...data, [k]: v });
  const parents = allRows.filter((r) => r.id !== editingId && !r.parentId);

  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="cf-code" required>
        <Input
          id="cf-code"
          value={data.code}
          onChange={(e) => set('code', e.target.value)}
          placeholder="RAW-MAT"
        />
      </FormField>
      <FormField label="Nama" htmlFor="cf-name" required>
        <Input
          id="cf-name"
          value={data.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Bahan Baku"
        />
      </FormField>
      <FormField label="Parent" htmlFor="cf-parent">
        <Select
          value={data.parentId || '__none__'}
          onValueChange={(v) => set('parentId', v === '__none__' ? '' : v)}
        >
          <SelectTrigger id="cf-parent">
            <SelectValue placeholder="— Root —" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">— Root —</SelectItem>
            {parents.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ErpItemCategoriesPage() {
  const [sortBy, setSortBy] = React.useState('createdAt');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = React.useState('');
  const { page, pageSize, setPage, setPageSize } = useListPagination('item-categories');

  const [debouncedSearch, setDebouncedSearch] = React.useState(search);
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { rows, meta, loading, error, reload } = useErpList(
    () =>
      listItemCategories({
        page,
        limit: pageSize,
        search: debouncedSearch || undefined,
        sortBy,
        sortDir,
      }),
    [page, pageSize, debouncedSearch, sortBy, sortDir],
  );

  React.useEffect(() => { setPage(1); }, [debouncedSearch, sortBy, sortDir, pageSize]);

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ErpItemCategory | null>(null);
  const [form, setForm] = React.useState<CatForm>(defaultForm);
  const [saving, setSaving] = React.useState(false);

  const paged = rows;
  const totalRows = meta?.total ?? 0;
  const pageCount = meta?.totalPages ?? 1;

  const parentMap = React.useMemo(() => {
    const m: Record<string, string> = {};
    rows.forEach((r) => (m[r.id] = r.name));
    return m;
  }, [rows]);

  const catSummary: SummaryConfig = { metricLabel: 'Σ kategori', rowCount: totalRows, totalCount: totalRows };
  const catPagination: ListPaginationConfig = { page, pageCount, pageSize, totalRows, onPage: setPage, onPageSize: setPageSize };
  void setSortBy; void setSortDir;

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm());
    setOpen(true);
  };

  const openEdit = (c: ErpItemCategory) => {
    setEditing(c);
    setForm(fromCat(c));
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateItemCategory(editing.id, toPayload(form));
        notify('Kategori diperbarui', 'success');
      } else {
        await createItemCategory(toPayload(form));
        notify('Kategori dibuat', 'success');
      }
      setOpen(false);
      reload();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (c: ErpItemCategory) => {
    confirmAction({
      title: 'Hapus kategori?',
      message: `${c.code} — ${c.name} akan dihapus permanen.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await deleteItemCategory(c.id);
          notify('Kategori dihapus', 'success');
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
        title="Kategori Item"
        code="ICAT"
        loading={loading}
        error={error}
        search={search}
        onSearch={setSearch}
        onAdd={openCreate}
        onRefresh={reload}
        summary={catSummary}
        pagination={catPagination}
      >
        <div className="lines">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableEmpty colSpan={4} />
              ) : (
                paged.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="mono">{c.code}</TableCell>
                    <TableCell>
                      {c.parentId && (
                        <span className="muted" style={{ marginRight: 4 }}>
                          ↳
                        </span>
                      )}
                      {c.name}
                    </TableCell>
                    <TableCell className="muted">
                      {c.parentId ? (parentMap[c.parentId] ?? c.parentId) : '—'}
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn sm" onClick={() => openEdit(c)}>
                          Edit
                        </button>
                        <button
                          className="btn sm danger"
                          onClick={() => handleDelete(c)}
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
              {editing ? 'Edit Kategori' : 'Tambah Kategori'}
            </ModalTitle>
          </ModalHeader>
          <CatFormFields
            data={form}
            onChange={setForm}
            allRows={rows}
            editingId={editing?.id}
          />
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
