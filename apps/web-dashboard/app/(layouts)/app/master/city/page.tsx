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

type MasterDataProvince = {
  uuid: string;
  name: string;
  isoCode: string;
};

type MasterDataCity = {
  uuid: string;
  provinceId: string;
  name: string;
  postalCode: string;
  province?: MasterDataProvince;
};

type FormState = {
  provinceId: string;
  name: string;
  postalCode: string;
};

const initialForm: FormState = {
  provinceId: '',
  name: '',
  postalCode: '',
};

function getTokenFromCookie() {
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('sf_token='))
    ?.slice('sf_token='.length) || '';
}

export default function MasterDataCityPage() {
  const [items, setItems] = useState<MasterDataCity[]>([]);
  const [provinces, setProvinces] = useState<MasterDataProvince[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProvince, setLoadingProvince] = useState(false);
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

      const response = await fetch(`/api/master-data-cities?${query.toString()}`, {
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

  const fetchProvinceOptions = async () => {
    setLoadingProvince(true);
    setError('');
    try {
      const query = new URLSearchParams({ page: '1', limit: '100' });
      const response = await fetch(`/api/master-data-provinces?${query.toString()}`, {
        cache: 'no-store',
        headers: token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : undefined,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load province data');
      }
      const nextProvinces = Array.isArray(payload.data) ? payload.data : [];
      setProvinces(nextProvinces);
      setForm((state) => {
        if (state.provinceId || nextProvinces.length === 0) {
          return state;
        }
        return { ...state, provinceId: nextProvinces[0].uuid };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load province data');
    } finally {
      setLoadingProvince(false);
    }
  };

  useEffect(() => {
    fetchList(1);
    fetchProvinceOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const endpoint = editingUuid ? `/api/master-data-cities/${editingUuid}` : '/api/master-data-cities';
      const method = editingUuid ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : {}),
        },
        body: JSON.stringify({
          provinceId: form.provinceId,
          name: form.name,
          postalCode: form.postalCode,
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to save data');
      }

      setForm({
        ...initialForm,
        provinceId: provinces[0]?.uuid || '',
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

  const onEdit = (item: MasterDataCity) => {
    setEditingUuid(item.uuid);
    setShowForm(true);
    setForm({
      provinceId: item.provinceId ?? item.province?.uuid ?? '',
      name: item.name ?? '',
      postalCode: item.postalCode ?? '',
    });
  };

  const onDelete = async (uuid: string) => {
    const ok = window.confirm('Delete this city?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      const response = await fetch(`/api/master-data-cities/${uuid}`, {
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
          provinceId: provinces[0]?.uuid || '',
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
          <ToolbarPageTitle>Master Data City</ToolbarPageTitle>
          <ToolbarDescription>Manage city and postal code by province.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button
            onClick={() => {
              setEditingUuid(null);
              setForm({
                ...initialForm,
                provinceId: provinces[0]?.uuid || '',
              });
              setShowForm(true);
            }}
          >
            <Plus />
            Add City
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
                placeholder="Search by city, postal code, province..."
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
                  <TableHead>Province</TableHead>
                  <TableHead>City Name</TableHead>
                  <TableHead>Postal Code</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5}>Loading...</TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>No city data found.</TableCell>
                  </TableRow>
                ) : (
                  items.map((item, index) => (
                    <TableRow key={item.uuid}>
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>{item.province ? `${item.province.name} (${item.province.isoCode})` : '-'}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.postalCode}</TableCell>
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
            <h2 className="mb-4 text-sm font-semibold text-mono">{editingUuid ? 'Edit City' : 'Create City'}</h2>
            <form className="space-y-3" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div>
                  <Label htmlFor="provinceId">
                    Province <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="provinceId"
                    className="h-8.5 w-full rounded-md border border-input bg-background px-3 text-[0.8125rem]"
                    value={form.provinceId}
                    onChange={(e) => setForm((s) => ({ ...s, provinceId: e.target.value }))}
                    required
                    disabled={loadingProvince || provinces.length === 0}
                  >
                    {provinces.length === 0 ? <option value="">No province available</option> : null}
                    {provinces.map((province) => (
                      <option key={province.uuid} value={province.uuid}>
                        {province.name} ({province.isoCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div>
                  <Label htmlFor="postalCode">
                    Postal Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="postalCode"
                    value={form.postalCode}
                    onChange={(e) => setForm((s) => ({ ...s, postalCode: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting || loadingProvince || provinces.length === 0}>
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
                      provinceId: provinces[0]?.uuid || '',
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
