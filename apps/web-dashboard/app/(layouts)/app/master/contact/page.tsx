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
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';

type ContactType = 'customer' | 'supplier' | 'company';

type MasterDataContact = {
  uuid: string;
  code: string;
  name: string;
  tax?: string | null;
  website?: string | null;
  address?: string | null;
  street?: string | null;
  city?: string | null;
  province?: string | null;
  zipCode?: string | null;
  type: ContactType;
  contactFirstName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
};

type FormState = {
  code: string;
  name: string;
  tax: string;
  website: string;
  address: string;
  street: string;
  city: string;
  province: string;
  zipCode: string;
  type: ContactType;
  contactFirstName: string;
  contactEmail: string;
  contactPhone: string;
};

const initialForm: FormState = {
  code: '',
  name: '',
  tax: '',
  website: '',
  address: '',
  street: '',
  city: '',
  province: '',
  zipCode: '',
  type: 'customer',
  contactFirstName: '',
  contactEmail: '',
  contactPhone: '',
};

function getTokenFromCookie() {
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('sf_token='))
    ?.slice('sf_token='.length) || '';
}

function slugifyCode(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function MasterDataContactPage() {
  const [items, setItems] = useState<MasterDataContact[]>([]);
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

      const response = await fetch(`/api/master-data-contacts?${query.toString()}`, {
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

  useEffect(() => {
    fetchList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const effectiveCode = form.code.trim() || slugifyCode(form.name);
      const payload = {
        ...form,
        code: effectiveCode,
        tax: form.tax || undefined,
        website: form.website || undefined,
        address: form.address || undefined,
        street: form.street || undefined,
        city: form.city || undefined,
        province: form.province || undefined,
        zipCode: form.zipCode || undefined,
        contactFirstName: form.contactFirstName || undefined,
        contactEmail: form.contactEmail || undefined,
        contactPhone: form.contactPhone || undefined,
      };

      const endpoint = editingUuid
        ? `/api/master-data-contacts/${editingUuid}`
        : '/api/master-data-contacts';
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

  const onEdit = (item: MasterDataContact) => {
    setEditingUuid(item.uuid);
    setShowForm(true);
    setForm({
      code: item.code ?? '',
      name: item.name ?? '',
      tax: item.tax ?? '',
      website: item.website ?? '',
      address: item.address ?? '',
      street: item.street ?? '',
      city: item.city ?? '',
      province: item.province ?? '',
      zipCode: item.zipCode ?? '',
      type: item.type,
      contactFirstName: item.contactFirstName ?? '',
      contactEmail: item.contactEmail ?? '',
      contactPhone: item.contactPhone ?? '',
    });
  };

  const onDelete = async (uuid: string) => {
    const ok = window.confirm('Delete this contact?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      const response = await fetch(`/api/master-data-contacts/${uuid}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : undefined,
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
          <ToolbarPageTitle>Master Data Contact</ToolbarPageTitle>
          <ToolbarDescription>Manage customer, supplier, and company contacts.</ToolbarDescription>
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
            Add Contact
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
              placeholder="Search by code, name, city, province..."
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
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5}>Loading...</TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>No contact data found.</TableCell>
                </TableRow>
              ) : (
                items.map((item, index) => (
                  <TableRow key={item.uuid}>
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="capitalize">{item.type}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                          <Pencil />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(item.uuid)}
                        >
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
          <h2 className="text-sm font-semibold text-mono mb-4">
            {editingUuid ? 'Edit Contact' : 'Create Contact'}
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
                  onChange={(e) => {
                    const nextName = e.target.value;
                    setForm((s) => ({
                      ...s,
                      name: nextName,
                      code: slugifyCode(nextName),
                    }));
                  }}
                  required
                />
              </div>
              <div>
                <Label htmlFor="code">
                  Code <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="code"
                  value={form.code}
                  onChange={(e) => setForm((s) => ({ ...s, code: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="type">
                  Type <span className="text-destructive">*</span>
                </Label>
                <select
                  id="type"
                  className="h-8.5 w-full rounded-md border border-input bg-background px-3 text-[0.8125rem]"
                  value={form.type}
                  onChange={(e) => setForm((s) => ({ ...s, type: e.target.value as ContactType }))}
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="supplier">Supplier</option>
                  <option value="company">Company</option>
                </select>
              </div>
              <div>
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm((s) => ({ ...s, contactEmail: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <div>
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  value={form.contactPhone}
                  onChange={(e) => setForm((s) => ({ ...s, contactPhone: e.target.value }))}
                />
              </div>
            </div>

            <Accordion type="single" collapsible variant="outline">
              <AccordionItem value="advanced-input">
                <AccordionTrigger>Advanced Input</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    <div>
                      <Label htmlFor="tax">Tax</Label>
                      <Input
                        id="tax"
                        value={form.tax}
                        onChange={(e) => setForm((s) => ({ ...s, tax: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={form.website}
                        onChange={(e) => setForm((s) => ({ ...s, website: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="street">Street</Label>
                      <Input
                        id="street"
                        value={form.street}
                        onChange={(e) => setForm((s) => ({ ...s, street: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={form.city}
                        onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="province">Province</Label>
                      <Input
                        id="province"
                        value={form.province}
                        onChange={(e) => setForm((s) => ({ ...s, province: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input
                        id="zipCode"
                        value={form.zipCode}
                        onChange={(e) => setForm((s) => ({ ...s, zipCode: e.target.value }))}
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={form.address}
                        onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactFirstName">Contact Name</Label>
                      <Input
                        id="contactFirstName"
                        value={form.contactFirstName}
                        onChange={(e) => setForm((s) => ({ ...s, contactFirstName: e.target.value }))}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

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
