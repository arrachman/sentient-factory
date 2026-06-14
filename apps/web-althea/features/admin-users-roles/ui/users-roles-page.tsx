'use client';

import { useMemo, useState } from 'react';
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUserList,
} from '../hooks/use-users';
import {
  EMPTY_FORM,
  type Tab,
} from '../model/role-config';
import { formatLastLogin } from '../model/format';
import type { ClinicRoleName, ClinicUser, CreateUserInput } from '../model/types';
import { PermissionMatrix } from './permission-matrix';
import { RoleCardsGrid } from './role-cards-grid';
import { UserFormDialog } from './user-form-dialog';
import { UsersStatsStrip } from './users-stats-strip';
import { UsersTable } from './users-table';
import { UsersToolbar } from './users-toolbar';

export function UsersRolesPage() {
  const [tab, setTab] = useState<Tab>('users');
  const [roleFilter, setRoleFilter] = useState<'all' | ClinicRoleName>('all');
  const [editing, setEditing] = useState<ClinicUser | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateUserInput>(EMPTY_FORM);

  const list = useUserList({ role: roleFilter === 'all' ? undefined : roleFilter, limit: 200 });
  const createMut = useCreateUser();
  const updateMut = useUpdateUser();
  const deleteMut = useDeleteUser();

  const items = list.data?.data ?? [];

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

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(u: ClinicUser) {
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

  function handleDelete(u: ClinicUser) {
    if (!confirm(`Hapus user "${u.fullName || u.email}"?`)) return;
    deleteMut.mutate(u.id);
    close();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      const { email: _e, username: _u, password, ...rest } = form;
      const input = password && password.length > 0 ? { ...rest, password } : rest;
      updateMut.mutate({ id: editing.id, input }, { onSuccess: close });
    } else {
      createMut.mutate(form, { onSuccess: close });
    }
  }

  const submitting = createMut.isPending || updateMut.isPending;

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 100px)' }}>
      <UsersToolbar
        tab={tab}
        onChangeTab={setTab}
        totalUsers={stats.total}
        onCreate={openCreate}
      />

      <UsersStatsStrip stats={stats} />

      <div style={{ flex: 1, minHeight: 0, padding: '0 24px 24px', overflow: 'auto' }}>
        {tab === 'users' && (
          <UsersTable
            items={items}
            isLoading={list.isLoading}
            totalCount={stats.total}
            roleCounts={roleCounts}
            roleFilter={roleFilter}
            onChangeRoleFilter={setRoleFilter}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
        {tab === 'roles' && <RoleCardsGrid roleCounts={roleCounts} />}
        {tab === 'matrix' && <PermissionMatrix />}
      </div>

      {open && (
        <UserFormDialog
          editing={editing}
          form={form}
          onChangeForm={setForm}
          onToggleRole={toggleRole}
          onSubmit={handleSubmit}
          onClose={close}
          submitting={submitting}
        />
      )}
    </div>
  );
}
