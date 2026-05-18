'use client';

/**
 * F3 Master Data — Item (produk/bahan) page.
 * Lists md_items; supports create, edit, delete.
 * Loads units + categories for lookup selects.
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
import { ErpListLayout } from '@/components/organisms/erp-list-layout';
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
import { listItems, createItem, updateItem, deleteItem } from '@/lib/api/items';
import type { ErpItem } from '@/lib/api/items';
import { listUnits } from '@/lib/api/units';
import { listItemCategories } from '@/lib/api/item-categories';
import {
  ItemFormFields,
  defaultItemForm,
  fromItem,
  toItemPayload,
  type ItemFormData,
} from './erp-items-form';

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ErpItemsPage() {
  const { rows, loading, error, reload } = useErpList(() => listItems());
  const { rows: units } = useErpList(() => listUnits());
  const { rows: categories } = useErpList(() => listItemCategories());

  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ErpItem | null>(null);
  const [form, setForm] = React.useState<ItemFormData>(defaultItemForm);
  const [saving, setSaving] = React.useState(false);

  // Build lookup maps
  const unitMap = React.useMemo(() => {
    const m: Record<string, string> = {};
    units.forEach((u) => (m[u.id] = u.code));
    return m;
  }, [units]);

  const catMap = React.useMemo(() => {
    const m: Record<string, string> = {};
    categories.forEach((c) => (m[c.id] = c.name));
    return m;
  }, [categories]);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    return q
      ? rows.filter(
          (r) =>
            r.code.toLowerCase().includes(q) ||
            r.name.toLowerCase().includes(q),
        )
      : rows;
  }, [rows, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultItemForm());
    setOpen(true);
  };

  const openEdit = (item: ErpItem) => {
    setEditing(item);
    setForm(fromItem(item));
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateItem(editing.id, toItemPayload(form));
        notify('Item diperbarui', 'success');
      } else {
        await createItem(toItemPayload(form));
        notify('Item dibuat', 'success');
      }
      setOpen(false);
      reload();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (item: ErpItem) => {
    confirmAction({
      title: 'Hapus item?',
      message: `${item.code} — ${item.name} akan dihapus permanen.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await deleteItem(item.id);
          notify('Item dihapus', 'success');
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
        title="Item"
        code="ITM"
        loading={loading}
        error={error}
        search={search}
        onSearch={setSearch}
        onAdd={openCreate}
        onRefresh={reload}
      >
        <div className="lines">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Satuan</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableEmpty colSpan={7} />
              ) : (
                filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="mono">{item.code}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <span className="code">{item.itemType}</span>
                    </TableCell>
                    <TableCell className="muted">
                      {item.unit?.code ?? unitMap[item.unitId] ?? item.unitId}
                    </TableCell>
                    <TableCell className="muted">
                      {item.category?.name ??
                        catMap[item.categoryId] ??
                        item.categoryId}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={item.isActive ? 'success' : 'default'}
                        dot
                      >
                        {item.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          className="btn sm"
                          onClick={() => openEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn sm danger"
                          onClick={() => handleDelete(item)}
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
            <ModalTitle>{editing ? 'Edit Item' : 'Tambah Item'}</ModalTitle>
          </ModalHeader>
          <ItemFormFields
            data={form}
            onChange={setForm}
            units={units}
            categories={categories}
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
