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
import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Badge } from '@/components/ui/badge';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';

type SupplierOption = {
  uuid: string;
  code: string;
  name: string;
};

type WarehouseOption = {
  uuid: string;
  name: string;
  createdBy?: string | null;
  locationName?: string | null;
  city?: {
    name?: string | null;
  } | null;
};

type ItemOption = {
  uuid: string;
  code: string;
  name: string;
  uom?: {
    name?: string | null;
    code?: string | null;
  } | null;
};

type InboundBatchForm = {
  batchIn: string;
  qty: string;
  expiredDate: string;
  notes: string;
};

type InboundDetailForm = {
  itemId: string;
  uomInput: string;
  notes: string;
  batches: InboundBatchForm[];
};

type InboundForm = {
  transactionNo: string;
  transactionDate: string;
  supplierId: string;
  warehouseId: string;
  status: 'POSTED' | 'CANCELLED';
  notes: string;
  details: InboundDetailForm[];
};

type InboundListItem = {
  uuid: string;
  reportNo: string | number;
  transactionNo: string;
  transactionDate: string;
  status: 'DRAFT' | 'POSTED' | 'CANCELLED';
  supplier?: {
    uuid: string;
    code: string;
    name: string;
  };
  warehouse?: {
    uuid: string;
    name: string;
  };
  _count?: {
    details?: number;
  };
};

type InboundDetailApi = {
  itemId?: string;
  uomInput?: number | null;
  notes?: string | null;
  batches?: Array<{
    batchIn?: string;
    qty?: string | number;
    expiredDate?: string | null;
    notes?: string | null;
  }>;
};

const STATUS_OPTIONS = ['DRAFT', 'POSTED', 'CANCELLED'] as const;

function toInputDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDefaultExpiredDate() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return toInputDate(date);
}

const initialBatch = (): InboundBatchForm => ({
  batchIn: '',
  qty: '',
  expiredDate: getDefaultExpiredDate(),
  notes: '',
});

const initialDetail = (): InboundDetailForm => ({
  itemId: '',
  uomInput: '',
  notes: '',
  batches: [initialBatch()],
});

