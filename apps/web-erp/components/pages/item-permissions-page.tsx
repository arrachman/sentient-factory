'use client';

/**
 * Item Permissions (Izin Item) — pivot table: itemId × roleId × {canView, canSell, canBuy}.
 * Minimal scaffold: data table with item name, role name, and 3 permission toggles.
 * Full CRUD form is deferred; permissions can be toggled inline via PATCH.
 */

import * as React from 'react';
import { useErpList } from '@/lib/use-erp-list';
import { useListPagination } from '@/lib/use-list-pagination';
import { ErpListLayout } from '@/components/organisms/erp-list-layout';
import {
  Table, TableHeader, TableRow, TableHead,
  TableBody, TableCell, TableEmpty,
} from '@/components/organisms/table';
import { Checkbox } from '@/components/ui/checkbox';
import { notify } from '@/lib/feedback';
import { toToastMessage } from '@/lib/error-message';
import type { NotifyType } from '@/lib/feedback';
import {
  listItemPermissions, updateErpItemPermission,
  type ErpItemPermission,
} from '@/lib/api/item-permissions';

// ─── Permission toggle cell ────────────────────────────────────────────────────

interface PermToggleProps {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onToggle: () => void;
}

function PermToggle({ checked, disabled, label, onToggle }: PermToggleProps) {
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
  onUpdated: () => void;
}

function PermRow({ row, focused, onUpdated }: PermRowProps) {
  const [saving, setSaving] = React.useState(false);

  const toggle = async (field: 'canView' | 'canSell' | 'canBuy') => {
    if (saving) return;
    setSaving(true);
    try {
      await updateErpItemPermission(row.id, { [field]: !row[field] });
      notify('Izin diperbarui', 'success' as NotifyType);
      onUpdated();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      notify(toToastMessage(msg), 'danger' as NotifyType);
    } finally {
      setSaving(false);
    }
  };

  return (
    <TableRow data-focused={focused || undefined}>
      <TableCell>
        <span style={{ fontFamily: 'monospace', fontSize: 'calc(11px * var(--font-scale, 1))' }}>
          {row.itemCode ?? row.itemId}
        </span>
      </TableCell>
      <TableCell>{row.itemName ?? <span className="muted">—</span>}</TableCell>
      <TableCell>{row.roleName ?? <span className="muted">—</span>}</TableCell>
      <TableCell>
        <PermToggle
          checked={row.canView}
          disabled={saving}
          label="Lihat"
          onToggle={() => toggle('canView')}
        />
      </TableCell>
      <TableCell>
        <PermToggle
          checked={row.canSell}
          disabled={saving}
          label="Jual"
          onToggle={() => toggle('canSell')}
        />
      </TableCell>
      <TableCell>
        <PermToggle
          checked={row.canBuy}
          disabled={saving}
          label="Beli"
          onToggle={() => toggle('canBuy')}
        />
      </TableCell>
    </TableRow>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ErpItemPermissionsPage() {
  const { page, pageSize, setPage } = useListPagination('item-permissions');
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [focusedIndex, setFocusedIndex] = React.useState(0);

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  React.useEffect(() => { setPage(1); }, [debouncedSearch, setPage]);

  const { rows, meta, loading, error, reload } = useErpList(
    () => listItemPermissions({
      page,
      limit: pageSize,
      search: debouncedSearch || undefined,
    }),
    [page, pageSize, debouncedSearch],
  );

  const totalRows = meta?.total ?? 0;
  const pageCount = meta?.totalPages ?? 1;

  return (
    <ErpListLayout
      title="Izin Item"
      code="IPM"
      search={search}
      onSearch={setSearch}
      onRefresh={reload}
      fetching={loading}
      pagination={{ page, pageCount, pageSize, totalRows, onPage: setPage }}
      summary={{ metricLabel: 'Total izin', rowCount: rows.length, totalCount: totalRows }}
      keyboardRows={{ rowCount: rows.length, focusedIndex, onFocusChange: setFocusedIndex, onToggle: () => {} }}
    >
      {error ? (
        <div style={{ padding: 16 }}>
          <span className="text-danger" style={{ fontSize: 'calc(12px * var(--font-scale, 1))' }}>
            Gagal memuat data: {error}
          </span>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: 100 }}>Kode Item</TableHead>
                <TableHead>Nama Item</TableHead>
                <TableHead>Role</TableHead>
                <TableHead style={{ width: 80 }}>Lihat</TableHead>
                <TableHead style={{ width: 80 }}>Jual</TableHead>
                <TableHead style={{ width: 80 }}>Beli</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} style={{ textAlign: 'center', padding: '24px 0' }}>
                    Memuat...
                  </TableCell>
                </TableRow>
              )}
              {!loading && rows.length === 0 && (
                <TableEmpty colSpan={6}>
                  {debouncedSearch
                    ? 'Tidak ada hasil untuk filter ini'
                    : 'Tidak ada data'}
                </TableEmpty>
              )}
              {!loading && rows.map((row, i) => (
                <PermRow
                  key={row.id}
                  row={row}
                  focused={focusedIndex === i}
                  onUpdated={reload}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </ErpListLayout>
  );
}
