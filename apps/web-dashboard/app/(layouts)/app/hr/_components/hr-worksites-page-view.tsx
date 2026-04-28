'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { divIcon } from 'leaflet';
import { MapPin, MapPinned, Plus, Search } from 'lucide-react';
import { Circle, MapContainer, Marker, TileLayer, ZoomControl, useMap, useMapEvents } from 'react-leaflet';
import { toast } from 'sonner';
import {
  Toolbar,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

type AssignedWorksiteRow = {
  id: number;
  name: string;
  code: string;
  radiusMeters: number;
  isPrimary: boolean;
};

type WorksiteRow = {
  id: number;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  isActive: boolean;
};

type AttendanceUserOption = {
  hrUserId: number;
  appUserId: number;
  employeeCode: string | null;
  faceEnrollmentStatus: string;
  employeeRoleType: string;
  isActive: boolean;
  username: string;
  fullName: string | null;
  defaultWorksiteName: string | null;
  assignedWorksites: AssignedWorksiteRow[];
};

type WorksitesPayload = {
  data: WorksiteRow[];
};

type ApiEnvelope<T> = {
  success?: boolean;
  data: T;
};

type GeofenceSearchResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

const DEFAULT_WORKSITE_LATITUDE = -5.145;
const DEFAULT_WORKSITE_LONGITUDE = 119.432;

function SectionShell({
  title,
  children,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={cn('mx-auto space-y-6 pb-6', wide ? 'w-full max-w-[1400px] px-4 sm:px-6 xl:px-8' : 'max-w-3xl px-4 sm:px-5')}>
      <div className="pb-2">
        <ToolbarHeading>
          <ToolbarPageTitle>{title}</ToolbarPageTitle>
        </ToolbarHeading>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function normalizeNumericValue(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (value && typeof value === 'object') {
    const decimalLike = value as { s?: number; e?: number; d?: number[] };
    if (Array.isArray(decimalLike.d)) {
      const serialized = decimalLike.d.join('');
      const exponent = typeof decimalLike.e === 'number' ? decimalLike.e : serialized.length - 1;
      const sign = decimalLike.s === -1 ? -1 : 1;
      const decimal = Number(`${sign < 0 ? '-' : ''}${serialized[0] ?? '0'}${serialized.length > 1 ? `.${serialized.slice(1)}` : ''}e${exponent}`);
      return Number.isFinite(decimal) ? decimal : 0;
    }
  }
  return 0;
}

function normalizeWorksiteRow(row: Record<string, unknown>): WorksiteRow {
  return {
    id: Number(row.id ?? 0),
    name: String(row.name ?? ''),
    code: String(row.code ?? ''),
    latitude: normalizeNumericValue(row.latitude),
    longitude: normalizeNumericValue(row.longitude),
    radiusMeters: normalizeNumericValue(row.radiusMeters),
    isActive: Boolean(row.isActive),
  };
}

function normalizeAssignedWorksiteRow(row: Record<string, unknown>): AssignedWorksiteRow {
  return {
    id: Number(row.id ?? 0),
    name: String(row.name ?? row.worksiteName ?? ''),
    code: String(row.code ?? row.worksiteCode ?? ''),
    radiusMeters: row.radiusMeters == null ? 0 : normalizeNumericValue(row.radiusMeters),
    isPrimary: Boolean(row.isPrimary),
  };
}

function normalizeAttendanceUserOption(row: Record<string, unknown>): AttendanceUserOption {
  return {
    hrUserId: Number(row.hrUserId ?? 0),
    appUserId: Number(row.appUserId ?? 0),
    employeeCode: typeof row.employeeCode === 'string' ? row.employeeCode : null,
    faceEnrollmentStatus: String(row.faceEnrollmentStatus ?? 'not_enrolled'),
    employeeRoleType: String(row.employeeRoleType ?? 'employee'),
    isActive: Boolean(row.isActive),
    username: String(row.username ?? ''),
    fullName: typeof row.fullName === 'string' ? row.fullName : null,
    defaultWorksiteName: typeof row.defaultWorksiteName === 'string' ? row.defaultWorksiteName : null,
    assignedWorksites: Array.isArray(row.assignedWorksites)
      ? row.assignedWorksites
          .filter((entry): entry is Record<string, unknown> => Boolean(entry && typeof entry === 'object'))
          .map((entry) => normalizeAssignedWorksiteRow(entry))
      : [],
  };
}

async function fetchJson<T>(url: string): Promise<ApiEnvelope<T> | null> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) return null;
  return (await response.json()) as ApiEnvelope<T>;
}

async function putJson<T>(url: string, body: Record<string, unknown>) {
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = (await response.json().catch(() => null)) as (ApiEnvelope<T> & { message?: string; error?: string }) | null;
  if (!response.ok) {
    throw new Error(payload?.message ?? payload?.error ?? 'Request failed.');
  }
  return payload;
}

function getInitials(value: string | null | undefined) {
  if (!value) return 'HR';
  const parts = value.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (parts.length === 0) return 'HR';
  return parts.map((part) => part.charAt(0).toUpperCase()).join('');
}

const worksiteMarkerIcon = divIcon({
  className: '',
  html:
    '<div class="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 shadow-[0_0_0_6px_rgba(59,130,246,0.12)]"><div class="h-2.5 w-2.5 rounded-full bg-white"></div></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function MapViewportSync({ latitude, longitude }: { latitude: number; longitude: number }) {
  const map = useMap();

  useEffect(() => {
    const syncMap = () => {
      map.invalidateSize();
      map.setView([latitude, longitude], map.getZoom(), { animate: false });
    };
    syncMap();
    const timers = [80, 220, 500].map((delay) => window.setTimeout(syncMap, delay));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [latitude, longitude, map]);

  return null;
}

function WorksiteMapPicker({
  latitude,
  longitude,
  radiusMeters,
  onChange,
}: {
  latitude: number;
  longitude: number;
  radiusMeters: number;
  onChange: (nextLatitude: number, nextLongitude: number) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeofenceSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  function LocationEvents() {
    useMapEvents({
      click(event) {
        onChange(event.latlng.lat, event.latlng.lng);
      },
    });
    return null;
  }

  async function searchLocation() {
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setSearching(true);
    setSearchError(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(query)}`,
        { headers: { Accept: 'application/json' } },
      );

      if (!response.ok) {
        throw new Error('Pencarian lokasi gagal.');
      }

      const results = (await response.json()) as GeofenceSearchResult[];
      setSearchResults(results);
      if (results.length === 0) {
        setSearchError('Lokasi tidak ditemukan. Coba nama jalan, area, atau kota yang lebih spesifik.');
      }
    } catch (error) {
      setSearchResults([]);
      setSearchError(error instanceof Error ? error.message : 'Pencarian lokasi gagal.');
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="relative h-[430px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
      <div className="absolute left-4 right-4 top-4 z-[500] space-y-2">
        <div className="flex items-center justify-between gap-3 rounded-xl bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
          <div>
            <p className="text-sm font-semibold text-slate-900">Peta Geofence</p>
            <p className="text-xs text-slate-500">Klik peta untuk memindahkan pin lokasi kerja.</p>
          </div>
          <Badge className="border-0 bg-blue-100 text-blue-700">{radiusMeters} m</Badge>
        </div>
        <div className="flex gap-2 rounded-xl bg-white/95 p-3 shadow-sm backdrop-blur">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  void searchLocation();
                }
              }}
              className="h-11 rounded-xl border-slate-200 bg-white pl-10"
              placeholder="Cari lokasi..."
            />
          </div>
          <Button
            type="button"
            className="h-11 rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-700"
            disabled={searching}
            onClick={() => void searchLocation()}
          >
            {searching ? '...' : 'Cari'}
          </Button>
        </div>
        {searchError ? <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700 shadow-sm">{searchError}</div> : null}
        {searchResults.length > 0 ? (
          <div className="max-h-48 overflow-auto rounded-xl bg-white/95 p-2 shadow-sm backdrop-blur">
            {searchResults.map((result) => (
              <button
                key={result.place_id}
                type="button"
                className="flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left hover:bg-slate-50"
                onClick={() => {
                  onChange(Number(result.lat), Number(result.lon));
                  setSearchResults([]);
                  setSearchError(null);
                }}
              >
                <MapPin className="mt-0.5 size-4 shrink-0 text-blue-600" />
                <span className="line-clamp-2 text-slate-700">{result.display_name}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="absolute inset-0">
        <MapContainer
          center={[latitude, longitude] as [number, number]}
          zoom={16}
          scrollWheelZoom
          zoomControl={false}
          className="geofence-map-canvas h-full w-full"
          style={{ height: '100%', width: '100%' }}
        >
          <ZoomControl position="topright" />
          <MapViewportSync latitude={latitude} longitude={longitude} />
          <LocationEvents />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Circle
            center={[latitude, longitude] as [number, number]}
            radius={radiusMeters}
            pathOptions={{ color: '#2563eb', fillColor: '#93c5fd', fillOpacity: 0.18 }}
          />
          <Marker
            position={[latitude, longitude] as [number, number]}
            draggable
            icon={worksiteMarkerIcon}
            eventHandlers={{
              dragend(event) {
                const marker = event.target as { getLatLng: () => { lat: number; lng: number } };
                const point = marker.getLatLng();
                onChange(point.lat, point.lng);
              },
            }}
          />
        </MapContainer>
      </div>
    </div>
  );
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

    setPayload(
      worksiteData
        ? {
            data: (worksiteData.data ?? []).map((row) => normalizeWorksiteRow(row)),
          }
        : null,
    );
    setAttendanceUsers((userData?.data ?? []).map((row) => normalizeAttendanceUserOption(row)));
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleCreate() {
    setSubmitting(true);
    try {
      await fetch('/api/hr/worksites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          code,
          latitude: Number(latitude),
          longitude: Number(longitude),
          radiusMeters: Number(radiusMeters),
          isActive: true,
        }),
      });
      setName('');
      setCode('');
      setLatitude('');
      setLongitude('');
      setRadiusMeters('100');
      setCreateDialogOpen(false);
      await load();
    } finally {
      setSubmitting(false);
    }
  }

  function openCreateDialog() {
    setName('');
    setCode('');
    setLatitude(String(DEFAULT_WORKSITE_LATITUDE));
    setLongitude(String(DEFAULT_WORKSITE_LONGITUDE));
    setRadiusMeters('100');
    setCreateDialogOpen(true);
  }

  function closeCreateDialog() {
    setCreateDialogOpen(false);
  }

  function openEditDialog(worksite: WorksiteRow) {
    setEditWorksiteId(worksite.id);
    setEditName(worksite.name);
    setEditCode(worksite.code);
    setEditLatitude(String(worksite.latitude));
    setEditLongitude(String(worksite.longitude));
    setEditRadiusMeters(String(worksite.radiusMeters));
    setEditIsActive(worksite.isActive);
    setEditDialogOpen(true);
  }

  async function handleEdit() {
    if (editWorksiteId == null) return;

    setEditSubmitting(true);
    try {
      await putJson(`/api/hr/worksites/${editWorksiteId}`, {
        name: editName,
        code: editCode,
        latitude: Number(editLatitude),
        longitude: Number(editLongitude),
        radiusMeters: Number(editRadiusMeters),
        isActive: editIsActive,
      });
      toast.success('Lokasi kerja berhasil diperbarui.');
      setEditDialogOpen(false);
      setEditWorksiteId(null);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal memperbarui lokasi kerja.');
    } finally {
      setEditSubmitting(false);
    }
  }

  function closeEditDialog() {
    setEditDialogOpen(false);
    setEditWorksiteId(null);
  }

  function openAssignmentDialog(user: AttendanceUserOption) {
    setAssignmentDialogUser(user);
    setAssignmentWorksiteIds(user.assignedWorksites.map((worksite) => worksite.id));
    setAssignmentDialogOpen(true);
  }

  async function saveAssignment() {
    if (!assignmentDialogUser) return;

    setAssignmentSaving(true);
    try {
      await putJson(`/api/hr/users/${assignmentDialogUser.appUserId}/worksites`, {
        worksiteIds: assignmentWorksiteIds,
      });
      toast.success('Penugasan tempat kerja berhasil disimpan.');
      setAssignmentDialogOpen(false);
      setAssignmentDialogUser(null);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan penugasan tempat kerja.');
    } finally {
      setAssignmentSaving(false);
    }
  }

  const filteredUsers = attendanceUsers.filter((user) => {
    const haystack = [
      user.fullName ?? '',
      user.username,
      user.employeeCode ?? '',
      user.defaultWorksiteName ?? '',
      user.assignedWorksites.map((worksite) => worksite.name).join(' '),
    ]
      .join(' ')
      .toLowerCase();

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
            <div className="space-y-5">
              {(payload?.data ?? []).length === 0 ? (
                <div className="rounded-2xl bg-white px-5 py-8 text-sm text-slate-500 shadow-sm">Belum ada lokasi kerja.</div>
              ) : (
                (payload?.data ?? []).map((worksite) => (
                  <button
                    key={worksite.id}
                    type="button"
                    className="group w-full rounded-2xl bg-white px-5 py-5 text-left shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-blue-100"
                    onClick={() => openEditDialog(worksite)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-slate-800">{worksite.name}</p>
                        <p className="mt-1 text-sm font-medium text-slate-500">{worksite.code}</p>
                      </div>
                      <Badge
                        className={cn(
                          'shrink-0 rounded-lg border-0 px-3 py-1 text-[11px] font-bold uppercase tracking-wide',
                          worksite.isActive ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-500',
                        )}
                      >
                        {worksite.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPinned className="size-4 text-slate-400" />
                        Radius: {worksite.radiusMeters}m
                      </p>
                      <span className="text-xs font-semibold text-blue-600 opacity-0 transition group-hover:opacity-100">Edit</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="space-y-4">
            <p className="px-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Editor Penugasan Tempat Kerja Pegawai</p>
            <Card className="overflow-hidden border-0 bg-white shadow-sm ring-1 ring-slate-100">
              <CardContent className="space-y-4 p-5">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={userSearch}
                    onChange={(event) => setUserSearch(event.target.value)}
                    placeholder="Cari nama pegawai, EMP-ID, atau lokasi kerja..."
                    className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-11 text-sm shadow-none"
                  />
                </div>
                <div className="max-h-[560px] divide-y divide-slate-100 overflow-auto">
                  {filteredUsers.length === 0 ? (
                    <div className="px-1 py-8 text-sm text-slate-500">Pegawai tidak ditemukan.</div>
                  ) : (
                    filteredUsers.map((user, index) => {
                      const displayName = user.fullName ?? user.username;
                      const primaryWorksite = user.assignedWorksites[0];
                      const avatarTones = [
                        'bg-blue-100 text-blue-600',
                        'bg-indigo-100 text-indigo-600',
                        'bg-slate-100 text-slate-600',
                        'bg-emerald-100 text-emerald-600',
                      ];

                      return (
                        <div key={user.appUserId} className="flex items-center gap-4 px-1 py-4">
                          <div
                            className={cn(
                              'flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                              avatarTones[index % avatarTones.length],
                            )}
                          >
                            {getInitials(displayName)}
                          </div>
                          <button type="button" className="min-w-0 flex-1 text-left" onClick={() => openAssignmentDialog(user)}>
                            <p className="truncate text-sm font-semibold text-slate-800">{displayName}</p>
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {primaryWorksite ? (
                                <>
                                  <Badge className="max-w-full rounded-md border-0 bg-blue-100 px-2 py-1 text-[11px] font-semibold text-blue-700">
                                    <span className="truncate">{primaryWorksite.name}</span>
                                  </Badge>
                                  {user.assignedWorksites.length > 1 ? (
                                    <Badge className="rounded-md border-0 bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">
                                      +{user.assignedWorksites.length - 1}
                                    </Badge>
                                  ) : null}
                                </>
                              ) : (
                                <Badge className="rounded-md border-0 bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">Belum diatur</Badge>
                              )}
                            </div>
                          </button>
                          <Button
                            variant="ghost"
                            className="h-8 rounded-lg px-3 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                            onClick={() => openAssignmentDialog(user)}
                          >
                            Atur
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={createDialogOpen} onOpenChange={(open) => (open ? setCreateDialogOpen(true) : closeCreateDialog())}>
        <DialogContent className="max-w-[980px] overflow-hidden rounded-2xl border-0 p-0 shadow-[0px_18px_60px_rgba(15,23,42,0.18)]">
          <DialogHeader className="border-b border-slate-100 px-5 py-4">
            <DialogTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
              <span className="flex size-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <MapPinned className="size-4" />
              </span>
              <span>Tambah Lokasi Kerja</span>
            </DialogTitle>
            <DialogDescription className="pl-12 text-sm text-slate-500">
              Tentukan lokasi lewat peta, lalu atur radius geofence dengan slider.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="px-5 py-5">
            <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
              <div className="space-y-4">
                <div className="grid gap-3">
                  <Field label="NAMA LOKASI">
                    <Input className="h-10 rounded-xl" value={name} onChange={(event) => setName(event.target.value)} placeholder="Head Office" />
                  </Field>
                  <Field label="KODE">
                    <Input className="h-10 rounded-xl" value={code} onChange={(event) => setCode(event.target.value)} placeholder="HQ" />
                  </Field>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Koordinat Dipilih</p>
                    <MapPin className="size-4 text-blue-600" />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Latitude</Label>
                      <Input className="h-9 rounded-lg bg-white px-2 text-xs" value={latitude} onChange={(event) => setLatitude(event.target.value)} placeholder="-6.200000" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Longitude</Label>
                      <Input className="h-9 rounded-lg bg-white px-2 text-xs" value={longitude} onChange={(event) => setLongitude(event.target.value)} placeholder="106.816666" />
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Radius Geofence</p>
                    <span className="text-sm font-semibold text-slate-900">{radiusMeters} meter</span>
                  </div>
                  <div className="mt-4">
                    <Slider value={[Number(radiusMeters) || 100]} min={50} max={1000} step={10} onValueChange={(value) => setRadiusMeters(String(value[0] ?? 100))} />
                  </div>
                </div>
                <div className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-5 text-blue-700">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-blue-600">
                    <MapPinned className="size-4" />
                  </span>
                  <span>Klik peta untuk memindahkan pin. Lokasi yang dipilih akan menjadi pusat geofence.</span>
                </div>
              </div>
              <div className="min-w-0">
                <WorksiteMapPicker
                  latitude={Number(latitude) || DEFAULT_WORKSITE_LATITUDE}
                  longitude={Number(longitude) || DEFAULT_WORKSITE_LONGITUDE}
                  radiusMeters={Number(radiusMeters) || 100}
                  onChange={(nextLatitude, nextLongitude) => {
                    setLatitude(String(nextLatitude));
                    setLongitude(String(nextLongitude));
                  }}
                />
              </div>
            </div>
          </DialogBody>
          <DialogFooter className="flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-5 py-4">
            <Button variant="outline" className="h-10 rounded-xl px-5" disabled={submitting} onClick={closeCreateDialog}>
              Batal
            </Button>
            <Button className="h-10 rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-700" onClick={() => void handleCreate()} disabled={submitting || !name || !code}>
              {submitting ? 'Menyimpan...' : 'Simpan Lokasi Kerja'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={(open) => (open ? setEditDialogOpen(true) : closeEditDialog())}>
        <DialogContent className="max-w-[980px] overflow-hidden rounded-2xl border-0 p-0 shadow-[0px_18px_60px_rgba(15,23,42,0.18)]">
          <DialogHeader className="border-b border-slate-100 px-5 py-4">
            <DialogTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
              <span className="flex size-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <MapPinned className="size-4" />
              </span>
              <span>Edit Lokasi Kerja</span>
            </DialogTitle>
            <DialogDescription className="pl-12 text-sm text-slate-500">
              Ubah lokasi lewat peta, lalu atur radius geofence dan status aktif.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="px-5 py-5">
            <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
              <div className="space-y-4">
                <div className="grid gap-3">
                  <Field label="NAMA LOKASI">
                    <Input className="h-10 rounded-xl" value={editName} onChange={(event) => setEditName(event.target.value)} placeholder="Head Office" />
                  </Field>
                  <Field label="KODE">
                    <Input className="h-10 rounded-xl" value={editCode} onChange={(event) => setEditCode(event.target.value)} placeholder="HQ" />
                  </Field>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Koordinat Dipilih</p>
                    <MapPin className="size-4 text-blue-600" />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Latitude</Label>
                      <Input className="h-9 rounded-lg bg-white px-2 text-xs" value={editLatitude} onChange={(event) => setEditLatitude(event.target.value)} placeholder="-6.200000" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Longitude</Label>
                      <Input className="h-9 rounded-lg bg-white px-2 text-xs" value={editLongitude} onChange={(event) => setEditLongitude(event.target.value)} placeholder="106.816666" />
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Radius Geofence</p>
                    <span className="text-sm font-semibold text-slate-900">{editRadiusMeters} meter</span>
                  </div>
                  <div className="mt-4">
                    <Slider value={[Number(editRadiusMeters) || 100]} min={50} max={1000} step={10} onValueChange={(value) => setEditRadiusMeters(String(value[0] ?? 100))} />
                  </div>
                </div>
                <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Status Aktif</p>
                    <p className="text-xs leading-5 text-slate-500">Nonaktifkan jika lokasi tidak lagi dipakai.</p>
                  </div>
                  <Checkbox checked={editIsActive} onCheckedChange={(checked) => setEditIsActive(checked === true)} />
                </label>
                <div className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-5 text-blue-700">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-blue-600">
                    <MapPinned className="size-4" />
                  </span>
                  <span>Klik peta untuk memindahkan pin. Lokasi yang dipilih akan menjadi pusat geofence.</span>
                </div>
              </div>
              <div className="min-w-0">
                <WorksiteMapPicker
                  latitude={Number(editLatitude) || DEFAULT_WORKSITE_LATITUDE}
                  longitude={Number(editLongitude) || DEFAULT_WORKSITE_LONGITUDE}
                  radiusMeters={Number(editRadiusMeters) || 100}
                  onChange={(nextLatitude, nextLongitude) => {
                    setEditLatitude(String(nextLatitude));
                    setEditLongitude(String(nextLongitude));
                  }}
                />
              </div>
            </div>
          </DialogBody>
          <DialogFooter className="flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-5 py-4">
            <Button variant="outline" className="h-10 rounded-xl px-5" disabled={editSubmitting} onClick={closeEditDialog}>
              Batal
            </Button>
            <Button className="h-10 rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-700" disabled={editSubmitting || !editName || !editCode} onClick={() => void handleEdit()}>
              {editSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={assignmentDialogOpen} onOpenChange={setAssignmentDialogOpen}>
        <DialogContent className="max-w-xl rounded-2xl border-0 p-0 shadow-[0px_18px_60px_rgba(15,23,42,0.18)]">
          <DialogHeader className="border-b border-slate-200 px-5 py-4">
            <DialogTitle className="text-lg font-semibold text-slate-900">Atur Tempat Kerja Pegawai</DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Pilih satu atau beberapa lokasi kerja untuk {assignmentDialogUser?.fullName ?? assignmentDialogUser?.username ?? 'pegawai ini'}.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4 px-5 py-4">
            <div className="grid max-h-[50vh] gap-2 overflow-auto pr-1">
              {(payload?.data ?? []).map((worksite) => {
                const checked = assignmentWorksiteIds.includes(worksite.id);
                return (
                  <label
                    key={worksite.id}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition-colors',
                      checked ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50',
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(next) => {
                        setAssignmentWorksiteIds((current) => {
                          if (next === true) {
                            return current.includes(worksite.id) ? current : [...current, worksite.id];
                          }
                          return current.filter((id) => id !== worksite.id);
                        });
                      }}
                      className="mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-slate-900">{worksite.name}</p>
                        <Badge className={cn('border-0 text-[11px]', checked ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600')}>
                          {worksite.code}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        Radius {worksite.radiusMeters} m • {worksite.latitude}, {worksite.longitude}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
              Lokasi pertama akan disimpan sebagai lokasi utama, sedangkan lainnya menjadi lokasi tambahan yang tetap valid untuk absensi.
            </div>
          </DialogBody>
          <DialogFooter className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
            <Button variant="outline" className="h-10 rounded-xl" disabled={assignmentSaving} onClick={() => setAssignmentDialogOpen(false)}>
              Batal
            </Button>
            <Button className="h-10 rounded-xl" disabled={assignmentSaving || assignmentWorksiteIds.length === 0} onClick={() => void saveAssignment()}>
              {assignmentWorksiteIds.length === 0 ? 'Pilih Minimal Satu Lokasi' : assignmentSaving ? 'Menyimpan...' : 'Simpan Penugasan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SectionShell>
  );
}
