'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

type RoleItem = {
  id?: string | number;
  uuid?: string | number;
  name: string;
  description?: string | null;
  isSystem: boolean;
  permissionCount?: number;
};

type PermissionItem = {
  id?: string | number;
  uuid?: string | number;
  name: string;
  module: string;
  action: string;
  description?: string | null;
};

type RoleFormState = {
  name: string;
  description: string;
  isSystem: boolean;
};

const initialRoleForm: RoleFormState = {
  name: '',
  description: '',
  isSystem: false,
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

function pickEntityId(entity?: { id?: string | number; uuid?: string | number } | null) {
  return toEntityId(entity?.id ?? entity?.uuid);
}

export default function AdministratorRolePage() {
  const [items, setItems] = useState<RoleItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);

  const [form, setForm] = useState<RoleFormState>(initialRoleForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [permissionDialogRole, setPermissionDialogRole] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
  const [permissionLoading, setPermissionLoading] = useState(false);
  const [permissionSubmitting, setPermissionSubmitting] = useState(false);

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

      const response = await fetch(`/api/master-data-roles?${query.toString()}`, {
        cache: 'no-store',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load roles');
      }

      const normalizedItems: RoleItem[] = (
        Array.isArray(payload.data) ? payload.data : []
      ).map((item: RoleItem) => ({
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
      setError(err instanceof Error ? err.message : 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await fetch('/api/master-data-permissions?page=1&limit=100', {
        cache: 'no-store',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load permissions');
      }
      const rows: PermissionItem[] = Array.isArray(payload.data) ? payload.data : [];
      setPermissions(rows);
    } catch {
      setPermissions([]);
    }
  };

  useEffect(() => {
    fetchList(1);
    void fetchPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        isSystem: form.isSystem,
      };

      const endpoint = editingId ? `/api/master-data-roles/${editingId}` : '/api/master-data-roles';
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
        throw new Error(result?.message || 'Failed to save role');
      }

      setEditingId(null);
      setForm(initialRoleForm);
      setShowForm(false);
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save role');
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (item: RoleItem) => {
    const id = pickEntityId(item);
    if (!id) {
      setError('Role ID is missing');
      return;
    }
    setEditingId(id);
    setShowForm(true);
    setForm({
      name: item.name ?? '',
      description: item.description ?? '',
      isSystem: Boolean(item.isSystem),
    });
  };

  const onDelete = async (id: string) => {
    const ok = window.confirm('Delete this role?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      const response = await fetch(`/api/master-data-roles/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to delete role');
      }

      if (editingId === id) {
        setEditingId(null);
        setForm(initialRoleForm);
        setShowForm(false);
      }
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete role');
    }
  };

  const openPermissionDialog = async (item: RoleItem) => {
    const roleId = pickEntityId(item);
    if (!roleId) {
      setError('Role ID is missing');
      return;
    }

    setPermissionDialogRole({ id: roleId, name: item.name });
    setPermissionLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/master-data-roles/${roleId}/permissions`, {
        cache: 'no-store',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load role permissions');
      }
      const ids: number[] = Array.isArray(payload?.data?.permissionIds)
        ? payload.data.permissionIds
            .map((value: unknown) => Number(value))
            .filter((value: number) => Number.isInteger(value) && value > 0)
        : [];
      setSelectedPermissionIds(Array.from(new Set(ids)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load role permissions');
      setSelectedPermissionIds([]);
    } finally {
      setPermissionLoading(false);
    }
  };

  const togglePermission = (permissionId: number) => {
    setSelectedPermissionIds((state) =>
      state.includes(permissionId)
        ? state.filter((id) => id !== permissionId)
        : [...state, permissionId],
    );
  };

  const saveRolePermissions = async () => {
    if (!permissionDialogRole) {
      return;
    }

    setPermissionSubmitting(true);
    setError('');
    try {
      const response = await fetch(`/api/master-data-roles/${permissionDialogRole.id}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          permissionIds: selectedPermissionIds,
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to update role permissions');
      }

      setPermissionDialogRole(null);
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role permissions');
    } finally {
      setPermissionSubmitting(false);
    }
  };

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Administrator Role</ToolbarPageTitle>
          <ToolbarDescription>Manage role master data and assign permissions per role.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button
            onClick={() => {
              setEditingId(null);
              setForm(initialRoleForm);
              setShowForm(true);
            }}
          >
            <Plus />
            Add Role
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
                  placeholder="Search role name/description..."
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
                  <TableHead>Description</TableHead>
                  <TableHead>System</TableHead>
                  <TableHead className="text-right">Permissions</TableHead>
                  <TableHead className="w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6}>Loading...</TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>No role found.</TableCell>
                  </TableRow>
                ) : (
                  items.map((item, index) => {
                    const roleId = pickEntityId(item);
                    return (
                      <TableRow key={roleId || `role-${index}`}>
                        <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="max-w-[280px] truncate">{item.description || '-'}</TableCell>
                        <TableCell>{item.isSystem ? 'Yes' : 'No'}</TableCell>
                        <TableCell className="text-right">{item.permissionCount ?? 0}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => void openPermissionDialog(item)}
                            >
                              <ShieldCheck className="size-4" />
                              Permissions
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => onEdit(item)}
                              aria-label="Edit role"
                            >
                              <Pencil />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => {
                                if (roleId) {
                                  void onDelete(roleId);
                                }
                              }}
                              disabled={!roleId || item.isSystem}
                              aria-label="Delete role"
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
                <Label>Role Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((state) => ({ ...state, name: e.target.value }))}
                  placeholder="manager"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>System Role</Label>
                <label className="flex h-9 items-center gap-2 rounded-md border px-3 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isSystem}
                    onChange={(e) => setForm((state) => ({ ...state, isSystem: e.target.checked }))}
                    disabled={Boolean(editingId && form.isSystem)}
                  />
                  <span>Mark as system role</span>
                </label>
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
                  setForm(initialRoleForm);
                  setShowForm(false);
                }}
              >
                <ArrowLeft />
                Back
              </Button>
              <Button type="submit" disabled={submitting}>
                <Save />
                {submitting ? 'Saving...' : editingId ? 'Update Role' : 'Create Role'}
              </Button>
            </div>
          </form>
        )}

        <Dialog
          open={Boolean(permissionDialogRole)}
          onOpenChange={(open) => {
            if (!open && !permissionSubmitting) {
              setPermissionDialogRole(null);
            }
          }}
        >
          <DialogContent className="max-w-[820px] p-0">
            <DialogHeader className="border-b px-5 pt-5 pb-4">
              <DialogTitle>
                Assign Permissions: {permissionDialogRole?.name || '-'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 px-5 pb-5">
              {permissionLoading ? (
                <p className="text-sm text-muted-foreground">Loading role permissions...</p>
              ) : permissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No permission master data found.</p>
              ) : (
                <div className="max-h-[420px] overflow-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[70px]">Use</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Module</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {permissions.map((permission) => {
                        const permissionId = Number(pickEntityId(permission));
                        const checked = selectedPermissionIds.includes(permissionId);
                        return (
                          <TableRow key={permissionId || permission.name}>
                            <TableCell>
                              <button
                                type="button"
                                className={`inline-flex size-7 items-center justify-center rounded border ${
                                  checked ? 'bg-primary text-primary-foreground' : 'bg-background'
                                }`}
                                onClick={() => {
                                  if (Number.isInteger(permissionId) && permissionId > 0) {
                                    togglePermission(permissionId);
                                  }
                                }}
                              >
                                {checked ? <Check className="size-4" /> : null}
                              </button>
                            </TableCell>
                            <TableCell className="font-medium">{permission.name}</TableCell>
                            <TableCell>{permission.module}</TableCell>
                            <TableCell>{permission.action}</TableCell>
                            <TableCell className="max-w-[260px] truncate">
                              {permission.description || '-'}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}

              <DialogFooter className="pt-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPermissionDialogRole(null)}
                  disabled={permissionSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => void saveRolePermissions()}
                  disabled={permissionSubmitting || permissionLoading}
                >
                  {permissionSubmitting ? 'Saving...' : 'Save Assignments'}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}
