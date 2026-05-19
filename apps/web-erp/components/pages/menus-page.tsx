'use client';

/**
 * Sys config — Menu Manager page (sys_menus).
 * Manages the MODULE→GROUP→ITEM tree that drives the dynamic sidebar.
 * Supports create, edit, delete, and sortOrder reorder (up/down).
 * Route path: /admin/menus
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
import {
  listSysMenus,
  createSysMenu,
  updateSysMenu,
  deleteSysMenu,
} from '@/lib/api/sys-menus';
import type { ErpSysMenu } from '@/lib/api/sys-menus';
import {
  MenuFormFields,
  defaultMenuForm,
  fromMenu,
  toMenuPayload,
} from './menus-form';
import type { MenuForm } from './menus-form';

// ─── Tree helpers ───────────────────────────────────────────────────────────

interface FlatRow {
  menu: ErpSysMenu;
  depth: number;
  siblings: ErpSysMenu[];
}

/** Depth-first flatten honoring parentId + sortOrder for indented display. */
function flatten(rows: ErpSysMenu[]): FlatRow[] {
  const byParent = new Map<string, ErpSysMenu[]>();
  for (const r of rows) {
    const key = r.parentId ?? '__root__';
    const arr = byParent.get(key) ?? [];
    arr.push(r);
    byParent.set(key, arr);
  }
  for (const arr of byParent.values()) {
    arr.sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id));
  }

  const out: FlatRow[] = [];
  const walk = (parentKey: string, depth: number) => {
    const kids = byParent.get(parentKey) ?? [];
    for (const k of kids) {
      out.push({ menu: k, depth, siblings: kids });
      walk(k.id, depth + 1);
    }
  };
  walk('__root__', 0);
  return out;
}

const TYPE_VARIANT: Record<string, 'success' | 'info' | 'default'> = {
  MODULE: 'success',
  GROUP: 'info',
  ITEM: 'default',
};

// ─── Page ────────────────────────────────────────────────────────────────────

export function ErpMenusPage() {
  const { rows, loading, error, reload } = useErpList(() => listSysMenus());
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ErpSysMenu | null>(null);
  const [form, setForm] = React.useState<MenuForm>(defaultMenuForm);
  const [saving, setSaving] = React.useState(false);

  const flat = React.useMemo(() => flatten(rows), [rows]);

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

  /** Swap sortOrder with the adjacent sibling (same parent). */
  const handleMove = async (row: FlatRow, dir: -1 | 1) => {
    const idx = row.siblings.findIndex((s) => s.id === row.menu.id);
    const target = row.siblings[idx + dir];
    if (!target) return;
    try {
      await Promise.all([
        updateSysMenu(row.menu.id, { sortOrder: target.sortOrder }),
        updateSysMenu(target.id, { sortOrder: row.menu.sortOrder }),
      ]);
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
              {filtered.length === 0 ? (
                <TableEmpty colSpan={7} />
              ) : (
                filtered.map((f) => {
                  const m = f.menu;
                  const sibIdx = f.siblings.findIndex(
                    (s) => s.id === m.id,
                  );
                  return (
                    <TableRow key={m.id}>
                      <TableCell>
                        <span
                          style={{
                            paddingLeft: f.depth * 18,
                            display: 'inline-block',
                          }}
                        >
                          {f.depth > 0 && (
                            <span
                              className="muted"
                              style={{ marginRight: 4 }}
                            >
                              ↳
                            </span>
                          )}
                          {m.title}
                        </span>
                      </TableCell>
                      <TableCell className="mono">{m.code}</TableCell>
                      <TableCell>
                        <Badge variant={TYPE_VARIANT[m.type] ?? 'default'}>
                          {m.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="muted mono">
                        {m.path ?? '—'}
                      </TableCell>
                      <TableCell className="mono">
                        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                          <button
                            className="btn sm"
                            disabled={sibIdx <= 0}
                            onClick={() => handleMove(f, -1)}
                            title="Naik"
                          >
                            ↑
                          </button>
                          <button
                            className="btn sm"
                            disabled={sibIdx >= f.siblings.length - 1}
                            onClick={() => handleMove(f, 1)}
                            title="Turun"
                          >
                            ↓
                          </button>
                          <span>{m.sortOrder}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={m.isActive ? 'success' : 'default'}
                          dot
                        >
                          {m.isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button
                            className="btn sm"
                            onClick={() => openEdit(m)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn sm danger"
                            onClick={() => handleDelete(m)}
                          >
                            Hapus
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
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
