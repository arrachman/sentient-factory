'use client';

import * as React from 'react';
import { useErpList } from '@/lib/use-erp-list';
import { useListPagination } from '@/lib/use-list-pagination';
import { ErpListLayout } from '@/components/organisms/erp-list-layout';
import {
  Table, TableHeader, TableRow, TableHead,
  TableBody, TableCell, TableEmpty, CheckboxCell, CheckboxHead,
} from '@/components/organisms/table';
import {
  Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter,
} from '@/components/organisms/modal';
import { SearchSelect } from '@/components/molecules/search-select';
import { RowActionsMenu, RowContextMenu, type RowActionItem } from '@/components/molecules/row-actions-menu';
import { FormField } from '@/components/ui/form-field';
import { Checkbox } from '@/components/ui/checkbox';
import { notify, confirmAction } from '@/lib/feedback';
import { toToastMessage } from '@/lib/error-message';
import { tGlobal } from '@/lib/mock';
import { listItems } from '@/lib/api/items';
import { listRoles } from '@/lib/api/roles';
import {
  listItemPermissions, createErpItemPermission, updateErpItemPermission,
  deleteErpItemPermission,
  type ErpItemPermission,
} from '@/lib/api/item-permissions';

// ─── Create dialog ─────────────────────────────────────────────────────────────

interface CreateForm {
  itemId: string; itemLabel: string;
  roleId: string; roleLabel: string;
  canView: boolean; canSell: boolean; canBuy: boolean;
}

const defaultForm = (): CreateForm => ({
  itemId: '', itemLabel: '', roleId: '', roleLabel: '',
  canView: true, canSell: true, canBuy: true,
});

interface PermCreateDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}

