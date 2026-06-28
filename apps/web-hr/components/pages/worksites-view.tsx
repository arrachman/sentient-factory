'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/molecules/page-header';
import { QueryState } from '@/components/molecules/query-state';
import { DataTable, type Column } from '@/components/organisms/data-table';
import { WorksiteFormDialog } from '@/components/pages/worksite-form-dialog';
import { useWorksites, hrQueryKeys } from '@/lib/api/hooks';
import { deleteWorksite } from '@/lib/api/worksites';
import type { HrWorksite } from '@/lib/api/worksites';

export function WorksitesView() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useWorksites();
  const rows = data ?? [];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<HrWorksite | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
    { key: 'radiusMeters', header: 'Radius', render: (r) => <span className="tabular-nums">{r.radiusMeters} m</span> },
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
          <Button size="sm" variant="danger" disabled={deletingId === String(r.id)} onClick={() => remove(r)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Lokasi & Geofence"
        description="Titik kerja dengan geofence GPS untuk membatasi area clock-in (adaptasi jibble Geofencing)."
        actions={
          <Button variant="primary" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Tambah
          </Button>
        }
      />
      <QueryState isLoading={isLoading} error={error} isEmpty={rows.length === 0}>
        <DataTable columns={columns} rows={rows} rowKey={(r) => String(r.id)} />
      </QueryState>
      <WorksiteFormDialog open={dialogOpen} onOpenChange={setDialogOpen} worksite={editing} />
    </div>
  );
}
