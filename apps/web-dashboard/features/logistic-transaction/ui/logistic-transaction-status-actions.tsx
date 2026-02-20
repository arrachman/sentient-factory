import * as React from 'react';
import {
  type CompletedActionState,
  type DeliveredActionState,
  type DeliveryActionState,
  type DeliveryOrderListItem,
} from '@/features/logistic-transaction/model/types';
import { LogisticTransactionStatusCompletedAction } from '@/features/logistic-transaction/ui/logistic-transaction-status-completed-action';
import { LogisticTransactionStatusDeliveredAction } from '@/features/logistic-transaction/ui/logistic-transaction-status-delivered-action';
import { LogisticTransactionStatusDeliveryAction } from '@/features/logistic-transaction/ui/logistic-transaction-status-delivery-action';

type LogisticTransactionStatusActionsProps = {
  item: DeliveryOrderListItem;
  rowId: string;
  deliveryAction: DeliveryActionState | null;
  deliveredAction: DeliveredActionState | null;
  completedAction: CompletedActionState | null;
  setDeliveryAction: React.Dispatch<React.SetStateAction<DeliveryActionState | null>>;
  setDeliveredAction: React.Dispatch<React.SetStateAction<DeliveredActionState | null>>;
  setCompletedAction: React.Dispatch<React.SetStateAction<CompletedActionState | null>>;
  deliverySubmittingId: string | null;
  deliveredSubmittingId: string | null;
  completedSubmittingId: string | null;
  onSetToDelivery: () => void;
  onSetToDelivered: () => void;
  onSetToCompleted: () => void;
};

export function LogisticTransactionStatusActions({
  item,
  rowId,
  deliveryAction,
  deliveredAction,
  completedAction,
  setDeliveryAction,
  setDeliveredAction,
  setCompletedAction,
  deliverySubmittingId,
  deliveredSubmittingId,
  completedSubmittingId,
  onSetToDelivery,
  onSetToDelivered,
  onSetToCompleted,
}: LogisticTransactionStatusActionsProps) {
  return (
    <>
      {item.status === 'OPEN' ? (
        <LogisticTransactionStatusDeliveryAction
          item={item}
          rowId={rowId}
          deliveryAction={deliveryAction}
          setDeliveryAction={setDeliveryAction}
          deliverySubmittingId={deliverySubmittingId}
          deliveredSubmittingId={deliveredSubmittingId}
          completedSubmittingId={completedSubmittingId}
          onSetToDelivery={onSetToDelivery}
        />
      ) : null}

      {item.status === 'DELIVERY' ? (
        <LogisticTransactionStatusDeliveredAction
          item={item}
          rowId={rowId}
          deliveredAction={deliveredAction}
          setDeliveredAction={setDeliveredAction}
          deliveredSubmittingId={deliveredSubmittingId}
          deliverySubmittingId={deliverySubmittingId}
          completedSubmittingId={completedSubmittingId}
          onSetToDelivered={onSetToDelivered}
        />
      ) : null}

      {item.status === 'DELIVERED' ? (
        <LogisticTransactionStatusCompletedAction
          item={item}
          rowId={rowId}
          completedAction={completedAction}
          setCompletedAction={setCompletedAction}
          completedSubmittingId={completedSubmittingId}
          deliverySubmittingId={deliverySubmittingId}
          deliveredSubmittingId={deliveredSubmittingId}
          onSetToCompleted={onSetToCompleted}
        />
      ) : null}
    </>
  );
}
