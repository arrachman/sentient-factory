'use client';

// Tree-aware DnD master page organism. Built for sys_menus (CLAUDE.md §2.22).
// Drag handle replaces checkbox column → no bulk action. Cross-parent drop
// rule in `tree-dnd-helpers.ts#inferNewParent`; backend re-validates.

import * as React from 'react';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Icon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { type RowActionItem } from '@/components/molecules/row-actions-menu';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from '@/components/organisms/modal';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableEmpty,
} from '@/components/organisms/table';
import { AuditHistoryPanel } from '@/components/organisms/audit-history-panel';
import { ListFooter } from '@/components/organisms/list-footer';
import { TreeDndRow } from './tree-dnd-row';
import {
  flattenTree,
  inferNewParent,
  computeReorderChanges,
  validateDrop,
} from './tree-dnd-helpers';
import type {
  TreeRow,
  TreeDndMasterPageProps,
} from './tree-dnd-master-page.types';
import { confirmAction, notify } from '@/lib/feedback';
import { hasErrors, type FormErrors } from '@/lib/form-validation';
import { tGlobal } from '@/lib/mock';
import { useTreeKeyboardNav } from '@/lib/use-tree-keyboard-nav';

export type { TreeRow, TreeNodeType } from './tree-dnd-master-page.types';
export type { TreeDndExtraColumn } from './tree-dnd-row';

