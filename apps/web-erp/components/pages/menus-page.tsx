'use client';

/**
 * Sys config — Menu Manager page (sys_menus).
 * Manages the MODULE→GROUP→ITEM tree that drives the dynamic sidebar.
 * Supports create, edit, delete, and drag-and-drop sibling reorder.
 * Route path: /admin/menus
 * Atomic tier: Page.
 */

import * as React from 'react';
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
} from '@/components/organisms/table';
import { confirmAction, notify } from '@/lib/feedback';
import { useErpList } from '@/lib/use-erp-list';
import {
  listSysMenus,
  createSysMenu,
  updateSysMenu,
  deleteSysMenu,
  reorderSiblings,
} from '@/lib/api/sys-menus';
import type { ErpSysMenu } from '@/lib/api/sys-menus';
import {
  MenuFormFields,
  defaultMenuForm,
  fromMenu,
  toMenuPayload,
} from './menus-form';
import type { MenuForm } from './menus-form';
import {
  MenusDndProvider,
  MenusTreeRows,
  flattenMenus,
  type SortOrderUpdate,
} from './menus-tree';

export function ErpMenusPage() {
  const { rows, loading, error, reload } = useErpList(() => listSysMenus());
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ErpSysMenu | null>(null);
  const [form, setForm] = React.useState<MenuForm>(defaultMenuForm);
  const [saving, setSaving] = React.useState(false);

  const flat = React.useMemo(() => flattenMenus(rows), [rows]);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return flat;
    return flat.filter(
      (f) =>
        f.menu.code.toLowerCase().includes(q) ||
        f.menu.title.toLowerCase().includes(q),
    );
  }, [flat, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultMenuForm());
    setOpen(true);
  };

  const openEdit = (m: ErpSysMenu) => {
    setEditing(m);
    setForm(fromMenu(m));
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateSysMenu(editing.id, toMenuPayload(form));
        notify('Menu diperbarui', 'success');
      } else {
        await createSysMenu(toMenuPayload(form));
        notify('Menu dibuat', 'success');
      }
      setOpen(false);
      reload();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (m: ErpSysMenu) => {
    confirmAction({
      title: 'Hapus menu?',
      message: `${m.code} — ${m.title} akan dihapus.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await deleteSysMenu(m.id);
          notify('Menu dihapus', 'success');
          reload();
        } catch (e: unknown) {
          notify(e instanceof Error ? e.message : 'Gagal', 'danger');
        }
      },
    });
  };

  const handleReorder = async (updates: SortOrderUpdate[]) => {
    try {
      await reorderSiblings(updates);
      reload();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal mengurutkan', 'danger');
    }
  };

  return (
    <>
      <ErpListLayout
        title="Menu Manager"
        code="SYS-MENU"
        loading={loading}
        error={error}
        search={search}
        onSearch={setSearch}
        onAdd={openCreate}
        onRefresh={reload}
      >
        <MenusDndProvider rows={filtered} onReorder={handleReorder}>
          <div className="lines">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Kode</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Urutan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                <MenusTreeRows
                  rows={filtered}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              </TableBody>
            </Table>
          </div>
        </MenusDndProvider>
      </ErpListLayout>

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editing ? 'Edit Menu' : 'Tambah Menu'}
            </ModalTitle>
          </ModalHeader>
          <MenuFormFields
            data={form}
            onChange={setForm}
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
