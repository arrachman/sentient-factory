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
import { Textarea } from '@/components/ui/textarea';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';

type PermissionItem = {
  id?: string | number;
  uuid?: string | number;
  name: string;
  module: string;
  action: string;
  description?: string | null;
  createdAt?: string;
};

type FormState = {
  name: string;
  module: string;
  action: string;
  description: string;
};

const initialForm: FormState = {
  name: '',
  module: '',
  action: '',
  description: '',
};

function getTokenFromCookie() {
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('sf_token='))
    ?.slice('sf_token='.length) || '';
}

function toEntityId(value: unknown) {
  if (value == null) {
    return '';
  }
  const id = String(value).trim();
  if (!id || id === 'null' || id === 'undefined') {
    return '';
  }
  return id;
}

function pickPermissionId(item?: PermissionItem | null) {
  return toEntityId(item?.id ?? item?.uuid);
}

export default function AdministratorPermissionPage() {
  const [items, setItems] = useState<PermissionItem[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
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

      const response = await fetch(`/api/master-data-permissions?${query.toString()}`, {
        cache: 'no-store',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load permissions');
      }

      const normalizedItems: PermissionItem[] = (
        Array.isArray(payload.data) ? payload.data : []
      ).map((item: PermissionItem) => ({
        ...item,
        id: item.id ?? item.uuid,
        uuid: item.uuid ?? item.id,
      }));
      setItems(normalizedItems);

      const meta = payload?.meta;
      setPage(typeof meta?.page === 'number' ? meta.page : safePage);
      setTotalPages(typeof meta?.totalPages === 'number' ? meta.totalPages : 1);
      setTotalItems(typeof meta?.total === 'number' ? meta.total : 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load permissions');
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
      const payload = {
        name: form.name.trim(),
        module: form.module.trim(),
        action: form.action.trim(),
        description: form.description.trim() || undefined,
      };

      const endpoint = editingId ? `/api/master-data-permissions/${editingId}` : '/api/master-data-permissions';
      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to save permission');
      }

      setEditingId(null);
      setForm(initialForm);
      setShowForm(false);
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save permission');
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (item: PermissionItem) => {
    const permissionId = pickPermissionId(item);
    if (!permissionId) {
      setError('Permission ID is missing');
      return;
    }
    setEditingId(permissionId);
    setShowForm(true);
    setForm({
      name: item.name ?? '',
      module: item.module ?? '',
      action: item.action ?? '',
      description: item.description ?? '',
    });
  };

  const onDelete = async (permissionId: string) => {
    const ok = window.confirm('Delete this permission?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      const response = await fetch(`/api/master-data-permissions/${permissionId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to delete permission');
      }

      if (editingId === permissionId) {
        setEditingId(null);
        setForm(initialForm);
        setShowForm(false);
      }
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete permission');
    }
  };

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Administrator Permission</ToolbarPageTitle>
          <ToolbarDescription>Manage permission name, module, and action mapping.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button
            onClick={() => {
              setEditingId(null);
              setForm(initialForm);
              setShowForm(true);
            }}
          >
            <Plus />
            Add Permission
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
                  placeholder="Search by permission, module, action..."
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
                  <TableHead>Module</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Description</TableHead>
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
                    <TableCell colSpan={6}>No permission found.</TableCell>
                  </TableRow>
                ) : (
                  items.map((item, index) => {
                    const permissionId = pickPermissionId(item);
                    return (
                      <TableRow key={permissionId || `permission-${index}`}>
                        <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.module}</TableCell>
                        <TableCell>{item.action}</TableCell>
                        <TableCell className="max-w-[300px] truncate">{item.description || '-'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => onEdit(item)}
                              aria-label="Edit permission"
                            >
                              <Pencil />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => {
                                if (permissionId) {
                                  void onDelete(permissionId);
                                }
                              }}
                              disabled={!permissionId}
                              aria-label="Delete permission"
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing page {page} of {totalPages} ({totalItems} rows)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchList(page - 1)}
                  disabled={page <= 1 || loading}
                >
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
          <form onSubmit={onSubmit} className="rounded-lg border p-5 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Permission Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((state) => ({ ...state, name: e.target.value }))}
                  placeholder="user:create"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Module</Label>
                <Input
                  value={form.module}
                  onChange={(e) => setForm((state) => ({ ...state, module: e.target.value }))}
                  placeholder="user"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Action</Label>
                <Input
                  value={form.action}
                  onChange={(e) => setForm((state) => ({ ...state, action: e.target.value }))}
                  placeholder="create"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((state) => ({ ...state, description: e.target.value }))}
                  placeholder="Optional description"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setForm(initialForm);
                  setShowForm(false);
                }}
              >
                <ArrowLeft />
                Back
              </Button>
              <Button type="submit" disabled={submitting}>
                <Save />
                {submitting ? 'Saving...' : editingId ? 'Update Permission' : 'Create Permission'}
              </Button>
            </div>
          </form>
        )}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}
