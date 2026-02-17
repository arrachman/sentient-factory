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
import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';

type SessionUser = {
  id?: string | number;
  email?: string;
  username?: string;
  fullName?: string | null;
};

type AdministratorSession = {
  id?: string | number;
  uuid?: string | number;
  userId: string | number;
  token: string;
  expiresAt: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt?: string;
  user?: SessionUser;
};

type UserOption = {
  value: string;
  label: string;
};

type UserApiItem = {
  id?: string | number;
  uuid?: string | number;
  email?: string;
  username?: string;
  fullName?: string | null;
};

type FormState = {
  userId: string;
  token: string;
  expiresAt: string;
  ipAddress: string;
  userAgent: string;
};

const initialForm: FormState = {
  userId: '',
  token: '',
  expiresAt: '',
  ipAddress: '',
  userAgent: '',
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

function pickSessionId(item?: AdministratorSession | null) {
  return toEntityId(item?.id ?? item?.uuid);
}

function toDatetimeLocal(value?: string | null) {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return adjusted.toISOString().slice(0, 16);
}

function fromDatetimeLocal(value: string) {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toISOString();
}

function formatDate(value?: string) {
  if (!value) {
    return '-';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  return date.toLocaleString();
}

function formatUserLabel(user: UserApiItem) {
  const fullName = user.fullName?.trim();
  const username = user.username?.trim();
  const email = user.email?.trim();
  const main = fullName || username || email || 'User';
  const sub = username && email ? `${username} • ${email}` : username || email || '';
  return sub && sub !== main ? `${main} (${sub})` : main;
}

export default function AdministratorSessionPage() {
  const [items, setItems] = useState<AdministratorSession[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<UserOption[]>([]);
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

      const response = await fetch(`/api/sessions?${query.toString()}`, {
        cache: 'no-store',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load sessions');
      }

      const normalizedItems: AdministratorSession[] = (
        Array.isArray(payload.data) ? payload.data : []
      ).map((item: AdministratorSession) => ({
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
      setError(err instanceof Error ? err.message : 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users?page=1&limit=100', {
          cache: 'no-store',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success) {
          return;
        }

        const options = (Array.isArray(payload.data) ? payload.data : [])
          .map((item: UserApiItem) => {
            const id = toEntityId(item.id ?? item.uuid);
            if (!id) {
              return null;
            }
            return {
              value: id,
              label: formatUserLabel(item),
            };
          })
          .filter((item: UserOption | null): item is UserOption => Boolean(item));

        setUsers(options);
      } catch {
        setUsers([]);
      }
    };

    fetchUsers();
  }, [token]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload: Record<string, unknown> = {
        userId: form.userId.trim(),
        token: form.token.trim(),
        expiresAt: fromDatetimeLocal(form.expiresAt),
        ipAddress: form.ipAddress.trim() || undefined,
        userAgent: form.userAgent.trim() || undefined,
      };

      const endpoint = editingUuid ? `/api/sessions/${editingUuid}` : '/api/sessions';
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
        throw new Error(result?.message || 'Failed to save session');
      }

      setForm(initialForm);
      setEditingUuid(null);
      setShowForm(false);
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save session');
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (item: AdministratorSession) => {
    const sessionId = pickSessionId(item);
    if (!sessionId) {
      setError('Session ID is missing');
      return;
    }

    setEditingUuid(sessionId);
    setShowForm(true);
    setForm({
      userId: toEntityId(item.userId),
      token: item.token ?? '',
      expiresAt: toDatetimeLocal(item.expiresAt),
      ipAddress: item.ipAddress ?? '',
      userAgent: item.userAgent ?? '',
    });
  };

  const onDelete = async (sessionId: string) => {
    const ok = window.confirm('Delete this session?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to delete session');
      }
      if (editingUuid === sessionId) {
        setEditingUuid(null);
        setForm(initialForm);
        setShowForm(false);
      }
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete session');
    }
  };

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Administrator Sessions</ToolbarPageTitle>
          <ToolbarDescription>Manage active and historical login sessions.</ToolbarDescription>
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
            Add Session
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
                  placeholder="Search by user, token, IP, or user agent..."
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
                  <TableHead>User</TableHead>
                  <TableHead>Token</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Expires At</TableHead>
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
                    <TableCell colSpan={6}>No sessions found.</TableCell>
                  </TableRow>
                ) : (
                  items.map((item, index) => {
                    const tokenPreview = item.token?.length > 24 ? `${item.token.slice(0, 24)}...` : item.token;
                    const userLabel =
                      item.user?.fullName || item.user?.username || item.user?.email || `User #${item.userId}`;

                    return (
                      <TableRow key={pickSessionId(item) || `session-row-${index}`}>
                        <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                        <TableCell>{userLabel}</TableCell>
                        <TableCell className="font-mono text-xs">{tokenPreview || '-'}</TableCell>
                        <TableCell>{item.ipAddress || '-'}</TableCell>
                        <TableCell>{formatDate(item.expiresAt)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              aria-label="Edit session"
                              onClick={() => onEdit(item)}
                            >
                              <Pencil />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              aria-label="Delete session"
                              onClick={() => {
                                const sessionId = pickSessionId(item);
                                if (!sessionId) {
                                  setError('Session ID is missing');
                                  return;
                                }
                                void onDelete(sessionId);
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
        ) : null}

        {showForm ? (
          <div className="rounded-lg border p-5">
            <h2 className="mb-4 text-sm font-semibold text-mono">
              {editingUuid ? 'Edit Session' : 'Create Session'}
            </h2>
            <form className="space-y-3" onSubmit={onSubmit}>
              <div>
                <Label htmlFor="userId">
                  User <span className="text-destructive">*</span>
                </Label>
                <AutocompleteSelect
                  value={form.userId}
                  onValueChange={(value) => setForm((s) => ({ ...s, userId: value }))}
                  options={users}
                  placeholder="Select user"
                  searchPlaceholder="Search user..."
                  emptyText="No user found."
                  triggerClassName="h-8.5 text-[0.8125rem]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="token">
                  Token <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="token"
                  value={form.token}
                  onChange={(e) => setForm((s) => ({ ...s, token: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="expiresAt">
                  Expires At <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={(e) => setForm((s) => ({ ...s, expiresAt: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div>
                  <Label htmlFor="ipAddress">IP Address</Label>
                  <Input
                    id="ipAddress"
                    value={form.ipAddress}
                    onChange={(e) => setForm((s) => ({ ...s, ipAddress: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="userAgent">User Agent</Label>
                  <Input
                    id="userAgent"
                    value={form.userAgent}
                    onChange={(e) => setForm((s) => ({ ...s, userAgent: e.target.value }))}
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
