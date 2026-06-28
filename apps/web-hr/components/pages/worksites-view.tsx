'use client';

import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/molecules/page-header';
import { QueryState } from '@/components/molecules/query-state';
import { DataTable, type Column } from '@/components/organisms/data-table';
import { useWorksites } from '@/lib/api/hooks';
import type { HrWorksite } from '@/lib/api/worksites';

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

export function WorksitesView() {
  const { data, isLoading, error } = useWorksites();
  const rows = data ?? [];

  return (
    <div>
      <PageHeader
        title="Lokasi & Geofence"
        description="Titik kerja dengan geofence GPS untuk membatasi area clock-in (adaptasi jibble Geofencing)."
      />
      <QueryState isLoading={isLoading} error={error} isEmpty={rows.length === 0}>
        <DataTable columns={columns} rows={rows} rowKey={(r) => String(r.id)} />
      </QueryState>
    </div>
  );
}
