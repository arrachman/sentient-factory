'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { AlertTriangle, Check, Search } from 'lucide-react';
import { toast } from 'sonner';
import {
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { EnrollmentTable } from './hr-face-enrollment-management/enrollment-table';
import { WorksiteAssignDialog } from './hr-face-enrollment-management/worksite-assign-dialog';

type AssignedWorksiteRow = { id: number; name: string; code: string; radiusMeters: number; isPrimary: boolean };

type WorksiteRow = {
  id: number; name: string; code: string; latitude: number; longitude: number; radiusMeters: number; isActive: boolean;
};

type FaceEnrollmentManagementRow = {
  hrUserId: number; appUserId: number; employeeCode: string | null;
  faceEnrollmentStatus: string; faceTemplateVersion: number; employeeRoleType: string;
  isActive: boolean; username: string; fullName: string | null; defaultWorksiteName: string | null;
  assignedWorksites: AssignedWorksiteRow[]; activeEnrollmentId: number | null;
  snapshotUrl: string | null; qualityScore: number | null; enrolledAt: string | null;
  registeredByUsername: string | null; registeredByFullName: string | null;
};

type ApiEnvelope<T> = { success?: boolean; data: T };

function SectionShell({ title, description, children, wide = false }: { title: string; description?: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={cn('mx-auto space-y-6 pb-6', wide ? 'w-full max-w-[1400px] px-4 sm:px-6 xl:px-8' : 'max-w-3xl px-4 sm:px-5')}>
      <div className="pb-2">
        <ToolbarHeading>
          <ToolbarPageTitle>{title}</ToolbarPageTitle>
          {description ? <ToolbarDescription>{description}</ToolbarDescription> : null}
        </ToolbarHeading>
      </div>
      {children}
    </div>
  );
}

function normalizeNumericValue(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') { const p = Number(value); return Number.isFinite(p) ? p : 0; }
  if (value && typeof value === 'object') {
    const d = value as { s?: number; e?: number; d?: number[] };
    if (Array.isArray(d.d)) {
      const s = d.d.join('');
      const exp = typeof d.e === 'number' ? d.e : s.length - 1;
      const sign = d.s === -1 ? -1 : 1;
      const n = Number(`${sign < 0 ? '-' : ''}${s[0] ?? '0'}${s.length > 1 ? `.${s.slice(1)}` : ''}e${exp}`);
      return Number.isFinite(n) ? n : 0;
    }
  }
  return 0;
}

function normalizeWorksiteRow(row: Record<string, unknown>): WorksiteRow {
  return { id: Number(row.id ?? 0), name: String(row.name ?? ''), code: String(row.code ?? ''), latitude: normalizeNumericValue(row.latitude), longitude: normalizeNumericValue(row.longitude), radiusMeters: normalizeNumericValue(row.radiusMeters), isActive: Boolean(row.isActive) };
}

function normalizeAssignedWorksiteRow(row: Record<string, unknown>): AssignedWorksiteRow {
  return { id: Number(row.id ?? 0), name: String(row.name ?? row.worksiteName ?? ''), code: String(row.code ?? row.worksiteCode ?? ''), radiusMeters: row.radiusMeters == null ? 0 : normalizeNumericValue(row.radiusMeters), isPrimary: Boolean(row.isPrimary) };
}

function normalizeFaceEnrollmentManagementRow(row: Record<string, unknown>): FaceEnrollmentManagementRow {
  return {
    hrUserId: Number(row.hrUserId ?? 0), appUserId: Number(row.appUserId ?? 0),
    employeeCode: typeof row.employeeCode === 'string' ? row.employeeCode : null,
    faceEnrollmentStatus: String(row.faceEnrollmentStatus ?? 'not_enrolled'),
    faceTemplateVersion: Number(row.faceTemplateVersion ?? 1),
    employeeRoleType: String(row.employeeRoleType ?? 'employee'), isActive: Boolean(row.isActive),
    username: String(row.username ?? ''), fullName: typeof row.fullName === 'string' ? row.fullName : null,
    defaultWorksiteName: typeof row.defaultWorksiteName === 'string' ? row.defaultWorksiteName : null,
    assignedWorksites: Array.isArray(row.assignedWorksites) ? row.assignedWorksites.filter((e): e is Record<string, unknown> => Boolean(e && typeof e === 'object')).map((e) => normalizeAssignedWorksiteRow(e)) : [],
    activeEnrollmentId: row.activeEnrollmentId == null ? null : Number(row.activeEnrollmentId),
    snapshotUrl: typeof row.snapshotUrl === 'string' ? row.snapshotUrl : null,
    qualityScore: row.qualityScore == null ? null : normalizeNumericValue(row.qualityScore),
    enrolledAt: typeof row.enrolledAt === 'string' ? row.enrolledAt : null,
    registeredByUsername: typeof row.registeredByUsername === 'string' ? row.registeredByUsername : null,
    registeredByFullName: typeof row.registeredByFullName === 'string' ? row.registeredByFullName : null,
  };
}

async function fetchJson<T>(url: string): Promise<ApiEnvelope<T> | null> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) return null;
  return (await response.json()) as ApiEnvelope<T>;
}

async function putJson<T>(url: string, body: Record<string, unknown>) {
  const response = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const payload = (await response.json().catch(() => null)) as (ApiEnvelope<T> & { message?: string; error?: string }) | null;
  if (!response.ok) throw new Error(payload?.message ?? payload?.error ?? 'Request failed.');
  return payload;
}

