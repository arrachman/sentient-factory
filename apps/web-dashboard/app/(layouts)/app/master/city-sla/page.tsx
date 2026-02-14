'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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

type MasterDataCitySla = {
  uuid: string;
  cityId: string;
  stdLeadTimeDays: number;
  stdReturnDoDays: number;
  city?: MasterDataCity;
};

type FormState = {
  cityId: string;
  stdLeadTimeDays: string;
  stdReturnDoDays: string;
};

const initialForm: FormState = {
  cityId: '',
  stdLeadTimeDays: '0',
  stdReturnDoDays: '0',
};

function getTokenFromCookie() {
  return (
    document.cookie
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith('sf_token='))
      ?.slice('sf_token='.length) || ''
  );
}

export default function MasterDataCitySlaPage() {
  const [items, setItems] = useState<MasterDataCitySla[]>([]);
  const [cities, setCities] = useState<MasterDataCity[]>([]);
  const [existingSlaCityIds, setExistingSlaCityIds] = useState<string[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [cityAutocompleteOpen, setCityAutocompleteOpen] = useState(false);
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
  const existingSlaCityIdSet = useMemo(() => new Set(existingSlaCityIds), [existingSlaCityIds]);
  const selectableCities = useMemo(
    () => cities.filter((city) => city.uuid === form.cityId || !existingSlaCityIdSet.has(city.uuid)),
    [cities, existingSlaCityIdSet, form.cityId],
  );
  const selectedCityLabel = useMemo(() => {
    const selected = selectableCities.find((city) => city.uuid === form.cityId);
    if (!selected) {
      return '';
    }
    return `${selected.name} (${selected.postalCode})${selected.province ? ` - ${selected.province.name}` : ''}`;
  }, [form.cityId, selectableCities]);
  const addableCities = useMemo(
    () => cities.filter((city) => !existingSlaCityIdSet.has(city.uuid)),
    [cities, existingSlaCityIdSet],
  );

  const fetchExistingSlaCityIds = async () => {
    const headers = token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : undefined;
    const cityIds: string[] = [];
    let pageCursor = 1;
    let totalPagesCursor = 1;

    do {
      const query = new URLSearchParams({ page: String(pageCursor), limit: '100' });
      const response = await fetch(`/api/master-data-city-slas?${query.toString()}`, {
        cache: 'no-store',
        headers,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load city SLA data');
      }

      const rows = Array.isArray(payload.data) ? payload.data : [];
      rows.forEach((row) => {
        const cityId = String(row?.cityId ?? '');
        if (cityId) {
          cityIds.push(cityId);
        }
      });

      const metaTotalPages = Number(payload?.meta?.totalPages ?? 1);
      totalPagesCursor = Number.isInteger(metaTotalPages) && metaTotalPages > 0 ? metaTotalPages : 1;
      pageCursor += 1;
    } while (pageCursor <= totalPagesCursor);

    const uniqueCityIds = Array.from(new Set(cityIds));
    setExistingSlaCityIds(uniqueCityIds);
    return uniqueCityIds;
  };

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

      const response = await fetch(`/api/master-data-city-slas?${query.toString()}`, {
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
      const usedCityIds = await fetchExistingSlaCityIds();
      const usedCityIdSet = new Set(usedCityIds);

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
        const firstAddableCity = nextCities.find((city) => !usedCityIdSet.has(city.uuid));
        return { ...state, cityId: firstAddableCity?.uuid || '' };
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
      const endpoint = editingUuid ? `/api/master-data-city-slas/${editingUuid}` : '/api/master-data-city-slas';
      const method = editingUuid ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : {}),
        },
        body: JSON.stringify({
          cityId: form.cityId,
          stdLeadTimeDays: Number(form.stdLeadTimeDays || 0),
          stdReturnDoDays: Number(form.stdReturnDoDays || 0),
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to save data');
      }

      setForm({
        ...initialForm,
        cityId: '',
      });
      setEditingUuid(null);
      setShowForm(false);
      await fetchList(page);
      await fetchCityOptions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save data');
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (item: MasterDataCitySla) => {
    setEditingUuid(item.uuid);
    setShowForm(true);
    setForm({
      cityId: item.cityId ?? item.city?.uuid ?? '',
      stdLeadTimeDays: String(item.stdLeadTimeDays ?? 0),
      stdReturnDoDays: String(item.stdReturnDoDays ?? 0),
    });
  };

  const onDelete = async (uuid: string) => {
    const ok = window.confirm('Delete this city SLA?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      const response = await fetch(`/api/master-data-city-slas/${uuid}`, {
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
          cityId: '',
        });
        setShowForm(false);
      }
      await fetchList(page);
      await fetchCityOptions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete data');
    }
  };

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Master Data City SLA</ToolbarPageTitle>
          <ToolbarDescription>Manage standard lead time and standard DO return by city.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button
            onClick={() => {
              setEditingUuid(null);
              setForm({
                ...initialForm,
                cityId: addableCities[0]?.uuid || '',
              });
              setShowForm(true);
            }}
            disabled={loadingCity || addableCities.length === 0}
          >
            <Plus />
            Add City SLA
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
                  <TableHead className="text-right">Std Lead Time</TableHead>
                  <TableHead className="text-right">Std Return DO</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7}>Loading...</TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>No city SLA data found.</TableCell>
                  </TableRow>
                ) : (
                  items.map((item, index) => (
                    <TableRow key={item.uuid}>
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>{item.city?.province ? `${item.city.province.name} (${item.city.province.isoCode})` : '-'}</TableCell>
                      <TableCell>{item.city?.name || '-'}</TableCell>
                      <TableCell>{item.city?.postalCode || '-'}</TableCell>
                      <TableCell className="text-right">{item.stdLeadTimeDays}</TableCell>
                      <TableCell className="text-right">{item.stdReturnDoDays}</TableCell>
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
              <p className="text-sm text-muted-foreground">
                Showing page {page} of {totalPages} ({totalItems} rows)
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => fetchList(page - 1)} disabled={page <= 1 || loading}>
                  <ChevronLeft />
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchList(page + 1)}
                  disabled={page >= totalPages || loading}
                >
                  Next
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="rounded-lg border p-5">
            <h3 className="mb-4 text-base font-semibold">{editingUuid ? 'Edit City SLA' : 'Add City SLA'}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>City</Label>
                <Popover open={cityAutocompleteOpen} onOpenChange={setCityAutocompleteOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={cityAutocompleteOpen}
                      className="h-10 w-full justify-between font-normal"
                      disabled={selectableCities.length === 0}
                    >
                      {selectedCityLabel || 'Select city'}
                      <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search city..." />
                      <CommandList>
                        <CommandEmpty>No city found.</CommandEmpty>
                        {selectableCities.map((city) => {
                          const optionLabel = `${city.name} (${city.postalCode})${
                            city.province ? ` - ${city.province.name}` : ''
                          }`;
                          return (
                            <CommandItem
                              key={city.uuid}
                              value={optionLabel}
                              onSelect={() => {
                                setForm((state) => ({ ...state, cityId: city.uuid }));
                                setCityAutocompleteOpen(false);
                              }}
                            >
                              <Check className={`mr-2 size-4 ${form.cityId === city.uuid ? 'opacity-100' : 'opacity-0'}`} />
                              {optionLabel}
                            </CommandItem>
                          );
                        })}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {!editingUuid && selectableCities.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No available city. All cities already have City SLA.
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label>Std Lead Time (Days)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.stdLeadTimeDays}
                  onChange={(e) => setForm((state) => ({ ...state, stdLeadTimeDays: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Std Return DO (Days)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.stdReturnDoDays}
                  onChange={(e) => setForm((state) => ({ ...state, stdReturnDoDays: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingUuid(null);
                }}
              >
                <ArrowLeft />
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || loadingCity}>
                <Save />
                {submitting ? 'Saving...' : editingUuid ? 'Update City SLA' : 'Create City SLA'}
              </Button>
            </div>
          </form>
        )}

        {error ? <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
