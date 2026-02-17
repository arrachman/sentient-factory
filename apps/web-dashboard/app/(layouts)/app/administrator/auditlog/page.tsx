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
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';

type AuditLogItem = {
  id?: string | number;
  uuid?: string | number;
  userId?: number | null;
  action?: string;
  entityType?: string;
  entityId?: string | null;
  oldData?: unknown;
  newData?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt?: string;
  userName?: string | null;
  userEmail?: string | null;
};

type FormState = {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  oldData: string;
  newData: string;
  ipAddress: string;
  userAgent: string;
};

const initialForm: FormState = {
  userId: '',
  action: '',
  entityType: '',
  entityId: '',
  oldData: '',
  newData: '',
  ipAddress: '',
  userAgent: '',
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

function pickAuditLogId(item?: AuditLogItem | null) {
  return toEntityId(item?.id ?? item?.uuid);
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

function stringifyJson(value: unknown) {
  if (value == null) {
    return '';
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '';
  }
}

export default function AdministratorAuditlogPage() {
  const [items, setItems] = useState<AuditLogItem[]>([]);
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

      const response = await fetch(`/api/audit-logs?${query.toString()}`, {
        cache: 'no-store',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load audit logs');
      }
      const normalizedItems: AuditLogItem[] = (Array.isArray(payload.data) ? payload.data : []).map(
        (item: AuditLogItem) => ({
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
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload: Record<string, unknown> = {
        action: form.action.trim(),
        entityType: form.entityType.trim(),
      };
      if (form.userId.trim()) {
        const parsedUserId = Number(form.userId.trim());
        if (!Number.isInteger(parsedUserId) || parsedUserId < 1) {
          throw new Error('User ID must be a positive number');
        }
        payload.userId = parsedUserId;
      }
      if (form.entityId.trim()) {
        payload.entityId = form.entityId.trim();
      }
      if (form.ipAddress.trim()) {
        payload.ipAddress = form.ipAddress.trim();
      }
      if (form.userAgent.trim()) {
        payload.userAgent = form.userAgent.trim();
      }
      if (form.oldData.trim()) {
        payload.oldData = JSON.parse(form.oldData);
      }
      if (form.newData.trim()) {
        payload.newData = JSON.parse(form.newData);
      }

      const endpoint = editingUuid ? `/api/audit-logs/${editingUuid}` : '/api/audit-logs';
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
        throw new Error(result?.message || 'Failed to save audit log');
      }

      setForm(initialForm);
      setEditingUuid(null);
      setShowForm(false);
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save audit log');
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (item: AuditLogItem) => {
    const auditLogId = pickAuditLogId(item);
    if (!auditLogId) {
      setError('Audit log ID is missing');
      return;
    }

    setEditingUuid(auditLogId);
    setShowForm(true);
    setForm({
      userId: item.userId ? String(item.userId) : '',
      action: item.action ?? '',
      entityType: item.entityType ?? '',
      entityId: item.entityId ?? '',
      oldData: stringifyJson(item.oldData),
      newData: stringifyJson(item.newData),
      ipAddress: item.ipAddress ?? '',
      userAgent: item.userAgent ?? '',
    });
  };

  const onDelete = async (auditLogId: string) => {
    const ok = window.confirm('Delete this audit log?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      const response = await fetch(`/api/audit-logs/${auditLogId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to delete audit log');
      }
      if (editingUuid === auditLogId) {
        setEditingUuid(null);
        setForm(initialForm);
        setShowForm(false);
      }
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete audit log');
    }
  };

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Administrator Auditlog</ToolbarPageTitle>
          <ToolbarDescription>Manage audit logs for administrator activities.</ToolbarDescription>
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
            Add Auditlog
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
                  placeholder="Search by action, entity, IP, or user..."
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
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Entity ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Created At</TableHead>
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
                    <TableCell colSpan={8}>No audit logs found.</TableCell>
                  </TableRow>
                ) : (
                  items.map((item, index) => (
                    <TableRow key={pickAuditLogId(item) || `audit-row-${index}`}>
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>{item.action || '-'}</TableCell>
                      <TableCell>{item.entityType || '-'}</TableCell>
                      <TableCell>{item.entityId || '-'}</TableCell>
                      <TableCell>{item.userName || item.userEmail || '-'}</TableCell>
                      <TableCell>{item.ipAddress || '-'}</TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label="Edit audit log"
                            onClick={() => onEdit(item)}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            aria-label="Delete audit log"
                            onClick={() => {
                              const auditLogId = pickAuditLogId(item);
                              if (!auditLogId) {
                                setError('Audit log ID is missing');
                                return;
                              }
                              void onDelete(auditLogId);
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
              {editingUuid ? 'Edit Auditlog' : 'Create Auditlog'}
            </h2>
            <form className="space-y-3" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div>
                  <Label htmlFor="action">
                    Action <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="action"
                    value={form.action}
                    onChange={(e) => setForm((s) => ({ ...s, action: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="entityType">
                    Entity Type <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="entityType"
                    value={form.entityType}
                    onChange={(e) => setForm((s) => ({ ...s, entityType: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div>
                  <Label htmlFor="entityId">Entity ID</Label>
                  <Input
                    id="entityId"
                    value={form.entityId}
                    onChange={(e) => setForm((s) => ({ ...s, entityId: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    value={form.userId}
                    onChange={(e) => setForm((s) => ({ ...s, userId: e.target.value }))}
                    placeholder="Optional numeric user ID"
                  />
                </div>
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

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div>
                  <Label htmlFor="oldData">Old Data (JSON)</Label>
                  <Textarea
                    id="oldData"
                    value={form.oldData}
                    onChange={(e) => setForm((s) => ({ ...s, oldData: e.target.value }))}
                    rows={6}
                    placeholder='{"before": "..."}'
                  />
                </div>
                <div>
                  <Label htmlFor="newData">New Data (JSON)</Label>
                  <Textarea
                    id="newData"
                    value={form.newData}
                    onChange={(e) => setForm((s) => ({ ...s, newData: e.target.value }))}
                    rows={6}
                    placeholder='{"after": "..."}'
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
