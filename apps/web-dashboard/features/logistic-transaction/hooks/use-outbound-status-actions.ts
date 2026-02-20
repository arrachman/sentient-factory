import { useState } from 'react';
import {
  type CompletedActionState,
  type DeliveredActionState,
  type DeliveryActionState,
} from '@/features/logistic-transaction/model/types';

type UseOutboundStatusActionsParams = {
  token: string;
  page: number;
  fetchList: (targetPage?: number) => Promise<void>;
  setError: (message: string) => void;
};

export function useOutboundStatusActions({ token, page, fetchList, setError }: UseOutboundStatusActionsParams) {
  const [deliverySubmittingId, setDeliverySubmittingId] = useState<string | null>(null);
  const [deliveredSubmittingId, setDeliveredSubmittingId] = useState<string | null>(null);
  const [completedSubmittingId, setCompletedSubmittingId] = useState<string | null>(null);

  const [deliveryAction, setDeliveryAction] = useState<DeliveryActionState | null>(null);
  const [deliveredAction, setDeliveredAction] = useState<DeliveredActionState | null>(null);
  const [completedAction, setCompletedAction] = useState<CompletedActionState | null>(null);

  const clearAllActions = () => {
    setDeliveryAction(null);
    setDeliveredAction(null);
    setCompletedAction(null);
  };

  const setToDelivery = async () => {
    if (!deliveryAction) {
      return;
    }
    if (!deliveryAction.shippingDate) {
      setError('Tanggal kirim wajib diisi.');
      return;
    }

    setError('');
    setDeliverySubmittingId(deliveryAction.id);
    try {
      const response = await fetch(`/api/outbound/${deliveryAction.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status: 'DELIVERY',
          shippingDate: deliveryAction.shippingDate,
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to update delivery status');
      }

      clearAllActions();
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update delivery status');
    } finally {
      setDeliverySubmittingId(null);
    }
  };

  const setToDelivered = async () => {
    if (!deliveredAction) {
      return;
    }
    if (!deliveredAction.actualReceivedDate) {
      setError('Aktual barang diterima wajib diisi.');
      return;
    }
    if (!deliveredAction.receivedBy.trim()) {
      setError('Diterima oleh wajib diisi.');
      return;
    }
    if (!deliveredAction.doScanReturnDate) {
      setError('Tanggal scan DO kembali wajib diisi.');
      return;
    }

    setError('');
    setDeliveredSubmittingId(deliveredAction.id);
    try {
      const response = await fetch(`/api/outbound/${deliveredAction.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status: 'DELIVERED',
          actualReceivedDate: deliveredAction.actualReceivedDate,
          receivedBy: deliveredAction.receivedBy.trim(),
          doScanReturnDate: deliveredAction.doScanReturnDate,
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to update delivered status');
      }

      clearAllActions();
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update delivered status');
    } finally {
      setDeliveredSubmittingId(null);
    }
  };

  const setToCompleted = async () => {
    if (!completedAction) {
      return;
    }
    if (!completedAction.doScanReturnDate) {
      setError('Tanggal DO kembali wajib diisi.');
      return;
    }
    if (!completedAction.stdDoReturnDate) {
      setError('STD DO Kembali tidak dapat dihitung. Pastikan Tanggal kirim dan Std return DO terisi.');
      return;
    }

    setError('');
    setCompletedSubmittingId(completedAction.id);
    try {
      const response = await fetch(`/api/outbound/${completedAction.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status: 'COMPLETED',
          doScanReturnDate: completedAction.doScanReturnDate,
          stdReturnDoDays: completedAction.stdReturnDoDays,
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to update completed status');
      }

      clearAllActions();
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update completed status');
    } finally {
      setCompletedSubmittingId(null);
    }
  };

  return {
    deliverySubmittingId,
    deliveredSubmittingId,
    completedSubmittingId,
    deliveryAction,
    deliveredAction,
    completedAction,
    setDeliveryAction,
    setDeliveredAction,
    setCompletedAction,
    setToDelivery,
    setToDelivered,
    setToCompleted,
  };
}
