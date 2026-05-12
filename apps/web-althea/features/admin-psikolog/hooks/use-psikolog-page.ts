'use client';

/**
 * Hook orchestrator untuk halaman Admin · Psikolog:
 *   - filter state, dialog state, selected card
 *   - mutations create/update + submit handler (drop email/username/password
 *     saat editing — backend authoritative untuk identitas)
 */
import { useMemo, useState } from 'react';
import {
  useCreatePsikolog,
  usePsikologList,
  useUpdatePsikolog,
} from './use-psikolog';
import type { CreatePsikologInput, Psikolog } from '../model/types';

export function usePsikologPage() {
  const [filter, setFilter] = useState<string>('all');
  const [editing, setEditing] = useState<Psikolog | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const listQuery = usePsikologList({
    isActive: true,
    specialty: filter === 'all' ? undefined : filter,
    limit: 100,
  });
  const createMut = useCreatePsikolog();
  const updateMut = useUpdatePsikolog();

  const psikologs = useMemo<Psikolog[]>(
    () => listQuery.data?.data ?? [],
    [listQuery.data],
  );

  const selected = useMemo<Psikolog | null>(() => {
    if (psikologs.length === 0) return null;
    if (selectedId !== null) {
      const found = psikologs.find((p) => p.id === selectedId);
      if (found) return found;
    }
    return psikologs[0];
  }, [psikologs, selectedId]);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(p: Psikolog) {
    setEditing(p);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditing(null);
  }

  function submit(input: CreatePsikologInput) {
    if (editing) {
      const {
        email: _email,
        username: _username,
        password: _password,
        ...rest
      } = input;
      void _email;
      void _username;
      void _password;
      updateMut.mutate(
        { id: editing.id, input: rest },
        { onSuccess: closeDialog },
      );
    } else {
      createMut.mutate(input, {
        onSuccess: () => setDialogOpen(false),
      });
    }
  }

  return {
    filter,
    setFilter,
    editing,
    dialogOpen,
    selected,
    setSelectedId,
    psikologs,
    isLoading: listQuery.isLoading,
    submitting: createMut.isPending || updateMut.isPending,
    openCreate,
    openEdit,
    closeDialog,
    submit,
  };
}
