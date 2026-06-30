'use client';

import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { HrListLayout, type FilterConfig } from '@/components/organisms/list-layout';
import { DataTable, type Column } from '@/components/organisms/data-table';
import { BulkActionBar } from '@/components/organisms/bulk-action-bar';
import type { RowActionItem } from '@/components/molecules/row-actions';
import { WorksiteFormDialog } from '@/components/pages/worksite-form-dialog';
import { useWorksites, hrQueryKeys } from '@/lib/api/hooks';
import { deleteWorksite } from '@/lib/api/worksites';
import type { HrWorksite } from '@/lib/api/worksites';

/** Lokasi & Geofence — full §2.7/§2.9/§2.11 list: action bar + search + status
 *  filter + summary + footer, plus selection, bulk delete, kebab row-actions
 *  (right-click parity), and keyboard-first row focus. Pilot for the rich list
 *  pattern; small list so search/filter run client-side. */
export function WorksitesView() {
  const qc = useQueryClient();
  const { data, isLoading, error, refetch } = useWorksites();
  const allRows = useMemo(() => data ?? [], [data]);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<HrWorksite | null>(null);
  const [busy, setBusy] = useState(false);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allRows.filter((w) => {
      const matchesSearch =
        !q || w.code?.toLowerCase().includes(q) || w.name?.toLowerCase().includes(q);
      const matchesStatus =
        status === '' ||
        (status === 'active' && w.isActive) ||
        (status === 'inactive' && !w.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [allRows, search, status]);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }
  function openEdit(w: HrWorksite) {
    setEditing(w);
    setDialogOpen(true);
  }

  function toggleKey(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }
  function toggleAll() {
    setSelected((prev) =>
      prev.size === rows.length ? new Set() : new Set(rows.map((r) => String(r.id))),
    );
  }
  const clearSelection = () => setSelected(new Set());

  async function removeMany(ids: string[], label: string) {
    if (!confirm(`Hapus ${label}?`)) return;
    setBusy(true);
    try {
      await Promise.all(ids.map((id) => deleteWorksite(id)));
      toast.success(`${ids.length} worksite dihapus.`);
      clearSelection();
      await qc.invalidateQueries({ queryKey: hrQueryKeys.worksites() });
    } catch (e) {
      toast.error((e as Error)?.message ?? 'Gagal menghapus.');
    } finally {
      setBusy(false);
    }
  }

  const filters: FilterConfig[] = [
    {
      key: 'status',
      label: 'Status',
      value: status,
      onChange: setStatus,
      options: [
        { label: 'Semua', value: '' },
        { label: 'Aktif', value: 'active' },
        { label: 'Nonaktif', value: 'inactive' },
      ],
    },
  ];

  const columns: Column<HrWorksite>[] = [
    { key: 'code', header: 'Kode' },
    { key: 'name', header: 'Nama Lokasi' },
    {
      key: 'coords',
      header: 'Koordinat',
      render: (r) => (
        <span className="tabular-nums text-xs text-muted-foreground">
          {Number(r.latitude).toFixed(5)}, {Number(r.longitude).toFixed(5)}
        </span>
      ),
    },
    {
      key: 'radiusMeters',
      header: 'Radius',
      className: 'text-right',
      render: (r) => <span className="tabular-nums">{r.radiusMeters} m</span>,
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (r) => (
        <Badge variant={r.isActive ? 'success' : 'default'} dot>
          {r.isActive ? 'Aktif' : 'Nonaktif'}
        </Badge>
      ),
    },
  ];

  const rowActions = (r: HrWorksite): RowActionItem[] => [
    { label: 'Edit', onSelect: () => openEdit(r) },
    {
      label: 'Hapus',
      danger: true,
      separatorBefore: true,
      onSelect: () => removeMany([String(r.id)], `worksite "${r.name}"`),
    },
  ];

  return (
    <>
      <HrListLayout
        title="Lokasi & Geofence"
        code="GEO"
        loading={isLoading}
        error={error ? ((error as Error)?.message ?? 'Terjadi kesalahan.') : null}
        search={search}
        onSearch={setSearch}
        onRefresh={() => refetch()}
        onAdd={openCreate}
        filters={filters}
        summary={{ metricLabel: 'Worksite', rowCount: rows.length, totalCount: allRows.length }}
        keyboardRows={{
          rowCount: rows.length,
          focusedIndex,
          onFocusChange: setFocusedIndex,
          onToggle: (i) => rows[i] && toggleKey(String(rows[i].id)),
          onOpen: (i) => rows[i] && openEdit(rows[i]),
        }}
      >
        <BulkActionBar
          count={selected.size}
          onCancel={clearSelection}
          actions={[
            {
              label: 'Hapus',
              danger: true,
              onClick: () => !busy && removeMany([...selected], `${selected.size} worksite`),
            },
          ]}
        />
        {rows.length === 0 ? (
          <div className="flex min-h-[160px] items-center justify-center text-sm text-muted-foreground">
            {allRows.length === 0 ? 'Belum ada worksite.' : 'Tidak ada hasil untuk filter ini.'}
          </div>
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(r) => String(r.id)}
            selectedKeys={selected}
            onToggleKey={toggleKey}
            onToggleAll={toggleAll}
            rowActions={rowActions}
            focusedIndex={focusedIndex}
            onRowOpen={openEdit}
          />
        )}
      </HrListLayout>
      <WorksiteFormDialog open={dialogOpen} onOpenChange={setDialogOpen} worksite={editing} />
    </>
  );
}
