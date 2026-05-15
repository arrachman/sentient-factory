'use client';

import { useMemo, useState } from 'react';
import {
  useClientDetail,
  useClientList,
  useCreateClient,
  useDeactivateClient,
  useDeleteClient,
  useUpdateClient,
} from '../hooks/use-client';
import {
  type Client,
  type ClientCategory,
  type ClientWithHistory as ClientDetail,
  type CreateClientInput,
} from '../model/types';
import { ClientDetailAside } from './client-detail-aside';
import { ClientFormDialog } from './client-form-dialog';
import { ClientsTable } from './clients-table';
import { ClientsToolbar } from './clients-toolbar';

type Filter = 'semua' | 'aktif' | 'baru' | 'selesai';

const EMPTY: CreateClientInput = {
  name: '',
  gender: 'L',
  age: undefined,
  category: undefined,
  phoneWa: '+62',
  medicalRecordNumber: '',
  preferredServiceType: '',
  email: '',
  address: '',
  notes: '',
  waOptedOut: false,
  isActive: true,
};

export function ClientsPage() {
  const [filter, setFilter] = useState<Filter>('semua');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ClientCategory | ''>('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Client | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateClientInput>(EMPTY);

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
  const deactivateMut = useDeactivateClient();

  const items = list.data?.data ?? [];
  const counts = useMemo(() => {
    const all = list.data?.data ?? [];
    return {
      semua: all.length,
      aktif: all.filter((c) => c.derivedStatus === 'aktif').length,
      baru: all.filter((c) => c.derivedStatus === 'baru').length,
      selesai: all.filter((c) => c.derivedStatus === 'selesai').length,
    };
  }, [list.data]);

  const sel = detail.data?.data ?? null;
  const submitting = createMut.isPending || updateMut.isPending;

  function close() { setOpen(false); setEditing(null); }

  function openCreate() { setEditing(null); setForm(EMPTY); setOpen(true); }

  function openEdit(c: Client | ClientDetail) {
    setEditing(c as Client);
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
      isActive: c.isActive,
    });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: CreateClientInput = {
      ...form,
      email: form.email?.trim() || undefined,
      medicalRecordNumber: form.medicalRecordNumber?.trim() || undefined,
      preferredServiceType: form.preferredServiceType?.trim() || undefined,
      address: form.address?.trim() || undefined,
      notes: form.notes?.trim() || undefined,
    };
    if (editing) updateMut.mutate({ id: editing.id, input: payload }, { onSuccess: close });
    else createMut.mutate(payload, { onSuccess: close });
  }

  function handleDelete(c: Client | ClientDetail) {
    if (!confirm(`Hapus klien "${c.name}"?`)) return;
    deleteMut.mutate(c.id, { onSuccess: () => { if (selectedId === c.id) setSelectedId(null); } });
  }

  function handleDeactivate(c: Client | ClientDetail) {
    if (!confirm(`Nonaktifkan klien "${c.name}"?`)) return;
    deactivateMut.mutate(c.id, { onSuccess: () => { if (selectedId === c.id) setSelectedId(null); } });
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col p-6">
      <div className="flex flex-1 min-h-0">
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <ClientsToolbar
            filter={filter}
            counts={counts}
            search={search}
            categoryFilter={categoryFilter}
            onChangeFilter={setFilter}
            onChangeSearch={setSearch}
            onChangeCategory={setCategoryFilter}
            onCreate={openCreate}
          />
          <ClientsTable
            items={items}
            isLoading={list.isLoading}
            totalCount={items.length}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        {selectedId && (
          <ClientDetailAside
            isLoading={detail.isLoading}
            detail={sel}
            onClose={() => setSelectedId(null)}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {open && (
        <ClientFormDialog
          editing={editing}
          form={form}
          submitting={submitting}
          onClose={close}
          onChangeForm={setForm}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
