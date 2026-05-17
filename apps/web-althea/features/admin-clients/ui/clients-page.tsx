'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClientList, useCreateClient } from '../hooks/use-client';
import { type ClientCategory, type CreateClientInput } from '../model/types';
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
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('semua');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ClientCategory | ''>('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateClientInput>(EMPTY);

  const list = useClientList({
    search: search.trim() || undefined,
    status: filter === 'semua' ? undefined : filter,
    category: categoryFilter || undefined,
    limit: 200,
  });
  const createMut = useCreateClient();

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

  function openCreate() {
    setForm(EMPTY);
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
    createMut.mutate(payload, { onSuccess: () => setOpen(false) });
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col p-6">
      <div className="flex flex-1 min-h-0 flex-col gap-3">
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
          onOpen={(id) => router.push(`/admin/clients/${id}`)}
        />
      </div>

      {open && (
        <ClientFormDialog
          editing={null}
          form={form}
          submitting={createMut.isPending}
          onClose={() => setOpen(false)}
          onChangeForm={setForm}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
