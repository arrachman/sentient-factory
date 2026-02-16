'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
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
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
import { cn } from '@/lib/utils';

type ContactOption = {
  id?: string | number;
  uuid?: string | number;
  code?: string;
  name?: string;
  city?: string | null;
};

type CityOption = {
  id?: string | number;
  uuid?: string | number;
  name?: string;
  postalCode?: string;
};

type CitySlaOption = {
  cityId?: string | number;
  stdLeadTimeDays: number;
  stdReturnDoDays: number;
};

type ItemOption = {
  id?: string | number;
  uuid?: string | number;
  code?: string;
  name?: string;
  uom?: {
    id?: string | number;
    uuid?: string | number;
    code?: string;
    name?: string;
  } | null;
};

type DivisionOption = {
  id?: string | number;
  uuid?: string | number;
  code: string;
  name: string;
  isActive?: boolean;
};

type DeliveryOrderDetailForm = {
  itemId: string;
  batchNumbers: string[];
  batchQtyMap: Record<string, string>;
  qtyKg: string;
  notes: string;
};

type BatchOption = {
  batchNumber: string;
  qtyPcs: number;
  disabled?: boolean;
};

type DeliveryOrderForm = {
  doNumber: string;
  doDate: string;
  doReceivedDate: string;
  customerId: string;
  destinationCityId: string;
  stdLeadTimeDays: string;
  stdReturnDoDays: string;
  shippingDate: string;
  actualReceivedDate: string;
  receivedBy: string;
  doScanReturnDate: string;
  status: string;
  bu: string;
  notes: string;
  details: DeliveryOrderDetailForm[];
};

type DeliveryOrderListItem = {
  id?: string | number;
  uuid: string;
  createdAt?: string;
  reportNo: string | number;
  doNumber: string;
  doDate: string;
  doReceivedDate: string;
  shippingDate?: string | null;
  standardReceivedDate?: string | null;
  actualReceivedDate?: string | null;
  stdDoReturnDate?: string | null;
  doScanReturnDate?: string | null;
  kpiDeliveryStatus?: 'ONTIME' | 'LATE' | null;
  kpiDoReturnStatus?: 'ONTIME' | 'LATE' | null;
  totalItemTypes: number;
  totalBatches: number;
  totalQtyPcs: string | number;
  totalKg: string | number;
  status: 'OPEN' | 'DELIVERY' | 'DELIVERED' | 'COMPLETED';
  customer?: {
    uuid: string;
    code: string;
    name: string;
  };
};

type DecimalLike = {
  s?: number;
  e?: number;
  d?: number[];
};

const STATUS_OPTIONS = ['OPEN', 'DELIVERY', 'DELIVERED', 'COMPLETED'] as const;

const initialDetail = (): DeliveryOrderDetailForm => ({
  itemId: '',
  batchNumbers: [],
  batchQtyMap: {},
  qtyKg: '',
  notes: '',
});

