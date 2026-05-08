'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import {
  useCreatePsikolog,
  useDeletePsikolog,
  usePsikologList,
  useUpdatePsikolog,
} from '../hooks/use-psikolog';
import type { CreatePsikologInput, Psikolog } from '../model/types';
import { PsikologForm } from './psikolog-form';
import { PsikologList } from './psikolog-list';

export function PsikologPage() {
  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [editing, setEditing] = useState<Psikolog | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const listQuery = usePsikologList({
    search: search.trim() || undefined,
    isActive: showInactive ? undefined : true,
    limit: 50,
  });

  const createMut = useCreatePsikolog();
  const updateMut = useUpdatePsikolog();
  const deleteMut = useDeletePsikolog();

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(p: Psikolog) {
    setEditing(p);
    setDialogOpen(true);
  }

  function handleSubmit(input: CreatePsikologInput) {
    if (editing) {
      const { email: _email, username: _u, password: _p, ...rest } = input;
      updateMut.mutate(
        { id: editing.id, input: rest },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditing(null);
          },
        },
      );
    } else {
      createMut.mutate(input, {
        onSuccess: () => {
          setDialogOpen(false);
        },
      });
    }
  }

  function handleDelete(p: Psikolog) {
    if (!confirm(`Hapus psikolog ${p.fullName || p.email}?`)) return;
    deleteMut.mutate(p.id);
  }

  const submitting = createMut.isPending || updateMut.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1">Psikolog</h1>
          <p className="caption mt-1">
            Kelola data psikolog: profil, spesialisasi, license, jadwal default.
          </p>
        </div>
        <button type="button" onClick={openCreate} className="btn btn-primary">
          <Plus className="h-4 w-4" />
          Tambah
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
          <input
            type="search"
            placeholder="Cari nama, email, license..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-althea pl-9"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm">Tampilkan nonaktif</span>
        </label>
      </div>

      <PsikologList
        data={listQuery.data?.data ?? []}
        loading={listQuery.isLoading}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      {listQuery.data?.meta && (
        <div className="caption text-right">
          Total: {listQuery.data.meta.total} psikolog
        </div>
      )}

      <PsikologForm
        open={dialogOpen}
        initial={editing}
        submitting={submitting}
        onSubmit={handleSubmit}
        onClose={() => {
          setDialogOpen(false);
          setEditing(null);
        }}
      />
    </div>
  );
}
