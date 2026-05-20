'use client';

/**
 * F3 Master Data — Partner page (Customer / Supplier / Employee).
 * Lists md_partners; supports create, edit, delete.
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
import {
  ErpListLayout,
  type FilterConfig,
  type SummaryConfig,
  type ListPaginationConfig,
} from '@/components/organisms/erp-list-layout';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
  CheckboxHead,
  CheckboxCell,
} from '@/components/organisms/table';
import { confirmAction, notify } from '@/lib/feedback';
import { useErpList } from '@/lib/use-erp-list';
import {
  listPartners,
  createPartner,
  updatePartner,
  deletePartner,
} from '@/lib/api/partners';
import type { ErpPartner, CreatePartnerPayload } from '@/lib/api/partners';

// ─── Partner type helper ──────────────────────────────────────────────────────

function partnerType(p: ErpPartner): string {
  const types: string[] = [];
  if (p.isCustomer) types.push('Customer');
  if (p.isSupplier) types.push('Supplier');
  if (p.isSalesman) types.push('Salesman');
  return types.length > 0 ? types.join(', ') : '—';
}

// ─── Form state ───────────────────────────────────────────────────────────────

type PartnerTypeKey = 'CUSTOMER' | 'SUPPLIER' | 'BOTH' | 'SALESMAN';

interface PartnerForm {
  code: string;
  name: string;
  partnerType: PartnerTypeKey;
  taxNumber: string;
  isActive: boolean;
}

const defaultForm = (): PartnerForm => ({
  code: '',
  name: '',
  partnerType: 'CUSTOMER',
  taxNumber: '',
  isActive: true,
});

function fromPartner(p: ErpPartner): PartnerForm {
  let ptype: PartnerTypeKey = 'CUSTOMER';
  if (p.isCustomer && p.isSupplier) ptype = 'BOTH';
  else if (p.isSupplier) ptype = 'SUPPLIER';
  else if (p.isSalesman) ptype = 'SALESMAN';
  return {
    code: p.code,
    name: p.name,
    partnerType: ptype,
    taxNumber: p.taxNumber ?? '',
    isActive: p.isActive,
  };
}

function toPayload(f: PartnerForm): CreatePartnerPayload {
  return {
    code: f.code,
    name: f.name,
    isCustomer: f.partnerType === 'CUSTOMER' || f.partnerType === 'BOTH',
    isSupplier: f.partnerType === 'SUPPLIER' || f.partnerType === 'BOTH',
    isSalesman: f.partnerType === 'SALESMAN',
    taxNumber: f.taxNumber || undefined,
    isActive: f.isActive,
  };
}

// ─── Form ─────────────────────────────────────────────────────────────────────

function PartnerFormFields({
  data,
  onChange,
}: {
  data: PartnerForm;
  onChange: (d: PartnerForm) => void;
}) {
  const set = (k: keyof PartnerForm, v: string | boolean) =>
    onChange({ ...data, [k]: v });

  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="pf-code" required>
        <Input
          id="pf-code"
          value={data.code}
          onChange={(e) => set('code', e.target.value)}
          placeholder="CUST-001"
        />
      </FormField>
      <FormField label="Nama" htmlFor="pf-name" required>
        <Input
          id="pf-name"
          value={data.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="PT Maju Bersama"
        />
      </FormField>
      <FormField label="Tipe" htmlFor="pf-type">
        <Select
          value={data.partnerType}
          onValueChange={(v) => set('partnerType', v as PartnerTypeKey)}
        >
          <SelectTrigger id="pf-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CUSTOMER">Customer</SelectItem>
            <SelectItem value="SUPPLIER">Supplier</SelectItem>
            <SelectItem value="BOTH">Customer & Supplier</SelectItem>
            <SelectItem value="SALESMAN">Salesman</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="NPWP" htmlFor="pf-tax">
        <Input
          id="pf-tax"
          value={data.taxNumber}
          onChange={(e) => set('taxNumber', e.target.value)}
          placeholder="01.234.567.8-901.000"
        />
      </FormField>
      <FormField label="Status" htmlFor="pf-active">
        <BooleanRadio
          id="pf-active"
          value={data.isActive}
          onValueChange={(v) => set('isActive', v)}
        />
      </FormField>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ErpPartnersPage() {
  const { rows, loading, error, reload } = useErpList(() => listPartners());
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ErpPartner | null>(null);
  const [form, setForm] = React.useState<PartnerForm>(defaultForm);
  const [saving, setSaving] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) => {
      if (q && !r.code.toLowerCase().includes(q) && !r.name.toLowerCase().includes(q)) return false;
      if (statusFilter === 'active' && !r.isActive) return false;
      if (statusFilter === 'inactive' && r.isActive) return false;
      if (typeFilter === 'CUSTOMER' && !(r.isCustomer && !r.isSupplier)) return false;
      if (typeFilter === 'SUPPLIER' && !(r.isSupplier && !r.isCustomer)) return false;
      if (typeFilter === 'SALESMAN' && !r.isSalesman) return false;
      return true;
    });
  }, [rows, search, statusFilter, typeFilter]);

  // Reset to page 1 when filters change
  React.useEffect(() => { setPage(1); }, [search, statusFilter, typeFilter]);

  const PAGE_SIZE = 20;
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Selection
  const allSelected = paged.length > 0 && paged.every((r) => selectedIds.has(r.id));
  const someSelected = !allSelected && paged.some((r) => selectedIds.has(r.id));
  const toggleRow = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  const toggleAll = (checked: boolean) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) paged.forEach((r) => next.add(r.id));
      else paged.forEach((r) => next.delete(r.id));
      return next;
    });

  const ALL = { label: 'Semua', value: '' };
  const partnerFilters: FilterConfig[] = [
    { key: 'status', label: 'Status', value: statusFilter, onChange: setStatusFilter,
      options: [ALL, { label: 'Aktif', value: 'active' }, { label: 'Nonaktif', value: 'inactive' }] },
    { key: 'type', label: 'Tipe', value: typeFilter, onChange: setTypeFilter,
      options: [ALL, { label: 'Customer', value: 'CUSTOMER' }, { label: 'Supplier', value: 'SUPPLIER' }, { label: 'Salesman', value: 'SALESMAN' }] },
  ];
  const partnerSummary: SummaryConfig = { metricLabel: 'Σ partner', rowCount: filtered.length, totalCount: rows.length };
  const partnerPagination: ListPaginationConfig = { page, pageCount, pageSize: PAGE_SIZE, totalRows: filtered.length, onPage: setPage };

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm());
    setOpen(true);
  };

  const openEdit = (p: ErpPartner) => {
    setEditing(p);
    setForm(fromPartner(p));
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updatePartner(editing.id, toPayload(form));
        notify('Partner diperbarui', 'success');
      } else {
        await createPartner(toPayload(form));
        notify('Partner dibuat', 'success');
      }
      setOpen(false);
      reload();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (p: ErpPartner) => {
    confirmAction({
      title: 'Hapus partner?',
      message: `${p.code} — ${p.name} akan dihapus permanen.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await deletePartner(p.id);
          notify('Partner dihapus', 'success');
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
        title="Partner"
        code="PTR"
        loading={loading}
        error={error}
        search={search}
        onSearch={setSearch}
        onAdd={openCreate}
        onRefresh={reload}
        onExport={() => notify('Export belum tersedia', 'warn')}
        filters={partnerFilters}
        summary={partnerSummary}
        pagination={partnerPagination}
      >
        <div className="lines">
          <Table>
            <TableHeader>
              <TableRow>
                <CheckboxHead
                  checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                  onCheckedChange={toggleAll}
                />
                <TableHead>Kode</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableEmpty colSpan={6} />
              ) : (
                paged.map((p) => (
                  <TableRow key={p.id} data-selected={selectedIds.has(p.id)}>
                    <CheckboxCell
                      checked={selectedIds.has(p.id)}
                      onCheckedChange={() => toggleRow(p.id)}
                    />
                    <TableCell className="mono">{p.code}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell className="muted text-xs">
                      {partnerType(p)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.isActive ? 'success' : 'default'} dot>
                        {p.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn sm" onClick={() => openEdit(p)}>
                          Edit
                        </button>
                        <button
                          className="btn sm danger"
                          onClick={() => handleDelete(p)}
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
              {editing ? 'Edit Partner' : 'Tambah Partner'}
            </ModalTitle>
          </ModalHeader>
          <PartnerFormFields data={form} onChange={setForm} />
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
