'use client';

/**
 * F2 Admin — User Management page.
 * Lists adm_users; supports create, edit, toggle active, delete.
 * Atomic tier: Page.
 */

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from '@/components/organisms/modal';
import { ErpListLayout } from '@/components/organisms/erp-list-layout';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from '@/components/organisms/table';
import { confirmAction } from '@/lib/feedback';
import { notify } from '@/lib/feedback';
import { useErpList } from '@/lib/use-erp-list';
import { listUsers, createUser, updateUser, deleteUser } from '@/lib/api/users';
import type { ErpUser } from '@/lib/api/users';
import {
  UserForm,
  useUserForm,
  toCreatePayload,
  toUpdatePayload,
} from './users-form';

// ─── Table ────────────────────────────────────────────────────────────────────

function UsersTable({
  rows,
  onEdit,
  onToggle,
  onDelete,
}: {
  rows: ErpUser[];
  onEdit: (u: ErpUser) => void;
  onToggle: (u: ErpUser) => void;
  onDelete: (u: ErpUser) => void;
}) {
  return (
    <div className="lines">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableEmpty colSpan={6} />
          ) : (
            rows.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="mono">{u.username}</TableCell>
                <TableCell>{u.fullName}</TableCell>
                <TableCell className="muted">{u.email ?? '—'}</TableCell>
                <TableCell>
                  <span className="code">{u.erpLevel}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={u.isActive ? 'success' : 'default'} dot>
                    {u.isActive ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn sm" onClick={() => onEdit(u)}>
                      Edit
                    </button>
                    <button
                      className="btn sm ghost"
                      onClick={() => onToggle(u)}
                    >
                      {u.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                    <button
                      className="btn sm danger"
                      onClick={() => onDelete(u)}
                    >
                      Hapus
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ErpUsersPage() {
  const { rows, loading, error, reload } = useErpList(() => listUsers());
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ErpUser | null>(null);
  const [saving, setSaving] = React.useState(false);
  const { data, setData } = useUserForm(editing);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    return q
      ? rows.filter(
          (r) =>
            r.username.toLowerCase().includes(q) ||
            r.fullName.toLowerCase().includes(q) ||
            (r.email ?? '').toLowerCase().includes(q),
        )
      : rows;
  }, [rows, search]);

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (u: ErpUser) => {
    setEditing(u);
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateUser(editing.id, toUpdatePayload(data));
        notify('User diperbarui', 'success');
      } else {
        await createUser(toCreatePayload(data));
        notify('User dibuat', 'success');
      }
      setOpen(false);
      reload();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (u: ErpUser) => {
    confirmAction({
      title: u.isActive ? 'Nonaktifkan user?' : 'Aktifkan user?',
      message: `${u.username} akan ${u.isActive ? 'dinonaktifkan' : 'diaktifkan'}.`,
      variant: u.isActive ? 'warn' : 'primary',
      confirmLabel: u.isActive ? 'Nonaktifkan' : 'Aktifkan',
      onConfirm: async () => {
        try {
          await updateUser(u.id, { isActive: !u.isActive });
          notify(
            `User ${u.isActive ? 'dinonaktifkan' : 'diaktifkan'}`,
            'success',
          );
          reload();
        } catch (e: unknown) {
          notify(e instanceof Error ? e.message : 'Gagal', 'danger');
        }
      },
    });
  };

  const handleDelete = (u: ErpUser) => {
    confirmAction({
      title: 'Hapus user?',
      message: `${u.username} akan dihapus permanen.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await deleteUser(u.id);
          notify('User dihapus', 'success');
          reload();
        } catch (e: unknown) {
          notify(e instanceof Error ? e.message : 'Gagal', 'danger');
        }
      },
    });
  };

  return (
    <>
      <ErpListLayout
        title="Users"
        code="USR"
        loading={loading}
        error={error}
        search={search}
        onSearch={setSearch}
        onAdd={openCreate}
        onRefresh={reload}
      >
        <UsersTable
          rows={filtered}
          onEdit={openEdit}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </ErpListLayout>

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{editing ? 'Edit User' : 'Tambah User'}</ModalTitle>
          </ModalHeader>
          <UserForm editing={editing} data={data} onChange={setData} />
          <ModalFooter>
            <button className="btn ghost" onClick={() => setOpen(false)}>
              Batal
            </button>
            <button
              className="btn primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
