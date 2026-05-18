'use client';

/**
 * F2 Admin — Branch Management page.
 * Lists ERP branches; supports create, edit, delete.
 * Atomic tier: Page.
 */

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
  listBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from '@/lib/api/branches';
import type {
  ErpBranch,
  CreateBranchPayload,
  UpdateBranchPayload,
} from '@/lib/api/branches';

// ─── Form state ───────────────────────────────────────────────────────────────

interface BranchForm {
  code: string;
  name: string;
  addressLine1: string;
  city: string;
  phone: string;
  isActive: boolean;
}

const defaultForm = (): BranchForm => ({
  code: '',
  name: '',
  addressLine1: '',
  city: '',
  phone: '',
  isActive: true,
});

function fromBranch(b: ErpBranch): BranchForm {
  return {
    code: b.code,
    name: b.name,
    addressLine1: b.addressLine1 ?? '',
    city: b.city ?? '',
    phone: b.phone ?? '',
    isActive: b.isActive,
  };
}

function toPayload(f: BranchForm): CreateBranchPayload & UpdateBranchPayload {
  return {
    code: f.code,
    name: f.name,
    addressLine1: f.addressLine1 || undefined,
    city: f.city || undefined,
    phone: f.phone || undefined,
    isActive: f.isActive,
  };
}

// ─── Branch form ──────────────────────────────────────────────────────────────

function BranchFormFields({
  data,
  onChange,
}: {
  data: BranchForm;
  onChange: (d: BranchForm) => void;
}) {
  const set = (k: keyof BranchForm, v: string | boolean) =>
    onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="bf-code" required>
        <Input
          id="bf-code"
          value={data.code}
          onChange={(e) => set('code', e.target.value)}
          placeholder="HQ"
        />
      </FormField>
      <FormField label="Nama" htmlFor="bf-name" required>
        <Input
          id="bf-name"
          value={data.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Head Quarter Jakarta"
        />
      </FormField>
      <FormField label="Alamat" htmlFor="bf-addr">
        <Input
          id="bf-addr"
          value={data.addressLine1}
          onChange={(e) => set('addressLine1', e.target.value)}
          placeholder="Jl. Sudirman No. 1"
        />
      </FormField>
      <FormField label="Kota" htmlFor="bf-city">
        <Input
          id="bf-city"
          value={data.city}
          onChange={(e) => set('city', e.target.value)}
          placeholder="Jakarta"
        />
      </FormField>
      <FormField label="Telepon" htmlFor="bf-phone">
        <Input
          id="bf-phone"
          value={data.phone}
          onChange={(e) => set('phone', e.target.value)}
          placeholder="021-5551234"
        />
      </FormField>
      <FormField label="Status" htmlFor="bf-active">
        <Select
          value={data.isActive ? 'active' : 'inactive'}
          onValueChange={(v) => set('isActive', v === 'active')}
        >
          <SelectTrigger id="bf-active">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Nonaktif</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ErpBranchesPage() {
  const { rows, loading, error, reload } = useErpList(() => listBranches());
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ErpBranch | null>(null);
  const [form, setForm] = React.useState<BranchForm>(defaultForm);
  const [saving, setSaving] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    return q
      ? rows.filter(
          (r) =>
            r.code.toLowerCase().includes(q) ||
            r.name.toLowerCase().includes(q) ||
            (r.city ?? '').toLowerCase().includes(q),
        )
      : rows;
  }, [rows, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm());
    setOpen(true);
  };

  const openEdit = (b: ErpBranch) => {
    setEditing(b);
    setForm(fromBranch(b));
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateBranch(editing.id, toPayload(form));
        notify('Cabang diperbarui', 'success');
      } else {
        await createBranch(toPayload(form));
        notify('Cabang dibuat', 'success');
      }
      setOpen(false);
      reload();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (b: ErpBranch) => {
    confirmAction({
      title: 'Hapus cabang?',
      message: `${b.code} — ${b.name} akan dihapus permanen.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await deleteBranch(b.id);
          notify('Cabang dihapus', 'success');
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
        title="Cabang"
        code="BRN"
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
                <TableHead>Kota</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableEmpty colSpan={6} />
              ) : (
                filtered.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="mono">{b.code}</TableCell>
                    <TableCell>{b.name}</TableCell>
                    <TableCell className="muted">{b.city ?? '—'}</TableCell>
                    <TableCell className="muted">{b.phone ?? '—'}</TableCell>
                    <TableCell>
                      <Badge variant={b.isActive ? 'success' : 'default'} dot>
                        {b.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn sm" onClick={() => openEdit(b)}>
                          Edit
                        </button>
                        <button
                          className="btn sm danger"
                          onClick={() => handleDelete(b)}
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
            <ModalTitle>
              {editing ? 'Edit Cabang' : 'Tambah Cabang'}
            </ModalTitle>
          </ModalHeader>
          <BranchFormFields data={form} onChange={setForm} />
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
