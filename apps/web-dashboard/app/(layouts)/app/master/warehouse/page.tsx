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
import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';

type MasterDataCity = {
  uuid: string;
  name: string;
  postalCode: string;
};

type MasterDataWarehouse = {
  uuid: string;
  name: string;
  cityId: string;
  locationName?: string | null;
  addressDetail?: string | null;
  city?: MasterDataCity | null;
};

type FormState = {
  name: string;
  cityId: string;
  locationName: string;
  addressDetail: string;
};

const initialForm: FormState = {
  name: '',
  cityId: '',
  locationName: '',
  addressDetail: '',
};

function getTokenFromCookie() {
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('sf_token='))
    ?.slice('sf_token='.length) || '';
}

export default function MasterDataWarehousePage() {
  const [items, setItems] = useState<MasterDataWarehouse[]>([]);
  const [cities, setCities] = useState<MasterDataCity[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);
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

      const response = await fetch(`/api/master-data-warehouses?${query.toString()}`, {
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

  const fetchCityOptions = async () => {
    setLoadingCity(true);
    setError('');
    try {
      const query = new URLSearchParams({ page: '1', limit: '100' });
      const response = await fetch(`/api/master-data-cities?${query.toString()}`, {
        cache: 'no-store',
        headers: token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : undefined,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load city data');
      }

      const nextCities = Array.isArray(payload.data) ? payload.data : [];
      setCities(nextCities);
      setForm((state) => {
        if (state.cityId || nextCities.length === 0) {
          return state;
        }
        return { ...state, cityId: nextCities[0].uuid };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load city data');
    } finally {
      setLoadingCity(false);
    }
  };

  useEffect(() => {
    fetchList(1);
    fetchCityOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const endpoint = editingUuid
        ? `/api/master-data-warehouses/${editingUuid}`
        : '/api/master-data-warehouses';
      const method = editingUuid ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : {}),
        },
        body: JSON.stringify({
          name: form.name,
          cityId: form.cityId,
          locationName: form.locationName || undefined,
          addressDetail: form.addressDetail || undefined,
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to save data');
      }

      setForm({
        ...initialForm,
        cityId: cities[0]?.uuid || '',
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

  const onEdit = (item: MasterDataWarehouse) => {
    setEditingUuid(item.uuid);
    setShowForm(true);
    setForm({
      name: item.name ?? '',
      cityId: item.cityId ?? item.city?.uuid ?? '',
      locationName: item.locationName ?? '',
      addressDetail: item.addressDetail ?? '',
    });
  };

  const onDelete = async (uuid: string) => {
    const ok = window.confirm('Delete this warehouse?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      const response = await fetch(`/api/master-data-warehouses/${uuid}`, {
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
          cityId: cities[0]?.uuid || '',
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
          <ToolbarPageTitle>Master Data Warehouse</ToolbarPageTitle>
          <ToolbarDescription>Manage warehouse master data.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button
            onClick={() => {
              setEditingUuid(null);
              setForm({
                ...initialForm,
                cityId: cities[0]?.uuid || '',
              });
              setShowForm(true);
            }}
          >
            <Plus />
            Add Warehouse
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
                placeholder="Search by name, city, location, address..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Location Name</TableHead>
                  <TableHead>Address Detail</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6}>Loading...</TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>No warehouse data found.</TableCell>
                  </TableRow>
                ) : (
                  items.map((item, index) => (
                    <TableRow key={item.uuid}>
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.city?.name || cities.find((city) => city.uuid === item.cityId)?.name || '-'}</TableCell>
                      <TableCell>{item.locationName || '-'}</TableCell>
                      <TableCell>{item.addressDetail || '-'}</TableCell>
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
                  <ChevronRight />
                  Next
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {showForm ? (
          <div className="rounded-lg border p-5">
            <h2 className="mb-4 text-sm font-semibold text-mono">
              {editingUuid ? 'Edit Warehouse' : 'Create Warehouse'}
            </h2>
            <form className="space-y-3" onSubmit={onSubmit}>
              <div className="grid grid-cols-2 gap-3">
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
                <div>
                  <Label htmlFor="cityId">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <AutocompleteSelect
                    value={form.cityId}
                    onValueChange={(value) => setForm((s) => ({ ...s, cityId: value }))}
                    options={cities.map((city) => ({
                      value: city.uuid,
                      label: `${city.name} (${city.postalCode})`,
                      keywords: city.province ? `${city.province.name} ${city.province.isoCode}` : undefined,
                    }))}
                    placeholder={cities.length === 0 ? 'No city available' : 'Select city'}
                    searchPlaceholder="Search city..."
                    emptyText="No city found."
                    required
                    disabled={loadingCity || cities.length === 0}
                    triggerClassName="h-8.5 text-[0.8125rem]"
                  />
                </div>
                <div>
                  <Label htmlFor="locationName">Location Name</Label>
                  <Input
                    id="locationName"
                    value={form.locationName}
                    onChange={(e) => setForm((s) => ({ ...s, locationName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="addressDetail">Address Detail</Label>
                  <Input
                    id="addressDetail"
                    value={form.addressDetail}
                    onChange={(e) => setForm((s) => ({ ...s, addressDetail: e.target.value }))}
                  />
                </div>
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <div className="flex items-center gap-2">
                <Button type="submit" disabled={submitting || loadingCity || cities.length === 0}>
                  <Save />
                  {submitting ? 'Saving...' : editingUuid ? 'Update' : 'Create'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingUuid(null);
                    setForm({
                      ...initialForm,
                      cityId: cities[0]?.uuid || '',
                    });
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
