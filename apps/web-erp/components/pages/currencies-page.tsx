'use client';

/**
 * F3 Master Data — Currency page.
 * Lists md_currencies; supports create, edit, delete.
 * Edit modal exposes a "Rates" tab to manage the dated rate sub-resource.
 * Atomic tier: Page.
 */

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
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
  listCurrencies,
  createCurrency,
  updateCurrency,
  deleteCurrency,
} from '@/lib/api/currencies';
import type {
  ErpCurrency,
  CreateCurrencyPayload,
} from '@/lib/api/currencies';
import { CurrencyRatesPanel } from './currencies-rates';

// ─── Form state ───────────────────────────────────────────────────────────────

interface CurForm {
  code: string;
  name: string;
  symbol: string;
  isActive: boolean;
}

const defaultForm = (): CurForm => ({
  code: '',
  name: '',
  symbol: '',
  isActive: true,
});

function fromCur(c: ErpCurrency): CurForm {
  return {
    code: c.code,
    name: c.name,
    symbol: c.symbol ?? '',
    isActive: c.isActive,
  };
}

function toPayload(f: CurForm): CreateCurrencyPayload {
  return {
    code: f.code,
    name: f.name,
    symbol: f.symbol || undefined,
    isActive: f.isActive,
  };
}

// ─── Form ─────────────────────────────────────────────────────────────────────

function CurFormFields({
  data,
  onChange,
}: {
  data: CurForm;
  onChange: (d: CurForm) => void;
}) {
  const set = (k: keyof CurForm, v: string | boolean) =>
    onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="cu-code" required>
        <Input
          id="cu-code"
          value={data.code}
          onChange={(e) => set('code', e.target.value)}
          placeholder="USD"
        />
      </FormField>
      <FormField label="Nama" htmlFor="cu-name" required>
        <Input
          id="cu-name"
          value={data.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="US Dollar"
        />
      </FormField>
      <FormField label="Simbol" htmlFor="cu-symbol">
        <Input
          id="cu-symbol"
          value={data.symbol}
          onChange={(e) => set('symbol', e.target.value)}
          placeholder="$"
        />
      </FormField>
      <FormField label="Status" htmlFor="cu-active">
        <BooleanRadio
          id="cu-active"
          value={data.isActive}
          onValueChange={(v) => set('isActive', v)}
        />
      </FormField>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ErpCurrenciesPage() {
  const [search, setSearch] = React.useState('');
  const [sortBy] = React.useState('code');
  const [sortDir] = React.useState<'asc' | 'desc'>('asc');
  const { page, pageSize, setPage, setPageSize } = useListPagination('currencies');

  const [debouncedSearch, setDebouncedSearch] = React.useState(search);
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { rows, meta, loading, error, reload } = useErpList(
    () =>
      listCurrencies({
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
  const [editing, setEditing] = React.useState<ErpCurrency | null>(null);
  const [form, setForm] = React.useState<CurForm>(defaultForm);
  const [saving, setSaving] = React.useState(false);

  const paged = rows;
  const totalRows = meta?.total ?? 0;
  const pageCount = meta?.totalPages ?? 1;
  const hasActiveFilter = search !== '';
  const summary: SummaryConfig = {
    metricLabel: 'Σ mata uang',
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

  const openEdit = (c: ErpCurrency) => {
    setEditing(c);
    setForm(fromCur(c));
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateCurrency(editing.id, toPayload(form));
        notify('Mata uang diperbarui', 'success');
      } else {
        await createCurrency(toPayload(form));
        notify('Mata uang dibuat', 'success');
      }
      setOpen(false);
      reload();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (c: ErpCurrency) => {
    confirmAction({
      title: 'Hapus mata uang?',
      message: `${c.code} — ${c.name} akan dihapus permanen.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await deleteCurrency(c.id);
          notify('Mata uang dihapus', 'success');
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
        title="Mata Uang"
        code="CUR"
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
                <TableHead>Simbol</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableEmpty colSpan={5}>
                  {hasActiveFilter
                    ? 'Tidak ada hasil untuk filter ini'
                    : 'Tidak ada data mata uang'}
                </TableEmpty>
              ) : (
                paged.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="mono">{c.code}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell className="muted">{c.symbol ?? '—'}</TableCell>
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
              {editing ? 'Edit Mata Uang' : 'Tambah Mata Uang'}
            </ModalTitle>
          </ModalHeader>
          {editing ? (
            <Tabs defaultValue="detail">
              <div className="p-4" style={{ paddingBottom: 0 }}>
                <TabsList>
                  <TabsTrigger value="detail">Detail</TabsTrigger>
                  <TabsTrigger value="rates">Rate</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="detail">
                <CurFormFields data={form} onChange={setForm} />
              </TabsContent>
              <TabsContent value="rates">
                <CurrencyRatesPanel currencyId={editing.id} />
              </TabsContent>
            </Tabs>
          ) : (
            <CurFormFields data={form} onChange={setForm} />
          )}
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
