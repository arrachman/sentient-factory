'use client';

import { useState } from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUserList,
} from '../hooks/use-users';
import {
  CLINIC_ROLES,
  ROLE_LABEL,
  type ClinicUser,
  type CreateUserInput,
} from '../model/types';

const EMPTY: CreateUserInput = {
  email: '',
  fullName: '',
  username: '',
  password: '',
  roles: ['clinic-intern'],
  isActive: true,
};

export function UsersRolesPage() {
  const [editing, setEditing] = useState<ClinicUser | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateUserInput>(EMPTY);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('');

  const list = useUserList({
    search: search.trim() || undefined,
    role: filterRole || undefined,
    limit: 100,
  });
  const createMut = useCreateUser();
  const updateMut = useUpdateUser();
  const deleteMut = useDeleteUser();

  function close() { setOpen(false); setEditing(null); }
  function openCreate() { setEditing(null); setForm(EMPTY); setOpen(true); }
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

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.roles.length === 0) {
      alert('Pilih minimal 1 role');
      return;
    }
    if (editing) {
      const { email: _e, username: _u, ...rest } = form;
      updateMut.mutate({ id: editing.id, input: rest }, { onSuccess: close });
    } else {
      createMut.mutate(form, { onSuccess: close });
    }
  }

  function handleDelete(u: ClinicUser) {
    if (!confirm(`Hapus user "${u.fullName || u.email}"?`)) return;
    deleteMut.mutate(u.id);
  }

  const items = list.data?.data ?? [];
  const submitting = createMut.isPending || updateMut.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1">Users &amp; Roles</h1>
          <p className="caption mt-1">Kelola user staff klinik dan role assignment.</p>
        </div>
        <button type="button" onClick={openCreate} className="btn btn-primary">
          <Plus className="h-4 w-4" /> Tambah User
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
          <input type="search" placeholder="Cari email, nama, username..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="input-althea pl-9" />
        </div>
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="input-althea max-w-[200px]">
          <option value="">Semua role</option>
          {CLINIC_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
        </select>
      </div>

      <div className="card-althea overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 border-b border-border text-left">
            <tr>
              <th className="px-4 py-2 font-medium">User</th>
              <th className="px-4 py-2 font-medium">Roles</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Last login</th>
              <th className="px-4 py-2 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-b-0 hover:bg-cream-50">
                <td className="px-4 py-2">
                  <div className="font-medium text-teal-800">{u.fullName || u.username}</div>
                  <div className="caption text-fg-muted">{u.email}</div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-1">
                    {u.roles.map((r) => (
                      <span key={r.id} className="badge badge-sage">{ROLE_LABEL[r.name as keyof typeof ROLE_LABEL] || r.name}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2">
                  {u.isActive ? <span className="badge badge-success">Aktif</span> : <span className="badge badge-neutral">Nonaktif</span>}
                </td>
                <td className="px-4 py-2 caption">
                  {u.lastLogin ? new Date(u.lastLogin).toLocaleString('id-ID') : '—'}
                </td>
                <td className="px-4 py-2 text-right">
                  <button type="button" onClick={() => openEdit(u)} className="btn btn-ghost btn-icon" aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => handleDelete(u)} className="btn btn-ghost btn-icon text-danger" aria-label="Hapus">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !list.isLoading && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-fg-muted">Tidak ada user.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className="card-althea w-full max-w-xl bg-card max-h-[90vh] overflow-y-auto">
            <div className="border-b border-border px-6 py-4">
              <h2 className="h2">{editing ? 'Edit User' : 'Tambah User'}</h2>
            </div>
            <form onSubmit={submit} className="space-y-3 px-6 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="caption mb-1 block">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={!!editing} required className="input-althea" />
                </div>
                <div>
                  <label className="caption mb-1 block">Nama Lengkap *</label>
                  <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required className="input-althea" />
                </div>
              </div>
              {!editing && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="caption mb-1 block">Username</label>
                    <input value={form.username ?? ''} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="auto dari email" className="input-althea" />
                  </div>
                  <div>
                    <label className="caption mb-1 block">Password</label>
                    <input type="password" value={form.password ?? ''} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="default Test1234!" className="input-althea" />
                  </div>
                </div>
              )}
              {editing && (
                <div>
                  <label className="caption mb-1 block">Reset Password (kosong = tidak diubah)</label>
                  <input type="password" value={form.password ?? ''} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-althea" />
                </div>
              )}
              <div>
                <label className="caption mb-1 block">Roles * (minimal 1)</label>
                <div className="flex flex-wrap gap-2">
                  {CLINIC_ROLES.map((r) => {
                    const active = form.roles.includes(r);
                    return (
                      <button key={r} type="button" onClick={() => toggleRole(r)}
                        className={`badge cursor-pointer transition ${active ? 'badge-sage' : 'badge-neutral'}`}>
                        {ROLE_LABEL[r]}
                      </button>
                    );
                  })}
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive ?? true} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4" />
                Aktif
              </label>
              <div className="flex justify-end gap-2 border-t border-border pt-3">
                <button type="button" onClick={close} className="btn btn-outline">Batal</button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Menyimpan...' : editing ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
