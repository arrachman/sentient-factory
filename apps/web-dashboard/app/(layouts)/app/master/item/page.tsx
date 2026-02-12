'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';

type MasterDataUom = {
  uuid: string;
  code: string;
  name: string;
  type: string;
};

type MasterDataItem = {
  uuid: string;
  code: string;
  name: string;
  category: string;
  itemType: string;
  isActive: boolean;
  uomId: string;
  uom?: MasterDataUom;
};

type FormState = {
  code: string;
  name: string;
  category: string;
  uomId: string;
  itemType: string;
  isActive: boolean;
};

const initialForm: FormState = {
  code: '',
  name: '',
  category: '',
  uomId: '',
  itemType: '',
  isActive: true,
};

function getTokenFromCookie() {
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('sf_token='))
    ?.slice('sf_token='.length) || '';
}

function slugifyCode(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function MasterDataItemPage() {
  const [items, setItems] = useState<MasterDataItem[]>([]);
  const [uoms, setUoms] = useState<MasterDataUom[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingUom, setLoadingUom] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const token = useMemo(() => getTokenFromCookie(), []);

  const fetchList = async (targetPage = page) => {
    const safePage =
      typeof targetPage === 'number' && Number.isInteger(targetPage) && targetPage > 0
        ? targetPage
        : 1;

    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams({ page: String(safePage), limit: String(limit) });
      if (search.trim()) {
        query.set('search', search.trim());
      }

      const response = await fetch(`/api/master-data-items?${query.toString()}`, {
        cache: 'no-store',
        headers: token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : undefined,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load data');
      }
      setItems(Array.isArray(payload.data) ? payload.data : []);
      const meta = payload?.meta;
      setPage(typeof meta?.page === 'number' ? meta.page : safePage);
      setTotalPages(typeof meta?.totalPages === 'number' ? meta.totalPages : 1);
      setTotalItems(typeof meta?.total === 'number' ? meta.total : 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUomOptions = async () => {
    setLoadingUom(true);
    setError('');
    try {
      const query = new URLSearchParams({ page: '1', limit: '100' });
      const response = await fetch(`/api/master-data-uoms?${query.toString()}`, {
        cache: 'no-store',
        headers: token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : undefined,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load UOM data');
      }
      const nextUoms = Array.isArray(payload.data) ? payload.data : [];
      setUoms(nextUoms);
      setForm((state) => {
        if (state.uomId || nextUoms.length === 0) {
          return state;
        }
        return { ...state, uomId: nextUoms[0].uuid };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load UOM data');
    } finally {
      setLoadingUom(false);
    }
  };

  useEffect(() => {
    fetchList(1);
    fetchUomOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const effectiveCode = form.code.trim() || slugifyCode(form.name);
      const endpoint = editingUuid ? `/api/master-data-items/${editingUuid}` : '/api/master-data-items';
      const method = editingUuid ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : {}),
        },
        body: JSON.stringify({
          code: effectiveCode,
          name: form.name,
          category: form.category,
          uomId: form.uomId,
          itemType: form.itemType,
          isActive: form.isActive,
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to save data');
      }

      setForm({
        ...initialForm,
        uomId: uoms[0]?.uuid || '',
      });
      setEditingUuid(null);
      setShowForm(false);
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save data');
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (item: MasterDataItem) => {
    setEditingUuid(item.uuid);
    setShowForm(true);
    setForm({
      code: item.code ?? '',
      name: item.name ?? '',
      category: item.category ?? '',
      uomId: item.uomId ?? item.uom?.uuid ?? '',
      itemType: item.itemType ?? '',
      isActive: item.isActive,
    });
  };

  const onDelete = async (uuid: string) => {
    const ok = window.confirm('Delete this item?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      const response = await fetch(`/api/master-data-items/${uuid}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : undefined,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to delete data');
      }
      if (editingUuid === uuid) {
        setEditingUuid(null);
        setForm({
          ...initialForm,
          uomId: uoms[0]?.uuid || '',
        });
        setShowForm(false);
      }
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete data');
    }
  };

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Master Data Item</ToolbarPageTitle>
          <ToolbarDescription>Manage item code, category, UOM, type, and active status.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button
            onClick={() => {
              setEditingUuid(null);
              setForm({
                ...initialForm,
                uomId: uoms[0]?.uuid || '',
              });
              setShowForm(true);
            }}
          >
            <Plus />
            Add Item
          </Button>
          <Button variant="outline" onClick={() => fetchList(page)} disabled={loading}>
            <RefreshCw />
            Refresh
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        {!showForm ? (
          <div className="rounded-lg border p-5">
            <div className="mb-3 flex items-center gap-2">
              <Input
                placeholder="Search by code, name, category, type, UOM..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button variant="outline" onClick={() => fetchList(1)} disabled={loading}>
                <RefreshCw />
                Search
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">No</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>UOM</TableHead>
                  <TableHead>Item Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8}>Loading...</TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8}>No item data found.</TableCell>
                  </TableRow>
                ) : (
                  items.map((item, index) => (
                    <TableRow key={item.uuid}>
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.uom ? `${item.uom.code} - ${item.uom.name}` : '-'}</TableCell>
                      <TableCell>{item.itemType}</TableCell>
                      <TableCell>{item.isActive ? 'Active' : 'Inactive'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                            <Pencil />
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => onDelete(item.uuid)}>
                            <Trash2 />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Total {totalItems} items • Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchList(page - 1)}
                  disabled={loading || page <= 1}
                >
                  <ChevronLeft />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchList(page + 1)}
                  disabled={loading || page >= totalPages}
                >
                  Next
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {showForm ? (
          <div className="rounded-lg border p-5">
            <h2 className="mb-4 text-sm font-semibold text-mono">{editingUuid ? 'Edit Item' : 'Create Item'}</h2>
            <form className="space-y-3" onSubmit={onSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => {
                      const nextName = e.target.value;
                      setForm((s) => ({
                        ...s,
                        name: nextName,
                        code: slugifyCode(nextName),
                      }));
                    }}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="code">
                    Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="code"
                    value={form.code}
                    onChange={(e) => setForm((s) => ({ ...s, code: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div>
                  <Label htmlFor="category">
                    Kategori Barang <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="category"
                    value={form.category}
                    onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="itemType">
                    Item Type <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="itemType"
                    value={form.itemType}
                    onChange={(e) => setForm((s) => ({ ...s, itemType: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div>
                  <Label htmlFor="uomId">
                    UOM <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="uomId"
                    className="h-8.5 w-full rounded-md border border-input bg-background px-3 text-[0.8125rem]"
                    value={form.uomId}
                    onChange={(e) => setForm((s) => ({ ...s, uomId: e.target.value }))}
                    required
                    disabled={loadingUom || uoms.length === 0}
                  >
                    {uoms.length === 0 ? <option value="">No UOM available</option> : null}
                    {uoms.map((uom) => (
                      <option key={uom.uuid} value={uom.uuid}>
                        {uom.code} - {uom.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Kelola UOM di halaman <code>/app/master/uom</code>.
                  </p>
                </div>
                <div>
                  <Label htmlFor="isActive">
                    Is Active <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="isActive"
                    className="h-8.5 w-full rounded-md border border-input bg-background px-3 text-[0.8125rem]"
                    value={form.isActive ? 'true' : 'false'}
                    onChange={(e) => setForm((s) => ({ ...s, isActive: e.target.value === 'true' }))}
                    required
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting || loadingUom || uoms.length === 0}>
                  <Save />
                  {submitting ? 'Saving...' : editingUuid ? 'Update' : 'Create'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingUuid(null);
                    setForm({
                      ...initialForm,
                      uomId: uoms[0]?.uuid || '',
                    });
                    setShowForm(false);
                  }}
                >
                  <ArrowLeft />
                  Back to List
                </Button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}
