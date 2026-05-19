'use client';

/**
 * Master Data — Warehouse page.
 * Lists md_warehouses; supports create, edit, delete.
 * Location FK rendered as a Select populated from /locations.
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
  listWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from '@/lib/api/warehouses';
import type {
  ErpWarehouse,
  CreateWarehousePayload,
} from '@/lib/api/warehouses';
import { listLocations } from '@/lib/api/locations';
import type { ErpLocation } from '@/lib/api/locations';

// ─── Form state ───────────────────────────────────────────────────────────────

interface WarehouseForm {
  code: string;
  name: string;
  locationId: string;
  allowNegativeStock: boolean;
  notes: string;
  isActive: boolean;
}

const defaultForm = (): WarehouseForm => ({
  code: '',
  name: '',
  locationId: '',
  allowNegativeStock: false,
  notes: '',
  isActive: true,
});

function fromWarehouse(w: ErpWarehouse): WarehouseForm {
  return {
    code: w.code,
    name: w.name,
    locationId: w.locationId ?? '',
    allowNegativeStock: w.allowNegativeStock,
    notes: w.notes ?? '',
    isActive: w.isActive,
  };
}

function toPayload(f: WarehouseForm): CreateWarehousePayload {
  return {
    code: f.code,
    name: f.name,
    locationId: f.locationId,
    allowNegativeStock: f.allowNegativeStock,
    notes: f.notes || undefined,
    isActive: f.isActive,
  };
}

// ─── Form ─────────────────────────────────────────────────────────────────────

function WarehouseFormFields({
  data,
  locations,
  onChange,
}: {
  data: WarehouseForm;
  locations: ErpLocation[];
  onChange: (d: WarehouseForm) => void;
}) {
  const set = (k: keyof WarehouseForm, v: string | boolean) =>
    onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="wf-code" required>
        <Input
          id="wf-code"
          value={data.code}
          onChange={(e) => set('code', e.target.value)}
          placeholder="WH-001"
        />
      </FormField>
      <FormField label="Nama" htmlFor="wf-name" required>
        <Input
          id="wf-name"
          value={data.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Gudang Bahan Baku A"
        />
      </FormField>
      <FormField label="Lokasi" htmlFor="wf-loc" required>
        <Select
          value={data.locationId}
          onValueChange={(v) => set('locationId', v)}
        >
          <SelectTrigger id="wf-loc">
            <SelectValue placeholder="Pilih lokasi" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.code} — {l.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Izinkan Stok Negatif" htmlFor="wf-neg">
        <Select
          value={data.allowNegativeStock ? 'yes' : 'no'}
          onValueChange={(v) => set('allowNegativeStock', v === 'yes')}
        >
          <SelectTrigger id="wf-neg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no">Tidak</SelectItem>
            <SelectItem value="yes">Ya</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Catatan" htmlFor="wf-notes">
        <Input
          id="wf-notes"
          value={data.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Gudang utama bahan baku produksi"
        />
      </FormField>
      <FormField label="Status" htmlFor="wf-active">
        <Select
          value={data.isActive ? 'active' : 'inactive'}
          onValueChange={(v) => set('isActive', v === 'active')}
        >
          <SelectTrigger id="wf-active">
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

export function ErpWarehousesPage() {
  const { rows, loading, error, reload } = useErpList(() => listWarehouses());
  const [locations, setLocations] = React.useState<ErpLocation[]>([]);
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ErpWarehouse | null>(null);
  const [form, setForm] = React.useState<WarehouseForm>(defaultForm);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    listLocations()
      .then((res) => setLocations(res.data))
      .catch(() => setLocations([]));
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

  const openEdit = (w: ErpWarehouse) => {
    setEditing(w);
    setForm(fromWarehouse(w));
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateWarehouse(editing.id, toPayload(form));
        notify('Gudang diperbarui', 'success');
      } else {
        await createWarehouse(toPayload(form));
        notify('Gudang dibuat', 'success');
      }
      setOpen(false);
      reload();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (w: ErpWarehouse) => {
    confirmAction({
      title: 'Hapus gudang?',
      message: `${w.code} — ${w.name} akan dihapus permanen.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await deleteWarehouse(w.id);
          notify('Gudang dihapus', 'success');
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
        title="Gudang"
        code="WH"
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
                <TableHead>Lokasi</TableHead>
                <TableHead>Stok Negatif</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableEmpty colSpan={6} />
              ) : (
                filtered.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell className="mono">{w.code}</TableCell>
                    <TableCell>{w.name}</TableCell>
                    <TableCell>
                      {w.location
                        ? `${w.location.code} — ${w.location.name}`
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={w.allowNegativeStock ? 'warn' : 'default'}
                        dot
                      >
                        {w.allowNegativeStock ? 'Diizinkan' : 'Tidak'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={w.isActive ? 'success' : 'default'} dot>
                        {w.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn sm" onClick={() => openEdit(w)}>
                          Edit
                        </button>
                        <button
                          className="btn sm danger"
                          onClick={() => handleDelete(w)}
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
              {editing ? 'Edit Gudang' : 'Tambah Gudang'}
            </ModalTitle>
          </ModalHeader>
          <WarehouseFormFields
            data={form}
            locations={locations}
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
