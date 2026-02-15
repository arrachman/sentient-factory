'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  Truck,
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
  uuid: string;
  code: string;
  name: string;
  city?: string | null;
};

type CityOption = {
  uuid: string;
  name: string;
  postalCode: string;
};

type CitySlaOption = {
  cityId: string;
  stdLeadTimeDays: number;
  stdReturnDoDays: number;
};

type ItemOption = {
  uuid: string;
  code: string;
  name: string;
  uom?: {
    uuid: string;
    code: string;
    name: string;
  } | null;
};

type DivisionOption = {
  uuid: string;
  code: string;
  name: string;
  isActive?: boolean;
};

type DeliveryOrderDetailForm = {
  itemId: string;
  batchNumbers: string[];
  qtyPcs: string;
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
  uuid: string;
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

const STATUS_OPTIONS = ['OPEN', 'DELIVERY', 'DELIVERED', 'COMPLETED'] as const;

const initialDetail = (): DeliveryOrderDetailForm => ({
  itemId: '',
  batchNumbers: [],
  qtyPcs: '',
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

type ApiDetailPayload = {
  itemId?: string;
  batchNumber?: string;
  qtyPcs?: string | number | null;
  qtyKg?: string | number | null;
  notes?: string | null;
  item?: {
    uuid?: string;
  } | null;
};

function mapApiDetails(details: ApiDetailPayload[]): DeliveryOrderDetailForm[] {
  if (!Array.isArray(details) || details.length === 0) {
    return [initialDetail()];
  }

  return details.map((detail) => ({
    itemId: String(detail.itemId ?? detail.item?.uuid ?? ''),
    batchNumbers: detail.batchNumber ? [String(detail.batchNumber)] : [],
    qtyPcs: detail.qtyPcs != null ? String(detail.qtyPcs) : '',
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
      return value[0];
    }
    return `${value.length} batches selected`;
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

export default function LogisticTransactionDoPage() {
  const router = useRouter();
  const pathname = usePathname();
  const isOutboundRoute = pathname.startsWith('/app/logistic/outbound');
  const isOutboundAddRoute = pathname === '/app/logistic/outbound/add';

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
      return Number(match?.qtyPcs ?? 0);
    },
    [batchOptionsByItemId],
  );

  const getAutoQtyPcs = useCallback(
    (itemId: string, batchNumbers: string[]) => {
      if (!itemId || batchNumbers.length === 0) {
        return '';
      }
      const total = batchNumbers.reduce(
        (sum, batchNumber) => sum + getBatchQtyPcs(itemId, batchNumber),
        0,
      );
      return String(total);
    },
    [getBatchQtyPcs],
  );

  const fetchBatchOptions = useCallback(
    async (itemId: string) => {
      const normalizedItemId = itemId.trim();
      if (!normalizedItemId || batchOptionsByItemId[normalizedItemId]) {
        return;
      }

      try {
        const response = await fetch(
          `/api/delivery-orders/batch-options?itemId=${encodeURIComponent(normalizedItemId)}`,
          {
            cache: 'no-store',
            headers: token
              ? { Authorization: `Bearer ${decodeURIComponent(token)}` }
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
    [batchOptionsByItemId, token],
  );

  const summary = useMemo(() => {
    const activeRows = form.details.filter(
      (row) => row.itemId.trim() && row.batchNumbers.length > 0,
    );
    const itemTypeCount = new Set(activeRows.map((row) => row.itemId.trim()))
      .size;
    const totalBatch = activeRows.reduce(
      (sum, row) => sum + row.batchNumbers.length,
      0,
    );

    let totalPcs = 0;
    let totalKg = 0;
    activeRows.forEach((row) => {
      totalPcs += Number(getAutoQtyPcs(row.itemId, row.batchNumbers) || 0) || 0;
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
    return new Map(citySlas.map((row) => [row.cityId, row]));
  }, [citySlas]);

  const resolveDefaultByCustomer = useCallback(
    (customerId: string) => {
      const selectedCustomer = customers.find((row) => row.uuid === customerId);
      const customerCity = String(selectedCustomer?.city ?? '')
        .trim()
        .toLowerCase();
      if (!customerCity) {
        return null;
      }

      const matchedCity = cities.find(
        (city) => city.name.trim().toLowerCase() === customerCity,
      );
      if (!matchedCity) {
        return null;
      }

      const sla = citySlaByCityId.get(matchedCity.uuid);
      return {
        destinationCityId: matchedCity.uuid,
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

      const response = await fetch(`/api/delivery-orders?${query.toString()}`, {
        cache: 'no-store',
        headers: token
          ? { Authorization: `Bearer ${decodeURIComponent(token)}` }
          : undefined,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load delivery orders');
      }

      setItems(Array.isArray(payload.data) ? payload.data : []);
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
        ? { Authorization: `Bearer ${decodeURIComponent(token)}` }
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

      const fallbackCustomerId = nextCustomers[0]?.uuid || '';
      const fallbackCustomer = nextCustomers.find(
        (row) => row.uuid === fallbackCustomerId,
      );
      const fallbackCustomerCity = String(fallbackCustomer?.city ?? '')
        .trim()
        .toLowerCase();
      const fallbackMatchedCity = nextCities.find(
        (city) => city.name.trim().toLowerCase() === fallbackCustomerCity,
      );
      const fallbackCityId =
        fallbackMatchedCity?.uuid || nextCities[0]?.uuid || '';
      const fallbackSla = nextCitySlas.find(
        (row) => row.cityId === fallbackCityId,
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
            row.itemId || (index === 0 ? nextItems[0]?.uuid || '' : row.itemId),
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
    const fallbackCustomerId = customers[0]?.uuid || '';
    const defaults = resolveDefaultByCustomer(fallbackCustomerId);
    setEditingUuid(null);
    setForm({
      ...initialForm,
      doDate: new Date().toISOString().slice(0, 10),
      doReceivedDate: new Date().toISOString().slice(0, 10),
      customerId: fallbackCustomerId,
      destinationCityId: defaults?.destinationCityId || cities[0]?.uuid || '',
      stdLeadTimeDays: defaults?.stdLeadTimeDays || '0',
      stdReturnDoDays: defaults?.stdReturnDoDays || '0',
      bu: divisions[0]?.code || '',
      details: [{ ...initialDetail(), itemId: itemOptions[0]?.uuid || '' }],
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
    if (!showForm) {
      return;
    }

    const itemIds = Array.from(
      new Set(
        form.details
          .map((detail) => detail.itemId.trim())
          .filter(Boolean),
      ),
    );
    itemIds.forEach((itemId) => {
      void fetchBatchOptions(itemId);
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
      const response = await fetch(`/api/delivery-orders/${uuid}`, {
        cache: 'no-store',
        headers: token
          ? { Authorization: `Bearer ${decodeURIComponent(token)}` }
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
          .map((detail) => detail.itemId.trim())
          .filter(Boolean)
          .map((itemId) => fetchBatchOptions(itemId)),
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
        const itemId = row.itemId.trim();
        const batchNumbers = row.batchNumbers
          .map((batchNumber) => String(batchNumber).trim())
          .filter(Boolean);
        const qtyKgRaw = row.qtyKg.trim();
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
          qtyPcs: getBatchQtyPcs(itemId, batchNumber),
          qtyKg: index === batchCount - 1 ? qtyKgRemainder : qtyKgBase,
          notes: row.notes.trim(),
        }));
      });

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
        ? `/api/delivery-orders/${editingUuid}`
        : '/api/delivery-orders';
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
      const response = await fetch(`/api/delivery-orders/${uuid}`, {
        method: 'DELETE',
        headers: token
          ? { Authorization: `Bearer ${decodeURIComponent(token)}` }
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
    key: 'itemId' | 'qtyPcs' | 'qtyKg' | 'notes',
    value: string,
  ) => {
    setForm((state) => ({
      ...state,
      details: state.details.map((detail, i) =>
        i === index
          ? key === 'itemId'
            ? { ...detail, itemId: value, batchNumbers: [], qtyPcs: '' }
            : { ...detail, [key]: value }
          : detail,
      ),
    }));
  };

  const setDetailBatchNumbers = (index: number, batchNumbers: string[]) => {
    setForm((state) => ({
      ...state,
      details: state.details.map((detail, i) =>
        i === index ? { ...detail, batchNumbers, qtyPcs: '' } : detail,
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
                  items.map((item, index) => (
                    <TableRow key={item.uuid}>
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
                            const nextState: DeliveryOrderForm = {
                              ...state,
                              customerId: value,
                            };
                            if (editingUuid) {
                              return nextState;
                            }

                            const defaults = resolveDefaultByCustomer(value);
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
                        options={customers.map((customer) => ({
                          value: customer.uuid,
                          label: customer.name,
                          keywords: customer.code,
                        }))}
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
                            destinationCityId: value,
                          }))
                        }
                        options={cities.map((city) => ({
                          value: city.uuid,
                          label: `${city.name} (${city.postalCode})`,
                        }))}
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

                <div className="rounded-lg border p-5">
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
                      Add Batch Row
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">No</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Batch Number</TableHead>
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
                      {form.details.map((detail, index) => (
                        <TableRow
                          key={`${index}-${detail.itemId}-${detail.batchNumbers.join('|')}`}
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <AutocompleteSelect
                              value={detail.itemId}
                              onValueChange={async (value) => {
                                setDetailField(index, 'itemId', value)
                                await fetchBatchOptions(value);
                              }}
                              options={itemOptions.map((item) => ({
                                value: item.uuid,
                                label: `${item.code} - ${item.name}${item.uom?.code ? ` (UOM: ${item.uom.code})` : ''}`,
                              }))}
                              placeholder="Select item"
                              searchPlaceholder="Search item..."
                              emptyText="No item found."
                              required
                              triggerClassName="h-9 px-2 text-sm"
                            />
                          </TableCell>
                          <TableCell>
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
                                  return { ...option, disabled: taken };
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
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={0}
                              step="0.01"
                              className="text-right"
                              value={getAutoQtyPcs(detail.itemId, detail.batchNumbers)}
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
                      ))}
                    </TableBody>
                  </Table>
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

                <div className="rounded-lg border p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="size-4" />
                    <span>Operational Tips</span>
                  </div>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    <li>
                      Satu item boleh dikirim multi batch dalam 1 nomor DO.
                    </li>
                    <li>
                      Pastikan kombinasi Item + Batch unik dalam satu dokumen.
                    </li>
                    <li>
                      Perhitungan preview SLA menggunakan tanggal DO dan
                      parameter SLA kota tujuan.
                    </li>
                  </ul>
                </div>
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
