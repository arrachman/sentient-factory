'use client';

/**
 * F2 Finance — Giros page (skeleton CRUD).
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
import {
  ErpListLayout,
  type ListPaginationConfig,
  type SummaryConfig,
  type FilterConfig,
} from '@/components/organisms/erp-list-layout';
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
import { useListPagination } from '@/lib/use-list-pagination';
import {
  listGiros,
  createGiro,
  updateGiro,
  deleteGiro,
} from '@/lib/api/fin-giros';
import type {
  ErpGiro,
  ErpGiroType,
  ErpGiroStatus,
  CreateGiroPayload,
} from '@/lib/api/fin-giros';

const GIRO_TYPES: ErpGiroType[] = ['INCOMING', 'OUTGOING'];
const GIRO_STATUSES: ErpGiroStatus[] = ['OUTSTANDING', 'CLEARED', 'BOUNCED', 'CANCELLED'];

interface FormState {
  giroNumber: string;
  type: ErpGiroType;
  partnerId: string;
  bankName: string;
  bankAccountNo: string;
  currencyId: string;
  exchangeRate: string;
  amount: string;
  dueDate: string;
  status: ErpGiroStatus;
  description: string;
  lineNo: number;
}

const defaultForm = (): FormState => ({
  giroNumber: '',
  type: 'INCOMING',
  partnerId: '',
  bankName: '',
  bankAccountNo: '',
  currencyId: '1',
  exchangeRate: '1.000000',
  amount: '0.0000',
  dueDate: new Date().toISOString().slice(0, 10),
  status: 'OUTSTANDING',
  description: '',
  lineNo: 1,
});

function fromRow(r: ErpGiro): FormState {
  return {
    giroNumber: r.giroNumber,
    type: r.type,
    partnerId: r.partnerId ?? '',
    bankName: r.bankName ?? '',
    bankAccountNo: r.bankAccountNo ?? '',
    currencyId: r.currencyId,
    exchangeRate: r.exchangeRate,
    amount: r.amount,
    dueDate: r.dueDate.slice(0, 10),
    status: r.status,
    description: r.description ?? '',
    lineNo: r.lineNo,
  };
}

function toPayload(f: FormState): CreateGiroPayload {
  return {
    giroNumber: f.giroNumber,
    type: f.type,
    partnerId: f.partnerId || undefined,
    bankName: f.bankName || undefined,
    bankAccountNo: f.bankAccountNo || undefined,
    currencyId: f.currencyId,
    exchangeRate: f.exchangeRate,
    amount: f.amount,
    dueDate: f.dueDate,
    status: f.status,
    description: f.description || undefined,
    lineNo: f.lineNo,
  };
}

function Fields({ data, onChange }: { data: FormState; onChange: (d: FormState) => void }) {
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="No. Giro" htmlFor="gi-no" required>
        <Input id="gi-no" value={data.giroNumber} onChange={(e) => set('giroNumber', e.target.value)} placeholder="GIRO-2026-000001" />
      </FormField>
      <FormField label="Tipe" htmlFor="gi-type" required>
        <Select value={data.type} onValueChange={(v) => set('type', v as ErpGiroType)}>
          <SelectTrigger id="gi-type"><SelectValue /></SelectTrigger>
          <SelectContent>
            {GIRO_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Partner ID" htmlFor="gi-partner">
        <Input id="gi-partner" value={data.partnerId} onChange={(e) => set('partnerId', e.target.value)} />
      </FormField>
      <FormField label="Bank" htmlFor="gi-bank">
        <Input id="gi-bank" value={data.bankName} onChange={(e) => set('bankName', e.target.value)} />
      </FormField>
      <FormField label="No. Rekening" htmlFor="gi-acc">
        <Input id="gi-acc" value={data.bankAccountNo} onChange={(e) => set('bankAccountNo', e.target.value)} />
      </FormField>
      <FormField label="Currency ID" htmlFor="gi-cur" required>
        <Input id="gi-cur" value={data.currencyId} onChange={(e) => set('currencyId', e.target.value)} />
      </FormField>
      <FormField label="Kurs" htmlFor="gi-rate" required>
        <Input id="gi-rate" value={data.exchangeRate} onChange={(e) => set('exchangeRate', e.target.value)} />
      </FormField>
      <FormField label="Jumlah" htmlFor="gi-amt" required>
        <Input id="gi-amt" value={data.amount} onChange={(e) => set('amount', e.target.value)} />
      </FormField>
      <FormField label="Jatuh Tempo" htmlFor="gi-due" required>
        <Input id="gi-due" type="date" value={data.dueDate} onChange={(e) => set('dueDate', e.target.value)} />
      </FormField>
      <FormField label="Status" htmlFor="gi-status">
        <Select value={data.status} onValueChange={(v) => set('status', v as ErpGiroStatus)}>
          <SelectTrigger id="gi-status"><SelectValue /></SelectTrigger>
          <SelectContent>
            {GIRO_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Deskripsi" htmlFor="gi-desc">
        <Input id="gi-desc" value={data.description} onChange={(e) => set('description', e.target.value)} />
      </FormField>
    </div>
  );
}

export function ErpGirosPage() {
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const { page, pageSize, setPage, setPageSize } = useListPagination('fin-giros');

  const [debouncedSearch, setDebouncedSearch] = React.useState(search);
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const typeParam = (typeFilter || undefined) as ErpGiroType | undefined;
  const statusParam = (statusFilter || undefined) as ErpGiroStatus | undefined;

  const { rows, meta, loading, error, reload } = useErpList(
    () =>
      listGiros({
        page,
        limit: pageSize,
        search: debouncedSearch || undefined,
        type: typeParam,
        status: statusParam,
      }),
    [page, pageSize, debouncedSearch, typeParam, statusParam],
  );

  React.useEffect(() => { setPage(1); }, [debouncedSearch, typeFilter, statusFilter, pageSize]);

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ErpGiro | null>(null);
  const [form, setForm] = React.useState<FormState>(defaultForm);
  const [saving, setSaving] = React.useState(false);

  const paged = rows;
  const totalRows = meta?.total ?? 0;
  const pageCount = meta?.totalPages ?? 1;

  const ALL = { label: 'Semua', value: '' };
  const filters: FilterConfig[] = [
    { key: 'type', label: 'Tipe', value: typeFilter, onChange: setTypeFilter,
      options: [ALL, ...GIRO_TYPES.map((t) => ({ label: t, value: t }))] },
    { key: 'status', label: 'Status', value: statusFilter, onChange: setStatusFilter,
      options: [ALL, ...GIRO_STATUSES.map((s) => ({ label: s, value: s }))] },
  ];
  const summary: SummaryConfig = { metricLabel: 'Σ giro', rowCount: totalRows, totalCount: totalRows };
  const pagination: ListPaginationConfig = { page, pageCount, pageSize, totalRows, onPage: setPage, onPageSize: setPageSize };

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm());
    setOpen(true);
  };

  const openEdit = (r: ErpGiro) => {
    setEditing(r);
    setForm(fromRow(r));
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateGiro(editing.id, toPayload(form));
        notify('Giro diperbarui', 'success');
      } else {
        await createGiro(toPayload(form));
        notify('Giro dibuat', 'success');
      }
      setOpen(false);
      reload();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (r: ErpGiro) => {
    confirmAction({
      title: 'Hapus giro?',
      message: `${r.giroNumber} akan dihapus.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await deleteGiro(r.id);
          notify('Giro dihapus', 'success');
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
        title="Giros"
        code="GIRO"
        loading={loading}
        error={error}
        search={search}
        onSearch={setSearch}
        onAdd={openCreate}
        onRefresh={reload}
        filters={filters}
        summary={summary}
        pagination={pagination}
      >
        <div className="lines">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Giro</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableEmpty colSpan={7} />
              ) : (
                paged.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="mono">{r.giroNumber}</TableCell>
                    <TableCell>{r.type}</TableCell>
                    <TableCell>{r.bankName ?? '—'}</TableCell>
                    <TableCell className="mono">{r.amount}</TableCell>
                    <TableCell>{r.dueDate.slice(0, 10)}</TableCell>
                    <TableCell>
                      <Badge variant={r.status === 'CLEARED' ? 'success' : 'default'} dot>
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn sm" onClick={() => openEdit(r)}>Edit</button>
                        <button className="btn sm danger" onClick={() => handleDelete(r)}>Hapus</button>
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
            <ModalTitle>{editing ? 'Edit Giro' : 'Tambah Giro'}</ModalTitle>
          </ModalHeader>
          <Fields data={form} onChange={setForm} />
          <ModalFooter>
            <button className="btn ghost" onClick={() => setOpen(false)}>Batal</button>
            <button className="btn primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
