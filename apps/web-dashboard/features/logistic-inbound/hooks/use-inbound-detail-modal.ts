import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';
import type { InboundBatchForm, InboundDetailForm, InboundForm, ItemOption } from '@/features/logistic-inbound/model/types';
import { initialBatch, initialDetail, pickEntityId } from '@/features/logistic-inbound/model/utils';

type UseInboundDetailModalInput = {
  form: InboundForm;
  setForm: Dispatch<SetStateAction<InboundForm>>;
  itemOptions: ItemOption[];
};

export function useInboundDetailModal({ form, setForm, itemOptions }: UseInboundDetailModalInput) {
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingDetailIndex, setEditingDetailIndex] = useState<number | null>(null);
  const [itemModalError, setItemModalError] = useState('');
  const [draftDetail, setDraftDetail] = useState<InboundDetailForm>(initialDetail());

  const createDefaultDetail = useCallback(
    () => ({
      ...initialDetail(),
      itemId: pickEntityId(itemOptions[0]) || '',
    }),
    [itemOptions],
  );

  const draftItemTotalQty = useMemo(
    () => draftDetail.batches.reduce((sum, batch) => sum + (Number(batch.qty || 0) || 0), 0),
    [draftDetail.batches],
  );

  const openAddItemModal = useCallback(() => {
    setEditingDetailIndex(null);
    setDraftDetail(createDefaultDetail());
    setItemModalError('');
    setIsItemModalOpen(true);
  }, [createDefaultDetail]);

  const openEditItemModal = useCallback(
    (index: number) => {
      const existing = form.details[index];
      if (!existing) {
        return;
      }
      setEditingDetailIndex(index);
      setDraftDetail({
        ...existing,
        batches: existing.batches.length > 0 ? existing.batches.map((batch) => ({ ...batch })) : [initialBatch()],
      });
      setItemModalError('');
      setIsItemModalOpen(true);
    },
    [form.details],
  );

  const closeItemModal = useCallback(() => {
    setIsItemModalOpen(false);
    setEditingDetailIndex(null);
    setItemModalError('');
    setDraftDetail(createDefaultDetail());
  }, [createDefaultDetail]);

  const setDraftField = useCallback((key: keyof InboundDetailForm, value: string) => {
    setDraftDetail((state) => ({
      ...state,
      [key]: value,
    }));
  }, []);

  const setDraftBatchField = useCallback((batchIndex: number, key: keyof InboundBatchForm, value: string) => {
    setDraftDetail((state) => ({
      ...state,
      batches: state.batches.map((batch, index) => (index === batchIndex ? { ...batch, [key]: value } : batch)),
    }));
  }, []);

  const addDraftBatchRow = useCallback(() => {
    setDraftDetail((state) => ({
      ...state,
      batches: [...state.batches, initialBatch()],
    }));
  }, []);

  const removeDraftBatchRow = useCallback((batchIndex: number) => {
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
  }, []);

  const saveDraftItem = useCallback(() => {
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
      setItemModalError('Minimal satu batch valid wajib diisi (batch number dan qty > 0).');
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
        details: state.details.map((detail, index) => (index === editingDetailIndex ? normalizedDetail : detail)),
      };
    });

    closeItemModal();
  }, [closeItemModal, draftDetail, editingDetailIndex, setForm]);

  const removeDetailRow = useCallback(
    (index: number) => {
      setForm((state) => ({
        ...state,
        details: state.details.filter((_, i) => i !== index),
      }));
    },
    [setForm],
  );

  return {
    isItemModalOpen,
    editingDetailIndex,
    itemModalError,
    draftDetail,
    draftItemTotalQty,
    openAddItemModal,
    openEditItemModal,
    closeItemModal,
    setDraftField,
    setDraftBatchField,
    addDraftBatchRow,
    removeDraftBatchRow,
    saveDraftItem,
    removeDetailRow,
  };
}
