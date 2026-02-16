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
  X,
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

type FormState = {
  name: string;
  isoCode: string;
};

const initialForm: FormState = {
  name: '',
  isoCode: '',
};

function getTokenFromCookie() {
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('sf_token='))
    ?.slice('sf_token='.length) || '';
}

export default function MasterDataProvincePage() {
  const [items, setItems] = useState<MasterDataProvince[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
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

      const response = await fetch(`/api/master-data-provinces?${query.toString()}`, {
        cache: 'no-store',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
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

  useEffect(() => {
    fetchList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const endpoint = editingUuid
        ? `/api/master-data-provinces/${editingUuid}`
        : '/api/master-data-provinces';
      const method = editingUuid ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: form.name,
          isoCode: form.isoCode,
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to save data');
      }

      setForm(initialForm);
      setEditingUuid(null);
      setShowForm(false);
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save data');
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (item: MasterDataProvince) => {
    setEditingUuid(item.uuid);
    setShowForm(true);
    setForm({
      name: item.name ?? '',
      isoCode: item.isoCode ?? '',
    });
  };

  const onDelete = async (uuid: string) => {
    const ok = window.confirm('Delete this province?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      const response = await fetch(`/api/master-data-provinces/${uuid}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to delete data');
      }
      if (editingUuid === uuid) {
        setEditingUuid(null);
        setForm(initialForm);
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
          <ToolbarPageTitle>Master Data Province</ToolbarPageTitle>
          <ToolbarDescription>Manage province name and ISO code.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button
            onClick={() => {
              setEditingUuid(null);
              setForm(initialForm);
              setShowForm(true);
            }}
          >
            <Plus />
            Add Province
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
              <div className="relative flex-1">
              <Input
                placeholder="Search by name or ISO code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    fetchList(1);
                  }
                }}
                className="pr-8"
              />
              {search ? (
                <button
                  type="button"
                  aria-label="Reset search"
                  onClick={() => {
                    setSearch('');
                    fetchList(1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </div>
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
                  <TableHead>ISO Code</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4}>Loading...</TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>No province data found.</TableCell>
                  </TableRow>
                ) : (
                  items.map((item, index) => (
                    <TableRow key={item.uuid}>
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.isoCode}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" aria-label="Edit province" onClick={() => onEdit(item)}>
                            <Pencil />
                          </Button>
                          <Button variant="destructive" size="icon" aria-label="Delete province" onClick={() => onDelete(item.uuid)}>
                            <Trash2 />
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
              {editingUuid ? 'Edit Province' : 'Create Province'}
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
                  <Label htmlFor="isoCode">
                    ISO Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="isoCode"
                    placeholder="ID-JI"
                    value={form.isoCode}
                    onChange={(e) => setForm((s) => ({ ...s, isoCode: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  <Save />
                  {submitting ? 'Saving...' : editingUuid ? 'Update' : 'Create'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingUuid(null);
                    setForm(initialForm);
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
