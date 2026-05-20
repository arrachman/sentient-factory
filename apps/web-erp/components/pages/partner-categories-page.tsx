'use client';

/**
 * F3 Master Data — Partner Category page.
 * Lists md_partner_categories; supports create, edit, delete.
 * Flat resource with a `kind` enum (CUSTOMER/SUPPLIER/SALESMAN/GENERAL).
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
import { BooleanRadio } from '@/components/ui/radio-group';
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
  listPartnerCategories,
  createPartnerCategory,
  updatePartnerCategory,
  deletePartnerCategory,
  PARTNER_CATEGORY_KINDS,
} from '@/lib/api/partner-categories';
import type {
  ErpPartnerCategory,
  ErpPartnerCategoryKind,
  CreatePartnerCategoryPayload,
} from '@/lib/api/partner-categories';

// ─── Form state ───────────────────────────────────────────────────────────────

interface PcForm {
  code: string;
  name: string;
  kind: ErpPartnerCategoryKind;
  isActive: boolean;
}

const defaultForm = (): PcForm => ({
  code: '',
  name: '',
  kind: 'CUSTOMER',
  isActive: true,
});

function fromPc(c: ErpPartnerCategory): PcForm {
  return { code: c.code, name: c.name, kind: c.kind, isActive: c.isActive };
}

function toPayload(f: PcForm): CreatePartnerCategoryPayload {
  return { code: f.code, name: f.name, kind: f.kind, isActive: f.isActive };
}

// ─── Form ─────────────────────────────────────────────────────────────────────

function PcFormFields({
  data,
  onChange,
}: {
  data: PcForm;
  onChange: (d: PcForm) => void;
}) {
  const set = (k: keyof PcForm, v: string | boolean) =>
    onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="pc-code" required>
        <Input
          id="pc-code"
          value={data.code}
          onChange={(e) => set('code', e.target.value)}
          placeholder="CUST-RETAIL"
        />
      </FormField>
      <FormField label="Nama" htmlFor="pc-name" required>
        <Input
          id="pc-name"
          value={data.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Retail Customer"
        />
      </FormField>
      <FormField label="Jenis" htmlFor="pc-kind" required>
        <Select
          value={data.kind}
          onValueChange={(v) => set('kind', v as ErpPartnerCategoryKind)}
        >
          <SelectTrigger id="pc-kind">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PARTNER_CATEGORY_KINDS.map((k) => (
              <SelectItem key={k} value={k}>
                {k}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Status" htmlFor="pc-active">
        <BooleanRadio
          id="pc-active"
          value={data.isActive}
          onValueChange={(v) => set('isActive', v)}
        />
      </FormField>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ErpPartnerCategoriesPage() {
  const { rows, loading, error, reload } = useErpList(() =>
    listPartnerCategories(),
  );
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ErpPartnerCategory | null>(null);
  const [form, setForm] = React.useState<PcForm>(defaultForm);
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

  const openEdit = (c: ErpPartnerCategory) => {
    setEditing(c);
    setForm(fromPc(c));
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updatePartnerCategory(editing.id, toPayload(form));
        notify('Kategori partner diperbarui', 'success');
      } else {
        await createPartnerCategory(toPayload(form));
        notify('Kategori partner dibuat', 'success');
      }
      setOpen(false);
      reload();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (c: ErpPartnerCategory) => {
    confirmAction({
      title: 'Hapus kategori partner?',
      message: `${c.code} — ${c.name} akan dihapus permanen.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await deletePartnerCategory(c.id);
          notify('Kategori partner dihapus', 'success');
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
        title="Kategori Partner"
        code="PCAT"
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
                <TableHead>Jenis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableEmpty colSpan={5} />
              ) : (
                filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="mono">{c.code}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell className="muted">{c.kind}</TableCell>
                    <TableCell>
                      <Badge variant={c.isActive ? 'success' : 'default'} dot>
                        {c.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn sm" onClick={() => openEdit(c)}>
                          Edit
                        </button>
                        <button
                          className="btn sm danger"
                          onClick={() => handleDelete(c)}
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
              {editing ? 'Edit Kategori Partner' : 'Tambah Kategori Partner'}
            </ModalTitle>
          </ModalHeader>
          <PcFormFields data={form} onChange={setForm} />
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
