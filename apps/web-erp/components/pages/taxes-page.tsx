'use client';

/**
 * Master Data — Tax page.
 * Lists md_taxes; supports create, edit, delete.
 * Sale/Purchase account FKs rendered as Selects populated from /accounts.
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
  listTaxes,
  createTax,
  updateTax,
  deleteTax,
} from '@/lib/api/taxes';
import type { ErpTax, CreateTaxPayload } from '@/lib/api/taxes';
import { listAccounts } from '@/lib/api/accounts';
import type { ErpAccount } from '@/lib/api/accounts';

// ─── Form state ───────────────────────────────────────────────────────────────

const NONE = '__none__';

interface TaxForm {
  code: string;
  name: string;
  rate: string;
  saleAccountId: string;
  purchaseAccountId: string;
  isActive: boolean;
}

const defaultForm = (): TaxForm => ({
  code: '',
  name: '',
  rate: '',
  saleAccountId: '',
  purchaseAccountId: '',
  isActive: true,
});

function fromTax(t: ErpTax): TaxForm {
  return {
    code: t.code,
    name: t.name,
    rate: t.rate,
    saleAccountId: t.saleAccountId ?? '',
    purchaseAccountId: t.purchaseAccountId ?? '',
    isActive: t.isActive,
  };
}

function toPayload(f: TaxForm): CreateTaxPayload {
  return {
    code: f.code,
    name: f.name,
    rate: f.rate,
    saleAccountId: f.saleAccountId || null,
    purchaseAccountId: f.purchaseAccountId || null,
    isActive: f.isActive,
  };
}

// ─── Form ─────────────────────────────────────────────────────────────────────

function TaxFormFields({
  data,
  accounts,
  onChange,
}: {
  data: TaxForm;
  accounts: ErpAccount[];
  onChange: (d: TaxForm) => void;
}) {
  const set = (k: keyof TaxForm, v: string | boolean) =>
    onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="tf-code" required>
        <Input
          id="tf-code"
          value={data.code}
          onChange={(e) => set('code', e.target.value)}
          placeholder="VAT11"
        />
      </FormField>
      <FormField label="Nama" htmlFor="tf-name" required>
        <Input
          id="tf-name"
          value={data.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="VAT 11%"
        />
      </FormField>
      <FormField label="Tarif (%)" htmlFor="tf-rate" required>
        <Input
          id="tf-rate"
          value={data.rate}
          onChange={(e) => set('rate', e.target.value)}
          placeholder="11.00"
        />
      </FormField>
      <FormField label="Akun Penjualan" htmlFor="tf-sale">
        <Select
          value={data.saleAccountId || NONE}
          onValueChange={(v) => set('saleAccountId', v === NONE ? '' : v)}
        >
          <SelectTrigger id="tf-sale">
            <SelectValue placeholder="Tidak ada" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>Tidak ada</SelectItem>
            {accounts.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.code} — {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Akun Pembelian" htmlFor="tf-pur">
        <Select
          value={data.purchaseAccountId || NONE}
          onValueChange={(v) =>
            set('purchaseAccountId', v === NONE ? '' : v)
          }
        >
          <SelectTrigger id="tf-pur">
            <SelectValue placeholder="Tidak ada" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>Tidak ada</SelectItem>
            {accounts.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.code} — {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Status" htmlFor="tf-active">
        <BooleanRadio
          id="tf-active"
          value={data.isActive}
          onValueChange={(v) => set('isActive', v)}
        />
      </FormField>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ErpTaxesPage() {
  const [search, setSearch] = React.useState('');
  const [sortBy] = React.useState('code');
  const [sortDir] = React.useState<'asc' | 'desc'>('asc');
  const { page, pageSize, setPage, setPageSize } = useListPagination('taxes');

  const [debouncedSearch, setDebouncedSearch] = React.useState(search);
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { rows, meta, loading, error, reload } = useErpList(
    () =>
      listTaxes({
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

  const [accounts, setAccounts] = React.useState<ErpAccount[]>([]);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ErpTax | null>(null);
  const [form, setForm] = React.useState<TaxForm>(defaultForm);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    // Load accounts for the form's account selects. Server defaults limit=10 so
    // we ask for a large page; this list is a lookup, not the page's main list.
    listAccounts({ page: 1, limit: 100 })
      .then((res) => setAccounts(res.data))
      .catch(() => setAccounts([]));
  }, []);

  const accountLabel = React.useCallback(
    (id?: string | null) => {
      if (!id) return '—';
      const a = accounts.find((x) => x.id === id);
      return a ? `${a.code} — ${a.name}` : id;
    },
    [accounts],
  );

  const paged = rows;
  const totalRows = meta?.total ?? 0;
  const pageCount = meta?.totalPages ?? 1;
  const hasActiveFilter = search !== '';
  const summary: SummaryConfig = {
    metricLabel: 'Σ pajak',
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

  const openEdit = (t: ErpTax) => {
    setEditing(t);
    setForm(fromTax(t));
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateTax(editing.id, toPayload(form));
        notify('Pajak diperbarui', 'success');
      } else {
        await createTax(toPayload(form));
        notify('Pajak dibuat', 'success');
      }
      setOpen(false);
      reload();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (t: ErpTax) => {
    confirmAction({
      title: 'Hapus pajak?',
      message: `${t.code} — ${t.name} akan dihapus permanen.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await deleteTax(t.id);
          notify('Pajak dihapus', 'success');
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
        title="Pajak"
        code="TAX"
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
                <TableHead>Tarif</TableHead>
                <TableHead>Akun Jual</TableHead>
                <TableHead>Akun Beli</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableEmpty colSpan={7}>
                  {hasActiveFilter
                    ? 'Tidak ada hasil untuk filter ini'
                    : 'Tidak ada data pajak'}
                </TableEmpty>
              ) : (
                paged.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="mono">{t.code}</TableCell>
                    <TableCell>{t.name}</TableCell>
                    <TableCell className="mono">{t.rate}%</TableCell>
                    <TableCell>{accountLabel(t.saleAccountId)}</TableCell>
                    <TableCell>{accountLabel(t.purchaseAccountId)}</TableCell>
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
              {editing ? 'Edit Pajak' : 'Tambah Pajak'}
            </ModalTitle>
          </ModalHeader>
          <TaxFormFields data={form} accounts={accounts} onChange={setForm} />
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
