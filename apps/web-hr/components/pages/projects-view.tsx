'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/molecules/page-header';
import { QueryState } from '@/components/molecules/query-state';
import { Pagination } from '@/components/molecules/pagination';
import { DataTable, type Column } from '@/components/organisms/data-table';
import { ProjectDialog } from '@/components/pages/project-dialog';
import { ProjectTimeDialog } from '@/components/pages/project-time-dialog';
import { useProjects, useProjectTime } from '@/lib/api/hooks';
import { deleteProject, deleteProjectTime } from '@/lib/api/projects';
import type { HrProject, HrProjectTimeEntry } from '@/lib/api/projects';

type Tab = 'projects' | 'time';

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}j ${m}m`;
  if (h) return `${h}j`;
  return `${m}m`;
}

export function ProjectsView() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>('projects');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editProject, setEditProject] = useState<HrProject | null>(null);
  const [timeDialogOpen, setTimeDialogOpen] = useState(false);
  const [page, setPage] = useState(1);

  const projectsQuery = useProjects();
  const projects = projectsQuery.data ?? [];

  const timeQuery = useProjectTime({ page, limit: 25 });
  const entries = (timeQuery.data?.data ?? []) as HrProjectTimeEntry[];
  const total = timeQuery.data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 25));

  async function removeProject(id: string) {
    setBusyId(id);
    try {
      await deleteProject(id);
      toast.success('Proyek dihapus.');
      await qc.invalidateQueries({ queryKey: ['hr', 'projects'] });
    } catch (e) {
      toast.error((e as Error)?.message ?? 'Gagal menghapus proyek.');
    } finally {
      setBusyId(null);
    }
  }

  async function removeEntry(id: string) {
    setBusyId(id);
    try {
      await deleteProjectTime(id);
      toast.success('Entri dihapus.');
      await qc.invalidateQueries({ queryKey: ['hr', 'project-time'] });
    } catch (e) {
      toast.error((e as Error)?.message ?? 'Gagal menghapus entri.');
    } finally {
      setBusyId(null);
    }
  }

  const projectColumns: Column<HrProject>[] = [
    { key: 'code', header: 'Kode', render: (r) => <span className="font-medium">{r.code}</span> },
    { key: 'name', header: 'Nama', render: (r) => r.name },
    { key: 'clientName', header: 'Klien', render: (r) => r.clientName ?? '—' },
    {
      key: 'isBillable',
      header: 'Tipe',
      render: (r) => (
        <Badge variant={r.isBillable ? 'success' : 'default'} dot>
          {r.isBillable ? 'Billable' : 'Internal'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => (
        <div className="flex justify-end gap-1.5">
          <Button
            size="sm"
            variant="default"
            disabled={busyId === r.id}
            onClick={() => { setEditProject(r); setProjectDialogOpen(true); }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="danger" disabled={busyId === r.id} onClick={() => removeProject(r.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  const timeColumns: Column<HrProjectTimeEntry>[] = [
    { key: 'workDate', header: 'Tanggal', render: (r) => <span className="font-medium">{r.workDate}</span> },
    { key: 'employee', header: 'Karyawan', render: (r) => r.fullName ?? r.username ?? '—' },
    { key: 'project', header: 'Proyek', render: (r) => r.projectName ?? r.projectCode ?? '—' },
    { key: 'minutes', header: 'Durasi', render: (r) => formatMinutes(Number(r.minutes)) },
    { key: 'activity', header: 'Aktivitas', render: (r) => r.activity ?? '—' },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => (
        <Button size="sm" variant="danger" disabled={busyId === r.id} onClick={() => removeEntry(r.id)}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Proyek & Aktivitas"
        description="Master proyek dan pencatatan waktu per proyek (adaptasi jibble Projects)."
        actions={
          tab === 'projects' ? (
            <Button variant="primary" onClick={() => { setEditProject(null); setProjectDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> Tambah Proyek
            </Button>
          ) : (
            <Button variant="primary" onClick={() => setTimeDialogOpen(true)}>
              <Plus className="h-4 w-4" /> Catat Waktu
            </Button>
          )
        }
      />
      <div className="mb-4 flex gap-1.5">
        <Button size="sm" variant={tab === 'projects' ? 'primary' : 'default'} onClick={() => setTab('projects')}>
          Master Proyek
        </Button>
        <Button size="sm" variant={tab === 'time' ? 'primary' : 'default'} onClick={() => setTab('time')}>
          Catatan Waktu
        </Button>
      </div>

      {tab === 'projects' ? (
        <QueryState
          isLoading={projectsQuery.isLoading}
          error={projectsQuery.error}
          isEmpty={projects.length === 0}
        >
          <DataTable columns={projectColumns} rows={projects} rowKey={(r) => r.id} />
        </QueryState>
      ) : (
        <QueryState
          isLoading={timeQuery.isLoading}
          error={timeQuery.error}
          isEmpty={entries.length === 0}
        >
          <DataTable columns={timeColumns} rows={entries} rowKey={(r) => r.id} />
          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        </QueryState>
      )}

      <ProjectDialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen} project={editProject} />
      <ProjectTimeDialog open={timeDialogOpen} onOpenChange={setTimeDialogOpen} />
    </div>
  );
}
