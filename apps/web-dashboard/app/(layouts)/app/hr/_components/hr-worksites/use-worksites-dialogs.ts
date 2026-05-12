'use client';

/**
 * Hook untuk wiring 3 dialog di halaman Lokasi Kerja:
 *  - createDialog (form + map picker)
 *  - editDialog (form + map picker + toggle aktif)
 *  - assignmentDialog (assign worksites ke pegawai)
 *
 * Mengembalikan flat state + handler agar halaman tetap deklaratif.
 */
import { useState } from 'react';
import { toast } from 'sonner';
import {
  DEFAULT_WORKSITE_LATITUDE,
  DEFAULT_WORKSITE_LONGITUDE,
  putJson,
  type AttendanceUserOption,
  type WorksiteRow,
} from '../hr-shared';

export function useWorksitesDialogs(reload: () => Promise<void>) {
  // Create.
  const [createOpen, setCreateOpen] = useState(false);
  const [submittingCreate, setSubmittingCreate] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createCode, setCreateCode] = useState('');
  const [createLat, setCreateLat] = useState('');
  const [createLng, setCreateLng] = useState('');
  const [createRadius, setCreateRadius] = useState('100');

  // Edit.
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editLat, setEditLat] = useState('');
  const [editLng, setEditLng] = useState('');
  const [editRadius, setEditRadius] = useState('100');
  const [editIsActive, setEditIsActive] = useState(true);

  // Assignment.
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [assignmentUser, setAssignmentUser] =
    useState<AttendanceUserOption | null>(null);
  const [assignmentIds, setAssignmentIds] = useState<number[]>([]);
  const [assignmentSaving, setAssignmentSaving] = useState(false);

  function openCreate() {
    setCreateName('');
    setCreateCode('');
    setCreateLat(String(DEFAULT_WORKSITE_LATITUDE));
    setCreateLng(String(DEFAULT_WORKSITE_LONGITUDE));
    setCreateRadius('100');
    setCreateOpen(true);
  }

  async function submitCreate() {
    setSubmittingCreate(true);
    try {
      await fetch('/api/hr/worksites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createName,
          code: createCode,
          latitude: Number(createLat),
          longitude: Number(createLng),
          radiusMeters: Number(createRadius),
          isActive: true,
        }),
      });
      setCreateOpen(false);
      await reload();
    } finally {
      setSubmittingCreate(false);
    }
  }

  function openEdit(worksite: WorksiteRow) {
    setEditId(worksite.id);
    setEditName(worksite.name);
    setEditCode(worksite.code);
    setEditLat(String(worksite.latitude));
    setEditLng(String(worksite.longitude));
    setEditRadius(String(worksite.radiusMeters));
    setEditIsActive(worksite.isActive);
    setEditOpen(true);
  }

  async function submitEdit() {
    if (editId == null) return;
    setSubmittingEdit(true);
    try {
      await putJson(`/api/hr/worksites/${editId}`, {
        name: editName,
        code: editCode,
        latitude: Number(editLat),
        longitude: Number(editLng),
        radiusMeters: Number(editRadius),
        isActive: editIsActive,
      });
      toast.success('Lokasi kerja berhasil diperbarui.');
      setEditOpen(false);
      setEditId(null);
      await reload();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Gagal memperbarui lokasi kerja.',
      );
    } finally {
      setSubmittingEdit(false);
    }
  }

  function openAssignment(user: AttendanceUserOption) {
    setAssignmentUser(user);
    setAssignmentIds(user.assignedWorksites.map((worksite) => worksite.id));
    setAssignmentOpen(true);
  }

  async function submitAssignment() {
    if (!assignmentUser) return;
    setAssignmentSaving(true);
    try {
      await putJson(`/api/hr/users/${assignmentUser.appUserId}/worksites`, {
        worksiteIds: assignmentIds,
      });
      toast.success('Penugasan tempat kerja berhasil disimpan.');
      setAssignmentOpen(false);
      setAssignmentUser(null);
      await reload();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Gagal menyimpan penugasan tempat kerja.',
      );
    } finally {
      setAssignmentSaving(false);
    }
  }

  return {
    create: {
      open: createOpen,
      setOpen: setCreateOpen,
      submitting: submittingCreate,
      submit: () => void submitCreate(),
      open_: openCreate,
      values: {
        name: createName,
        code: createCode,
        latitude: createLat,
        longitude: createLng,
        radiusMeters: createRadius,
        isActive: true,
      },
      handlers: {
        setName: setCreateName,
        setCode: setCreateCode,
        setLatitude: setCreateLat,
        setLongitude: setCreateLng,
        setRadiusMeters: setCreateRadius,
        setIsActive: () => undefined,
      },
    },
    edit: {
      open: editOpen,
      setOpen: (open: boolean) => {
        if (!open) setEditId(null);
        setEditOpen(open);
      },
      submitting: submittingEdit,
      submit: () => void submitEdit(),
      open_: openEdit,
      values: {
        name: editName,
        code: editCode,
        latitude: editLat,
        longitude: editLng,
        radiusMeters: editRadius,
        isActive: editIsActive,
      },
      handlers: {
        setName: setEditName,
        setCode: setEditCode,
        setLatitude: setEditLat,
        setLongitude: setEditLng,
        setRadiusMeters: setEditRadius,
        setIsActive: setEditIsActive,
      },
    },
    assignment: {
      open: assignmentOpen,
      setOpen: setAssignmentOpen,
      saving: assignmentSaving,
      ids: assignmentIds,
      setIds: setAssignmentIds,
      user: assignmentUser,
      submit: () => void submitAssignment(),
      open_: openAssignment,
    },
  };
}
