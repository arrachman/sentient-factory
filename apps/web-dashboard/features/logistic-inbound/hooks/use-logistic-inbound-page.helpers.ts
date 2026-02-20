import type {
  InboundDetailForm,
  InboundForm,
  InboundListItem,
  ItemOption,
  SupplierOption,
  WarehouseOption,
} from '@/features/logistic-inbound/model/types';
import { initialForm, pickEntityId, pickInboundId } from '@/features/logistic-inbound/model/utils';

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

export function buildInboundDetailSummary(details: InboundDetailForm[]) {
  let totalQty = 0;
  let totalBatch = 0;

  details.forEach((detail) => {
    detail.batches.forEach((batch) => {
      totalBatch += 1;
      totalQty += Number(batch.qty || 0) || 0;
    });
  });

  return {
    totalItemTypes: details.length,
    totalBatch,
    totalQty,
  };
}

export function toSafePage(targetPage: number): number {
  return typeof targetPage === 'number' && Number.isInteger(targetPage) && targetPage > 0 ? targetPage : 1;
}

export function buildCreateInboundForm(params: {
  suppliers: SupplierOption[];
  warehouses: WarehouseOption[];
  lockedWarehouseId: string;
}): InboundForm {
  const today = new Date().toISOString().slice(0, 10);

  return {
    ...initialForm,
    transactionDate: today,
    supplierId: pickEntityId(params.suppliers[0]) || '',
    warehouseId: params.lockedWarehouseId || pickEntityId(params.warehouses[0]) || '',
    details: [],
  };
}

export function applyOptionsToFormState(params: {
  state: InboundForm;
  suppliers: SupplierOption[];
  warehouses: WarehouseOption[];
  items: ItemOption[];
  isAdminRole: boolean;
  lockedWarehouseId: string;
}): InboundForm {
  const fallbackWarehouseId = pickEntityId(params.warehouses[0]);

  return {
    ...params.state,
    supplierId: params.state.supplierId || pickEntityId(params.suppliers[0]) || '',
    warehouseId: params.isAdminRole
      ? params.state.warehouseId || fallbackWarehouseId || ''
      : params.lockedWarehouseId || fallbackWarehouseId || '',
    details: params.state.details.map((detail, index) => ({
      ...detail,
      itemId: detail.itemId || (index === 0 ? pickEntityId(params.items[0]) || '' : detail.itemId),
    })),
  };
}

export function buildInboundDetailsPayload(details: InboundForm['details']) {
  return details
    .map((detail) => {
      const batches = detail.batches
        .map((batch) => ({
          batchIn: batch.batchIn.trim(),
          qty: Number(batch.qty || 0),
          expiredDate: batch.expiredDate || undefined,
          notes: batch.notes.trim() || undefined,
        }))
        .filter((batch) => batch.batchIn && batch.qty > 0);

      const isDetailValid = detail.itemId && batches.length > 0;
      const uomInput = Math.max(0, Math.trunc(Number(detail.uomInput.trim() || 0)));

      return {
        itemId: detail.itemId,
        uomInput: isDetailValid ? uomInput : undefined,
        notes: detail.notes.trim() || undefined,
        qty: batches.reduce((sum, batch) => sum + batch.qty, 0),
        batches,
      };
    })
    .filter((detail) => detail.itemId && detail.batches.length > 0 && detail.qty > 0);
}

export function buildInboundUpdateRoute(item: InboundListItem, buildInboundRef: (id: string, createdAt?: string) => string) {
  const rowId = pickInboundId(item);
  if (!rowId) {
    return '';
  }

  const inboundRef = buildInboundRef(rowId, item.createdAt);
  return `/app/logistic/inbound/update?ref=${encodeURIComponent(inboundRef)}`;
}
