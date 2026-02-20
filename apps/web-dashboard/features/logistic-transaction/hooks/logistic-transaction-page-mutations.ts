import { FormEvent } from 'react';
import { type DeliveryOrderForm } from '@/features/logistic-transaction/model/types';
import { toEntityId } from '@/features/logistic-transaction/model/utils';

type UpsertParams = {
  event: FormEvent;
  form: DeliveryOrderForm;
  lockedWarehouseId: string;
  editingUuid: string | null;
  token: string;
  setSubmitting: (value: boolean) => void;
  setError: (value: string) => void;
  getSelectedBatchQtyPcs: (itemId: string, batchNumber: string, batchQtyMap: Record<string, string>) => number;
  isOutboundAddRoute: boolean;
  routerPush: (href: string) => void;
  setShowForm: (value: boolean) => void;
  setEditingUuid: (value: string | null) => void;
  fetchList: (targetPage?: number) => Promise<void>;
  page: number;
};

export async function upsertOutboundOrder({
  event,
  form,
  lockedWarehouseId,
  editingUuid,
  token,
  setSubmitting,
  setError,
  getSelectedBatchQtyPcs,
  isOutboundAddRoute,
  routerPush,
  setShowForm,
  setEditingUuid,
  fetchList,
  page,
}: UpsertParams) {
  event.preventDefault();
  setSubmitting(true);
  setError('');

  try {
    const normalizedDetails = form.details.flatMap((row) => {
      const itemId = toEntityId(row.itemId);
      const batchNumbers = row.batchNumbers.map((batchNumber) => String(batchNumber).trim()).filter(Boolean);
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
      const qtyKgRemainder = Math.round((qtyKgTotal - qtyKgBase * (batchCount - 1)) * 1000) / 1000;

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
    const effectiveWarehouseId = lockedWarehouseId || toEntityId(form.warehouseId);
    if (!effectiveWarehouseId) {
      throw new Error('Warehouse wajib dipilih.');
    }

    const payload = {
      doNumber: form.doNumber.trim(),
      doDate: form.doDate,
      doReceivedDate: form.doReceivedDate,
      customerId: form.customerId,
      warehouseId: effectiveWarehouseId,
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

    const endpoint = editingUuid ? `/api/outbound/${editingUuid}` : '/api/outbound';
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
      throw new Error(result?.message || 'Failed to save delivery order');
    }

    if (isOutboundAddRoute && !editingUuid) {
      routerPush('/app/logistic/outbound');
    } else {
      setShowForm(false);
    }
    setEditingUuid(null);
    await fetchList(page);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to save delivery order');
  } finally {
    setSubmitting(false);
  }
}

type RemoveParams = {
  uuid: string;
  token: string;
  setError: (value: string) => void;
  fetchList: (targetPage?: number) => Promise<void>;
  page: number;
};

export async function removeOutboundOrder({ uuid, token, setError, fetchList, page }: RemoveParams) {
  const ok = window.confirm('Delete this Delivery Order?');
  if (!ok) {
    return;
  }

  setError('');
  try {
    const response = await fetch(`/api/outbound/${uuid}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.success) {
      throw new Error(payload?.message || 'Failed to delete delivery order');
    }

    await fetchList(page);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to delete delivery order');
  }
}
