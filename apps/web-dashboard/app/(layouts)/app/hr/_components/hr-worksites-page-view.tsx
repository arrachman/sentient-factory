'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { MapPinned, Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { WorksitesList } from './hr-worksites/worksites-list';
import { EmployeeWorksiteAssignment } from './hr-worksites/employee-worksite-assignment';
import { WorksiteFormFields } from './hr-worksites/worksite-form-fields';

type AssignedWorksiteRow = { id: number; name: string; code: string; radiusMeters: number; isPrimary: boolean };
type WorksiteRow = { id: number; name: string; code: string; latitude: number; longitude: number; radiusMeters: number; isActive: boolean };
type AttendanceUserOption = {
  hrUserId: number; appUserId: number; employeeCode: string | null; faceEnrollmentStatus: string;
  employeeRoleType: string; isActive: boolean; username: string; fullName: string | null;
  defaultWorksiteName: string | null; assignedWorksites: AssignedWorksiteRow[];
};
type WorksitesPayload = { data: WorksiteRow[] };
type ApiEnvelope<T> = { success?: boolean; data: T };

const DEFAULT_WORKSITE_LATITUDE = -5.145;
const DEFAULT_WORKSITE_LONGITUDE = 119.432;

function SectionShell({ title, children, wide = false }: { title: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={cn('mx-auto space-y-6 pb-6', wide ? 'w-full max-w-[1400px] px-4 sm:px-6 xl:px-8' : 'max-w-3xl px-4 sm:px-5')}>
      <div className="pb-2"><ToolbarHeading><ToolbarPageTitle>{title}</ToolbarPageTitle></ToolbarHeading></div>
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

function normalizeAttendanceUserOption(row: Record<string, unknown>): AttendanceUserOption {
  return {
    hrUserId: Number(row.hrUserId ?? 0), appUserId: Number(row.appUserId ?? 0),
    employeeCode: typeof row.employeeCode === 'string' ? row.employeeCode : null,
    faceEnrollmentStatus: String(row.faceEnrollmentStatus ?? 'not_enrolled'),
    employeeRoleType: String(row.employeeRoleType ?? 'employee'), isActive: Boolean(row.isActive),
    username: String(row.username ?? ''), fullName: typeof row.fullName === 'string' ? row.fullName : null,
    defaultWorksiteName: typeof row.defaultWorksiteName === 'string' ? row.defaultWorksiteName : null,
    assignedWorksites: Array.isArray(row.assignedWorksites)
      ? row.assignedWorksites.filter((e): e is Record<string, unknown> => Boolean(e && typeof e === 'object')).map((e) => normalizeAssignedWorksiteRow(e))
      : [],
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

export function HrWorksitesPageView() {
  const [payload, setPayload] = useState<WorksitesPayload | null>(null);
  const [attendanceUsers, setAttendanceUsers] = useState<AttendanceUserOption[]>([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radiusMeters, setRadiusMeters] = useState('100');
  const [submitting, setSubmitting] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editWorksiteId, setEditWorksiteId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editLatitude, setEditLatitude] = useState('');
  const [editLongitude, setEditLongitude] = useState('');
  const [editRadiusMeters, setEditRadiusMeters] = useState('100');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [assignmentDialogUser, setAssignmentDialogUser] = useState<AttendanceUserOption | null>(null);
  const [assignmentWorksiteIds, setAssignmentWorksiteIds] = useState<number[]>([]);
  const [assignmentSaving, setAssignmentSaving] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  async function load() {
    const [worksiteData, userData] = await Promise.all([
      fetchJson<Record<string, unknown>[]>('/api/hr/worksites?page=1&limit=20'),
      fetchJson<Record<string, unknown>[]>('/api/hr/users'),
    ]);
    setPayload(worksiteData ? { data: (worksiteData.data ?? []).map((row) => normalizeWorksiteRow(row)) } : null);
    setAttendanceUsers((userData?.data ?? []).map((row) => normalizeAttendanceUserOption(row)));
  }

  useEffect(() => { void load(); }, []);

  async function handleCreate() {
    setSubmitting(true);
    try {
      await fetch('/api/hr/worksites', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, code, latitude: Number(latitude), longitude: Number(longitude), radiusMeters: Number(radiusMeters), isActive: true }) });
      setName(''); setCode(''); setLatitude(''); setLongitude(''); setRadiusMeters('100'); setCreateDialogOpen(false);
      await load();
    } finally { setSubmitting(false); }
  }

  function openCreateDialog() {
    setName(''); setCode(''); setLatitude(String(DEFAULT_WORKSITE_LATITUDE)); setLongitude(String(DEFAULT_WORKSITE_LONGITUDE)); setRadiusMeters('100'); setCreateDialogOpen(true);
  }

  function openEditDialog(worksite: WorksiteRow) {
    setEditWorksiteId(worksite.id); setEditName(worksite.name); setEditCode(worksite.code);
    setEditLatitude(String(worksite.latitude)); setEditLongitude(String(worksite.longitude));
    setEditRadiusMeters(String(worksite.radiusMeters)); setEditIsActive(worksite.isActive); setEditDialogOpen(true);
  }

  async function handleEdit() {
    if (editWorksiteId == null) return;
    setEditSubmitting(true);
    try {
      await putJson(`/api/hr/worksites/${editWorksiteId}`, { name: editName, code: editCode, latitude: Number(editLatitude), longitude: Number(editLongitude), radiusMeters: Number(editRadiusMeters), isActive: editIsActive });
      toast.success('Lokasi kerja berhasil diperbarui.'); setEditDialogOpen(false); setEditWorksiteId(null); await load();
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Gagal memperbarui lokasi kerja.'); }
    finally { setEditSubmitting(false); }
  }

  async function saveAssignment() {
    if (!assignmentDialogUser) return;
    setAssignmentSaving(true);
    try {
      await putJson(`/api/hr/users/${assignmentDialogUser.appUserId}/worksites`, { worksiteIds: assignmentWorksiteIds });
      toast.success('Penugasan tempat kerja berhasil disimpan.'); setAssignmentDialogOpen(false); setAssignmentDialogUser(null); await load();
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Gagal menyimpan penugasan tempat kerja.'); }
    finally { setAssignmentSaving(false); }
  }

  const filteredUsers = attendanceUsers.filter((user) => {
    const haystack = [user.fullName ?? '', user.username, user.employeeCode ?? '', user.defaultWorksiteName ?? '', user.assignedWorksites.map((ws) => ws.name).join(' ')].join(' ').toLowerCase();
    return haystack.includes(userSearch.trim().toLowerCase());
  });

  return (
    <SectionShell title="Lokasi Kerja & Geofence" wide>
      <div className="mx-auto w-full max-w-[1120px] space-y-6 px-4 sm:px-6 xl:px-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xl font-semibold tracking-tight text-slate-900">Lokasi Kerja & Geofence</p>
            <p className="max-w-2xl text-sm text-slate-500">Kelola lokasi kerja dan penugasan pegawai.</p>
          </div>
          <Button className="h-11 rounded-xl bg-blue-600 px-5 text-white shadow-sm hover:bg-blue-700" onClick={openCreateDialog}>
            <Plus className="mr-2 size-4" />
            Tambah Lokasi
          </Button>
        </div>

        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(280px,0.42fr)_minmax(0,0.58fr)]">
          <div className="space-y-4">
            <p className="px-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Lokasi</p>
            <WorksitesList worksites={payload?.data ?? []} onEdit={openEditDialog} />
          </div>
          <div className="space-y-4">
            <p className="px-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Editor Penugasan Tempat Kerja Pegawai</p>
            <EmployeeWorksiteAssignment users={filteredUsers} userSearch={userSearch} onSearchChange={setUserSearch} onAssign={(user) => { setAssignmentDialogUser(user); setAssignmentWorksiteIds(user.assignedWorksites.map((ws) => ws.id)); setAssignmentDialogOpen(true); }} />
          </div>
        </div>
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-[980px] overflow-hidden rounded-2xl border-0 p-0 shadow-[0px_18px_60px_rgba(15,23,42,0.18)]">
          <DialogHeader className="border-b border-slate-100 px-5 py-4">
            <DialogTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
              <span className="flex size-9 items-center justify-center rounded-full bg-blue-50 text-blue-600"><MapPinned className="size-4" /></span>
              <span>Tambah Lokasi Kerja</span>
            </DialogTitle>
            <DialogDescription className="pl-12 text-sm text-slate-500">Tentukan lokasi lewat peta, lalu atur radius geofence dengan slider.</DialogDescription>
          </DialogHeader>
          <DialogBody className="px-5 py-5">
            <WorksiteFormFields name={name} code={code} latitude={latitude} longitude={longitude} radiusMeters={radiusMeters} onName={setName} onCode={setCode} onLatitude={setLatitude} onLongitude={setLongitude} onRadiusMeters={setRadiusMeters} onMapChange={(lat, lng) => { setLatitude(String(lat)); setLongitude(String(lng)); }} />
          </DialogBody>
          <DialogFooter className="flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-5 py-4">
            <Button variant="outline" className="h-10 rounded-xl px-5" disabled={submitting} onClick={() => setCreateDialogOpen(false)}>Batal</Button>
            <Button className="h-10 rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-700" onClick={() => void handleCreate()} disabled={submitting || !name || !code}>{submitting ? 'Menyimpan...' : 'Simpan Lokasi Kerja'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={(open) => { setEditDialogOpen(open); if (!open) setEditWorksiteId(null); }}>
        <DialogContent className="max-w-[980px] overflow-hidden rounded-2xl border-0 p-0 shadow-[0px_18px_60px_rgba(15,23,42,0.18)]">
          <DialogHeader className="border-b border-slate-100 px-5 py-4">
            <DialogTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
              <span className="flex size-9 items-center justify-center rounded-full bg-blue-50 text-blue-600"><MapPinned className="size-4" /></span>
              <span>Edit Lokasi Kerja</span>
            </DialogTitle>
            <DialogDescription className="pl-12 text-sm text-slate-500">Ubah lokasi lewat peta, lalu atur radius geofence dan status aktif.</DialogDescription>
          </DialogHeader>
          <DialogBody className="px-5 py-5">
            <WorksiteFormFields name={editName} code={editCode} latitude={editLatitude} longitude={editLongitude} radiusMeters={editRadiusMeters} isActive={editIsActive} showActiveToggle onName={setEditName} onCode={setEditCode} onLatitude={setEditLatitude} onLongitude={setEditLongitude} onRadiusMeters={setEditRadiusMeters} onIsActive={setEditIsActive} onMapChange={(lat, lng) => { setEditLatitude(String(lat)); setEditLongitude(String(lng)); }} />
          </DialogBody>
          <DialogFooter className="flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-5 py-4">
            <Button variant="outline" className="h-10 rounded-xl px-5" disabled={editSubmitting} onClick={() => { setEditDialogOpen(false); setEditWorksiteId(null); }}>Batal</Button>
            <Button className="h-10 rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-700" disabled={editSubmitting || !editName || !editCode} onClick={() => void handleEdit()}>{editSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={assignmentDialogOpen} onOpenChange={setAssignmentDialogOpen}>
        <DialogContent className="max-w-xl rounded-2xl border-0 p-0 shadow-[0px_18px_60px_rgba(15,23,42,0.18)]">
          <DialogHeader className="border-b border-slate-200 px-5 py-4">
            <DialogTitle className="text-lg font-semibold text-slate-900">Atur Tempat Kerja Pegawai</DialogTitle>
            <DialogDescription className="text-sm text-slate-500">Pilih satu atau beberapa lokasi kerja untuk {assignmentDialogUser?.fullName ?? assignmentDialogUser?.username ?? 'pegawai ini'}.</DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4 px-5 py-4">
            <div className="grid max-h-[50vh] gap-2 overflow-auto pr-1">
              {(payload?.data ?? []).map((worksite) => {
                const checked = assignmentWorksiteIds.includes(worksite.id);
                return (
                  <label key={worksite.id} className={cn('flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition-colors', checked ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50')}>
                    <Checkbox checked={checked} onCheckedChange={(next) => { setAssignmentWorksiteIds((curr) => next === true ? (curr.includes(worksite.id) ? curr : [...curr, worksite.id]) : curr.filter((id) => id !== worksite.id)); }} className="mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-slate-900">{worksite.name}</p>
                        <Badge className={cn('border-0 text-[11px]', checked ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600')}>{worksite.code}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">Radius {worksite.radiusMeters} m • {worksite.latitude}, {worksite.longitude}</p>
                    </div>
                  </label>
                );
              })}
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600">Lokasi pertama akan disimpan sebagai lokasi utama, sedangkan lainnya menjadi lokasi tambahan yang tetap valid untuk absensi.</div>
          </DialogBody>
          <DialogFooter className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
            <Button variant="outline" className="h-10 rounded-xl" disabled={assignmentSaving} onClick={() => setAssignmentDialogOpen(false)}>Batal</Button>
            <Button className="h-10 rounded-xl" disabled={assignmentSaving || assignmentWorksiteIds.length === 0} onClick={() => void saveAssignment()}>
              {assignmentWorksiteIds.length === 0 ? 'Pilih Minimal Satu Lokasi' : assignmentSaving ? 'Menyimpan...' : 'Simpan Penugasan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SectionShell>
  );
}
