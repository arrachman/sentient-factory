'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
import { AutocompleteSelect, type AutocompleteSelectOption } from '@/components/ui/autocomplete-select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { buildEntityRef, parseEntityRef } from '@/lib/entity-ref';

type DepartmentItem = {
  id?: string | number;
  uuid?: string | number;
  createdAt?: string;
  code: string;
  name: string;
  description?: string | null;
  parentId?: string | number | null;
  parent?: {
    id?: string | number;
    code?: string;
    name?: string;
  } | null;
};

type FormState = {
  code: string;
  name: string;
  description: string;
  parentId: string;
};

const initialForm: FormState = {
  code: '',
  name: '',
  description: '',
  parentId: '',
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

function pickDepartmentId(item?: DepartmentItem | null) {
  return toEntityId(item?.id ?? item?.uuid);
}

export default function AdministratorDepartmentPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAddRoute = pathname === '/app/administrator/department/add';
  const isUpdateRoute = pathname === '/app/administrator/department/update';
  const updateUuid = searchParams.get('uuid')?.trim() ?? '';
  const updateRef = searchParams.get('ref')?.trim() ?? '';
  const decodedRefId = parseEntityRef(updateRef);
  const updateId = updateUuid || decodedRefId;

  const [items, setItems] = useState<DepartmentItem[]>([]);
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

      const response = await fetch(`/api/departments?${query.toString()}`, {
        cache: 'no-store',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load departments');
      }

      const normalizedItems: DepartmentItem[] = (Array.isArray(payload.data) ? payload.data : []).map(
        (item: DepartmentItem) => ({
          ...item,
          id: item.id ?? item.uuid,
          uuid: item.uuid ?? item.id,
        }),
      );
      setItems(normalizedItems);

      const meta = payload?.meta;
      setPage(typeof meta?.page === 'number' ? meta.page : safePage);
      setTotalPages(typeof meta?.totalPages === 'number' ? meta.totalPages : 1);
      setTotalItems(typeof meta?.total === 'number' ? meta.total : 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isAddRoute || showForm) {
      return;
    }
    setEditingUuid(null);
    setForm(initialForm);
    setShowForm(true);
  }, [isAddRoute, showForm]);

  useEffect(() => {
    if (!isUpdateRoute || !updateId || showForm) {
      return;
    }
    const item = items.find((row) => pickDepartmentId(row) === updateId);
    if (!item) {
      return;
    }
    onEdit(item);
  }, [isUpdateRoute, updateId, showForm, items]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload: Record<string, unknown> = {
        code: form.code.trim(),
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        parentId: form.parentId.trim() ? Number(form.parentId) : null,
      };

      const endpoint = editingUuid ? `/api/departments/${editingUuid}` : '/api/departments';
      const method = editingUuid ? 'PATCH' : 'POST';

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
        throw new Error(result?.message || 'Failed to save department');
      }

      setForm(initialForm);
      setEditingUuid(null);
      setShowForm(false);
      if (isAddRoute || isUpdateRoute) {
        router.push('/app/administrator/department');
      }
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save department');
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (item: DepartmentItem) => {
    const id = pickDepartmentId(item);
    if (!id) {
      setError('Department ID is missing');
      return;
    }

    setEditingUuid(id);
    setShowForm(true);
    setForm({
      code: item.code ?? '',
      name: item.name ?? '',
      description: item.description ?? '',
      parentId: toEntityId(item.parentId ?? item.parent?.id),
    });
  };

  const onDelete = async (id: string) => {
    const ok = window.confirm('Delete this department?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      const response = await fetch(`/api/departments/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to delete department');
      }

      if (editingUuid === id) {
        setEditingUuid(null);
        setForm(initialForm);
        setShowForm(false);
        if (isAddRoute || isUpdateRoute) {
          router.push('/app/administrator/department');
        }
      }
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete department');
    }
  };

  const parentOptions = useMemo<AutocompleteSelectOption[]>(() => {
    return items
      .filter((item) => pickDepartmentId(item) !== editingUuid)
      .map((item) => ({
        value: pickDepartmentId(item),
        label: `${item.code} - ${item.name}`,
      }))
      .filter((item) => item.value);
  }, [items, editingUuid]);

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Administrator Department</ToolbarPageTitle>
          <ToolbarDescription>Manage department code, name, hierarchy, and description.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button onClick={() => router.push('/app/administrator/department/add')}>
            <Plus />
            Add Department
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
                  placeholder="Search by code, name, or description..."
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
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Parent</TableHead>
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
                    <TableCell colSpan={6}>No departments found.</TableCell>
                  </TableRow>
                ) : (
                  items.map((item, index) => {
                    const id = pickDepartmentId(item);
                    const ref = buildEntityRef(id, item.createdAt);
                    return (
                      <TableRow key={id || `department-${index}`}>
                        <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                        <TableCell>{item.code}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.parent ? `${item.parent.code} - ${item.parent.name}` : '-'}</TableCell>
                        <TableCell>{item.description || '-'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              aria-label="Edit department"
                              onClick={() =>
                                router.push(
                                  `/app/administrator/department/update?ref=${encodeURIComponent(ref)}`,
                                )
                              }
                            >
                              <Pencil />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              aria-label="Delete department"
                              onClick={() => {
                                if (!id) {
                                  setError('Department ID is missing');
                                  return;
                                }
                                void onDelete(id);
                              }}
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
        ) : (
          <div className="rounded-lg border p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold">{editingUuid ? 'Edit Department' : 'Create Department'}</h2>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  setEditingUuid(null);
                  setForm(initialForm);
                  if (isAddRoute || isUpdateRoute) {
                    router.push('/app/administrator/department');
                  }
                }}
              >
                <ArrowLeft />
                Back to list
              </Button>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    value={form.code}
                    onChange={(e) => setForm((s) => ({ ...s, code: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="parent">Parent Department</Label>
                  <AutocompleteSelect
                    value={form.parentId}
                    onValueChange={(value) => setForm((s) => ({ ...s, parentId: value }))}
                    options={[{ value: '', label: 'No parent' }, ...parentOptions]}
                    placeholder="Select parent department"
                    searchPlaceholder="Search parent department..."
                    emptyText="No parent department found."
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setForm(initialForm);
                    setEditingUuid(null);
                    setShowForm(false);
                    if (isAddRoute || isUpdateRoute) {
                      router.push('/app/administrator/department');
                    }
                  }}
                  disabled={submitting}
                >
                  <X />
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  <Save />
                  {submitting ? 'Saving...' : editingUuid ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
}
