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

type AdministratorUser = {
  uuid: string;
  email: string;
  username: string;
  fullName?: string | null;
  isActive: boolean;
  role?: string | null;
  roles?: string[];
};

type FormState = {
  email: string;
  username: string;
  fullName: string;
  password: string;
  isActive: boolean;
};

const initialForm: FormState = {
  email: '',
  username: '',
  fullName: '',
  password: '',
  isActive: true,
};

function getTokenFromCookie() {
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('sf_token='))
    ?.slice('sf_token='.length) || '';
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

      const response = await fetch(`/api/users?${query.toString()}`, {
        cache: 'no-store',
        headers: token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : undefined,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load users');
      }
      setItems(Array.isArray(payload.data) ? payload.data : []);
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

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload: Record<string, unknown> = {
        email: form.email.trim(),
        username: form.username.trim(),
        fullName: form.fullName.trim() || undefined,
        isActive: form.isActive,
      };

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
          ...(token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : {}),
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
    setEditingUuid(item.uuid);
    setShowForm(true);
    setForm({
      email: item.email ?? '',
      username: item.username ?? '',
      fullName: item.fullName ?? '',
      password: '',
      isActive: item.isActive,
    });
  };

  const onDelete = async (uuid: string) => {
    const ok = window.confirm('Delete this user?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      const response = await fetch(`/api/users/${uuid}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : undefined,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to delete user');
      }
      if (editingUuid === uuid) {
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
              setForm(initialForm);
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
              <Input
                placeholder="Search by email, username, or full name..."
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
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
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
                    <TableCell colSpan={7}>No users found.</TableCell>
                  </TableRow>
                ) : (
                  items.map((item, index) => (
                    <TableRow key={item.uuid}>
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>{item.fullName || '-'}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.username}</TableCell>
                      <TableCell className="capitalize">{item.role || '-'}</TableCell>
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
                    minLength={8}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
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
