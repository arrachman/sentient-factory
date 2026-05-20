'use client';

/**
 * Master Data — Location page.
 * Lists md_locations; supports create, edit, delete.
 * Branch FK rendered as a Select populated from /branches.
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
  listLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from '@/lib/api/locations';
import type {
  ErpLocation,
  CreateLocationPayload,
} from '@/lib/api/locations';
import { listBranches } from '@/lib/api/branches';
import type { ErpBranch } from '@/lib/api/branches';

// ─── Form state ───────────────────────────────────────────────────────────────

interface LocationForm {
  code: string;
  name: string;
  branchId: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  phone: string;
  notes: string;
  isActive: boolean;
}

const defaultForm = (): LocationForm => ({
  code: '',
  name: '',
  branchId: '',
  addressLine1: '',
  city: '',
  postalCode: '',
  phone: '',
  notes: '',
  isActive: true,
});

function fromLocation(l: ErpLocation): LocationForm {
  return {
    code: l.code,
    name: l.name,
    branchId: l.branchId ?? '',
    addressLine1: l.addressLine1 ?? '',
    city: l.city ?? '',
    postalCode: l.postalCode ?? '',
    phone: l.phone ?? '',
    notes: l.notes ?? '',
    isActive: l.isActive,
  };
}

function toPayload(f: LocationForm): CreateLocationPayload {
  return {
    code: f.code,
    name: f.name,
    branchId: f.branchId,
    addressLine1: f.addressLine1 || undefined,
    city: f.city || undefined,
    postalCode: f.postalCode || undefined,
    phone: f.phone || undefined,
    notes: f.notes || undefined,
    isActive: f.isActive,
  };
}

// ─── Form ─────────────────────────────────────────────────────────────────────

function LocationFormFields({
  data,
  branches,
  onChange,
}: {
  data: LocationForm;
  branches: ErpBranch[];
  onChange: (d: LocationForm) => void;
}) {
  const set = (k: keyof LocationForm, v: string | boolean) =>
    onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="lf-code" required>
        <Input
          id="lf-code"
          value={data.code}
          onChange={(e) => set('code', e.target.value)}
          placeholder="LOC-001"
        />
      </FormField>
      <FormField label="Nama" htmlFor="lf-name" required>
        <Input
          id="lf-name"
          value={data.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Gudang Utara"
        />
      </FormField>
      <FormField label="Cabang" htmlFor="lf-branch" required>
        <Select
          value={data.branchId}
          onValueChange={(v) => set('branchId', v)}
        >
          <SelectTrigger id="lf-branch">
            <SelectValue placeholder="Pilih cabang" />
          </SelectTrigger>
          <SelectContent>
            {branches.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.code} — {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Alamat" htmlFor="lf-addr">
        <Input
          id="lf-addr"
          value={data.addressLine1}
          onChange={(e) => set('addressLine1', e.target.value)}
          placeholder="Jl. Industri No. 10"
        />
      </FormField>
      <FormField label="Kota" htmlFor="lf-city">
        <Input
          id="lf-city"
          value={data.city}
          onChange={(e) => set('city', e.target.value)}
          placeholder="Bekasi"
        />
      </FormField>
      <FormField label="Kode Pos" htmlFor="lf-zip">
        <Input
          id="lf-zip"
          value={data.postalCode}
          onChange={(e) => set('postalCode', e.target.value)}
          placeholder="17141"
        />
      </FormField>
      <FormField label="Telepon" htmlFor="lf-phone">
        <Input
          id="lf-phone"
          value={data.phone}
          onChange={(e) => set('phone', e.target.value)}
          placeholder="021-8881234"
        />
      </FormField>
      <FormField label="Catatan" htmlFor="lf-notes">
        <Input
          id="lf-notes"
          value={data.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Lokasi penyimpanan bahan baku"
        />
      </FormField>
      <FormField label="Status" htmlFor="lf-active">
        <BooleanRadio
          id="lf-active"
          value={data.isActive}
          onValueChange={(v) => set('isActive', v)}
        />
      </FormField>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ErpLocationsPage() {
  const { rows, loading, error, reload } = useErpList(() => listLocations());
  const [branches, setBranches] = React.useState<ErpBranch[]>([]);
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ErpLocation | null>(null);
  const [form, setForm] = React.useState<LocationForm>(defaultForm);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    listBranches()
      .then((res) => setBranches(res.data))
      .catch(() => setBranches([]));
  }, []);

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

  const openEdit = (l: ErpLocation) => {
    setEditing(l);
    setForm(fromLocation(l));
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateLocation(editing.id, toPayload(form));
        notify('Lokasi diperbarui', 'success');
      } else {
        await createLocation(toPayload(form));
        notify('Lokasi dibuat', 'success');
      }
      setOpen(false);
      reload();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (l: ErpLocation) => {
    confirmAction({
      title: 'Hapus lokasi?',
      message: `${l.code} — ${l.name} akan dihapus permanen.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await deleteLocation(l.id);
          notify('Lokasi dihapus', 'success');
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
        title="Lokasi"
        code="LOC"
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
                <TableHead>Cabang</TableHead>
                <TableHead>Kota</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableEmpty colSpan={6} />
              ) : (
                filtered.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="mono">{l.code}</TableCell>
                    <TableCell>{l.name}</TableCell>
                    <TableCell>
                      {l.branch ? `${l.branch.code} — ${l.branch.name}` : '—'}
                    </TableCell>
                    <TableCell>{l.city ?? '—'}</TableCell>
                    <TableCell>
                      <Badge variant={l.isActive ? 'success' : 'default'} dot>
                        {l.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn sm" onClick={() => openEdit(l)}>
                          Edit
                        </button>
                        <button
                          className="btn sm danger"
                          onClick={() => handleDelete(l)}
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
              {editing ? 'Edit Lokasi' : 'Tambah Lokasi'}
            </ModalTitle>
          </ModalHeader>
          <LocationFormFields
            data={form}
            branches={branches}
            onChange={setForm}
          />
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
