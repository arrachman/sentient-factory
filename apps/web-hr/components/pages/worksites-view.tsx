'use client';

import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HrListLayout, type FilterConfig } from '@/components/organisms/list-layout';
import { DataTable, type Column } from '@/components/organisms/data-table';
import { WorksiteFormDialog } from '@/components/pages/worksite-form-dialog';
import { useWorksites, hrQueryKeys } from '@/lib/api/hooks';
import { deleteWorksite } from '@/lib/api/worksites';
import type { HrWorksite } from '@/lib/api/worksites';

/** Lokasi & Geofence — pilot adopter of the §2.7 HrListLayout chrome
 *  (action bar + search + status filter + summary + footer). Worksites is a
 *  small list, so search/filter run client-side (no server pagination). */
export function WorksitesView() {
  const qc = useQueryClient();
  const { data, isLoading, error, refetch } = useWorksites();
  const allRows = useMemo(() => data ?? [], [data]);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(''); // '' = semua
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<HrWorksite | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  async function remove(w: HrWorksite) {
    if (!confirm(`Hapus worksite "${w.name}"?`)) return;
    setDeletingId(String(w.id));
    try {
      await deleteWorksite(String(w.id));
      toast.success('Worksite dihapus.');
      await qc.invalidateQueries({ queryKey: hrQueryKeys.worksites() });
    } catch (e) {
      toast.error((e as Error)?.message ?? 'Gagal menghapus.');
    } finally {
      setDeletingId(null);
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
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => (
        <div className="flex justify-end gap-1.5">
          <Button size="sm" variant="default" onClick={() => openEdit(r)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="danger"
            disabled={deletingId === String(r.id)}
            onClick={() => remove(r)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
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
        keyboardHints
      >
        {rows.length === 0 ? (
          <div className="flex min-h-[160px] items-center justify-center text-sm text-muted-foreground">
            {allRows.length === 0 ? 'Belum ada worksite.' : 'Tidak ada hasil untuk filter ini.'}
          </div>
        ) : (
          <DataTable columns={columns} rows={rows} rowKey={(r) => String(r.id)} />
        )}
      </HrListLayout>
      <WorksiteFormDialog open={dialogOpen} onOpenChange={setDialogOpen} worksite={editing} />
    </>
  );
}
