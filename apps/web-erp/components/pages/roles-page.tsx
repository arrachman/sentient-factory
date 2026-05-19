'use client';

/**
 * F2 Admin — Role Management page.
 * Lists adm_roles; supports create, edit, delete.
 * Atomic tier: Page.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/input';
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
import { confirmAction, notify } from '@/lib/feedback';
import { useErpList } from '@/lib/use-erp-list';
import { listRoles, createRole, updateRole, deleteRole } from '@/lib/api/roles';
import type { ErpRole, CreateRolePayload } from '@/lib/api/roles';

// ─── Form state ───────────────────────────────────────────────────────────────

interface RoleForm {
  code: string;
  name: string;
  description: string;
}

const defaultForm = (): RoleForm => ({ code: '', name: '', description: '' });

function fromRole(r: ErpRole): RoleForm {
  return {
    code: r.code,
    name: r.name,
    description: r.description ?? '',
  };
}

function toPayload(f: RoleForm): CreateRolePayload {
  return {
    code: f.code,
    name: f.name,
    description: f.description || undefined,
  };
}

// ─── Form ─────────────────────────────────────────────────────────────────────

function RoleFormFields({
  data,
  onChange,
}: {
  data: RoleForm;
  onChange: (d: RoleForm) => void;
}) {
  const set = (k: keyof RoleForm, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="rf-code" required>
        <Input
          id="rf-code"
          value={data.code}
          onChange={(e) => set('code', e.target.value)}
          placeholder="ADMIN"
        />
      </FormField>
      <FormField label="Nama" htmlFor="rf-name" required>
        <Input
          id="rf-name"
          value={data.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Administrator"
        />
      </FormField>
      <FormField label="Deskripsi" htmlFor="rf-desc">
        <Textarea
          id="rf-desc"
          value={data.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Opsional"
        />
      </FormField>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ErpRolesPage() {
  const { rows, loading, error, reload } = useErpList(() => listRoles());
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ErpRole | null>(null);
  const [form, setForm] = React.useState<RoleForm>(defaultForm);
  const [saving, setSaving] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    return q
      ? rows.filter(
          (r) =>
            r.code.toLowerCase().includes(q) ||
            r.name.toLowerCase().includes(q),
        )
      : rows;
  }, [rows, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm());
    setOpen(true);
  };

  const openEdit = (r: ErpRole) => {
    setEditing(r);
    setForm(fromRole(r));
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateRole(editing.id, toPayload(form));
        notify('Role diperbarui', 'success');
      } else {
        await createRole(toPayload(form));
        notify('Role dibuat', 'success');
      }
      setOpen(false);
      reload();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (r: ErpRole) => {
    confirmAction({
      title: 'Hapus role?',
      message: `${r.code} — ${r.name} akan dihapus permanen.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await deleteRole(r.id);
          notify('Role dihapus', 'success');
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
        title="Roles"
        code="ROL"
        loading={loading}
        error={error}
        search={search}
        onSearch={setSearch}
        onAdd={openCreate}
        onRefresh={reload}
      >
        <div className="lines">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableEmpty colSpan={4} />
              ) : (
                filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="mono">{r.code}</TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell className="muted">
                      {r.description ?? '—'}
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn sm" onClick={() => openEdit(r)}>
                          Edit
                        </button>
                        <button
                          className="btn sm danger"
                          onClick={() => handleDelete(r)}
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
      </ErpListLayout>

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{editing ? 'Edit Role' : 'Tambah Role'}</ModalTitle>
          </ModalHeader>
          <RoleFormFields data={form} onChange={setForm} />
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
