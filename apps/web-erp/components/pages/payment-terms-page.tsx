'use client';

/**
 * Master Data — Payment Term page.
 * Lists md_payment_terms; supports create, edit, delete.
 * Atomic tier: Page.
 */

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
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
} from '@/components/organisms/table';
import { confirmAction, notify } from '@/lib/feedback';
import { useErpList } from '@/lib/use-erp-list';
import { useListPagination } from '@/lib/use-list-pagination';
import {
  listPaymentTerms,
  createPaymentTerm,
  updatePaymentTerm,
  deletePaymentTerm,
} from '@/lib/api/payment-terms';
import type {
  ErpPaymentTerm,
  CreatePaymentTermPayload,
} from '@/lib/api/payment-terms';

// ─── Form state ───────────────────────────────────────────────────────────────

interface PaymentTermForm {
  code: string;
  name: string;
  netDays: string;
  discountDays1: string;
  discountPercent1: string;
  discountDays2: string;
  discountPercent2: string;
  penaltyPercent: string;
  penaltyPeriod: string;
  isActive: boolean;
}

const defaultForm = (): PaymentTermForm => ({
  code: '',
  name: '',
  netDays: '0',
  discountDays1: '',
  discountPercent1: '',
  discountDays2: '',
  discountPercent2: '',
  penaltyPercent: '',
  penaltyPeriod: '',
  isActive: true,
});

function fromTerm(t: ErpPaymentTerm): PaymentTermForm {
  return {
    code: t.code,
    name: t.name,
    netDays: String(t.netDays),
    discountDays1: t.discountDays1 != null ? String(t.discountDays1) : '',
    discountPercent1: t.discountPercent1 ?? '',
    discountDays2: t.discountDays2 != null ? String(t.discountDays2) : '',
    discountPercent2: t.discountPercent2 ?? '',
    penaltyPercent: t.penaltyPercent ?? '',
    penaltyPeriod: t.penaltyPeriod ?? '',
    isActive: t.isActive,
  };
}

function toPayload(f: PaymentTermForm): CreatePaymentTermPayload {
  const num = (v: string) =>
    v.trim() === '' ? undefined : Number(v);
  const str = (v: string) => (v.trim() === '' ? undefined : v);
  return {
    code: f.code,
    name: f.name,
    netDays: Number(f.netDays || '0'),
    discountDays1: num(f.discountDays1),
    discountPercent1: str(f.discountPercent1),
    discountDays2: num(f.discountDays2),
    discountPercent2: str(f.discountPercent2),
    penaltyPercent: str(f.penaltyPercent),
    penaltyPeriod: str(f.penaltyPeriod),
    isActive: f.isActive,
  };
}

// ─── Form ─────────────────────────────────────────────────────────────────────

