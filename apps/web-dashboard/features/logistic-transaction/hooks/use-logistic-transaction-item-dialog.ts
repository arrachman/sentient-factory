import { useEffect, useMemo, useState } from 'react';
import { type DeliveryOrderDetailForm } from '@/features/logistic-transaction/model/types';
import { toEntityId } from '@/features/logistic-transaction/model/utils';

type UseLogisticTransactionItemDialogParams = {
  formDetails: DeliveryOrderDetailForm[];
  setFormDetails: (updater: (current: DeliveryOrderDetailForm[]) => DeliveryOrderDetailForm[]) => void;
  createDefaultDetail: () => DeliveryOrderDetailForm;
  fetchBatchOptions: (itemId: string, force?: boolean) => Promise<void>;
  getBatchQtyPcs: (itemId: string, batchNumber: string) => number;
  getSelectedBatchQtyPcs: (itemId: string, batchNumber: string, batchQtyMap: Record<string, string>) => number;
  getAutoQtyPcs: (itemId: string, batchNumbers: string[], batchQtyMap: Record<string, string>) => string;
};

export function useLogisticTransactionItemDialog({
  formDetails,
  setFormDetails,
  createDefaultDetail,
  fetchBatchOptions,
  getBatchQtyPcs,
  getSelectedBatchQtyPcs,
  getAutoQtyPcs,
}: UseLogisticTransactionItemDialogParams) {
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingDetailIndex, setEditingDetailIndex] = useState<number | null>(null);
  const [itemModalError, setItemModalError] = useState('');
  const [draftDetail, setDraftDetail] = useState<DeliveryOrderDetailForm>(createDefaultDetail());

  const draftItemTotalPcs = useMemo(
    () => Number(getAutoQtyPcs(draftDetail.itemId, draftDetail.batchNumbers, draftDetail.batchQtyMap) || 0) || 0,
    [draftDetail.batchNumbers, draftDetail.batchQtyMap, draftDetail.itemId, getAutoQtyPcs],
  );

  const draftItemId = useMemo(() => toEntityId(draftDetail.itemId), [draftDetail.itemId]);

  useEffect(() => {
    if (!isItemModalOpen || !draftItemId) {
      return;
    }
    void fetchBatchOptions(draftItemId, true);
  }, [draftItemId, fetchBatchOptions, isItemModalOpen]);

  const openAddItemModal = () => {
    setEditingDetailIndex(null);
    setDraftDetail(createDefaultDetail());
    setItemModalError('');
    setIsItemModalOpen(true);
  };

  const openEditItemModal = async (index: number) => {
    const existing = formDetails[index];
    if (!existing) {
      return;
    }
    const itemId = toEntityId(existing.itemId);
    if (itemId) {
      await fetchBatchOptions(itemId, true);
    }
    setEditingDetailIndex(index);
    setDraftDetail({
      ...existing,
      batchNumbers: [...existing.batchNumbers],
      batchQtyMap: { ...existing.batchQtyMap },
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

  const setDraftField = (key: 'qtyKg' | 'notes', value: string) => {
    setDraftDetail((state) => ({
      ...state,
      [key]: value,
    }));
  };

  const setDraftItemId = async (value: string) => {
    const normalizedItemId = toEntityId(value);
    setDraftDetail((state) => ({
      ...state,
      itemId: normalizedItemId,
      batchNumbers: [],
      batchQtyMap: {},
    }));
    if (normalizedItemId) {
      await fetchBatchOptions(normalizedItemId, true);
    }
  };

  const setDraftBatchNumbers = (batchNumbers: string[]) => {
    setDraftDetail((state) => {
      const normalizedBatchNumbers = Array.from(new Set(batchNumbers.map((batchNumber) => String(batchNumber).trim()).filter(Boolean)));
      const nextBatchQtyMap = normalizedBatchNumbers.reduce<Record<string, string>>((acc, batchNumber) => {
        const maxQtyPcs = getBatchQtyPcs(state.itemId, batchNumber);
        const previousValue = state.batchQtyMap[batchNumber];
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
      }, {});

      return {
        ...state,
        batchNumbers: normalizedBatchNumbers,
        batchQtyMap: nextBatchQtyMap,
      };
    });
  };

  const setDraftBatchQty = (batchNumber: string, rawValue: string) => {
    setDraftDetail((state) => {
      const maxQtyPcs = getBatchQtyPcs(state.itemId, batchNumber);
      if (rawValue === '') {
        return {
          ...state,
          batchQtyMap: {
            ...state.batchQtyMap,
            [batchNumber]: '',
          },
        };
      }

      const parsed = Math.floor(Number(rawValue));
      if (!Number.isFinite(parsed) || parsed < 0) {
        return state;
      }

      const clamped = Math.min(parsed, maxQtyPcs);
      return {
        ...state,
        batchQtyMap: {
          ...state.batchQtyMap,
          [batchNumber]: String(clamped),
        },
      };
    });
  };

  const saveDraftItem = () => {
    const itemId = toEntityId(draftDetail.itemId);
    if (!itemId) {
      setItemModalError('Item wajib dipilih.');
      return;
    }

    const selectedBatchNumbers = Array.from(new Set(draftDetail.batchNumbers.map((batchNumber) => String(batchNumber).trim()).filter(Boolean)));
    if (selectedBatchNumbers.length === 0) {
      setItemModalError('Minimal satu batch wajib dipilih.');
      return;
    }

    const qtyKg = Number(draftDetail.qtyKg || 0);
    if (!Number.isFinite(qtyKg) || qtyKg <= 0) {
      setItemModalError('Qty KG wajib diisi dan harus lebih dari 0.');
      return;
    }

    const nextBatchQtyMap = selectedBatchNumbers.reduce<Record<string, string>>((acc, batchNumber) => {
      const selectedQty = getSelectedBatchQtyPcs(itemId, batchNumber, draftDetail.batchQtyMap);
      acc[batchNumber] = String(selectedQty);
      return acc;
    }, {});

    const normalizedDetail: DeliveryOrderDetailForm = {
      ...draftDetail,
      itemId,
      batchNumbers: selectedBatchNumbers,
      batchQtyMap: nextBatchQtyMap,
      qtyKg: String(qtyKg),
      notes: draftDetail.notes.trim(),
    };

    setFormDetails((currentDetails) => {
      if (editingDetailIndex == null) {
        return [...currentDetails, normalizedDetail];
      }
      return currentDetails.map((detail, index) => (index === editingDetailIndex ? normalizedDetail : detail));
    });

    closeItemModal();
  };

  const removeDetailRow = (index: number) => {
    setFormDetails((currentDetails) => currentDetails.filter((_, i) => i !== index));
  };

  return {
    isItemModalOpen,
    editingDetailIndex,
    itemModalError,
    draftDetail,
    draftItemId,
    draftItemTotalPcs,
    openAddItemModal,
    openEditItemModal,
    closeItemModal,
    setDraftField,
    setDraftItemId,
    setDraftBatchNumbers,
    setDraftBatchQty,
    saveDraftItem,
    removeDetailRow,
  };
}
