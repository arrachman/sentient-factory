'use client';

import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HrListLayout, type FilterConfig } from '@/components/organisms/list-layout';
import { DataTable, type Column } from '@/components/organisms/data-table';
import { HolidayDialog } from '@/components/pages/holiday-dialog';
import { useHolidays } from '@/lib/api/hooks';
import { deleteHoliday } from '@/lib/api/holidays';
import type { HrHoliday } from '@/lib/api/holidays';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1];
const WEEKDAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function weekdayLabel(iso: string): string {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  return Number.isNaN(d.getTime()) ? '—' : WEEKDAYS[d.getDay()];
}

export function HolidaysView() {
  const qc = useQueryClient();
  const [year, setYear] = useState(CURRENT_YEAR);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<HrHoliday | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useHolidays({ year });
  const allRows = useMemo(() => data ?? [], [data]);
  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allRows;
    return allRows.filter(
      (r) => r.name?.toLowerCase().includes(q) || r.region?.toLowerCase().includes(q),
    );
  }, [allRows, search]);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }
  function openEdit(holiday: HrHoliday) {
    setEditing(holiday);
    setDialogOpen(true);
  }

  async function remove(holiday: HrHoliday) {
    if (!window.confirm(`Hapus hari libur "${holiday.name}"?`)) return;
    setBusyId(String(holiday.id));
    try {
      await deleteHoliday(String(holiday.id));
      toast.success('Hari libur dihapus.');
      await qc.invalidateQueries({ queryKey: ['hr', 'holidays'] });
    } catch (e) {
      toast.error((e as Error)?.message ?? 'Gagal menghapus.');
    } finally {
      setBusyId(null);
    }
  }

  const filters: FilterConfig[] = [
    {
      key: 'year',
      label: 'Tahun',
      value: String(year),
      onChange: (v) => setYear(Number(v)),
      options: YEARS.map((y) => ({ label: String(y), value: String(y) })),
    },
  ];

  const columns: Column<HrHoliday>[] = [
    { key: 'holidayDate', header: 'Tanggal', render: (r) => r.holidayDate?.slice(0, 10) ?? '—' },
    { key: 'weekday', header: 'Hari', render: (r) => weekdayLabel(r.holidayDate) },
    { key: 'name', header: 'Nama', render: (r) => r.name },
    { key: 'region', header: 'Wilayah', render: (r) => r.region ?? '—' },
    {
      key: 'flags',
      header: 'Sifat',
      render: (r) => (
        <div className="flex gap-1.5">
          {r.isRecurring && <Badge variant="default">Berulang</Badge>}
          <Badge variant={r.isActive ? 'success' : 'default'} dot>
            {r.isActive ? 'aktif' : 'nonaktif'}
          </Badge>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => {
        const busy = busyId === String(r.id);
        return (
          <div className="flex justify-end gap-1.5">
            <Button size="sm" variant="default" disabled={busy} onClick={() => openEdit(r)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="danger" disabled={busy} onClick={() => remove(r)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <HrListLayout
        title="Kalender Libur"
        code="HOL"
        loading={isLoading}
        error={error ? ((error as Error)?.message ?? 'Terjadi kesalahan.') : null}
        search={search}
        onSearch={setSearch}
        onRefresh={() => refetch()}
        onAdd={openCreate}
        addLabel="Tambah Hari Libur"
        filters={filters}
        summary={{ metricLabel: 'Hari libur', rowCount: rows.length, totalCount: allRows.length }}
      >
        {rows.length === 0 ? (
          <div className="flex min-h-[160px] items-center justify-center text-sm text-muted-foreground">
            {allRows.length === 0 ? 'Belum ada hari libur tahun ini.' : 'Tidak ada hasil untuk filter ini.'}
          </div>
        ) : (
          <DataTable columns={columns} rows={rows} rowKey={(r) => String(r.id)} />
        )}
      </HrListLayout>
      <HolidayDialog open={dialogOpen} onOpenChange={setDialogOpen} holiday={editing} />
    </>
  );
}
