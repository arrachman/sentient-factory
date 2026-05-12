'use client';

/**
 * Hook orchestrator untuk halaman Klien.
 *   - Filter (status tab + search + kategori) + selected id
 *   - List & detail query, mutations create/update/delete
 *   - Form state + sanitize submit (empty string → undefined)
 */
import { useMemo, useState } from 'react';
import {
  useClientDetail,
  useClientList,
  useCreateClient,
  useDeleteClient,
  useUpdateClient,
} from './use-client';
import {
  EMPTY_CLIENT,
  sanitizeClientPayload,
  type Filter,
} from '../model/page-helpers';
import type {
  Client,
  ClientCategory,
  CreateClientInput,
} from '../model/types';

export function useClientsPage() {
  const [filter, setFilter] = useState<Filter>('semua');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ClientCategory | ''>(
    '',
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Client | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateClientInput>(EMPTY_CLIENT);

  const list = useClientList({
    search: search.trim() || undefined,
    status: filter === 'semua' ? undefined : filter,
    category: categoryFilter || undefined,
    limit: 200,
  });
  const detail = useClientDetail(selectedId);
  const createMut = useCreateClient();
  const updateMut = useUpdateClient();
  const deleteMut = useDeleteClient();

  const items = useMemo(() => list.data?.data ?? [], [list.data]);
  const counts = useMemo<Record<Filter, number>>(() => {
    const all = list.data?.data ?? [];
    return {
      semua: all.length,
      aktif: all.filter((c) => c.derivedStatus === 'aktif').length,
      baru: all.filter((c) => c.derivedStatus === 'baru').length,
      selesai: all.filter((c) => c.derivedStatus === 'selesai').length,
    };
  }, [list.data]);

  const submitting = createMut.isPending || updateMut.isPending;

  function close() {
    setOpen(false);
    setEditing(null);
  }

  function startCreate() {
    setEditing(null);
    setForm(EMPTY_CLIENT);
    setOpen(true);
  }

  function startEdit(c: Client) {
    setEditing(c);
    setForm({
      name: c.name,
      gender: c.gender,
      age: c.age ?? undefined,
      category: c.category ?? undefined,
      phoneWa: c.phoneWa,
      medicalRecordNumber: c.medicalRecordNumber ?? '',
      preferredServiceType: c.preferredServiceType ?? '',
      email: c.email ?? '',
      address: c.address ?? '',
      notes: c.notes ?? '',
      waOptedOut: c.waOptedOut,
    });
    setOpen(true);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload = sanitizeClientPayload(form);
    if (editing) {
      updateMut.mutate(
        { id: editing.id, input: payload },
        { onSuccess: close },
      );
    } else {
      createMut.mutate(payload, { onSuccess: close });
    }
  }

  function handleDelete(c: Client) {
    if (!confirm(`Hapus klien "${c.name}"?`)) return;
    deleteMut.mutate(c.id, {
      onSuccess: () => {
        if (selectedId === c.id) setSelectedId(null);
      },
    });
  }

  return {
    filter,
    setFilter,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    selectedId,
    setSelectedId,
    editing,
    open,
    form,
    setForm,
    items,
    counts,
    totalCount: list.data?.meta?.total ?? 0,
    isLoadingList: list.isLoading,
    isLoadingDetail: detail.isLoading,
    selDetail: detail.data?.data ?? null,
    submitting,
    close,
    startCreate,
    startEdit,
    submit,
    handleDelete,
  };
}
