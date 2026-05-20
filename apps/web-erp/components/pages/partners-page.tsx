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
import { useListPagination } from '@/lib/use-list-pagination';
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
  const [sortBy, setSortBy] = React.useState('createdAt');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('');
  const { page, pageSize, setPage, setPageSize } = useListPagination('partners');

  const [debouncedSearch, setDebouncedSearch] = React.useState(search);
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const isActiveParam =
    statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined;

  // Server-side type filter: CUSTOMER/SUPPLIER map to isCustomer/isSupplier.
  // SALESMAN is not a backend filter (DTO lacks `isSalesman`); fall back to
  // client-side filtering of the current page for that one option.
  const isCustomerParam = typeFilter === 'CUSTOMER' ? true : undefined;
  const isSupplierParam = typeFilter === 'SUPPLIER' ? true : undefined;

  const { rows, meta, loading, error, reload } = useErpList(
    () =>
      listPartners({
        page,
        limit: pageSize,
        search: debouncedSearch || undefined,
        sortBy,
        sortDir,
        isActive: isActiveParam,
        isCustomer: isCustomerParam,
        isSupplier: isSupplierParam,
      }),
    [page, pageSize, debouncedSearch, sortBy, sortDir, isActiveParam, isCustomerParam, isSupplierParam, typeFilter],
  );

  React.useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter, typeFilter, sortBy, sortDir, pageSize]);

  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ErpPartner | null>(null);
  const [form, setForm] = React.useState<PartnerForm>(defaultForm);
  const [saving, setSaving] = React.useState(false);

  // Client-side fallback ONLY for SALESMAN (backend DTO has no isSalesman).
  // For CUSTOMER/SUPPLIER the backend already filters; this passes through.
  const paged = React.useMemo(() => {
    if (typeFilter === 'SALESMAN') return rows.filter((r) => r.isSalesman);
    return rows;
  }, [rows, typeFilter]);

  const totalRows = meta?.total ?? 0;
  const pageCount = meta?.totalPages ?? 1;
  void setSortBy; void setSortDir;

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
  const partnerSummary: SummaryConfig = { metricLabel: 'Σ partner', rowCount: totalRows, totalCount: totalRows };
  const partnerPagination: ListPaginationConfig = { page, pageCount, pageSize, totalRows, onPage: setPage, onPageSize: setPageSize };

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
