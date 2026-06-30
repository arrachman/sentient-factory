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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<HrHoliday | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data, isLoading, error } = useHolidays({ year });
  const rows = data ?? [];

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
    <div>
      <PageHeader
        title="Kalender Libur"
        description="Hari libur nasional & cuti bersama (adaptasi jibble Holiday Calendar). Dipakai perhitungan lembur & timesheet."
        actions={
          <Button variant="primary" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Tambah Hari Libur
          </Button>
        }
      />
      <div className="mb-4 flex gap-1.5">
        {YEARS.map((y) => (
          <Button
            key={y}
            size="sm"
            variant={year === y ? 'primary' : 'default'}
            onClick={() => setYear(y)}
          >
            {y}
          </Button>
        ))}
      </div>
      <QueryState isLoading={isLoading} error={error} isEmpty={rows.length === 0}>
        <DataTable columns={columns} rows={rows} rowKey={(r) => String(r.id)} />
      </QueryState>
      <HolidayDialog open={dialogOpen} onOpenChange={setDialogOpen} holiday={editing} />
    </div>
  );
}
