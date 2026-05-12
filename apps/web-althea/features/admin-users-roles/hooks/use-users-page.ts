'use client';

/**
 * Hook orchestrator untuk halaman User & Role.
 * Konsolidasi: tab/filter state, form dialog, mutations, derived stats.
 */
import { useMemo, useState } from 'react';
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUserList,
} from './use-users';
import { EMPTY_FORM, type Tab } from '../model/role-config';
import { formatLastLogin } from '../model/format';
import type {
  ClinicRoleName,
  ClinicUser,
  CreateUserInput,
} from '../model/types';

export function useUsersPage() {
  const [tab, setTab] = useState<Tab>('users');
  const [roleFilter, setRoleFilter] = useState<'all' | ClinicRoleName>('all');
  const [editing, setEditing] = useState<ClinicUser | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateUserInput>(EMPTY_FORM);

  const list = useUserList({
    role: roleFilter === 'all' ? undefined : roleFilter,
    limit: 200,
  });
  const createMut = useCreateUser();
  const updateMut = useUpdateUser();
  const deleteMut = useDeleteUser();

  const items = useMemo<ClinicUser[]>(
    () => list.data?.data ?? [],
    [list.data],
  );

  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((u) => u.isActive).length;
    const inactive = total - active;
    const sedangLogin = items.filter(
      (u) => formatLastLogin(u.lastLogin) === 'Sekarang aktif',
    ).length;
    return { total, active, inactive, sedangLogin };
  }, [items]);

  const roleCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const u of items) {
      for (const r of u.roles) map[r.name] = (map[r.name] ?? 0) + 1;
    }
    return map;
  }, [items]);

  function close() {
    setOpen(false);
    setEditing(null);
  }

  function startCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function startEdit(u: ClinicUser) {
    setEditing(u);
    setForm({
      email: u.email,
      fullName: u.fullName ?? '',
      username: u.username,
      password: '',
      roles: u.roles.map((r) => r.name),
      isActive: u.isActive,
    });
    setOpen(true);
  }

  function toggleRole(roleName: string) {
    if (form.roles.includes(roleName)) {
      setForm({ ...form, roles: form.roles.filter((r) => r !== roleName) });
    } else {
      setForm({ ...form, roles: [...form.roles, roleName] });
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.roles.length === 0) {
      alert('Pilih minimal 1 role');
      return;
    }
    if (editing) {
      const { email: _email, username: _username, ...rest } = form;
      void _email;
      void _username;
      updateMut.mutate(
        { id: editing.id, input: rest },
        { onSuccess: close },
      );
    } else {
      createMut.mutate(form, { onSuccess: close });
    }
  }

  function handleDelete(u: ClinicUser) {
    if (!confirm(`Hapus user "${u.fullName || u.email}"?`)) return;
    deleteMut.mutate(u.id);
    close();
  }

  return {
    tab,
    setTab,
    roleFilter,
    setRoleFilter,
    editing,
    open,
    form,
    setForm,
    items,
    stats,
    roleCounts,
    isLoading: list.isLoading,
    submitting: createMut.isPending || updateMut.isPending,
    close,
    startCreate,
    startEdit,
    toggleRole,
    submit,
    handleDelete,
  };
}
