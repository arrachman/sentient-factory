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
import { buildEntityRef, parseEntityRef } from '@/lib/entity-ref';
import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';

type AdministratorMenu = {
  id: number;
  key: string;
  title: string;
  path: string | null;
  icon: string | null;
  type: string;
  parentId: number | null;
  parentTitle: string | null;
  sortOrder: number;
  isVisible: boolean;
  isActive: boolean;
  permissionName: string | null;
  createdAt?: string;
};

type FormState = {
  key: string;
  title: string;
  path: string;
  icon: string;
  type: string;
  parentId: string;
  sortOrder: string;
  permissionName: string;
  isVisible: boolean;
  isActive: boolean;
};

const initialForm: FormState = {
  key: '',
  title: '',
  path: '',
  icon: '',
  type: 'ITEM',
  parentId: '',
  sortOrder: '0',
  permissionName: '',
  isVisible: true,
  isActive: true,
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

export default function AdministratorMenuPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAddRoute = pathname === '/app/administrator/menu/add';
  const isUpdateRoute = pathname === '/app/administrator/menu/update';
  const updateIdFromQuery = searchParams.get('id')?.trim() ?? '';
  const updateRef = searchParams.get('ref')?.trim() ?? '';
  const decodedRefId = parseEntityRef(updateRef);
  const updateId = updateIdFromQuery || decodedRefId;

  const [items, setItems] = useState<AdministratorMenu[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [parentFilter, setParentFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [parentOptions, setParentOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);

  const token = useMemo(() => getTokenFromCookie(), []);

  const fetchList = async (targetPage = page) => {
    const safePage =
      typeof targetPage === 'number' &&
      Number.isInteger(targetPage) &&
      targetPage > 0
        ? targetPage
        : 1;

    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams({
        page: String(safePage),
        limit: String(limit),
        includeInactive: 'true',
      });
      if (search.trim()) {
        query.set('search', search.trim());
      }
      if (parentFilter !== 'all') {
        query.set('parentId', parentFilter);
      }

      const response = await fetch(`/api/menus?${query.toString()}`, {
        cache: 'no-store',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load menu data');
      }
      setItems(Array.isArray(payload.data) ? payload.data : []);
      const meta = payload?.meta;
      setPage(typeof meta?.page === 'number' ? meta.page : safePage);
      setTotalPages(typeof meta?.totalPages === 'number' ? meta.totalPages : 1);
      setTotalItems(typeof meta?.total === 'number' ? meta.total : 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load menu data');
    } finally {
      setLoading(false);
    }
  };

  const fetchParentOptions = async () => {
    try {
      const response = await fetch(
        '/api/menus?page=1&limit=100&includeInactive=true',
        {
          cache: 'no-store',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        },
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        setParentOptions([]);
        return;
      }
      const options = (Array.isArray(payload.data) ? payload.data : []).map(
        (item: AdministratorMenu) => ({
          value: String(item.id),
          label: `${item.title} (${item.key})`,
        }),
      );
      setParentOptions(options);
    } catch {
      setParentOptions([]);
    }
  };

  useEffect(() => {
    fetchList(1);
    fetchParentOptions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isAddRoute || showForm) {
      return;
    }
    setEditingId(null);
    setForm(initialForm);
    setShowForm(true);
  }, [isAddRoute, showForm]);

  useEffect(() => {
    if (!isUpdateRoute || !updateId || showForm) {
      return;
    }
    const id = Number(updateId);
    if (!Number.isInteger(id)) {
      return;
    }
    const item = items.find((row) => row.id === id);
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
        key: form.key.trim(),
        title: form.title.trim(),
        type: form.type.trim(),
        parentId: form.parentId ? Number(form.parentId) : null,
        sortOrder: Number(form.sortOrder || 0),
        isVisible: form.isVisible,
        isActive: form.isActive,
      };

      if (form.path.trim()) {
        payload.path = form.path.trim();
      } else if (editingId) {
        payload.path = null;
      }

      if (form.icon.trim()) {
        payload.icon = form.icon.trim();
      } else if (editingId) {
        payload.icon = null;
      }

      if (form.permissionName.trim()) {
        payload.permissionName = form.permissionName.trim();
      } else if (editingId) {
        payload.permissionName = null;
      }

      const endpoint = editingId ? `/api/menus/${editingId}` : '/api/menus';
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
        throw new Error(result?.message || 'Failed to save menu');
      }

      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      if (isAddRoute || isUpdateRoute) {
        router.push('/app/administrator/menu');
      }
      await Promise.all([fetchList(page), fetchParentOptions()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save menu');
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (item: AdministratorMenu) => {
    setEditingId(String(item.id));
    setShowForm(true);
    setForm({
      key: item.key ?? '',
      title: item.title ?? '',
      path: item.path ?? '',
      icon: item.icon ?? '',
      type: item.type ?? 'ITEM',
      parentId: item.parentId ? String(item.parentId) : '',
      sortOrder: String(item.sortOrder ?? 0),
      permissionName: item.permissionName ?? '',
      isVisible: item.isVisible,
      isActive: item.isActive,
    });
  };

  const onDelete = async (id: number) => {
    const ok = window.confirm('Delete this menu?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      const response = await fetch(`/api/menus/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to delete menu');
      }
      if (editingId === String(id)) {
        setEditingId(null);
        setForm(initialForm);
        setShowForm(false);
        if (isAddRoute || isUpdateRoute) {
          router.push('/app/administrator/menu');
        }
      }
      await Promise.all([fetchList(page), fetchParentOptions()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete menu');
    }
  };

  const parentSelectOptions = useMemo(() => {
    const selectedId = editingId ? Number(editingId) : null;
    const filtered = parentOptions.filter(
      (option) => Number(option.value) !== selectedId,
    );
    return [{ value: '', label: 'No Parent' }, ...filtered];
  }, [parentOptions, editingId]);

  const parentFilterOptions = useMemo(
    () => [
      { value: 'all', label: 'All Parent' },
      { value: 'null', label: 'No Parent' },
      ...parentOptions,
    ],
    [parentOptions],
  );

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Administrator Menu</ToolbarPageTitle>
          <ToolbarDescription>
            Manage sidebar menu structure and visibility.
          </ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button onClick={() => router.push('/app/administrator/menu/add')}>
            <Plus />
            Add Menu
          </Button>
          <Button
            variant="outline"
            onClick={() => fetchList(page)}
            disabled={loading}
          >
            <RefreshCw />
            Refresh
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        {!showForm ? (
          <div className="rounded-lg border p-5">
            <div className="mb-3 grid grid-cols-1 gap-2 md:grid-cols-[1fr_260px_auto]">
              <div className="relative flex-1">
                <Input
                  placeholder="Search by key, title, path, icon..."
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
              <AutocompleteSelect
                value={parentFilter}
                onValueChange={(value) => setParentFilter(value || 'all')}
                options={parentFilterOptions}
                placeholder="Filter parent"
                searchPlaceholder="Search parent..."
                emptyText="No parent found."
                triggerClassName="h-9 text-sm"
              />
              <Button
                variant="outline"
                onClick={() => fetchList(1)}
                disabled={loading}
              >
                <RefreshCw />
                Apply
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">No</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Status</TableHead>
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
                    <TableCell colSpan={7}>No menu data found.</TableCell>
                  </TableRow>
                ) : (
                  items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.key}</TableCell>
                      <TableCell>{item.path || '-'}</TableCell>
                      <TableCell>{item.parentTitle || '-'}</TableCell>
                      <TableCell>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label="Edit menu"
                            onClick={() =>
                              router.push(
                                `/app/administrator/menu/update?ref=${encodeURIComponent(
                                  buildEntityRef(
                                    String(item.id),
                                    item.createdAt,
                                  ),
                                )}`,
                              )
                            }
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            aria-label="Delete menu"
                            onClick={() => onDelete(item.id)}
                          >
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
                  Next
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {showForm ? (
          <div className="rounded-lg border p-5">
            <h2 className="mb-4 text-sm font-semibold text-mono">
              {editingId ? 'Edit Menu' : 'Create Menu'}
            </h2>
            <form className="space-y-3" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div>
                  <Label htmlFor="title">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, title: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="key">
                    Key <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="key"
                    value={form.key}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, key: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                <div>
                  <Label htmlFor="path">Path</Label>
                  <Input
                    id="path"
                    value={form.path}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, path: e.target.value }))
                    }
                    placeholder="/app/administrator/menu"
                  />
                </div>
                <div>
                  <Label htmlFor="icon">Icon (Lucide)</Label>
                  <Input
                    id="icon"
                    value={form.icon}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, icon: e.target.value }))
                    }
                    placeholder="Users"
                  />
                </div>
                <div>
                  <Label htmlFor="permissionName">Permission</Label>
                  <Input
                    id="permissionName"
                    value={form.permissionName}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, permissionName: e.target.value }))
                    }
                    placeholder="menu.read"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div>
                  <Label htmlFor="type">
                    Type <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="type"
                    value={form.type}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, type: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sortOrder">
                    Sort Order <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    min={0}
                    value={form.sortOrder}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, sortOrder: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                <div>
                  <Label htmlFor="parentId">Parent Menu</Label>
                  <AutocompleteSelect
                    value={form.parentId}
                    onValueChange={(value) =>
                      setForm((s) => ({ ...s, parentId: value }))
                    }
                    options={parentSelectOptions}
                    placeholder="Select parent menu"
                    searchPlaceholder="Search parent menu..."
                    emptyText="No menu found."
                    triggerClassName="h-8.5 text-[0.8125rem]"
                  />
                </div>
                <div>
                  <Label htmlFor="isVisible">
                    Visibility <span className="text-destructive">*</span>
                  </Label>
                  <AutocompleteSelect
                    value={form.isVisible ? 'true' : 'false'}
                    onValueChange={(value) =>
                      setForm((s) => ({ ...s, isVisible: value === 'true' }))
                    }
                    options={[
                      { value: 'true', label: 'Visible' },
                      { value: 'false', label: 'Hidden' },
                    ]}
                    placeholder="Select visibility"
                    searchPlaceholder="Search visibility..."
                    emptyText="No visibility found."
                    required
                    triggerClassName="h-8.5 text-[0.8125rem]"
                  />
                </div>
                <div>
                  <Label htmlFor="isActive">
                    Status <span className="text-destructive">*</span>
                  </Label>
                  <AutocompleteSelect
                    value={form.isActive ? 'true' : 'false'}
                    onValueChange={(value) =>
                      setForm((s) => ({ ...s, isActive: value === 'true' }))
                    }
                    options={[
                      { value: 'true', label: 'Active' },
                      { value: 'false', label: 'Inactive' },
                    ]}
                    placeholder="Select status"
                    searchPlaceholder="Search status..."
                    emptyText="No status found."
                    required
                    triggerClassName="h-8.5 text-[0.8125rem]"
                  />
                </div>
              </div>

              {error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : null}

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  <Save />
                  {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setForm(initialForm);
                    setShowForm(false);
                    if (isAddRoute || isUpdateRoute) {
                      router.push('/app/administrator/menu');
                    }
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
