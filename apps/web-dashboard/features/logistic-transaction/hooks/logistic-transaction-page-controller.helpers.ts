import type {
  CityOption,
  CitySlaOption,
  ContactOption,
  DeliveryOrderDetailForm,
  DeliveryOrderForm,
  DivisionOption,
  ItemOption,
  WarehouseOption,
} from '@/features/logistic-transaction/model/types';
import type { BatchOption } from '@/features/logistic-transaction/ui/batch-multi-select';
import { initialForm } from '@/features/logistic-transaction/model/types';
import { pickEntityId, toEntityId } from '@/features/logistic-transaction/model/utils';

type BatchOptionsByItemId = Record<string, BatchOption[]>;
type BatchQtyMap = Record<string, string>;

export function buildItemOptionMap(itemOptions: ItemOption[]): Map<string, ItemOption> {
  const map = new Map<string, ItemOption>();
  itemOptions.forEach((item) => {
    const id = pickEntityId(item);
    if (id) {
      map.set(id, item);
    }
  });
  return map;
}

export function getBatchQtyPcsByItem(
  batchOptionsByItemId: BatchOptionsByItemId,
  itemId: string,
  batchNumber: string,
): number {
  const options = batchOptionsByItemId[itemId] || [];
  const match = options.find((option) => option.batchNumber === batchNumber);
  const parsed = Number(match?.qtyPcs ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getSelectedBatchQtyPcsValue(
  itemId: string,
  batchNumber: string,
  batchQtyMap: BatchQtyMap,
  getBatchQtyPcs: (itemId: string, batchNumber: string) => number,
): number {
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

  if (!Number.isFinite(requestedQty) || requestedQty < 0) {
    return 0;
  }

  return requestedQty;
}

export function getAutoQtyPcsValue(
  itemId: string,
  batchNumbers: string[],
  batchQtyMap: BatchQtyMap,
  getSelectedBatchQtyPcs: (itemId: string, batchNumber: string, batchQtyMap: BatchQtyMap) => number,
): string {
  if (!itemId || batchNumbers.length === 0) {
    return '';
  }

  const total = batchNumbers.reduce(
    (sum, batchNumber) => sum + getSelectedBatchQtyPcs(itemId, batchNumber, batchQtyMap),
    0,
  );

  return String(total);
}

export function buildDetailSummary(
  details: DeliveryOrderDetailForm[],
  getAutoQtyPcs: (itemId: string, batchNumbers: string[], batchQtyMap: BatchQtyMap) => string,
) {
  const activeRows = details.filter((row) => toEntityId(row.itemId) && row.batchNumbers.length > 0);
  const itemTypeCount = new Set(activeRows.map((row) => toEntityId(row.itemId))).size;
  const totalBatch = activeRows.reduce((sum, row) => sum + row.batchNumbers.length, 0);

  let totalPcs = 0;
  let totalKg = 0;

  activeRows.forEach((row) => {
    totalPcs += Number(getAutoQtyPcs(row.itemId, row.batchNumbers, row.batchQtyMap) || 0) || 0;
    totalKg += Number(row.qtyKg || 0) || 0;
  });

  return { itemTypeCount, totalBatch, totalPcs, totalKg };
}

export function buildBuOptions(divisions: DivisionOption[], selectedBu: string): DivisionOption[] {
  const existing = divisions.some((division) => division.code === selectedBu);
  if (!selectedBu || existing) {
    return divisions;
  }
  return [{ uuid: 'current-bu', code: selectedBu, name: selectedBu }, ...divisions];
}

export function resolveDefaultByCustomerId(
  customerId: string,
  customers: ContactOption[],
  cities: CityOption[],
  citySlaByCityId: Map<string, CitySlaOption>,
) {
  const selectedCustomer = customers.find((row) => pickEntityId(row) === customerId);
  const customerCity = String(selectedCustomer?.city ?? '').trim().toLowerCase();

  if (!customerCity) {
    return null;
  }

  const matchedCity = cities.find((city) => String(city.name ?? '').trim().toLowerCase() === customerCity);
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
}

export function buildCreateFormState(params: {
  customers: ContactOption[];
  warehouses: WarehouseOption[];
  cities: CityOption[];
  divisions: DivisionOption[];
  lockedWarehouseId: string;
  resolveDefaultByCustomer: (customerId: string) => {
    destinationCityId: string;
    stdLeadTimeDays: string;
    stdReturnDoDays: string;
  } | null;
}): DeliveryOrderForm {
  const fallbackCustomerId = pickEntityId(params.customers[0]);
  const fallbackWarehouseId = params.lockedWarehouseId || pickEntityId(params.warehouses[0]);
  const defaults = params.resolveDefaultByCustomer(fallbackCustomerId);
  const today = new Date().toISOString().slice(0, 10);

  return {
    ...initialForm,
    doDate: today,
    doReceivedDate: today,
    customerId: fallbackCustomerId,
    warehouseId: fallbackWarehouseId,
    destinationCityId: defaults?.destinationCityId || pickEntityId(params.cities[0]),
    stdLeadTimeDays: defaults?.stdLeadTimeDays || '0',
    stdReturnDoDays: defaults?.stdReturnDoDays || '0',
    bu: params.divisions[0]?.code || '',
    details: [],
  };
}