export function HrFaceEnrollmentManagementPageView() {
  const [rows, setRows] = useState<FaceEnrollmentManagementRow[]>([]);
  const [worksites, setWorksites] = useState<WorksiteRow[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enrolled' | 'not_enrolled'>('all');
  const [worksiteDialogOpen, setWorksiteDialogOpen] = useState(false);
  const [worksiteDialogRow, setWorksiteDialogRow] = useState<FaceEnrollmentManagementRow | null>(null);
  const [worksiteSelectionIds, setWorksiteSelectionIds] = useState<number[]>([]);
  const [worksiteSaving, setWorksiteSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  async function loadRows() {
    const payload = await fetchJson<Record<string, unknown>[]>('/api/hr/face-enrollments');
    setRows((payload?.data ?? []).map((row) => normalizeFaceEnrollmentManagementRow(row)));
  }

  async function loadWorksites() {
    const payload = await fetchJson<Record<string, unknown>[]>('/api/hr/worksites?page=1&limit=100');
    setWorksites((payload?.data ?? []).map((row) => normalizeWorksiteRow(row)));
  }

  useEffect(() => { void Promise.all([loadRows(), loadWorksites()]).catch(() => null); }, []);
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  function openWorksiteDialog(row: FaceEnrollmentManagementRow) {
    setWorksiteDialogRow(row);
    setWorksiteSelectionIds(row.assignedWorksites.map((w) => w.id));
    setWorksiteDialogOpen(true);
  }

  function handleToggleWorksite(id: number, checked: boolean) {
    setWorksiteSelectionIds((current) => checked ? (current.includes(id) ? current : [...current, id]) : current.filter((x) => x !== id));
  }

  async function saveWorksiteAssignments() {
    if (!worksiteDialogRow) return;
    setWorksiteSaving(true);
    try {
      await putJson(`/api/hr/users/${worksiteDialogRow.appUserId}/worksites`, { worksiteIds: worksiteSelectionIds });
      toast.success('Tempat kerja pegawai berhasil diperbarui.');
      setWorksiteDialogOpen(false);
      setWorksiteDialogRow(null);
      await loadRows();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan tempat kerja.');
    } finally {
      setWorksiteSaving(false);
    }
  }

  const trimmedSearch = search.trim().toLowerCase();
  const filteredRows = rows.filter((row) => {
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'enrolled' ? row.faceEnrollmentStatus === 'enrolled' : row.faceEnrollmentStatus !== 'enrolled');
    if (!trimmedSearch) return matchesStatus;
    const haystack = [row.fullName ?? '', row.username, row.employeeCode ?? '', row.defaultWorksiteName ?? '', row.assignedWorksites.map((w) => w.name).join(' ')].join(' ').toLowerCase();
    return haystack.includes(trimmedSearch) && matchesStatus;
  });

  const enrolledCount = rows.filter((row) => row.faceEnrollmentStatus === 'enrolled').length;
  const notEnrolledCount = rows.filter((row) => row.faceEnrollmentStatus !== 'enrolled').length;
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const activePage = Math.min(page, totalPages);
  const visibleRows = filteredRows.slice((activePage - 1) * pageSize, activePage * pageSize);
  const rangeStart = filteredRows.length === 0 ? 0 : (activePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(activePage * pageSize, filteredRows.length);
  const pageWindowStart = Math.max(1, Math.min(activePage - 1, Math.max(1, totalPages - 2)));
  const pageNumbers = Array.from({ length: Math.min(totalPages, 3) }, (_, i) => pageWindowStart + i);

  return (
    <SectionShell title="Manajemen Pendaftaran Wajah" description="Kelola data wajah pegawai untuk keperluan absensi." wide>
      <div className="mx-auto w-full max-w-[1120px] space-y-6 px-4 sm:px-6 xl:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Sudah Terdaftar</p>
              <div className="mt-3 flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-slate-900">{enrolledCount}</p>
                <p className="text-sm font-medium text-slate-500">pegawai</p>
              </div>
            </div>
            <span className="flex size-11 items-center justify-center rounded-full bg-blue-50 text-blue-600"><Check className="size-5" /></span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Belum Terdaftar</p>
              <div className="mt-3 flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-slate-900">{notEnrolledCount}</p>
                <p className="text-sm font-medium text-slate-500">pegawai</p>
              </div>
            </div>
            <span className="flex size-11 items-center justify-center rounded-full bg-rose-50 text-rose-600"><AlertTriangle className="size-5" /></span>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-[360px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama pegawai, username, kode..." className="h-11 rounded-lg border-slate-200 bg-white pl-11 shadow-none" />
            </div>
            <div className="flex rounded-lg bg-slate-100 p-1">
              {([{ key: 'all', label: 'Semua' }, { key: 'enrolled', label: 'Sudah Terdaftar' }, { key: 'not_enrolled', label: 'Belum Terdaftar' }] as const).map((item) => (
                <button key={item.key} type="button" onClick={() => setStatusFilter(item.key)}
                  className={cn('rounded-md px-4 py-2 text-xs font-semibold transition-colors', statusFilter === item.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900')}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <EnrollmentTable
            visibleRows={visibleRows}
            filteredTotal={filteredRows.length}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            pageSize={pageSize}
            activePage={activePage}
            totalPages={totalPages}
            pageNumbers={pageNumbers}
            onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
            onPageChange={setPage}
            onOpenWorksiteDialog={openWorksiteDialog}
          />
        </div>

        <WorksiteAssignDialog
          open={worksiteDialogOpen}
          onOpenChange={setWorksiteDialogOpen}
          targetRow={worksiteDialogRow}
          worksites={worksites}
          selectionIds={worksiteSelectionIds}
          onToggle={handleToggleWorksite}
          saving={worksiteSaving}
          onSave={() => void saveWorksiteAssignments()}
        />
      </div>
    </SectionShell>
  );
}
