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
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  AutocompleteSelect,
  type AutocompleteSelectOption,
} from '@/components/ui/autocomplete-select';
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
  id?: string | number;
  uuid?: string | number;
  code?: string;
  name?: string;
};

type WarehouseOption = {
  id?: string | number;
  uuid?: string | number;
  name?: string;
  createdBy?: string | null;
  locationName?: string | null;
  city?: {
    name?: string | null;
  } | null;
};

type ItemOption = {
  id?: string | number;
  uuid?: string | number;
  code?: string;
  name?: string;
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
  id?: string | number;
  uuid: string;
  reportNo: string | number;
  transactionNo: string;
  transactionDate: string;
  createdAt?: string;
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

type DecimalLike = {
  s?: number;
  e?: number;
  d?: number[];
};

type InboundDetailApi = {
  itemId?: string;
  uomInput?: number | null;
  qty?: string | number | DecimalLike;
  notes?: string | null;
  batches?: Array<{
    batchIn?: string;
    batchNumber?: string;
    batchOut?: string;
    batchNo?: string;
    qty?: string | number | DecimalLike;
    qtyPcs?: string | number | DecimalLike;
    qty_pcs?: string | number | DecimalLike;
    quantity?: string | number | DecimalLike;
    quantityPcs?: string | number | DecimalLike;
    expiredDate?: string | null;
    expiryDate?: string | null;
    expired_date?: string | null;
    notes?: string | null;
    note?: string | null;
  }>;
  [key: string]: unknown;
};

const REQUIRED_FIELD_CLASS =
  'border-blue-500/70 focus-visible:border-blue-600 focus-visible:ring-blue-100';
const REQUIRED_SELECT_TRIGGER_CLASS =
  'border-blue-500/70 focus-visible:border-blue-600 focus-visible:ring-blue-100';

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
  details: [],
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

function pickInboundId(item?: InboundListItem | null) {
  return toEntityId(item?.id ?? item?.uuid);
}

function toBase64Url(input: string) {
  const base64 = btoa(input);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(input: string) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const paddingLength = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + '='.repeat(paddingLength);
  return atob(padded);
}

function buildInboundRef(id: string, createdAt?: string | null) {
  if (!id) {
    return '';
  }

  const millis = createdAt ? Date.parse(createdAt) : NaN;
  const safeMillis = Number.isFinite(millis) ? Math.trunc(millis) : 0;
  return toBase64Url(`${id}.${safeMillis}`);
}

function parseInboundRef(ref: string) {
  if (!ref) {
    return '';
  }

  try {
    const decoded = fromBase64Url(ref);
    const [id] = decoded.split('.', 1);
    const normalizedId = toEntityId(id);
    return normalizedId;
  } catch {
    return '';
  }
}

function toNumberInputValue(value: unknown) {
  if (value == null) {
    return '';
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : '';
  }
  if (isDecimalLike(value)) {
    const normalized = decimalLikeToString(value);
    return Number.isFinite(Number(normalized)) ? normalized : '';
  }

  const normalized = String(value).trim().replace(',', '.');
  if (!normalized) {
    return '';
  }

  return Number.isFinite(Number(normalized)) ? normalized : '';
}

function isDecimalLike(value: unknown): value is DecimalLike {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as DecimalLike;
  return Array.isArray(candidate.d);
}

function decimalLikeToString(value: DecimalLike): string {
  const sign = value.s === -1 ? '-' : '';
  const exponent = Number.isFinite(value.e) ? Number(value.e) : 0;
  const chunks = Array.isArray(value.d) ? value.d : [];

  if (chunks.length === 0) {
    return '0';
  }

  const digits =
    chunks
      .map((chunk, index) =>
        index === 0 ? String(chunk) : String(chunk).padStart(7, '0'),
      )
      .join('')
      .replace(/^0+/, '') || '0';

  const decimalPos = exponent + 1;
  let normalized = '';

  if (decimalPos <= 0) {
    normalized = `0.${'0'.repeat(Math.abs(decimalPos))}${digits}`;
  } else if (decimalPos >= digits.length) {
    normalized = `${digits}${'0'.repeat(decimalPos - digits.length)}`;
  } else {
    normalized = `${digits.slice(0, decimalPos)}.${digits.slice(decimalPos)}`;
  }

  if (normalized.includes('.')) {
    normalized = normalized.replace(/\.?0+$/, '');
  }

  return `${sign}${normalized || '0'}`;
}

function readObjectValueByKeys(
  source: Record<string, unknown>,
  keys: string[],
) {
  for (const key of keys) {
    if (source[key] != null) {
      return source[key];
    }
  }
  return undefined;
}

function readFirstValueByMatcher(
  source: Record<string, unknown>,
  matcher: (key: string) => boolean,
) {
  const key = Object.keys(source).find((item) => matcher(item.toLowerCase()));
  return key ? source[key] : undefined;
}

function toRecord(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function resolveBatchesFromDetail(detail: InboundDetailApi) {
  if (Array.isArray(detail.batches)) {
    return detail.batches;
  }

  const dynamicBatchArray = Object.entries(detail).find(([key, value]) => {
    if (!Array.isArray(value)) {
      return false;
    }
    const lower = key.toLowerCase();
    return lower.includes('batch');
  });

  return Array.isArray(dynamicBatchArray?.[1]) ? dynamicBatchArray[1] : [];
}

function mapDetailFromApi(details?: InboundDetailApi[]): InboundDetailForm[] {
  if (!Array.isArray(details) || details.length === 0) {
    return [];
  }

  return details.map((detail) => {
    const batches = resolveBatchesFromDetail(detail);
    const detailRecord = toRecord(detail) ?? {};
    const detailQtyFallback = toNumberInputValue(
      readObjectValueByKeys(detailRecord, ['qty', 'qtyPcs', 'qty_pcs', 'quantity', 'quantityPcs']) ??
        readFirstValueByMatcher(detailRecord, (key) => key.includes('qty') || key.includes('quantity')),
    );

    return {
      itemId: String(detail.itemId ?? ''),
      uomInput:
        detail.uomInput == null ? '' : String(Math.trunc(Number(detail.uomInput))),
      notes: String(detail.notes ?? ''),
      batches:
        batches.length > 0
          ? batches.map((batch) => {
              const batchRecord = toRecord(batch) ?? {};
              const qtyRaw =
                readObjectValueByKeys(batchRecord, [
                  'qty',
                  'qtyPcs',
                  'qty_pcs',
                  'quantity',
                  'quantityPcs',
                  'quantity_pcs',
                ]) ??
                readFirstValueByMatcher(
                  batchRecord,
                  (key) => key.includes('qty') || key.includes('quantity'),
                );

              const batchIdRaw =
                readObjectValueByKeys(batchRecord, [
                  'batchIn',
                  'batchNumber',
                  'batchOut',
                  'batchNo',
                  'batch',
                ]) ??
                readFirstValueByMatcher(batchRecord, (key) => key.includes('batch'));

              const expiredRaw =
                readObjectValueByKeys(batchRecord, [
                  'expiredDate',
                  'expiryDate',
                  'expired_date',
                  'expiry_date',
                ]) ??
                readFirstValueByMatcher(
                  batchRecord,
                  (key) => key.includes('expir'),
                );

              const notesRaw =
                readObjectValueByKeys(batchRecord, ['notes', 'note']) ??
                readFirstValueByMatcher(
                  batchRecord,
                  (key) => key.includes('note'),
                );

              return {
                batchIn: String(batchIdRaw ?? ''),
                qty:
                  qtyRaw != null
                    ? toNumberInputValue(qtyRaw)
                    : batches.length === 1
                      ? detailQtyFallback
                      : '',
                expiredDate: String(expiredRaw ?? '').slice(0, 10),
                notes: String(notesRaw ?? ''),
              };
            })
          : [initialBatch()],
    };
  });
}

export default function LogisticInboundPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAddRoute = pathname === '/app/logistic/inbound/add';
  const isUpdateRoute = pathname === '/app/logistic/inbound/update';
  const updateUuid = searchParams.get('uuid')?.trim() ?? '';
  const updateRef = searchParams.get('ref')?.trim() ?? '';
  const decodedRefId = parseInboundRef(updateRef);
  const updateInboundId = updateUuid || decodedRefId;

  const [items, setItems] = useState<InboundListItem[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseOption[]>([]);
  const [itemOptions, setItemOptions] = useState<ItemOption[]>([]);

  const [form, setForm] = useState<InboundForm>(initialForm);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [lockedWarehouseId, setLockedWarehouseId] = useState('');
  const [isAdminRole, setIsAdminRole] = useState(false);

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingDetailIndex, setEditingDetailIndex] = useState<number | null>(
    null,
  );
  const [itemModalError, setItemModalError] = useState('');
  const [draftDetail, setDraftDetail] = useState<InboundDetailForm>(
    initialDetail(),
  );

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const token = useMemo(() => getTokenFromCookie(), []);
  const itemOptionMap = useMemo(() => {
    const map = new Map<string, ItemOption>();
    itemOptions.forEach((item) => {
      const id = pickEntityId(item);
      if (id) {
        map.set(id, item);
      }
    });
    return map;
  }, [itemOptions]);

  const createDefaultDetail = () => ({
    ...initialDetail(),
    itemId: pickEntityId(itemOptions[0]) || '',
  });

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

      const response = await fetch(`/api/inbounds?${query.toString()}`, {
        cache: 'no-store',
        headers: token
          ? { Authorization: `Bearer ${token}` }
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
        ? { Authorization: `Bearer ${token}` }
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

      const nextSuppliers: SupplierOption[] = Array.isArray(supplierPayload.data)
        ? supplierPayload.data
        : [];
      const allWarehouses: WarehouseOption[] = Array.isArray(warehousePayload.data)
        ? warehousePayload.data
        : [];
      const nextItems: ItemOption[] = Array.isArray(itemPayload.data)
        ? itemPayload.data
        : [];
      const userId = String(profilePayload?.data?.id ?? '');
      const roleNames = [
        profilePayload?.data?.role,
        ...(Array.isArray(profilePayload?.data?.roles)
          ? profilePayload.data.roles
          : []),
        profilePayload?.data?.user?.role,
        ...(Array.isArray(profilePayload?.data?.user?.roles)
          ? profilePayload.data.user.roles
          : []),
      ]
        .map((value) => String(value ?? '').trim().toLowerCase())
        .filter(Boolean);
      const hasAdminRole = roleNames.includes('admin');
      const mappedWarehouseIdRaw =
        profilePayload?.data?.warehouseId ??
        profilePayload?.data?.user?.warehouseId ??
        '';
      const mappedWarehouseId = toEntityId(mappedWarehouseIdRaw);
      const matchedWarehouse = allWarehouses.find((warehouse) => {
        const candidateIds = [
          toEntityId(warehouse.id),
          toEntityId(warehouse.uuid),
          pickEntityId(warehouse),
        ].filter(Boolean);
        return candidateIds.includes(mappedWarehouseId);
      });
      const nextWarehouses = hasAdminRole
        ? allWarehouses
        : matchedWarehouse
          ? [matchedWarehouse]
          : [];
      const fallbackWarehouseId = pickEntityId(nextWarehouses[0]);
      const resolvedLockedWarehouseId = hasAdminRole
        ? ''
        : pickEntityId(matchedWarehouse ?? null);
      const nextLockedWarehouseId = hasAdminRole ? '' : resolvedLockedWarehouseId;

      setSuppliers(nextSuppliers);
      setWarehouses(nextWarehouses);
      setItemOptions(nextItems);
      setCurrentUserId(userId);
      setIsAdminRole(hasAdminRole);
      setLockedWarehouseId(nextLockedWarehouseId);

      setForm((state) => ({
        ...state,
        supplierId: state.supplierId || pickEntityId(nextSuppliers[0]) || '',
        warehouseId: hasAdminRole
          ? state.warehouseId || fallbackWarehouseId || ''
          : nextLockedWarehouseId || fallbackWarehouseId || '',
        details: state.details.map((detail, index) => ({
          ...detail,
          itemId:
            detail.itemId ||
            (index === 0 ? pickEntityId(nextItems[0]) || '' : detail.itemId),
        })),
      }));

      if (!hasAdminRole && !nextLockedWarehouseId) {
        setError('Warehouse user login tidak ditemukan. Hubungi admin untuk assign warehouse.');
      }
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

  useEffect(() => {
    if (!isAddRoute || showForm || loadingOptions) {
      return;
    }
    openCreateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddRoute, showForm, loadingOptions]);

  useEffect(() => {
    if (!isUpdateRoute || showForm || loadingOptions) {
      return;
    }
    if (!updateInboundId) {
      setError('Inbound reference wajib diisi untuk halaman update.');
      return;
    }
    void openEditForm(updateInboundId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateRoute, updateInboundId, showForm, loadingOptions]);

  const openCreateForm = () => {
    setEditingUuid(null);
    setForm({
      ...initialForm,
      transactionDate: new Date().toISOString().slice(0, 10),
      supplierId: pickEntityId(suppliers[0]) || '',
      warehouseId: lockedWarehouseId || pickEntityId(warehouses[0]) || '',
      details: [],
    });
    setIsItemModalOpen(false);
    setEditingDetailIndex(null);
    setItemModalError('');
    setDraftDetail(createDefaultDetail());
    setShowForm(true);
  };

  const openEditForm = async (uuid: string) => {
    setError('');
    try {
      const response = await fetch(`/api/inbounds/${uuid}`, {
        cache: 'no-store',
        headers: token
          ? { Authorization: `Bearer ${token}` }
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
      setIsItemModalOpen(false);
      setEditingDetailIndex(null);
      setItemModalError('');
      setDraftDetail(createDefaultDetail());
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
          const batches = detail.batches
            .map((batch) => ({
              batchIn: batch.batchIn.trim(),
              qty: Number(batch.qty || 0),
              expiredDate: batch.expiredDate || undefined,
              notes: batch.notes.trim() || undefined,
            }))
            .filter((batch) => batch.batchIn && batch.qty > 0);

          const isDetailValid =
            detail.itemId && batches.length > 0;
          const uomInput = Math.max(
            0,
            Math.trunc(Number(detail.uomInput.trim() || 0)),
          );

          return {
            itemId: detail.itemId,
            uomInput: isDetailValid ? uomInput : undefined,
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
            ? { Authorization: `Bearer ${token}` }
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
      router.push('/app/logistic/inbound');
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
          ? { Authorization: `Bearer ${token}` }
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

  const draftItemTotalQty = useMemo(
    () =>
      draftDetail.batches.reduce(
        (sum, batch) => sum + (Number(batch.qty || 0) || 0),
        0,
      ),
    [draftDetail.batches],
  );

  const openAddItemModal = () => {
    setEditingDetailIndex(null);
    setDraftDetail(createDefaultDetail());
    setItemModalError('');
    setIsItemModalOpen(true);
  };

  const openEditItemModal = (index: number) => {
    const existing = form.details[index];
    if (!existing) {
      return;
    }
    setEditingDetailIndex(index);
    setDraftDetail({
      ...existing,
      batches:
        existing.batches.length > 0
          ? existing.batches.map((batch) => ({ ...batch }))
          : [initialBatch()],
    });
    setItemModalError('');
    setIsItemModalOpen(true);
  };

  const closeItemModal = () => {
    setIsItemModalOpen(false);
    setEditingDetailIndex(null);
    setItemModalError('');
    setDraftDetail(createDefaultDetail());
  };

  const setDraftField = (key: keyof InboundDetailForm, value: string) => {
    setDraftDetail((state) => ({
      ...state,
      [key]: value,
    }));
  };

  const setDraftBatchField = (
    batchIndex: number,
    key: keyof InboundBatchForm,
    value: string,
  ) => {
    setDraftDetail((state) => ({
      ...state,
      batches: state.batches.map((batch, index) =>
        index === batchIndex ? { ...batch, [key]: value } : batch,
      ),
    }));
  };

  const addDraftBatchRow = () => {
    setDraftDetail((state) => ({
      ...state,
      batches: [...state.batches, initialBatch()],
    }));
  };

  const removeDraftBatchRow = (batchIndex: number) => {
    setDraftDetail((state) => {
      if (state.batches.length === 1) {
        return {
          ...state,
          batches: [initialBatch()],
        };
      }
      return {
        ...state,
        batches: state.batches.filter((_, index) => index !== batchIndex),
      };
    });
  };

  const saveDraftItem = () => {
    const validBatches = draftDetail.batches
      .filter((batch) => batch.batchIn.trim() && Number(batch.qty || 0) > 0)
      .map((batch) => ({
        ...batch,
        batchIn: batch.batchIn.trim(),
        notes: batch.notes.trim(),
      }));

    if (!draftDetail.itemId) {
      setItemModalError('Item wajib dipilih.');
      return;
    }

    if (validBatches.length === 0) {
      setItemModalError(
        'Minimal satu batch valid wajib diisi (batch number dan qty > 0).',
      );
      return;
    }

    const normalizedDetail: InboundDetailForm = {
      ...draftDetail,
      itemId: draftDetail.itemId,
      notes: draftDetail.notes.trim(),
      batches: validBatches,
    };

    setForm((state) => {
      if (editingDetailIndex == null) {
        return {
          ...state,
          details: [...state.details, normalizedDetail],
        };
      }

      return {
        ...state,
        details: state.details.map((detail, index) =>
          index === editingDetailIndex ? normalizedDetail : detail,
        ),
      };
    });

    closeItemModal();
  };

  const removeDetailRow = (index: number) => {
    setForm((state) => ({
      ...state,
      details: state.details.filter((_, i) => i !== index),
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
              <Button
                onClick={() => router.push('/app/logistic/inbound/add')}
                disabled={loadingOptions}
              >
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
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setEditingUuid(null);
                router.push('/app/logistic/inbound');
              }}
            >
              <ArrowLeft />
              Back to List
            </Button>
          )}
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        {!showForm ? (
          <div className="rounded-lg border p-5">
            <div className="mb-3 grid gap-2 md:grid-cols-[1fr_auto]">
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
                  <TableHead className="text-right">Item Row</TableHead>
                  <TableHead className="w-[170px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7}>Loading inbounds...</TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>No inbound found.</TableCell>
                  </TableRow>
                ) : (
                  items.map((item, index) => {
                    const rowId = pickInboundId(item);
                    return (
                    <TableRow key={rowId || `inbound-${index}`}>
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
                      <TableCell className="text-right">
                        {item._count?.details ?? 0}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label="Edit inbound"
                            onClick={() => {
                              if (rowId) {
                                const inboundRef = buildInboundRef(
                                  rowId,
                                  item.createdAt,
                                );
                                router.push(
                                  `/app/logistic/inbound/update?ref=${encodeURIComponent(inboundRef)}`,
                                );
                              }
                            }}
                            disabled={!rowId}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            aria-label="Delete inbound"
                            onClick={() => {
                              if (rowId) {
                                void remove(rowId);
                              }
                            }}
                            disabled={!rowId}
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
          <form onSubmit={upsert} className="space-y-5">
            <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
              <div className="space-y-5">
                <div className="rounded-lg border p-5">
                  <p className="mb-4 text-xs text-muted-foreground">
                    Field dengan border biru wajib diisi.
                  </p>
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
                        className={REQUIRED_FIELD_CLASS}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Supplier</Label>
                      <AutocompleteSelect
                        value={form.supplierId}
                        onValueChange={(value) =>
                          setForm((state) => ({ ...state, supplierId: value }))
                        }
                        options={suppliers.flatMap<AutocompleteSelectOption>((supplier) => {
                            const value = pickEntityId(supplier);
                            if (!value) {
                              return [];
                            }
                            return {
                              value,
                              label: String(supplier.name ?? ''),
                              keywords: supplier.code,
                            };
                          })}
                        placeholder="Select supplier"
                        searchPlaceholder="Search supplier..."
                        emptyText="No supplier found."
                        required
                        triggerClassName={REQUIRED_SELECT_TRIGGER_CLASS}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Warehouse</Label>
                      <AutocompleteSelect
                        value={form.warehouseId}
                        onValueChange={(value) =>
                          setForm((state) => ({ ...state, warehouseId: value }))
                        }
                        options={warehouses.flatMap<AutocompleteSelectOption>((warehouse) => {
                            const value = pickEntityId(warehouse);
                            if (!value) {
                              return [];
                            }
                            const warehouseName = String(warehouse.name ?? '');
                            const cityName = warehouse.city?.name
                              ? String(warehouse.city.name)
                              : '';
                            return {
                              value,
                              label: `${warehouseName}${cityName ? ` - ${cityName}` : ''}`,
                              keywords: warehouse.locationName || undefined,
                            };
                          })}
                        placeholder="Select warehouse"
                        searchPlaceholder="Search warehouse..."
                        emptyText="No warehouse found."
                        disabled={!isAdminRole}
                        required
                        triggerClassName={REQUIRED_SELECT_TRIGGER_CLASS}
                      />
                      {!isAdminRole && lockedWarehouseId ? (
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

              </div>
            </div>

            <div className="rounded-lg border p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold">Item List</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openAddItemModal}
                >
                  <Plus />
                  Add Item
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">No</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>UOM</TableHead>
                    <TableHead className="text-right">Total Batch</TableHead>
                    <TableHead className="text-right">Total Qty</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="w-[140px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {form.details.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-muted-foreground"
                      >
                        Belum ada item. Klik Add Item untuk mulai input batch.
                      </TableCell>
                    </TableRow>
                  ) : (
                    form.details.map((detail, detailIndex) => {
                      const item = itemOptionMap.get(detail.itemId);
                      const detailQty = detail.batches.reduce(
                        (sum, batch) => sum + (Number(batch.qty || 0) || 0),
                        0,
                      );

                      return (
                        <TableRow key={`detail-${detailIndex}`}>
                          <TableCell>{detailIndex + 1}</TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {item?.name || '-'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {item?.code || detail.itemId || '-'}
                            </div>
                          </TableCell>
                          <TableCell>
                            {item?.uom?.name || item?.uom?.code || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            {detail.batches.length}
                          </TableCell>
                          <TableCell className="text-right">
                            {detailQty}
                          </TableCell>
                          <TableCell className="max-w-[280px] truncate">
                            {detail.notes || '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                aria-label="Edit item"
                                onClick={() => openEditItemModal(detailIndex)}
                              >
                                <Pencil />
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                aria-label="Remove item"
                                onClick={() => removeDetailRow(detailIndex)}
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
            </div>

            <div className="rounded-lg border p-5">
              <div className="flex flex-col gap-2 md:flex-row md:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingUuid(null);
                    router.push('/app/logistic/inbound');
                  }}
                >
                  <ArrowLeft />
                  Back to List
                </Button>
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
              </div>
            </div>

            <Dialog
              open={isItemModalOpen}
              onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                  closeItemModal();
                }
              }}
            >
              <DialogContent className="max-w-[1100px] p-0">
                <DialogHeader className="border-b px-5 pt-5 pb-4">
                  <DialogTitle>
                    {editingDetailIndex == null ? 'Tambah Item' : 'Edit Item'}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 px-5 pb-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Item</Label>
                      <AutocompleteSelect
                        value={draftDetail.itemId}
                        onValueChange={(value) => setDraftField('itemId', value)}
                        options={itemOptions.flatMap<AutocompleteSelectOption>((item) => {
                          const value = pickEntityId(item);
                          if (!value) {
                            return [];
                          }
                          const code = String(item.code ?? '');
                          const name = String(item.name ?? '');
                          return {
                            value,
                            label: `${code} - ${name}`,
                            keywords: `${item.uom?.name ?? ''} ${item.uom?.code ?? ''}`,
                          };
                        })}
                        placeholder="Select item"
                        searchPlaceholder="Search item..."
                        emptyText="No item found."
                        required
                        triggerClassName={REQUIRED_SELECT_TRIGGER_CLASS}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Catatan Item</Label>
                      <Input
                        value={draftDetail.notes}
                        onChange={(e) => setDraftField('notes', e.target.value)}
                        placeholder="Catatan item"
                      />
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <div className="flex items-center justify-between border-b px-3 py-2">
                      <p className="text-sm font-medium">Batch Rows</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addDraftBatchRow}
                      >
                        <Plus />
                        + Add Batch
                      </Button>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Batch Number</TableHead>
                          <TableHead className="w-[160px]">Qty</TableHead>
                          <TableHead className="w-[180px]">Exp Date</TableHead>
                          <TableHead>Notes</TableHead>
                          <TableHead className="w-[72px]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {draftDetail.batches.map((batch, batchIndex) => (
                          <TableRow key={`draft-batch-${batchIndex}`}>
                            <TableCell>
                              <Input
                                placeholder="Batch number"
                                value={batch.batchIn}
                                onChange={(e) =>
                                  setDraftBatchField(
                                    batchIndex,
                                    'batchIn',
                                    e.target.value,
                                  )
                                }
                                className={REQUIRED_FIELD_CLASS}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Qty"
                                value={batch.qty}
                                onChange={(e) =>
                                  setDraftBatchField(
                                    batchIndex,
                                    'qty',
                                    e.target.value,
                                  )
                                }
                                className={REQUIRED_FIELD_CLASS}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="date"
                                value={batch.expiredDate}
                                onChange={(e) =>
                                  setDraftBatchField(
                                    batchIndex,
                                    'expiredDate',
                                    e.target.value,
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                placeholder="Catatan batch"
                                value={batch.notes}
                                onChange={(e) =>
                                  setDraftBatchField(
                                    batchIndex,
                                    'notes',
                                    e.target.value,
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeDraftBatchRow(batchIndex)}
                              >
                                <Trash2 />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm">
                    <span>Total Qty Item</span>
                    <span className="font-semibold">{draftItemTotalQty}</span>
                  </div>

                  {itemModalError ? (
                    <p className="text-sm text-destructive">{itemModalError}</p>
                  ) : null}

                  <DialogFooter className="pt-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeItemModal}
                    >
                      Cancel
                    </Button>
                    <Button type="button" onClick={saveDraftItem}>
                      {editingDetailIndex == null ? 'Simpan/Add Item' : 'Update Item'}
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </form>
        )}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}