const initialForm: DeliveryOrderForm = {
  doNumber: '',
  doDate: '',
  doReceivedDate: '',
  customerId: '',
  destinationCityId: '',
  stdLeadTimeDays: '0',
  stdReturnDoDays: '0',
  shippingDate: '',
  actualReceivedDate: '',
  receivedBy: '',
  doScanReturnDate: '',
  status: 'OPEN',
  bu: '',
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

function addDays(dateString?: string, days?: string) {
  if (!dateString) {
    return '-';
  }
  const date = new Date(dateString);
  const dayCount = Number(days || 0);
  if (Number.isNaN(date.getTime()) || Number.isNaN(dayCount)) {
    return '-';
  }
  date.setDate(date.getDate() + dayCount);
  return fmtDate(date.toISOString());
}

function badgeVariant(status?: 'ONTIME' | 'LATE' | null) {
  if (status === 'ONTIME') {
    return 'primary';
  }
  if (status === 'LATE') {
    return 'destructive';
  }
  return 'secondary';
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

  const digits = chunks
    .map((chunk, index) => (index === 0 ? String(chunk) : String(chunk).padStart(7, '0')))
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

  normalized = normalized.replace(/\.?0+$/, '');
  return `${sign}${normalized || '0'}`;
}

function normalizeNumber(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (isDecimalLike(value)) {
    const parsed = Number(decimalLikeToString(value));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
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

type ApiDetailPayload = {
  itemId?: string | number;
  batchNumber?: string;
  qtyPcs?: string | number | null;
  qtyKg?: string | number | null;
  notes?: string | null;
  item?: {
    id?: string | number;
    uuid?: string | number;
  } | null;
};

function mapApiDetails(details: ApiDetailPayload[]): DeliveryOrderDetailForm[] {
  if (!Array.isArray(details) || details.length === 0) {
    return [initialDetail()];
  }

  return details.map((detail) => ({
    itemId: toEntityId(detail.itemId ?? detail.item?.id ?? detail.item?.uuid),
    batchNumbers: detail.batchNumber ? [String(detail.batchNumber)] : [],
    batchQtyMap: detail.batchNumber
      ? {
          [String(detail.batchNumber)]:
            detail.qtyPcs != null ? String(detail.qtyPcs) : '0',
        }
      : {},
    qtyKg: detail.qtyKg != null ? String(detail.qtyKg) : '',
    notes: String(detail.notes ?? ''),
  }));
}

type BatchMultiSelectProps = {
  value: string[];
  options: BatchOption[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  required?: boolean;
};

function BatchMultiSelect({
  value,
  options,
  onChange,
  placeholder = 'Select batches',
  searchPlaceholder = 'Search batch...',
  emptyText = 'No batch found.',
  disabled = false,
  required = false,
}: BatchMultiSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    if (value.length === 0) {
      return '';
    }
    if (value.length === 1) {
      return `${value[0]} (1 batch)`;
    }
    return `${value.length} batch selected`;
  }, [value]);

  const toggleBatch = (batchNumber: string) => {
    if (value.includes(batchNumber)) {
      onChange(value.filter((item) => item !== batchNumber));
      return;
    }
    onChange([...value, batchNumber]);
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="h-9 w-full justify-between px-2 text-sm font-normal"
          >
            <span className="truncate text-left">{selectedLabel || placeholder}</span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              {options.map((option) => (
                <CommandItem
                  key={option.batchNumber}
                  value={`${option.batchNumber} ${option.qtyPcs}`}
                  disabled={option.disabled}
                  onSelect={() => toggleBatch(option.batchNumber)}
                >
                  <Check
                    className={cn(
                      'mr-2 size-4',
                      value.includes(option.batchNumber) ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <span className="truncate">{option.batchNumber}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {option.qtyPcs.toLocaleString('id-ID')} pcs
                  </span>
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <input
        value={value.join(',')}
        readOnly
        required={required}
        tabIndex={-1}
        className="sr-only"
        aria-hidden
      />
    </div>
  );
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

function buildEntityRef(id: string, createdAt?: string | null) {
  const normalizedId = String(id ?? '').trim();
  if (!normalizedId) {
    return '';
  }

  const millis = createdAt ? Date.parse(createdAt) : NaN;
  const safeMillis = Number.isFinite(millis) ? Math.trunc(millis) : 0;
  return toBase64Url(`${normalizedId}.${safeMillis}`);
}

function parseEntityRef(ref: string) {
  const normalizedRef = String(ref ?? '').trim();
  if (!normalizedRef) {
    return '';
  }

  try {
    const decoded = fromBase64Url(normalizedRef);
    const [id] = decoded.split('.', 1);
    return String(id ?? '').trim();
  } catch {
    return '';
  }
}

export default function LogisticTransactionDoPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isOutboundRoute = pathname.startsWith('/app/logistic/outbound');
  const isOutboundAddRoute = pathname === '/app/logistic/outbound/add';
  const isOutboundUpdateRoute = pathname === '/app/logistic/outbound/update';
  const updateUuid = searchParams.get('uuid')?.trim() ?? '';
  const updateRef = searchParams.get('ref')?.trim() ?? '';
  const decodedUpdateRefId = parseEntityRef(updateRef);
  const updateId = updateUuid || decodedUpdateRefId;

  const [items, setItems] = useState<DeliveryOrderListItem[]>([]);
  const [customers, setCustomers] = useState<ContactOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [citySlas, setCitySlas] = useState<CitySlaOption[]>([]);
  const [itemOptions, setItemOptions] = useState<ItemOption[]>([]);
  const [batchOptionsByItemId, setBatchOptionsByItemId] = useState<
    Record<string, BatchOption[]>
  >({});
  const [divisions, setDivisions] = useState<DivisionOption[]>([]);

  const [form, setForm] = useState<DeliveryOrderForm>(initialForm);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

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

  const getBatchQtyPcs = useCallback(
    (itemId: string, batchNumber: string) => {
      const options = batchOptionsByItemId[itemId] || [];
      const match = options.find((option) => option.batchNumber === batchNumber);
      const parsed = Number(match?.qtyPcs ?? 0);
      return Number.isFinite(parsed) ? parsed : 0;
    },
    [batchOptionsByItemId],
  );

  const getSelectedBatchQtyPcs = useCallback(
    (
      itemId: string,
      batchNumber: string,
      batchQtyMap: Record<string, string>,
    ) => {
      const raw = batchQtyMap[batchNumber];
      const requestedQty = Math.floor(Number(raw));
      const maxQtyPcs = getBatchQtyPcs(itemId, batchNumber);

      if (Number.isFinite(maxQtyPcs) && maxQtyPcs > 0) {
        if (raw == null || raw === '') {
          return maxQtyPcs;
        }
        if (!Number.isFinite(requestedQty) || requestedQty < 0) {
          return 0;
        }
        return Math.min(requestedQty, maxQtyPcs);
      }

      // Fallback when max from options is unavailable: rely on selected qty input.
      if (!Number.isFinite(requestedQty) || requestedQty < 0) {
        return 0;
      }
      return requestedQty;
    },
    [getBatchQtyPcs],
  );

  const getAutoQtyPcs = useCallback(
    (
      itemId: string,
      batchNumbers: string[],
      batchQtyMap: Record<string, string>,
    ) => {
      if (!itemId || batchNumbers.length === 0) {
        return '';
      }
      const total = batchNumbers.reduce(
        (sum, batchNumber) =>
          sum + getSelectedBatchQtyPcs(itemId, batchNumber, batchQtyMap),
        0,
      );
      return String(total);
    },
    [getSelectedBatchQtyPcs],
  );

  const fetchBatchOptions = useCallback(
    async (itemId: string, force = false) => {
      const normalizedItemId = toEntityId(itemId);
      if (!normalizedItemId) {
        return;
      }

      const existingOptions = batchOptionsByItemId[normalizedItemId];
      if (!force && Array.isArray(existingOptions) && existingOptions.length > 0) {
        return;
      }

      try {
        const query = new URLSearchParams({ itemId: normalizedItemId });
        if (editingUuid) {
          query.set('excludeDoId', editingUuid);
        }
        const response = await fetch(
          `/api/outbound/batch-options?${query.toString()}`,
          {
            cache: 'no-store',
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : undefined,
          },
        );
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success) {
          throw new Error(payload?.message || 'Failed to load batch options');
        }

        const nextOptions: BatchOption[] = Array.isArray(payload?.data)
          ? payload.data.map((row: { batchNumber?: string; qtyPcs?: number | string }) => ({
              batchNumber: String(row?.batchNumber ?? ''),
              qtyPcs: Number(row?.qtyPcs ?? 0),
            }))
          : [];
        setBatchOptionsByItemId((state) => ({
          ...state,
          [normalizedItemId]: nextOptions.filter((row) => row.batchNumber),
        }));
      } catch {
        setBatchOptionsByItemId((state) => ({
          ...state,
          [normalizedItemId]: [],
        }));
      }
    },
    [batchOptionsByItemId, editingUuid, token],
  );

  const summary = useMemo(() => {
    const activeRows = form.details.filter(
      (row) => toEntityId(row.itemId) && row.batchNumbers.length > 0,
    );
    const itemTypeCount = new Set(activeRows.map((row) => toEntityId(row.itemId)))
      .size;
    const totalBatch = activeRows.reduce(
      (sum, row) => sum + row.batchNumbers.length,
      0,
    );

    let totalPcs = 0;
    let totalKg = 0;
    activeRows.forEach((row) => {
      totalPcs +=
        Number(getAutoQtyPcs(row.itemId, row.batchNumbers, row.batchQtyMap) || 0) ||
        0;
      totalKg += Number(row.qtyKg || 0) || 0;
    });

    return {
      itemTypeCount,
      totalBatch,
      totalPcs,
      totalKg,
    };
  }, [form.details, getAutoQtyPcs]);

  const buOptions = useMemo(() => {
    const existing = divisions.some((division) => division.code === form.bu);
    if (!form.bu || existing) {
      return divisions;
    }
    return [{ uuid: 'current-bu', code: form.bu, name: form.bu }, ...divisions];
  }, [divisions, form.bu]);

  const citySlaByCityId = useMemo(() => {
    return new Map(citySlas.map((row) => [toEntityId(row.cityId), row]));
  }, [citySlas]);

  const resolveDefaultByCustomer = useCallback(
    (customerId: string) => {
      const selectedCustomer = customers.find(
        (row) => pickEntityId(row) === customerId,
      );
      const customerCity = String(selectedCustomer?.city ?? '')
        .trim()
        .toLowerCase();
      if (!customerCity) {
        return null;
      }

      const matchedCity = cities.find(
        (city) => String(city.name ?? '').trim().toLowerCase() === customerCity,
      );
      if (!matchedCity) {
        return null;
      }

      const cityId = pickEntityId(matchedCity);
      const sla = citySlaByCityId.get(cityId);
      return {
        destinationCityId: cityId,
        stdLeadTimeDays: String(sla?.stdLeadTimeDays ?? 0),
        stdReturnDoDays: String(sla?.stdReturnDoDays ?? 0),
      };
    },
    [cities, customers, citySlaByCityId],
  );

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

      const response = await fetch(`/api/outbound?${query.toString()}`, {
        cache: 'no-store',
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load delivery orders');
      }

      const normalizedItems: DeliveryOrderListItem[] = (Array.isArray(payload.data) ? payload.data : []).map(
        (row: DeliveryOrderListItem) => ({
          ...row,
          totalItemTypes: normalizeNumber(row?.totalItemTypes),
          totalBatches: normalizeNumber(row?.totalBatches),
          totalQtyPcs: normalizeNumber(row?.totalQtyPcs),
          totalKg: normalizeNumber(row?.totalKg),
        }),
      );

      setItems(normalizedItems);
      const meta = payload?.meta;
      setPage(typeof meta?.page === 'number' ? meta.page : safePage);
      setTotalPages(typeof meta?.totalPages === 'number' ? meta.totalPages : 1);
      setTotalItems(typeof meta?.total === 'number' ? meta.total : 0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load delivery orders',
      );
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

      const [customerRes, cityRes, itemRes, divisionRes, citySlaRes] =
        await Promise.all([
          fetch('/api/master-data-contacts?page=1&limit=100&type=customer', {
            cache: 'no-store',
            headers,
          }),
          fetch('/api/master-data-cities?page=1&limit=100', {
            cache: 'no-store',
            headers,
          }),
          fetch('/api/master-data-items?page=1&limit=100&isActive=true', {
            cache: 'no-store',
            headers,
          }),
          fetch('/api/master-data-divisions?page=1&limit=100', {
            cache: 'no-store',
            headers,
          }),
          fetch('/api/master-data-city-slas?page=1&limit=100', {
            cache: 'no-store',
            headers,
          }),
        ]);

      const [
        customerPayload,
        cityPayload,
        itemPayload,
        divisionPayload,
        citySlaPayload,
      ] = await Promise.all([
        customerRes.json().catch(() => null),
        cityRes.json().catch(() => null),
        itemRes.json().catch(() => null),
        divisionRes.json().catch(() => null),
        citySlaRes.json().catch(() => null),
      ]);

      if (!customerRes.ok || !customerPayload?.success) {
        throw new Error(
          customerPayload?.message || 'Failed to load customer options',
        );
      }
      if (!cityRes.ok || !cityPayload?.success) {
        throw new Error(cityPayload?.message || 'Failed to load city options');
      }
      if (!itemRes.ok || !itemPayload?.success) {
        throw new Error(itemPayload?.message || 'Failed to load item options');
      }
      if (!divisionRes.ok || !divisionPayload?.success) {
        throw new Error(
          divisionPayload?.message || 'Failed to load division options',
        );
      }
      if (!citySlaRes.ok || !citySlaPayload?.success) {
        throw new Error(
          citySlaPayload?.message || 'Failed to load city SLA options',
        );
      }

      const nextCustomers: ContactOption[] = Array.isArray(customerPayload.data)
        ? customerPayload.data
        : [];
      const nextCities: CityOption[] = Array.isArray(cityPayload.data)
        ? cityPayload.data
        : [];
      const nextItems: ItemOption[] = Array.isArray(itemPayload.data)
        ? itemPayload.data
        : [];
      const nextDivisions: DivisionOption[] = Array.isArray(
        divisionPayload.data,
      )
        ? divisionPayload.data
        : [];
      const nextCitySlas: CitySlaOption[] = Array.isArray(citySlaPayload.data)
        ? citySlaPayload.data
        : [];

      setCustomers(nextCustomers);
      setCities(nextCities);
      setItemOptions(nextItems);
      setDivisions(nextDivisions);
      setCitySlas(nextCitySlas);

      const fallbackCustomerId = pickEntityId(nextCustomers[0]);
      const fallbackCustomer = nextCustomers.find(
        (row) => pickEntityId(row) === fallbackCustomerId,
      );
      const fallbackCustomerCity = String(fallbackCustomer?.city ?? '')
        .trim()
        .toLowerCase();
      const fallbackMatchedCity = nextCities.find(
        (city) =>
          String(city.name ?? '').trim().toLowerCase() === fallbackCustomerCity,
      );
      const fallbackCityId = pickEntityId(fallbackMatchedCity) || pickEntityId(nextCities[0]);
      const fallbackSla = nextCitySlas.find(
        (row) => toEntityId(row.cityId) === fallbackCityId,
      );

      setForm((state) => ({
        ...state,
        customerId: state.customerId || fallbackCustomerId,
        destinationCityId: state.destinationCityId || fallbackCityId,
        stdLeadTimeDays:
          state.stdLeadTimeDays && state.stdLeadTimeDays !== '0'
            ? state.stdLeadTimeDays
            : String(fallbackSla?.stdLeadTimeDays ?? 0),
        stdReturnDoDays:
          state.stdReturnDoDays && state.stdReturnDoDays !== '0'
            ? state.stdReturnDoDays
            : String(fallbackSla?.stdReturnDoDays ?? 0),
        bu: state.bu || nextDivisions[0]?.code || '',
        details: state.details.map((row, index) => ({
          ...row,
          itemId:
            toEntityId(row.itemId) ||
            (index === 0 ? pickEntityId(nextItems[0]) : toEntityId(row.itemId)),
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

  const openCreateForm = useCallback(() => {
    const fallbackCustomerId = pickEntityId(customers[0]);
    const defaults = resolveDefaultByCustomer(fallbackCustomerId);
    setEditingUuid(null);
    setForm({
      ...initialForm,
      doDate: new Date().toISOString().slice(0, 10),
      doReceivedDate: new Date().toISOString().slice(0, 10),
      customerId: fallbackCustomerId,
      destinationCityId: defaults?.destinationCityId || pickEntityId(cities[0]),
      stdLeadTimeDays: defaults?.stdLeadTimeDays || '0',
      stdReturnDoDays: defaults?.stdReturnDoDays || '0',
      bu: divisions[0]?.code || '',
      details: [{ ...initialDetail(), itemId: pickEntityId(itemOptions[0]) }],
    });
    setShowForm(true);
  }, [cities, customers, divisions, itemOptions, resolveDefaultByCustomer]);

  useEffect(() => {
    if (!isOutboundAddRoute || loadingOptions) {
      return;
    }

    if (!showForm || editingUuid) {
      openCreateForm();
    }
  }, [
    editingUuid,
    isOutboundAddRoute,
    loadingOptions,
    openCreateForm,
    showForm,
  ]);

  useEffect(() => {
    if (!isOutboundUpdateRoute || loadingOptions) {
      return;
    }
    if (!updateId) {
      setError('Delivery order reference wajib diisi untuk halaman update.');
      return;
    }
    if (showForm && editingUuid === updateId) {
      return;
    }
    void openEditForm(updateId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingUuid, isOutboundUpdateRoute, loadingOptions, showForm, updateId]);

  useEffect(() => {
    if (!showForm) {
      return;
    }

    const itemIds = Array.from(
      new Set(
        form.details
          .map((detail) => toEntityId(detail.itemId))
          .filter(Boolean),
      ),
    );
    itemIds.forEach((itemId) => {
      void fetchBatchOptions(itemId, true);
    });
  }, [fetchBatchOptions, form.details, showForm]);

  const closeForm = () => {
    if (isOutboundRoute) {
      router.push('/app/logistic/outbound');
      return;
    }
    setShowForm(false);
  };

  const openEditForm = async (uuid: string) => {
    setError('');
    try {
      const response = await fetch(`/api/outbound/${uuid}`, {
        cache: 'no-store',
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(
          payload?.message || 'Failed to load delivery order detail',
        );
      }

      const data = payload.data;
      const detailRows = mapApiDetails(data.details);
      setEditingUuid(uuid);
      setForm({
        doNumber: String(data.doNumber ?? ''),
        doDate: data.doDate ? String(data.doDate).slice(0, 10) : '',
        doReceivedDate: data.doReceivedDate
          ? String(data.doReceivedDate).slice(0, 10)
          : '',
        customerId: String(data.customerId ?? ''),
        destinationCityId: String(data.destinationCityId ?? ''),
        stdLeadTimeDays: String(data.stdLeadTimeDays ?? 0),
        stdReturnDoDays: String(data.stdReturnDoDays ?? 0),
        shippingDate: data.shippingDate
          ? String(data.shippingDate).slice(0, 10)
          : '',
        actualReceivedDate: data.actualReceivedDate
          ? String(data.actualReceivedDate).slice(0, 10)
          : '',
        receivedBy: String(data.receivedBy ?? ''),
        doScanReturnDate: data.doScanReturnDate
          ? String(data.doScanReturnDate).slice(0, 10)
          : '',
        status: String(data.status ?? 'OPEN'),
        bu: String(data.bu ?? ''),
        notes: String(data.notes ?? ''),
        details: detailRows,
      });
      await Promise.all(
        detailRows
          .map((detail) => toEntityId(detail.itemId))
          .filter(Boolean)
          .map((itemId) => fetchBatchOptions(itemId, true)),
      );
      setShowForm(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load delivery order detail',
      );
    }
  };

  const upsert = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const normalizedDetails = form.details.flatMap((row) => {
        const itemId = toEntityId(row.itemId);
        const batchNumbers = row.batchNumbers
          .map((batchNumber) => String(batchNumber).trim())
          .filter(Boolean);
        const qtyKgRaw = String(row.qtyKg ?? '').trim();
        if (!itemId || batchNumbers.length === 0 || !qtyKgRaw) {
          return [];
        }

        const qtyKgTotal = Number(qtyKgRaw);
        if (!Number.isFinite(qtyKgTotal) || qtyKgTotal <= 0) {
          throw new Error('Qty KG harus lebih dari 0.');
        }

        const normalizedBatches = Array.from(new Set(batchNumbers));
        const batchCount = normalizedBatches.length;
        const qtyKgBase = Math.floor((qtyKgTotal / batchCount) * 1000) / 1000;
        const qtyKgRemainder = Math.round(
          (qtyKgTotal - qtyKgBase * (batchCount - 1)) * 1000,
        ) / 1000;

        return normalizedBatches.map((batchNumber, index) => ({
          itemId,
          batchNumber,
          qtyPcs: getSelectedBatchQtyPcs(itemId, batchNumber, row.batchQtyMap),
          qtyKg: index === batchCount - 1 ? qtyKgRemainder : qtyKgBase,
          notes: String(row.notes ?? '').trim(),
        }));
      });

      const hasInvalidBatchQty = normalizedDetails.some((detail) => detail.qtyPcs <= 0);
      if (hasInvalidBatchQty) {
        throw new Error('Qty PCS per batch harus lebih dari 0.');
      }

      if (normalizedDetails.length === 0) {
        throw new Error('Minimal satu baris detail batch item wajib diisi.');
      }

      const payload = {
        doNumber: form.doNumber.trim(),
        doDate: form.doDate,
        doReceivedDate: form.doReceivedDate,
        customerId: form.customerId,
        destinationCityId: form.destinationCityId || undefined,
        stdLeadTimeDays: Number(form.stdLeadTimeDays || 0),
        stdReturnDoDays: Number(form.stdReturnDoDays || 0),
        shippingDate: form.shippingDate || undefined,
        actualReceivedDate: form.actualReceivedDate || undefined,
        receivedBy: form.receivedBy || undefined,
        doScanReturnDate: form.doScanReturnDate || undefined,
        status: form.status,
        bu: form.bu || undefined,
        notes: form.notes || undefined,
        details: normalizedDetails.map((row) => ({
          itemId: row.itemId,
          batchNumber: row.batchNumber,
          qtyPcs: row.qtyPcs,
          qtyKg: row.qtyKg,
          notes: row.notes || undefined,
        })),
      };

      const endpoint = editingUuid
        ? `/api/outbound/${editingUuid}`
        : '/api/outbound';
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
        throw new Error(result?.message || 'Failed to save delivery order');
      }

      if (isOutboundAddRoute && !editingUuid) {
        router.push('/app/logistic/outbound');
      } else {
        setShowForm(false);
      }
      setEditingUuid(null);
      await fetchList(page);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save delivery order',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (uuid: string) => {
    const ok = window.confirm('Delete this Delivery Order?');
    if (!ok) {
      return;
    }

    setError('');
    try {
      const response = await fetch(`/api/outbound/${uuid}`, {
        method: 'DELETE',
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to delete delivery order');
      }

      await fetchList(page);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete delivery order',
      );
    }
  };

  const setDetailField = (
    index: number,
    key: 'itemId' | 'qtyKg' | 'notes',
    value: string,
  ) => {
    setForm((state) => ({
      ...state,
      details: state.details.map((detail, i) =>
        i === index
          ? key === 'itemId'
            ? { ...detail, itemId: value, batchNumbers: [], batchQtyMap: {} }
            : { ...detail, [key]: value }
          : detail,
      ),
    }));
  };

  const setDetailBatchNumbers = (index: number, batchNumbers: string[]) => {
    setForm((state) => ({
      ...state,
      details: state.details.map((detail, i) => {
        if (i !== index) {
          return detail;
        }

        const normalizedBatchNumbers = Array.from(new Set(batchNumbers));
        const nextBatchQtyMap = normalizedBatchNumbers.reduce<Record<string, string>>(
          (acc, batchNumber) => {
            const maxQtyPcs = getBatchQtyPcs(detail.itemId, batchNumber);
            const previousValue = detail.batchQtyMap[batchNumber];
            if (previousValue == null || previousValue === '') {
              acc[batchNumber] = String(maxQtyPcs);
              return acc;
            }

            const parsed = Math.floor(Number(previousValue));
            if (!Number.isFinite(parsed) || parsed < 0) {
              acc[batchNumber] = String(maxQtyPcs);
              return acc;
            }

            acc[batchNumber] = String(Math.min(parsed, maxQtyPcs));
            return acc;
          },
          {},
        );

        return {
          ...detail,
          batchNumbers: normalizedBatchNumbers,
          batchQtyMap: nextBatchQtyMap,
        };
      }),
    }));
  };

  const setDetailBatchQty = (index: number, batchNumber: string, rawValue: string) => {
    setForm((state) => ({
      ...state,
      details: state.details.map((detail, i) => {
        if (i !== index) {
          return detail;
        }

        const maxQtyPcs = getBatchQtyPcs(detail.itemId, batchNumber);
        if (rawValue === '') {
          return {
            ...detail,
            batchQtyMap: {
              ...detail.batchQtyMap,
              [batchNumber]: '',
            },
          };
        }

        const parsed = Math.floor(Number(rawValue));
        if (!Number.isFinite(parsed) || parsed < 0) {
          return detail;
        }

        const clamped = Math.min(parsed, maxQtyPcs);
        return {
          ...detail,
          batchQtyMap: {
            ...detail.batchQtyMap,
            [batchNumber]: String(clamped),
          },
        };
      }),
    }));
  };

  const addDetailRow = () => {
    setForm((state) => ({
      ...state,
      details: [
        ...state.details,
        { ...initialDetail(), itemId: pickEntityId(itemOptions[0]) },
      ],
    }));
  };

  const removeDetailRow = (index: number) => {
    setForm((state) => {
      if (state.details.length === 1) {
        return {
          ...state,
          details: [initialDetail()],
        };
      }
      return {
        ...state,
        details: state.details.filter((_, i) => i !== index),
      };
    });
  };

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>
            Logistic Outbound - Delivery Order
          </ToolbarPageTitle>
          <ToolbarDescription>
            Kelola proses logistic outbound: dokumen DO, pengiriman per batch,
            monitoring SLA kirim, dan pengembalian dokumen.
          </ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          {!showForm ? (
            <>
              <Button
                onClick={() => {
                  if (isOutboundRoute) {
                    router.push('/app/logistic/outbound/add');
                    return;
                  }
                  openCreateForm();
                }}
              >
                <Plus />
                Add DO
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
            <Button variant="outline" onClick={closeForm}>
              <ArrowLeft />
              Back to List
            </Button>
          )}
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        {!showForm ? (
          <div className="rounded-lg border p-5">
            <div className="mb-3 grid gap-2 md:grid-cols-[1fr_220px_auto]">
              <div className="relative flex-1">
                <Input
                  placeholder="Search DO Number, Customer, BU..."
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
                  <TableHead>DO Number</TableHead>
                  <TableHead>DO Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>KPI Kirim</TableHead>
                  <TableHead>KPI Return</TableHead>
                  <TableHead className="text-right">Tot Item</TableHead>
                  <TableHead className="text-right">Tot Batch</TableHead>
                  <TableHead className="text-right">Tot KG</TableHead>
                  <TableHead className="w-[170px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={11}>
                      Loading delivery orders...
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11}>
                      No delivery orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item, index) => {
                    const rowId = toEntityId(item.id ?? item.uuid);
                    return (
                    <TableRow key={rowId || `outbound-${index}`}>
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>
                        <div className="font-medium">{item.doNumber}</div>
                        <div className="text-xs text-muted-foreground">
                          Report #{item.reportNo}
                        </div>
                      </TableCell>
                      <TableCell>{fmtDate(item.doDate)}</TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {item.customer?.name || '-'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.customer?.code || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={badgeVariant(item.kpiDeliveryStatus)}>
                          {item.kpiDeliveryStatus || '-'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={badgeVariant(item.kpiDoReturnStatus)}>
                          {item.kpiDoReturnStatus || '-'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.totalItemTypes ?? 0}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.totalBatches ?? 0}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.totalKg ?? 0}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label="Edit transaction"
                            onClick={() => {
                              if (isOutboundRoute) {
                                const ref = buildEntityRef(rowId, item.createdAt);
                                router.push(
                                  `/app/logistic/outbound/update?ref=${encodeURIComponent(ref)}`,
                                );
                                return;
                              }
                              if (rowId) {
                                void openEditForm(rowId);
                              }
                            }}
                            disabled={!rowId}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            aria-label="Delete transaction"
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
                  <h3 className="mb-4 text-base font-semibold">
                    Informasi Delivery Order
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Nomor DO</Label>
                      <Input
                        value={form.doNumber}
                        onChange={(e) =>
                          setForm((state) => ({
                            ...state,
                            doNumber: e.target.value,
                          }))
                        }
                        placeholder="DO-2026-0001"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>BU (Bagian Usaha)</Label>
                      <AutocompleteSelect
                        value={form.bu}
                        onValueChange={(value) =>
                          setForm((state) => ({ ...state, bu: value }))
                        }
                        options={buOptions.map((division) => ({
                          value: division.code,
                          label: `${division.code} - ${division.name}`,
                        }))}
                        placeholder="Select BU"
                        searchPlaceholder="Search BU..."
                        emptyText="No BU found."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tanggal DO</Label>
                      <Input
                        type="date"
                        value={form.doDate}
                        onChange={(e) =>
                          setForm((state) => ({
                            ...state,
                            doDate: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tanggal Masuk DO</Label>
                      <Input
                        type="date"
                        value={form.doReceivedDate}
                        onChange={(e) =>
                          setForm((state) => ({
                            ...state,
                            doReceivedDate: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tujuan / Customer</Label>
                      <AutocompleteSelect
                        value={form.customerId}
                        onValueChange={(value) =>
                          setForm((state) => {
                            const normalizedCustomerId = toEntityId(value);
                            const nextState: DeliveryOrderForm = {
                              ...state,
                              customerId: normalizedCustomerId,
                            };
                            if (editingUuid) {
                              return nextState;
                            }

                            const defaults = resolveDefaultByCustomer(normalizedCustomerId);
                            if (!defaults) {
                              return nextState;
                            }

                            return {
                              ...nextState,
                              destinationCityId: defaults.destinationCityId,
                              stdLeadTimeDays: defaults.stdLeadTimeDays,
                              stdReturnDoDays: defaults.stdReturnDoDays,
                            };
                          })
                        }
                        options={customers.flatMap((customer) => {
                          const value = pickEntityId(customer);
                          if (!value) {
                            return [];
                          }
                          return {
                            value,
                            label: String(customer.name ?? ''),
                            keywords: customer.code,
                          };
                        })}
                        placeholder="Select customer"
                        searchPlaceholder="Search customer..."
                        emptyText="No customer found."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Kota Tujuan</Label>
                      <AutocompleteSelect
                        value={form.destinationCityId}
                        onValueChange={(value) =>
                          setForm((state) => ({
                            ...state,
                            destinationCityId: toEntityId(value),
                          }))
                        }
                        options={cities.flatMap((city) => {
                          const value = pickEntityId(city);
                          if (!value) {
                            return [];
                          }
                          const cityName = String(city.name ?? '');
                          const postalCode = String(city.postalCode ?? '');
                          return {
                            value,
                            label: `${cityName}${postalCode ? ` (${postalCode})` : ''}`,
                          };
                        })}
                        placeholder="Select city"
                        searchPlaceholder="Search city..."
                        emptyText="No city found."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>STD Lead Time (Hari)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={form.stdLeadTimeDays}
                        onChange={(e) =>
                          setForm((state) => ({
                            ...state,
                            stdLeadTimeDays: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>STD Return DO (Hari)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={form.stdReturnDoDays}
                        onChange={(e) =>
                          setForm((state) => ({
                            ...state,
                            stdReturnDoDays: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label>Catatan</Label>
                    <Textarea
                      value={form.notes}
                      onChange={(e) =>
                        setForm((state) => ({
                          ...state,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="Catatan tambahan DO"
                      rows={3}
                    />
                  </div>
                </div>

              </div>

              <div className="space-y-5">
                <div className="rounded-lg border p-5">
                  <h3 className="mb-3 text-base font-semibold">
                    SLA & KPI Preview
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span>Standard Barang Diterima</span>
                      <span className="font-medium">
                        {addDays(form.doDate, form.stdLeadTimeDays)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <span>STD DO Kembali</span>
                      <span className="font-medium">
                        {addDays(form.doDate, form.stdReturnDoDays)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <span>KPI 1 Ketepatan Pengiriman</span>
                      <Badge variant="secondary">Auto by system</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>KPI 2 Ketepatan DO Kembali</span>
                      <Badge variant="secondary">Auto by system</Badge>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-5">
                  <h3 className="mb-3 text-base font-semibold">
                    Ringkasan Barang
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span>Total Jenis Barang</span>
                      <span className="font-semibold">
                        {summary.itemTypeCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <span>Total Batch</span>
                      <span className="font-semibold">
                        {summary.totalBatch}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <span>Total PCS</span>
                      <span className="font-semibold">
                        {summary.totalPcs.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total KG</span>
                      <span className="font-semibold">
                        {summary.totalKg.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="rounded-lg border p-5 xl:col-span-2">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold">
                    Detail Barang (Per Batch)
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addDetailRow}
                  >
                    <Plus />
                    Add Item
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">No</TableHead>
                      <TableHead>Item + Batch Number</TableHead>
                      <TableHead className="w-[120px] text-right">
                        Qty PCS
                      </TableHead>
                      <TableHead className="w-[120px] text-right">
                        Qty KG
                      </TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="w-[80px]">Act</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {form.details.map((detail, index) => {
                      const selectedBatchDetails = detail.batchNumbers.map((batchNumber) => ({
                        batchNumber,
                        maxQtyPcs: getBatchQtyPcs(detail.itemId, batchNumber),
                        qtyPcs: getSelectedBatchQtyPcs(
                          detail.itemId,
                          batchNumber,
                          detail.batchQtyMap,
                        ),
                        rawQtyPcs: detail.batchQtyMap[batchNumber] ?? '',
                      }));

                      return (
                      <TableRow
                        key={`${index}-${detail.itemId}-${detail.batchNumbers.join('|')}`}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="space-y-2">
                              <AutocompleteSelect
                                value={detail.itemId}
                                onValueChange={async (value) => {
                                  const normalizedItemId = toEntityId(value);
                                  setDetailField(index, 'itemId', normalizedItemId);
                                  await fetchBatchOptions(normalizedItemId, true);
                                }}
                                options={itemOptions.flatMap((item) => {
                                  const value = pickEntityId(item);
                                  if (!value) {
                                    return [];
                                  }
                                  const code = String(item.code ?? '');
                                  const name = String(item.name ?? '');
                                  const uomCode = String(item.uom?.code ?? '');
                                  return {
                                    value,
                                    label: `${code} - ${name}${uomCode ? ` (UOM: ${uomCode})` : ''}`,
                                  };
                                })}
                                placeholder="Select item"
                                searchPlaceholder="Search item..."
                                emptyText="No item found."
                                required
                                triggerClassName="h-9 px-2 text-sm"
                              />
                              <BatchMultiSelect
                                value={detail.batchNumbers}
                                onChange={(value) =>
                                  setDetailBatchNumbers(index, value)
                                }
                                options={(batchOptionsByItemId[detail.itemId] || [])
                                  .map((option) => {
                                    const taken = form.details.some(
                                      (row, rowIndex) =>
                                        rowIndex !== index &&
                                        row.itemId === detail.itemId &&
                                        row.batchNumbers.includes(option.batchNumber),
                                    );
                                    return {
                                      ...option,
                                      disabled: taken || option.qtyPcs <= 0,
                                    };
                                  })}
                                placeholder={detail.itemId ? 'Select batch(es)' : 'Select item first'}
                                searchPlaceholder="Search batch..."
                                emptyText={
                                  detail.itemId
                                    ? 'No batch found for this item.'
                                    : 'Select item first.'
                                }
                                disabled={!detail.itemId}
                                required
                              />
                            </div>
                            {selectedBatchDetails.length > 0 ? (
                              <div className="rounded-md border bg-muted/20 p-2 text-xs">
                                <div className="mb-1 font-medium text-foreground">
                                  Selected batches
                                </div>
                                <div className="space-y-1">
                                  {selectedBatchDetails.map((batch) => (
                                    <div
                                      key={`${detail.itemId}-${batch.batchNumber}`}
                                      className="grid grid-cols-[1fr_110px] items-center gap-2"
                                    >
                                      <span className="truncate">{batch.batchNumber}</span>
                                      <Input
                                        type="number"
                                        min={1}
                                        max={batch.maxQtyPcs}
                                        step={1}
                                        value={batch.rawQtyPcs}
                                        onChange={(e) =>
                                          setDetailBatchQty(
                                            index,
                                            batch.batchNumber,
                                            e.target.value,
                                          )
                                        }
                                        className="h-7 text-right text-xs"
                                      />
                                      <div className="col-span-2 flex items-center justify-between text-[11px] text-muted-foreground">
                                        <span>
                                          {batch.qtyPcs.toLocaleString('id-ID')} pcs dipakai
                                        </span>
                                        <span>
                                          max {batch.maxQtyPcs.toLocaleString('id-ID')} pcs
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            className="text-right"
                            value={getAutoQtyPcs(
                              detail.itemId,
                              detail.batchNumbers,
                              detail.batchQtyMap,
                            )}
                            readOnly
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0.001}
                            step="0.001"
                            className="text-right"
                            value={detail.qtyKg}
                            onChange={(e) =>
                              setDetailField(index, 'qtyKg', e.target.value)
                            }
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={detail.notes}
                            onChange={(e) =>
                              setDetailField(index, 'notes', e.target.value)
                            }
                            placeholder="Optional"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeDetailRow(index)}
                          >
                            <Trash2 />
                          </Button>
                        </TableCell>
                      </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {error ? (
              <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-600">
                {error}
              </p>
            ) : null}

            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeForm}>
                <ArrowLeft />
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || loadingOptions}>
                <Save />
                {submitting
                  ? 'Saving...'
                  : editingUuid
                    ? 'Update Delivery Order'
                    : 'Create Delivery Order'}
              </Button>
            </div>
          </form>
        )}

        {error && !showForm ? (
          <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-600">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