function PermCreateDialog({ open, onOpenChange, onCreated }: PermCreateDialogProps) {
  const [form, setForm] = React.useState<CreateForm>(defaultForm);
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<Partial<Record<keyof CreateForm, string>>>({});

  React.useEffect(() => { if (open) { setForm(defaultForm()); setErrors({}); } }, [open]);

  const set = <K extends keyof CreateForm>(k: K, v: CreateForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const loadItems = React.useCallback(async (search: string, page: number, limit: number) => {
    const res = await listItems({ search: search || undefined, page, limit, isActive: true });
    return { data: res.data.map((i) => ({ value: i.id, label: i.name, code: i.code })), total: res.meta.total };
  }, []);

  const loadRoles = React.useCallback(async (search: string, page: number, limit: number) => {
    const res = await listRoles({ search: search || undefined, page, limit });
    return { data: res.data.map((r) => ({ value: r.id, label: r.name, code: r.code })), total: res.meta.total };
  }, []);

  const handleSave = async () => {
    const e: typeof errors = {};
    if (!form.itemId) e.itemId = 'Item wajib dipilih';
    if (!form.roleId) e.roleId = 'Role wajib dipilih';
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      await createErpItemPermission({
        itemId: form.itemId, roleId: form.roleId,
        canView: form.canView, canSell: form.canSell, canBuy: form.canBuy,
      });
      notify('Izin item ditambahkan', 'success');
      onOpenChange(false);
      onCreated();
    } catch (err) {
      notify(toToastMessage(err instanceof Error ? err.message : String(err)), 'danger');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader><ModalTitle>Tambah Izin Item</ModalTitle></ModalHeader>
        <div className="p-4 flex flex-col gap-3">
          <FormField label="Item" htmlFor="ip-item" required error={errors.itemId}>
            <SearchSelect
              id="ip-item" placeholder="Cari item…" title="Pilih Item"
              value={form.itemId} onValueChange={(v) => set('itemId', v)}
              loadOptions={loadItems} initialLabel={form.itemLabel}
              error={!!errors.itemId}
            />
          </FormField>
          <FormField label="Role" htmlFor="ip-role" required error={errors.roleId}>
            <SearchSelect
              id="ip-role" placeholder="Cari role…" title="Pilih Role"
              value={form.roleId} onValueChange={(v) => set('roleId', v)}
              loadOptions={loadRoles} initialLabel={form.roleLabel}
              error={!!errors.roleId}
            />
          </FormField>
          <FormField label="Izin akses">
            <div style={{ display: 'flex', gap: 20, paddingTop: 4 }}>
              {(['canView', 'canSell', 'canBuy'] as const).map((f) => {
                const labels = { canView: 'Lihat', canSell: 'Jual', canBuy: 'Beli' };
                return (
                  <label key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 'calc(13px * var(--font-scale, 1))' }}>
                    <Checkbox checked={form[f]} onCheckedChange={(v) => set(f, Boolean(v))} />
                    {labels[f]}
                  </label>
                );
              })}
            </div>
          </FormField>
        </div>
        <ModalFooter>
          <button className="btn ghost" onClick={() => onOpenChange(false)}>{tGlobal('Batal')}</button>
          <button className="btn primary" onClick={handleSave} disabled={saving}>
            {saving ? tGlobal('Menyimpan...') : tGlobal('Simpan')}
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// ─── Permission toggle cell ────────────────────────────────────────────────────

function PermToggle({ checked, disabled, label, onToggle }: {
  checked: boolean; disabled?: boolean; label: string; onToggle: () => void;
}) {
  return (
    <span
      style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: disabled ? 'not-allowed' : 'pointer' }}
      onClick={disabled ? undefined : onToggle}
      title={label}
    >
      <Checkbox checked={checked} disabled={disabled} onCheckedChange={onToggle} />
      <span style={{ fontSize: 'calc(11px * var(--font-scale, 1))', userSelect: 'none' }}>{label}</span>
    </span>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────────

interface PermRowProps {
  row: ErpItemPermission;
  focused: boolean;
  selected: boolean;
  onSelect: () => void;
  onUpdated: () => void;
  onDelete: () => void;
}

function PermRow({ row, focused, selected, onSelect, onUpdated, onDelete }: PermRowProps) {
  const [saving, setSaving] = React.useState(false);

  const toggle = async (field: 'canView' | 'canSell' | 'canBuy') => {
    if (saving) return;
    setSaving(true);
    try {
      await updateErpItemPermission(row.id, { [field]: !row[field] });
      notify('Izin diperbarui', 'success');
      onUpdated();
    } catch (err) {
      notify(toToastMessage(err instanceof Error ? err.message : String(err)), 'danger');
    } finally {
      setSaving(false);
    }
  };

  const rowActions: RowActionItem[] = [
    {
      label: tGlobal('Hapus'),
      danger: true,
      separatorBefore: true,
      onSelect: onDelete,
    },
  ];

  return (
    <RowContextMenu items={rowActions}>
      <TableRow data-focused={focused || undefined} data-selected={selected || undefined}>
        <CheckboxCell checked={selected} onCheckedChange={onSelect} />
        <TableCell>
          <span style={{ fontFamily: 'monospace', fontSize: 'calc(11px * var(--font-scale, 1))' }}>
            {row.itemCode ?? row.itemId}
          </span>
        </TableCell>
        <TableCell>{row.itemName ?? <span className="muted">—</span>}</TableCell>
        <TableCell>{row.roleName ?? <span className="muted">—</span>}</TableCell>
        <TableCell>
          <PermToggle checked={row.canView} disabled={saving} label="Lihat" onToggle={() => toggle('canView')} />
        </TableCell>
        <TableCell>
          <PermToggle checked={row.canSell} disabled={saving} label="Jual" onToggle={() => toggle('canSell')} />
        </TableCell>
        <TableCell>
          <PermToggle checked={row.canBuy} disabled={saving} label="Beli" onToggle={() => toggle('canBuy')} />
        </TableCell>
        <TableCell style={{ textAlign: 'right' }}>
          <RowActionsMenu items={rowActions} />
        </TableCell>
      </TableRow>
    </RowContextMenu>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ErpItemPermissionsPage() {
  const { page, pageSize, setPage } = useListPagination('item-permissions');
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = React.useState('createdAt');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc');
  const [createOpen, setCreateOpen] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  React.useEffect(() => { setPage(1); }, [debouncedSearch, sortBy, sortDir, setPage]);

  const { rows, meta, loading, error, reload } = useErpList(
    () => listItemPermissions({ page, limit: pageSize, search: debouncedSearch || undefined, sortBy, sortDir }),
    [page, pageSize, debouncedSearch, sortBy, sortDir],
  );

  const totalRows = meta?.total ?? 0;
  const pageCount = meta?.totalPages ?? 1;

  const toggleRow = (id: string) =>
    setSelectedIds((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const allSelected = rows.length > 0 && rows.every((r) => selectedIds.has(r.id));
  const someSelected = !allSelected && rows.some((r) => selectedIds.has(r.id));

  const handleDelete = (row: ErpItemPermission) => {
    confirmAction({
      title: 'Hapus Izin Item?',
      message: `${row.itemCode ?? row.itemId} × ${row.roleName ?? row.roleId} akan dihapus permanen.`,
      confirmLabel: 'Hapus', confirmIcon: 'trash', variant: 'danger',
      onConfirm: async () => {
        try {
          await deleteErpItemPermission(row.id);
          notify('Izin item dihapus', 'success');
          setSelectedIds((s) => { const n = new Set(s); n.delete(row.id); return n; });
          reload();
        } catch (err) {
          notify(toToastMessage(err instanceof Error ? err.message : String(err)), 'danger');
        }
      },
    });
  };

  const handleBulkDelete = () => {
    const ids = Array.from(selectedIds);
    confirmAction({
      title: 'Hapus Izin Item?',
      message: `${ids.length} izin item akan dihapus permanen.`,
      confirmLabel: 'Hapus', confirmIcon: 'trash', variant: 'danger',
      onConfirm: async () => {
        try {
          await Promise.all(ids.map((id) => deleteErpItemPermission(id)));
          notify(`${ids.length} izin item dihapus`, 'success');
          setSelectedIds(new Set());
          reload();
        } catch (err) {
          notify(toToastMessage(err instanceof Error ? err.message : String(err)), 'danger');
        }
      },
    });
  };

  const sortHeader = (col: string, label: string) => (
    <TableHead
      style={{ cursor: 'pointer', userSelect: 'none' }}
      onClick={() => { if (sortBy === col) setSortDir((d) => d === 'asc' ? 'desc' : 'asc'); else { setSortBy(col); setSortDir('asc'); } }}
    >
      {label}{sortBy === col ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
    </TableHead>
  );

  const bulkBar = selectedIds.size > 0 ? (
    <div className="bulk-bar">
      <span className="count">{selectedIds.size} {tGlobal('baris dipilih')}</span>
      <div className="divider" />
      <button className="ba-btn danger" onClick={handleBulkDelete}>{tGlobal('Hapus')}</button>
      <div className="divider" />
      <button className="ba-btn" onClick={() => setSelectedIds(new Set())}>{tGlobal('Batal')}</button>
    </div>
  ) : undefined;

  return (
    <>
      <PermCreateDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={reload} />
      <ErpListLayout
        title="Izin Item"
        code="IPM"
        search={search}
        onSearch={setSearch}
        onAdd={() => setCreateOpen(true)}
        addLabel="+ Tambah Izin"
        onRefresh={reload}
        fetching={loading}
        error={error}
        toolbar={bulkBar}
        pagination={{ page, pageCount, pageSize, totalRows, onPage: setPage }}
        summary={{ metricLabel: 'Total izin', rowCount: rows.length, totalCount: totalRows }}
        keyboardRows={{ rowCount: rows.length, focusedIndex, onFocusChange: setFocusedIndex, onToggle: (i) => toggleRow(rows[i]?.id ?? '') }}
      >
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <CheckboxHead
                  checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                  onCheckedChange={() => {
                    if (allSelected) setSelectedIds(new Set());
                    else setSelectedIds(new Set(rows.map((r) => r.id)));
                  }}
                />
                {sortHeader('itemCode', 'Kode Item')}
                {sortHeader('itemName', 'Nama Item')}
                {sortHeader('roleName', 'Role')}
                <TableHead style={{ width: 70 }}>Lihat</TableHead>
                <TableHead style={{ width: 70 }}>Jual</TableHead>
                <TableHead style={{ width: 70 }}>Beli</TableHead>
                <TableHead style={{ width: 50 }} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={8} style={{ textAlign: 'center', padding: '24px 0' }}>Memuat...</TableCell>
                </TableRow>
              )}
              {!loading && rows.length === 0 && (
                debouncedSearch
                  ? <TableEmpty colSpan={8} variant="filtered" searchTerm={debouncedSearch} />
                  : <TableEmpty colSpan={8} variant="empty" entityLabel="izin item" description="Izin item dikonfigurasi per kombinasi item dan role." />
              )}
              {!loading && rows.map((row, i) => (
                <PermRow
                  key={row.id}
                  row={row}
                  focused={focusedIndex === i}
                  selected={selectedIds.has(row.id)}
                  onSelect={() => toggleRow(row.id)}
                  onUpdated={reload}
                  onDelete={() => handleDelete(row)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </ErpListLayout>
    </>
  );
}