const initialForm: InboundForm = {
  transactionNo: '',
  transactionDate: '',
  supplierId: '',
  warehouseId: '',
  status: 'POSTED',
  notes: '',
  details: [initialDetail()],
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

function fmtDate(value?: string | null) {
  if (!value) {
    return '-';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function mapDetailFromApi(details?: InboundDetailApi[]): InboundDetailForm[] {
  if (!Array.isArray(details) || details.length === 0) {
    return [initialDetail()];
  }

  return details.map((detail) => ({
    itemId: String(detail.itemId ?? ''),
    uomInput:
      detail.uomInput == null ? '' : String(Math.trunc(Number(detail.uomInput))),
    notes: String(detail.notes ?? ''),
    batches:
      Array.isArray(detail.batches) && detail.batches.length > 0
        ? detail.batches.map((batch) => ({
            batchIn: String(batch.batchIn ?? ''),
            qty: batch.qty != null ? String(batch.qty) : '',
            expiredDate: batch.expiredDate
              ? String(batch.expiredDate).slice(0, 10)
              : '',
            notes: String(batch.notes ?? ''),
          }))
        : [initialBatch()],
  }));
}

export default function LogisticInboundPage() {
  const [items, setItems] = useState<InboundListItem[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseOption[]>([]);
  const [itemOptions, setItemOptions] = useState<ItemOption[]>([]);

  const [form, setForm] = useState<InboundForm>(initialForm);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [lockedWarehouseId, setLockedWarehouseId] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const token = useMemo(() => getTokenFromCookie(), []);

  const detailSummary = useMemo(() => {
    let totalQty = 0;
    let totalBatch = 0;

    form.details.forEach((detail) => {
      detail.batches.forEach((batch) => {
        totalBatch += 1;
        totalQty += Number(batch.qty || 0) || 0;
      });
    });

    return {
      totalItemTypes: form.details.length,
      totalBatch,
      totalQty,
    };
  }, [form.details]);

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
      });
      if (search.trim()) {
        query.set('search', search.trim());
      }
      if (statusFilter) {
        query.set('status', statusFilter);
      }

      const response = await fetch(`/api/inbounds?${query.toString()}`, {
        cache: 'no-store',
        headers: token
          ? { Authorization: `Bearer ${decodeURIComponent(token)}` }
          : undefined,
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load inbounds');
      }

      setItems(Array.isArray(payload.data) ? payload.data : []);
      const meta = payload?.meta;
      setPage(typeof meta?.page === 'number' ? meta.page : safePage);
      setTotalPages(typeof meta?.totalPages === 'number' ? meta.totalPages : 1);
      setTotalItems(typeof meta?.total === 'number' ? meta.total : 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inbounds');
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    setLoadingOptions(true);
    setError('');
    try {
      const headers = token
        ? { Authorization: `Bearer ${decodeURIComponent(token)}` }
        : undefined;

      const [profileRes, supplierRes, warehouseRes, itemRes] =
        await Promise.all([
          fetch('/api/auth/me', { cache: 'no-store', headers }),
          fetch('/api/master-data-contacts?page=1&limit=100&type=supplier', {
            cache: 'no-store',
            headers,
          }),
          fetch('/api/master-data-warehouses?page=1&limit=100', {
            cache: 'no-store',
            headers,
          }),
          fetch('/api/master-data-items?page=1&limit=100&isActive=true', {
            cache: 'no-store',
            headers,
          }),
        ]);

      const [profilePayload, supplierPayload, warehousePayload, itemPayload] =
        await Promise.all([
          profileRes.json().catch(() => null),
          supplierRes.json().catch(() => null),
          warehouseRes.json().catch(() => null),
          itemRes.json().catch(() => null),
        ]);

      if (!profileRes.ok || !profilePayload?.success) {
        throw new Error(
          profilePayload?.message || 'Failed to load current user',
        );
      }
      if (!supplierRes.ok || !supplierPayload?.success) {
        throw new Error(
          supplierPayload?.message || 'Failed to load supplier options',
        );
      }
      if (!warehouseRes.ok || !warehousePayload?.success) {
        throw new Error(
          warehousePayload?.message || 'Failed to load warehouse options',
        );
      }
      if (!itemRes.ok || !itemPayload?.success) {
        throw new Error(itemPayload?.message || 'Failed to load item options');
      }

      const nextSuppliers = Array.isArray(supplierPayload.data)
        ? supplierPayload.data
        : [];
      const nextWarehouses = Array.isArray(warehousePayload.data)
        ? warehousePayload.data
        : [];
      const nextItems = Array.isArray(itemPayload.data) ? itemPayload.data : [];
      const userId = String(profilePayload?.data?.id ?? '');
      const mappedWarehouseIdRaw =
        profilePayload?.data?.warehouseId ??
        profilePayload?.data?.user?.warehouseId ??
        '';
      const mappedWarehouseId = String(mappedWarehouseIdRaw).trim();
      const resolvedLockedWarehouseId =
        mappedWarehouseId && mappedWarehouseId !== 'null' && mappedWarehouseId !== 'undefined'
          ? mappedWarehouseId
          : '';
      const nextLockedWarehouseId = resolvedLockedWarehouseId;

      setSuppliers(nextSuppliers);
      setWarehouses(nextWarehouses);
      setItemOptions(nextItems);
      setCurrentUserId(userId);
      setLockedWarehouseId(nextLockedWarehouseId);

      setForm((state) => ({
        ...state,
        supplierId: state.supplierId || nextSuppliers[0]?.uuid || '',
        warehouseId:
          nextLockedWarehouseId ||
          state.warehouseId ||
          nextWarehouses[0]?.uuid ||
          '',
        details: state.details.map((detail, index) => ({
          ...detail,
          itemId:
            detail.itemId ||
            (index === 0 ? nextItems[0]?.uuid || '' : detail.itemId),
        })),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load options');
    } finally {
      setLoadingOptions(false);
    }
  };

  useEffect(() => {
    fetchList(1);
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreateForm = () => {
    setEditingUuid(null);
    setForm({
      ...initialForm,
      transactionDate: new Date().toISOString().slice(0, 10),
      supplierId: suppliers[0]?.uuid || '',
      warehouseId: lockedWarehouseId || warehouses[0]?.uuid || '',
      details: [{ ...initialDetail(), itemId: itemOptions[0]?.uuid || '' }],
    });
    setShowForm(true);
  };

  const openEditForm = async (uuid: string) => {
    setError('');
    try {
      const response = await fetch(`/api/inbounds/${uuid}`, {
        cache: 'no-store',
        headers: token
          ? { Authorization: `Bearer ${decodeURIComponent(token)}` }
          : undefined,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load inbound detail');
      }

      const data = payload.data;
      setEditingUuid(uuid);
      setForm({
        transactionNo: String(data.transactionNo ?? ''),
        transactionDate: data.transactionDate
          ? String(data.transactionDate).slice(0, 10)
          : '',
        supplierId: String(data.supplierId ?? ''),
        warehouseId: String(data.warehouseId ?? ''),
        status: String(data.status ?? 'POSTED') as InboundForm['status'],
        notes: String(data.notes ?? ''),
        details: mapDetailFromApi(data.details),
      });
      setShowForm(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load inbound detail',
      );
    }
  };

  const upsert = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const detailsPayload = form.details
        .map((detail) => {
          const parsedUomInput = detail.uomInput.trim();
          const uomInput =
            parsedUomInput === '' ? undefined : Number(parsedUomInput);
          if (
            uomInput !== undefined &&
            (!Number.isInteger(uomInput) || uomInput < 0)
          ) {
            throw new Error('Input UOM harus integer dan tidak boleh negatif.');
          }

          const batches = detail.batches
            .map((batch) => ({
              batchIn: batch.batchIn.trim(),
              qty: Number(batch.qty || 0),
              expiredDate: batch.expiredDate || undefined,
              notes: batch.notes.trim() || undefined,
            }))
            .filter((batch) => batch.batchIn && batch.qty > 0);

          return {
            itemId: detail.itemId,
            uomInput,
            notes: detail.notes.trim() || undefined,
            qty: batches.reduce((sum, batch) => sum + batch.qty, 0),
            batches,
          };
        })
        .filter(
          (detail) =>
            detail.itemId && detail.batches.length > 0 && detail.qty > 0,
        );

      if (detailsPayload.length === 0) {
        throw new Error(
          'Minimal satu detail item dengan batch valid wajib diisi.',
        );
      }

      const payload = {
        transactionNo: form.transactionNo.trim() || undefined,
        transactionDate: form.transactionDate || undefined,
        supplierId: form.supplierId,
        warehouseId: lockedWarehouseId || form.warehouseId,
        status: 'POSTED',
        notes: form.notes.trim() || undefined,
        details: detailsPayload,
      };

      const endpoint = editingUuid
        ? `/api/inbounds/${editingUuid}`
        : '/api/inbounds';
      const method = editingUuid ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token
            ? { Authorization: `Bearer ${decodeURIComponent(token)}` }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to save inbound');
      }

      setShowForm(false);
      setEditingUuid(null);
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save inbound');
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (uuid: string) => {
    const ok = window.confirm('Delete this inbound?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      const response = await fetch(`/api/inbounds/${uuid}`, {
        method: 'DELETE',
        headers: token
          ? { Authorization: `Bearer ${decodeURIComponent(token)}` }
          : undefined,
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to delete inbound');
      }

      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete inbound');
    }
  };

  const setDetailField = (
    index: number,
    key: keyof InboundDetailForm,
    value: string,
  ) => {
    setForm((state) => ({
      ...state,
      details: state.details.map((detail, i) =>
        i === index ? { ...detail, [key]: value } : detail,
      ),
    }));
  };

  const setBatchField = (
    detailIndex: number,
    batchIndex: number,
    key: keyof InboundBatchForm,
    value: string,
  ) => {
    setForm((state) => ({
      ...state,
      details: state.details.map((detail, i) =>
        i !== detailIndex
          ? detail
          : {
              ...detail,
              batches: detail.batches.map((batch, j) =>
                j === batchIndex ? { ...batch, [key]: value } : batch,
              ),
            },
      ),
    }));
  };

  const addDetailRow = () => {
    setForm((state) => ({
      ...state,
      details: [
        ...state.details,
        { ...initialDetail(), itemId: itemOptions[0]?.uuid || '' },
      ],
    }));
  };

  const removeDetailRow = (index: number) => {
    setForm((state) => {
      if (state.details.length === 1) {
        return {
          ...state,
          details: [{ ...initialDetail(), itemId: itemOptions[0]?.uuid || '' }],
        };
      }
      return {
        ...state,
        details: state.details.filter((_, i) => i !== index),
      };
    });
  };

  const addBatchRow = (detailIndex: number) => {
    setForm((state) => ({
      ...state,
      details: state.details.map((detail, i) =>
        i === detailIndex
          ? { ...detail, batches: [...detail.batches, initialBatch()] }
          : detail,
      ),
    }));
  };

  const removeBatchRow = (detailIndex: number, batchIndex: number) => {
    setForm((state) => ({
      ...state,
      details: state.details.map((detail, i) => {
        if (i !== detailIndex) {
          return detail;
        }
        if (detail.batches.length === 1) {
          return { ...detail, batches: [initialBatch()] };
        }
        return {
          ...detail,
          batches: detail.batches.filter((_, j) => j !== batchIndex),
        };
      }),
    }));
  };

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Logistic Inbound</ToolbarPageTitle>
          <ToolbarDescription>
            Kelola inbound dari supplier dengan multi batch per item.
          </ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          {!showForm ? (
            <>
              <Button onClick={openCreateForm} disabled={loadingOptions}>
                <Plus />
                Add Inbound
              </Button>
              <Button
                variant="outline"
                onClick={() => fetchList(page)}
                disabled={loading}
              >
                <RefreshCw />
                Refresh
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setShowForm(false)}>
              <ArrowLeft />
              Back to List
            </Button>
          )}
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        {!showForm ? (
          <div className="rounded-lg border p-5">
            <div className="mb-3 grid gap-2 md:grid-cols-[1fr_200px_auto]">
              <div className="relative flex-1">
                <Input
                  placeholder="Search transaction no, supplier, warehouse..."
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
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
                options={[
                  { value: '', label: 'All Status' },
                  ...STATUS_OPTIONS.map((status) => ({
                    value: status,
                    label: status,
                  })),
                ]}
                placeholder="All Status"
                searchPlaceholder="Search status..."
                emptyText="No status found."
              />
              <Button
                variant="outline"
                onClick={() => fetchList(1)}
                disabled={loading}
              >
                <RefreshCw />
                Search
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">No</TableHead>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Item Row</TableHead>
                  <TableHead className="w-[170px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8}>Loading inbounds...</TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8}>No inbound found.</TableCell>
                  </TableRow>
                ) : (
                  items.map((item, index) => (
                    <TableRow key={item.uuid}>
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>
                        <div className="font-medium">{item.transactionNo}</div>
                        <div className="text-xs text-muted-foreground">
                          Report #{item.reportNo}
                        </div>
                      </TableCell>
                      <TableCell>{fmtDate(item.transactionDate)}</TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {item.supplier?.name || '-'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.supplier?.code || '-'}
                        </div>
                      </TableCell>
                      <TableCell>{item.warehouse?.name || '-'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === 'CANCELLED'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {item._count?.details ?? 0}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditForm(item.uuid)}
                          >
                            <Pencil />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => remove(item.uuid)}
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
          <form onSubmit={upsert} className="space-y-5">
            <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
              <div className="space-y-5">
                <div className="rounded-lg border p-5">
                  <h3 className="mb-4 text-base font-semibold">
                    Inbound Header
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Transaction No</Label>
                      <Input
                        value={form.transactionNo}
                        onChange={(e) =>
                          setForm((state) => ({
                            ...state,
                            transactionNo: e.target.value,
                          }))
                        }
                        placeholder="Auto-generate jika kosong"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Transaction Date</Label>
                      <Input
                        type="date"
                        value={form.transactionDate}
                        onChange={(e) =>
                          setForm((state) => ({
                            ...state,
                            transactionDate: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Supplier</Label>
                      <AutocompleteSelect
                        value={form.supplierId}
                        onValueChange={(value) =>
                          setForm((state) => ({ ...state, supplierId: value }))
                        }
                        options={suppliers.map((supplier) => ({
                          value: supplier.uuid,
                          label: supplier.name,
                          keywords: supplier.code,
                        }))}
                        placeholder="Select supplier"
                        searchPlaceholder="Search supplier..."
                        emptyText="No supplier found."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Warehouse</Label>
                      <AutocompleteSelect
                        value={form.warehouseId}
                        onValueChange={(value) =>
                          setForm((state) => ({ ...state, warehouseId: value }))
                        }
                        options={warehouses.map((warehouse) => ({
                          value: warehouse.uuid,
                          label: `${warehouse.name}${warehouse.city?.name ? ` - ${warehouse.city.name}` : ''}`,
                          keywords: warehouse.locationName || undefined,
                        }))}
                        placeholder="Select warehouse"
                        searchPlaceholder="Search warehouse..."
                        emptyText="No warehouse found."
                        disabled={Boolean(lockedWarehouseId)}
                      />
                      {lockedWarehouseId ? (
                        <p className="text-xs text-muted-foreground">
                          Warehouse dikunci berdasarkan user login (
                          {currentUserId}).
                        </p>
                      ) : null}
                    </div>
                    <input type="hidden" value={form.status} readOnly />
                    <div className="space-y-2 md:col-span-2">
                      <Label>Catatan</Label>
                      <Textarea
                        value={form.notes}
                        onChange={(e) =>
                          setForm((state) => ({
                            ...state,
                            notes: e.target.value,
                          }))
                        }
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base font-semibold">Item & Batch</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addDetailRow}
                    >
                      <Plus />
                      Add Item
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {form.details.map((detail, detailIndex) => {
                      const detailQty = detail.batches.reduce(
                        (sum, batch) => sum + (Number(batch.qty || 0) || 0),
                        0,
                      );

                      return (
                        <div
                          key={`detail-${detailIndex}`}
                          className="rounded-md border p-4"
                        >
                          <div className="mb-3 grid gap-3 md:grid-cols-[1fr_160px_180px_auto]">
                            <div className="space-y-1">
                              <Label>Item</Label>
                              <AutocompleteSelect
                                value={detail.itemId}
                                onValueChange={(value) =>
                                  setDetailField(detailIndex, 'itemId', value)
                                }
                                options={itemOptions.map((item) => ({
                                  value: item.uuid,
                                  label: `${item.code} - ${item.name}`,
                                  keywords: `${item.uom?.name ?? ''} ${item.uom?.code ?? ''}`,
                                }))}
                                placeholder="Select item"
                                searchPlaceholder="Search item..."
                                emptyText="No item found."
                              />
                            </div>
                            <div className="space-y-1">
                              <Label>Qty (auto)</Label>
                              <Input value={String(detailQty)} readOnly />
                            </div>
                            <div className="space-y-1">
                              <Label>Input UOM (integer)</Label>
                              <Input
                                type="number"
                                step="1"
                                min="0"
                                placeholder="cth: 25"
                                value={detail.uomInput}
                                onChange={(e) =>
                                  setDetailField(
                                    detailIndex,
                                    'uomInput',
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div className="flex items-end">
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeDetailRow(detailIndex)}
                              >
                                <Trash2 />
                                Remove Item
                              </Button>
                            </div>
                          </div>

                          <div className="mb-3">
                            <Label>Catatan Item</Label>
                            <Input
                              value={detail.notes}
                              onChange={(e) =>
                                setDetailField(
                                  detailIndex,
                                  'notes',
                                  e.target.value,
                                )
                              }
                              placeholder="Catatan item"
                            />
                          </div>

                          <div className="space-y-2 rounded-md border p-3">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">Batch Rows</p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addBatchRow(detailIndex)}
                              >
                                <Plus />
                                Add Batch
                              </Button>
                            </div>

                            {detail.batches.map((batch, batchIndex) => (
                              <div
                                key={`batch-${detailIndex}-${batchIndex}`}
                                className="grid gap-2 md:grid-cols-4"
                              >
                                <Input
                                  placeholder="Batch number"
                                  value={batch.batchIn}
                                  onChange={(e) =>
                                    setBatchField(
                                      detailIndex,
                                      batchIndex,
                                      'batchIn',
                                      e.target.value,
                                    )
                                  }
                                />
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  placeholder="Qty"
                                  value={batch.qty}
                                  onChange={(e) =>
                                    setBatchField(
                                      detailIndex,
                                      batchIndex,
                                      'qty',
                                      e.target.value,
                                    )
                                  }
                                />
                                <Input
                                  type="date"
                                  value={batch.expiredDate}
                                  onChange={(e) =>
                                    setBatchField(
                                      detailIndex,
                                      batchIndex,
                                      'expiredDate',
                                      e.target.value,
                                    )
                                  }
                                />
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Catatan batch"
                                    value={batch.notes}
                                    onChange={(e) =>
                                      setBatchField(
                                        detailIndex,
                                        batchIndex,
                                        'notes',
                                        e.target.value,
                                      )
                                    }
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() =>
                                      removeBatchRow(detailIndex, batchIndex)
                                    }
                                  >
                                    <Trash2 />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border p-5">
                  <h3 className="mb-3 text-base font-semibold">Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Item Types</span>
                      <span className="font-medium">
                        {detailSummary.totalItemTypes}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Batch</span>
                      <span className="font-medium">
                        {detailSummary.totalBatch}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Qty</span>
                      <span className="font-medium">
                        {detailSummary.totalQty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-5">
                  <div className="flex flex-col gap-2">
                    <Button
                      type="submit"
                      disabled={submitting || loadingOptions}
                    >
                      <Save />
                      {submitting
                        ? 'Saving...'
                        : editingUuid
                          ? 'Update Inbound'
                          : 'Create Inbound'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setEditingUuid(null);
                      }}
                    >
                      <ArrowLeft />
                      Back to List
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}
