'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Check, X, Ban } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/molecules/page-header';
import { QueryState } from '@/components/molecules/query-state';
import { Pagination } from '@/components/molecules/pagination';
import { DataTable, type Column } from '@/components/organisms/data-table';
import { LeaveRequestDialog } from '@/components/pages/leave-request-dialog';
import { useLeaveRequests } from '@/lib/api/hooks';
import { applyLeaveAction } from '@/lib/api/leave';
import type { LeaveRequest, LeaveStatus, LeaveAction } from '@/lib/api/leave';

const TABS: { value: LeaveStatus; label: string }[] = [
  { value: 'pending', label: 'Menunggu' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'rejected', label: 'Ditolak' },
  { value: 'cancelled', label: 'Dibatalkan' },
];

const STATUS_VARIANT: Record<LeaveStatus, 'warn' | 'success' | 'danger' | 'default'> = {
  pending: 'warn',
  approved: 'success',
  rejected: 'danger',
  cancelled: 'default',
};

export function LeaveView() {
  const qc = useQueryClient();
  const [status, setStatus] = useState<LeaveStatus>('pending');
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const query = { status, page, limit: 25 };
  const { data, isLoading, error } = useLeaveRequests(query);
  const rows = (data?.data ?? []) as LeaveRequest[];
  const totalPages = data?.meta?.totalPages ?? 1;

  async function act(id: string, action: LeaveAction) {
    setBusyId(id);
    try {
      await applyLeaveAction(id, action);
      toast.success('Pengajuan diperbarui.');
      await qc.invalidateQueries({ queryKey: ['hr', 'leave', 'requests'] });
    } catch (e) {
      toast.error((e as Error)?.message ?? 'Aksi gagal.');
    } finally {
      setBusyId(null);
    }
  }

  const columns: Column<LeaveRequest>[] = [
    { key: 'fullName', header: 'Karyawan', render: (r) => r.fullName ?? r.username ?? '—' },
    { key: 'leaveTypeName', header: 'Tipe', render: (r) => r.leaveTypeName ?? '—' },
    {
      key: 'period',
      header: 'Periode',
      render: (r) => (
        <span className="text-xs">
          {r.startDate} → {r.endDate}{' '}
          <span className="text-muted-foreground">({Number(r.totalDays)} hari)</span>
        </span>
      ),
    },
    { key: 'reason', header: 'Alasan', render: (r) => r.reason ?? '—' },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <Badge variant={STATUS_VARIANT[r.status]} dot>{r.status}</Badge>,
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => {
        const busy = busyId === String(r.id);
        if (r.status === 'pending') {
          return (
            <div className="flex justify-end gap-1.5">
              <Button size="sm" variant="default" disabled={busy} onClick={() => act(String(r.id), 'cancel')}>
                <Ban className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="danger" disabled={busy} onClick={() => act(String(r.id), 'reject')}>
                <X className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="primary" disabled={busy} onClick={() => act(String(r.id), 'approve')}>
                <Check className="h-3.5 w-3.5" />
              </Button>
            </div>
          );
        }
        return <span className="text-xs text-muted-foreground">{r.reviewNote ?? '—'}</span>;
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Cuti"
        description="Pengajuan & persetujuan cuti karyawan (adaptasi jibble Time Off / PTO)."
        actions={
          <Button variant="primary" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" /> Ajukan Cuti
          </Button>
        }
      />
      <div className="mb-4 flex gap-1.5">
        {TABS.map((t) => (
          <Button
            key={t.value}
            size="sm"
            variant={status === t.value ? 'primary' : 'default'}
            onClick={() => { setStatus(t.value); setPage(1); }}
          >
            {t.label}
          </Button>
        ))}
      </div>
      <QueryState isLoading={isLoading} error={error} isEmpty={rows.length === 0}>
        <DataTable columns={columns} rows={rows} rowKey={(r) => String(r.id)} />
        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
      </QueryState>
      <LeaveRequestDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