function PaymentTermFormFields({
  data,
  onChange,
}: {
  data: PaymentTermForm;
  onChange: (d: PaymentTermForm) => void;
}) {
  const set = (k: keyof PaymentTermForm, v: string | boolean) =>
    onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="pt-code" required>
        <Input
          id="pt-code"
          value={data.code}
          onChange={(e) => set('code', e.target.value)}
          placeholder="NET30"
        />
      </FormField>
      <FormField label="Nama" htmlFor="pt-name" required>
        <Input
          id="pt-name"
          value={data.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Net 30 Days"
        />
      </FormField>
      <FormField label="Jatuh Tempo (hari)" htmlFor="pt-net" required>
        <Input
          id="pt-net"
          type="number"
          value={data.netDays}
          onChange={(e) => set('netDays', e.target.value)}
          placeholder="30"
        />
      </FormField>
      <FormField label="Diskon Hari (Tier 1)" htmlFor="pt-dd1">
        <Input
          id="pt-dd1"
          type="number"
          value={data.discountDays1}
          onChange={(e) => set('discountDays1', e.target.value)}
          placeholder="10"
        />
      </FormField>
      <FormField label="Diskon Persen (Tier 1)" htmlFor="pt-dp1">
        <Input
          id="pt-dp1"
          value={data.discountPercent1}
          onChange={(e) => set('discountPercent1', e.target.value)}
          placeholder="2.00"
        />
      </FormField>
      <FormField label="Diskon Hari (Tier 2)" htmlFor="pt-dd2">
        <Input
          id="pt-dd2"
          type="number"
          value={data.discountDays2}
          onChange={(e) => set('discountDays2', e.target.value)}
          placeholder="5"
        />
      </FormField>
      <FormField label="Diskon Persen (Tier 2)" htmlFor="pt-dp2">
        <Input
          id="pt-dp2"
          value={data.discountPercent2}
          onChange={(e) => set('discountPercent2', e.target.value)}
          placeholder="1.00"
        />
      </FormField>
      <FormField label="Denda Persen" htmlFor="pt-pen">
        <Input
          id="pt-pen"
          value={data.penaltyPercent}
          onChange={(e) => set('penaltyPercent', e.target.value)}
          placeholder="1.50"
        />
      </FormField>
      <FormField label="Periode Denda" htmlFor="pt-penp">
        <Input
          id="pt-penp"
          value={data.penaltyPeriod}
          onChange={(e) => set('penaltyPeriod', e.target.value)}
          placeholder="monthly"
        />
      </FormField>
      <FormField label="Status" htmlFor="pt-active">
        <BooleanRadio
          id="pt-active"
          value={data.isActive}
          onValueChange={(v) => set('isActive', v)}
        />
      </FormField>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ErpPaymentTermsPage() {
  const [search, setSearch] = React.useState('');
  const [sortBy] = React.useState('code');
  const [sortDir] = React.useState<'asc' | 'desc'>('asc');
  const { page, pageSize, setPage, setPageSize } =
    useListPagination('payment-terms');

  const [debouncedSearch, setDebouncedSearch] = React.useState(search);
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { rows, meta, loading, error, reload } = useErpList(
    () =>
      listPaymentTerms({
        page,
        limit: pageSize,
        search: debouncedSearch || undefined,
        sortBy,
        sortDir,
      }),
    [page, pageSize, debouncedSearch, sortBy, sortDir],
  );

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortBy, sortDir, pageSize, setPage]);

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ErpPaymentTerm | null>(null);
  const [form, setForm] = React.useState<PaymentTermForm>(defaultForm);
  const [saving, setSaving] = React.useState(false);

  const paged = rows;
  const totalRows = meta?.total ?? 0;
  const pageCount = meta?.totalPages ?? 1;
  const hasActiveFilter = search !== '';
  const summary: SummaryConfig = {
    metricLabel: 'Σ termin',
    rowCount: totalRows,
    totalCount: totalRows,
  };
  const pagination: ListPaginationConfig = {
    page,
    pageCount,
    pageSize,
    totalRows,
    onPage: setPage,
    onPageSize: setPageSize,
  };

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm());
    setOpen(true);
  };

  const openEdit = (t: ErpPaymentTerm) => {
    setEditing(t);
    setForm(fromTerm(t));
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updatePaymentTerm(editing.id, toPayload(form));
        notify('Termin pembayaran diperbarui', 'success');
      } else {
        await createPaymentTerm(toPayload(form));
        notify('Termin pembayaran dibuat', 'success');
      }
      setOpen(false);
      reload();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (t: ErpPaymentTerm) => {
    confirmAction({
      title: 'Hapus termin pembayaran?',
      message: `${t.code} — ${t.name} akan dihapus permanen.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await deletePaymentTerm(t.id);
          notify('Termin pembayaran dihapus', 'success');
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
        title="Termin Pembayaran"
        code="TERM"
        loading={loading}
        error={error}
        search={search}
        onSearch={setSearch}
        onAdd={openCreate}
        onRefresh={reload}
        summary={summary}
        pagination={pagination}
      >
        <div className="lines">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
                <TableHead>Denda %</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableEmpty colSpan={6}>
                  {hasActiveFilter
                    ? 'Tidak ada hasil untuk filter ini'
                    : 'Tidak ada data termin pembayaran'}
                </TableEmpty>
              ) : (
                paged.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="mono">{t.code}</TableCell>
                    <TableCell>{t.name}</TableCell>
                    <TableCell className="mono">{t.netDays} hari</TableCell>
                    <TableCell className="mono">
                      {t.penaltyPercent ? `${t.penaltyPercent}%` : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={t.isActive ? 'success' : 'default'} dot>
                        {t.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn sm" onClick={() => openEdit(t)}>
                          Edit
                        </button>
                        <button
                          className="btn sm danger"
                          onClick={() => handleDelete(t)}
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
              {editing ? 'Edit Termin Pembayaran' : 'Tambah Termin Pembayaran'}
            </ModalTitle>
          </ModalHeader>
          <PaymentTermFormFields data={form} onChange={setForm} />
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