export function TreeDndMasterPage<T extends TreeRow, F>({
  title,
  entityLabel,
  auditEntityName,
  loadAll,
  create,
  update,
  remove,
  reorder,
  defaultForm,
  fromRecord,
  toPayload,
  FormFields,
  validate,
  extraColumns = [],
}: TreeDndMasterPageProps<T, F>) {
  const [rows, setRows] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const searchRef = React.useRef<HTMLInputElement>(null);

  const reload = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await loadAll());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat');
    } finally {
      setLoading(false);
    }
  }, [loadAll]);

  React.useEffect(() => {
    reload();
  }, [reload]);
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const flat = React.useMemo(() => {
    const out: { row: T; depth: number }[] = [];
    flattenTree(rows, null, 0, out);
    return out;
  }, [rows]);

  const visibleFlat = React.useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return flat;
    const idxById = new Map(flat.map((f, i) => [f.row.id, i]));
    const matches = new Set<string>();
    for (const f of flat) {
      const r = f.row;
      if (r.code.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)) {
        matches.add(r.id);
        let pid = r.parentId;
        while (pid) {
          matches.add(pid);
          const parent = flat[idxById.get(pid) ?? -1]?.row;
          pid = parent?.parentId ?? null;
        }
      }
    }
    return flat.filter((f) => matches.has(f.row.id));
  }, [flat, debouncedSearch]);

  const sortableIds = visibleFlat.map((f) => f.row.id);

  // Modal state
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<T | null>(null);
  const [form, setForm] = React.useState<F>(defaultForm);
  const [formErrors, setFormErrors] = React.useState<FormErrors<F>>({});
  const [saving, setSaving] = React.useState(false);
  const [auditTarget, setAuditTarget] = React.useState<T | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm());
    setFormErrors({});
    setOpen(true);
  };
  const openEdit = (row: T) => {
    setEditing(row);
    setForm(fromRecord(row));
    setFormErrors({});
    setOpen(true);
  };

  // Keyboard-first row nav (CLAUDE.md §2.7 F). No X/select: this tree has no
  // row selection (§2.22 — drag handle replaces the checkbox column).
  const { focusedIndex } = useTreeKeyboardNav({
    rowCount: visibleFlat.length,
    resetKey: debouncedSearch,
    searchRef,
    onAdd: openCreate,
    onOpenFocused: (i) => {
      const target = visibleFlat[i]?.row;
      if (target) openEdit(target);
    },
  });

  const handleSave = async () => {
    if (validate) {
      const errs = validate(form);
      if (hasErrors(errs)) {
        setFormErrors(errs);
        setTimeout(() => {
          document
            .querySelector<HTMLElement>('[role="dialog"] [aria-invalid="true"]')
            ?.focus();
        }, 0);
        return;
      }
    }
    setSaving(true);
    try {
      if (editing) {
        await update(editing.id, toPayload(form));
        notify(`${tGlobal(title)} ${tGlobal('diperbarui')}`, 'success');
      } else {
        await create(toPayload(form));
        notify(`${tGlobal(title)} ${tGlobal('dibuat')}`, 'success');
      }
      setOpen(false);
      reload();
    } catch (e) {
      notify(e instanceof Error ? e.message : tGlobal('Gagal menyimpan'), 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (row: T) =>
    confirmAction({
      title: `${tGlobal('Hapus')} ${tGlobal(entityLabel)}?`,
      message: `${row.code} — ${row.name} ${tGlobal('akan dihapus permanen.')}`,
      variant: 'danger',
      confirmLabel: tGlobal('Hapus'),
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await remove(row.id);
          notify(`${tGlobal(title)} ${tGlobal('dihapus')}`, 'success');
          reload();
        } catch (e) {
          notify(e instanceof Error ? e.message : tGlobal('Gagal'), 'danger');
        }
      },
    });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    if (debouncedSearch) {
      notify(tGlobal('Bersihkan filter sebelum menata ulang'), 'warn');
      return;
    }
    const flatRows = flat.map((f) => f.row);
    const fromIdx = flatRows.findIndex((r) => r.id === active.id);
    const toIdx = flatRows.findIndex((r) => r.id === over.id);
    if (fromIdx < 0 || toIdx < 0) return;

    const reordered = arrayMove(flatRows, fromIdx, toIdx);
    const movedIdx = reordered.findIndex((r) => r.id === active.id);
    const newParentId = inferNewParent(reordered, movedIdx);

    const err = validateDrop(reordered, String(active.id), newParentId);
    if (err) {
      notify(tGlobal(err), 'warn');
      return;
    }

    const changes = computeReorderChanges(
      rows,
      reordered,
      String(active.id),
      newParentId,
    );
    if (changes.length === 0) return;

    // Optimistic local update
    setRows((prev) =>
      prev.map((r) => {
        const ch = changes.find((c) => c.id === r.id);
        if (!ch) return r;
        return { ...r, parentId: ch.parentId, sortOrder: ch.sortOrder } as T;
      }),
    );

    try {
      await reorder(changes);
      notify(`${tGlobal(title)} ${tGlobal('ditata ulang')}`, 'success');
    } catch (e) {
      notify(e instanceof Error ? e.message : tGlobal('Gagal menata ulang'), 'danger');
      reload();
    }
  };

  const colCount = 5 + extraColumns.length;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 12px 0' }}>
        <h2 style={{ fontSize: 'calc(15px * var(--font-scale, 1))', fontWeight: 600 }}>{tGlobal(title)}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input ref={searchRef} value={search} onChange={(e) => setSearch(e.target.value)} placeholder={tGlobal('Cari…')} style={{ width: 220 }} />
          <button className="btn ghost" onClick={reload} title={tGlobal('Muat ulang')}><Icon name="refresh" /></button>
          <button className="btn primary" onClick={openCreate}><Icon name="plus" /> {tGlobal('Tambah')}</button>
        </div>
      </div>

      <div className="lines">
        {loading ? (
          <div style={{ padding: 16 }} className="muted">{tGlobal('Memuat...')}</div>
        ) : error ? (
          <div style={{ padding: 16, color: 'var(--danger, #c33)' }}>{tGlobal('Gagal memuat data')}: {error}</div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <Table className="table-fixed">
              <colgroup>
                <col style={{ width: 36 }} />
                <col style={{ width: 200 }} />
                <col />
                {extraColumns.map((c) => <col key={c.key} style={{ width: 160 }} />)}
                <col style={{ width: 120 }} />
                <col style={{ width: 48 }} />
              </colgroup>
              <TableHeader>
                <TableRow>
                  <TableHead aria-label={tGlobal('Tarik')} />
                  <TableHead>{tGlobal('Kode')}</TableHead>
                  <TableHead>{tGlobal('Nama')}</TableHead>
                  {extraColumns.map((c) => <TableHead key={c.key}>{tGlobal(c.label)}</TableHead>)}
                  <TableHead>{tGlobal('Status')}</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                  {visibleFlat.length === 0 ? (
                    <TableEmpty
                      colSpan={colCount}
                      variant={debouncedSearch ? 'filtered' : 'empty'}
                      entityLabel={tGlobal(entityLabel)}
                      searchTerm={debouncedSearch || undefined}
                    />
                  ) : (
                    visibleFlat.map(({ row, depth }, idx) => {
                      const actions: RowActionItem[] = [
                        { label: tGlobal('Edit'), onSelect: () => openEdit(row) },
                        { label: tGlobal('Riwayat'), onSelect: () => setAuditTarget(row) },
                        {
                          label: tGlobal('Hapus'),
                          onSelect: () => handleDelete(row),
                          danger: true,
                          separatorBefore: true,
                        },
                      ];
                      return (
                        <TreeDndRow
                          key={row.id}
                          row={row}
                          depth={depth}
                          focused={focusedIndex === idx}
                          extraColumns={extraColumns}
                          rowActions={actions}
                          onOpenEdit={openEdit}
                        />
                      );
                    })
                  )}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        )}
      </div>

      {!loading && !error && (
        <ListFooter
          summary={{ rowCount: visibleFlat.length, totalRows: flat.length }}
          selectable={false}
          onAdd={openCreate}
        />
      )}

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editing
                ? `${tGlobal('Edit')} ${tGlobal(title)}`
                : `${tGlobal('Tambah')} ${tGlobal(title)}`}
            </ModalTitle>
          </ModalHeader>
          <FormFields data={form} onChange={setForm} errors={formErrors} />
          <ModalFooter>
            <button className="btn ghost" onClick={() => setOpen(false)}>
              {tGlobal('Batal')}
            </button>
            <button className="btn primary" onClick={handleSave} disabled={saving}>
              {saving ? tGlobal('Menyimpan...') : tGlobal('Simpan')}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal open={!!auditTarget} onOpenChange={(v) => { if (!v) setAuditTarget(null); }}>
        <ModalContent size="lg">
          <ModalHeader>
            <ModalTitle>
              {tGlobal('Riwayat Perubahan')} — {auditTarget?.code} {auditTarget?.name}
            </ModalTitle>
          </ModalHeader>
          <div style={{ padding: 0, maxHeight: '60vh', overflowY: 'auto' }}>
            {auditTarget && (
              <AuditHistoryPanel entityName={auditEntityName} entityId={auditTarget.id} />
            )}
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
