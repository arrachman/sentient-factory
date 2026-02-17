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
import { Checkbox } from '@/components/ui/checkbox';
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

type AdministratorUser = {
  id?: string | number;
  uuid?: string | number;
  email: string;
  username: string;
  fullName?: string | null;
  roleId?: string | number | null;
  roleIds?: Array<string | number>;
  warehouseId?: string | null;
  warehouseName?: string | null;
  isActive: boolean;
  role?: string | null;
  roles?: string[];
};

type WarehouseOption = {
  value: string;
  label: string;
};

type WarehouseApiItem = {
  id?: string | number;
  uuid?: string;
  name?: string | null;
  locationName?: string | null;
};

type RoleApiItem = {
  id?: string | number;
  uuid?: string | number;
  name?: string | null;
};

type FormState = {
  email: string;
  username: string;
  fullName: string;
  password: string;
  roleIds: string[];
  warehouseId: string;
  isActive: boolean;
};

const initialForm: FormState = {
  email: '',
  username: '',
  fullName: '',
  password: '',
  roleIds: [],
  warehouseId: '',
  isActive: true,
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

function pickUserId(user?: AdministratorUser | null) {
  return toEntityId(user?.id ?? user?.uuid);
}

export default function AdministratorUsersPage() {
  const [items, setItems] = useState<AdministratorUser[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [warehouses, setWarehouses] = useState<WarehouseOption[]>([]);
  const [roles, setRoles] = useState<WarehouseOption[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [defaultWarehouseId, setDefaultWarehouseId] = useState('');

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

      const response = await fetch(`/api/users?${query.toString()}`, {
        cache: 'no-store',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load users');
      }
      const normalizedItems: AdministratorUser[] = (
        Array.isArray(payload.data) ? payload.data : []
      ).map((item: AdministratorUser) => ({
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
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await fetch('/api/master-data-warehouses?page=1&limit=100', {
          cache: 'no-store',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success) {
          return;
        }
        const options = (Array.isArray(payload.data) ? payload.data : []).map(
          (item: WarehouseApiItem) => ({
            value: String(item.id ?? item.uuid ?? ''),
            label: String(item.locationName || item.name || item.id || item.uuid || ''),
          }),
        );
        setWarehouses(options);
      } catch {
        setWarehouses([]);
      }
    };

    fetchWarehouses();
  }, [token]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/master-data-roles?page=1&limit=100&includeSystem=true', {
          cache: 'no-store',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success) {
          return;
        }
        const options = (Array.isArray(payload.data) ? payload.data : []).map((item: RoleApiItem) => ({
          value: String(item.id ?? item.uuid ?? ''),
          label: String(item.name || item.id || item.uuid || ''),
        }));
        setRoles(options);
      } catch {
        setRoles([]);
      }
    };

    fetchRoles();
  }, [token]);

  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          cache: 'no-store',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success) {
          return;
        }

        const rawWarehouseId =
          payload?.data?.warehouseId ??
          payload?.data?.user?.warehouseId ??
          null;
        const normalizedWarehouseId =
          rawWarehouseId == null ? '' : String(rawWarehouseId).trim();
        setDefaultWarehouseId(normalizedWarehouseId);
      } catch {
        setDefaultWarehouseId('');
      }
    };

    fetchCurrentUserProfile();
  }, [token]);

  useEffect(() => {
    if (!showForm || editingUuid || form.warehouseId || !defaultWarehouseId) {
      return;
    }
    setForm((prev) => ({ ...prev, warehouseId: defaultWarehouseId }));
  }, [defaultWarehouseId, editingUuid, form.warehouseId, showForm]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload: Record<string, unknown> = {
        email: form.email.trim(),
        username: form.username.trim(),
        fullName: form.fullName.trim() || undefined,
        roleIds: form.roleIds,
        warehouseId: form.warehouseId.trim(),
        isActive: form.isActive,
      };

      if (!Array.isArray(form.roleIds) || form.roleIds.length === 0) {
        throw new Error('Please select at least one role');
      }

      if (editingUuid) {
        if (form.password.trim()) {
          payload.password = form.password.trim();
        }
      } else {
        payload.password = form.password.trim();
      }

      const endpoint = editingUuid ? `/api/users/${editingUuid}` : '/api/users';
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
        throw new Error(result?.message || 'Failed to save user');
      }

      setForm(initialForm);
      setEditingUuid(null);
      setShowForm(false);
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save user');
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (item: AdministratorUser) => {
    const userId = pickUserId(item);
    if (!userId) {
      setError('User ID is missing');
      return;
    }
    setEditingUuid(userId);
    setShowForm(true);
    setForm({
      email: item.email ?? '',
      username: item.username ?? '',
      fullName: item.fullName ?? '',
      password: '',
      roleIds: Array.isArray(item.roleIds)
        ? item.roleIds.map((value) => toEntityId(value)).filter(Boolean)
        : toEntityId(item.roleId)
          ? [toEntityId(item.roleId)]
          : [],
      warehouseId: item.warehouseId ?? '',
      isActive: item.isActive,
    });
  };

  const onDelete = async (userId: string) => {
    const ok = window.confirm('Delete this user?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to delete user');
      }
      if (editingUuid === userId) {
        setEditingUuid(null);
        setForm(initialForm);
        setShowForm(false);
      }
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Administrator Users</ToolbarPageTitle>
          <ToolbarDescription>Manage application users and their account status.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button
            onClick={() => {
              setEditingUuid(null);
              setForm({ ...initialForm, warehouseId: defaultWarehouseId || initialForm.warehouseId });
              setShowForm(true);
            }}
          >
            <Plus />
            Add User
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
                  placeholder="Search by email, username, or full name..."
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
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Role</TableHead>
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
                    <TableCell colSpan={8}>No users found.</TableCell>
                  </TableRow>
                ) : (
                  items.map((item, index) => (
                    <TableRow key={pickUserId(item) || `user-row-${index}`}>
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>{item.fullName || '-'}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.username}</TableCell>
                      <TableCell>{item.warehouseName || '-'}</TableCell>
                      <TableCell className="capitalize">
                        {item.roles?.length ? item.roles.join(', ') : item.role || '-'}
                      </TableCell>
                      <TableCell>{item.isActive ? 'Active' : 'Inactive'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" aria-label="Edit user" onClick={() => onEdit(item)}>
                            <Pencil />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            aria-label="Delete user"
                            onClick={() => {
                              const userId = pickUserId(item);
                              if (!userId) {
                                setError('User ID is missing');
                                return;
                              }
                              void onDelete(userId);
                            }}
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
              {editingUuid ? 'Edit User' : 'Create User'}
            </h2>
            <form className="space-y-3" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="username">
                    Username <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="username"
                    value={form.username}
                    onChange={(e) => setForm((s) => ({ ...s, username: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div>
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">
                    {editingUuid ? 'New Password (optional)' : 'Password'}{' '}
                    {!editingUuid ? <span className="text-destructive">*</span> : null}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                    required={!editingUuid}
                    minLength={6}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div>
                  <Label>
                    Roles <span className="text-destructive">*</span>
                  </Label>
                  <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-2">
                    {roles.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No role found.</p>
                    ) : (
                      roles.map((role) => {
                        const checked = form.roleIds.includes(role.value);
                        return (
                          <label key={role.value} className="flex cursor-pointer items-center gap-2 text-sm">
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(next) => {
                                setForm((prev) => {
                                  if (next) {
                                    return {
                                      ...prev,
                                      roleIds: Array.from(new Set([...prev.roleIds, role.value])),
                                    };
                                  }
                                  return {
                                    ...prev,
                                    roleIds: prev.roleIds.filter((item) => item !== role.value),
                                  };
                                });
                              }}
                            />
                            <span>{role.label}</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="isActive">Status</Label>
                  <AutocompleteSelect
                    value={form.isActive ? 'active' : 'inactive'}
                    onValueChange={(value) => setForm((s) => ({ ...s, isActive: value === 'active' }))}
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                    ]}
                    placeholder="Select status"
                    searchPlaceholder="Search status..."
                    emptyText="No status found."
                    triggerClassName="h-8.5 text-[0.8125rem]"
                  />
                </div>
                <div>
                  <Label htmlFor="warehouseId">
                    Warehouse <span className="text-destructive">*</span>
                  </Label>
                  <AutocompleteSelect
                    value={form.warehouseId}
                    onValueChange={(value) => setForm((s) => ({ ...s, warehouseId: value }))}
                    options={warehouses}
                    placeholder="Select warehouse"
                    searchPlaceholder="Search warehouse..."
                    emptyText="No warehouse found."
                    triggerClassName="h-8.5 text-[0.8125rem]"
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
