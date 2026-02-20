import {
  type CompletedActionState,
  type DeliveredActionState,
  type DeliveryActionState,
  type DeliveryOrderListItem,
} from '@/features/logistic-transaction/model/types';
import { calculateStandardReceivedDate, normalizeNumber } from '@/features/logistic-transaction/model/utils';

export function buildDeliveryActionState(rowId: string, item: DeliveryOrderListItem): DeliveryActionState {
  return {
    id: rowId,
    shippingDate: item.shippingDate ? String(item.shippingDate).slice(0, 10) : new Date().toISOString().slice(0, 10),
    stdLeadTimeDays: normalizeNumber(item.stdLeadTimeDays),
  };
}

export function buildDeliveredActionState(rowId: string, item: DeliveryOrderListItem): DeliveredActionState {
  return {
    id: rowId,
    shippingDate: item.shippingDate ? String(item.shippingDate).slice(0, 10) : '',
    stdLeadTimeDays: normalizeNumber(item.stdLeadTimeDays),
    actualReceivedDate: item.actualReceivedDate
      ? String(item.actualReceivedDate).slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    receivedBy: '',
    doScanReturnDate: item.doScanReturnDate
      ? String(item.doScanReturnDate).slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  };
}

export function buildCompletedActionState(rowId: string, item: DeliveryOrderListItem): CompletedActionState {
  return {
    id: rowId,
    shippingDate: item.shippingDate ? String(item.shippingDate).slice(0, 10) : '',
    doScanReturnDate: item.doScanReturnDate ? String(item.doScanReturnDate).slice(0, 10) : new Date().toISOString().slice(0, 10),
    stdReturnDoDays: normalizeNumber(item.stdReturnDoDays),
    stdDoReturnDate: calculateStandardReceivedDate(
      item.shippingDate ? String(item.shippingDate).slice(0, 10) : '',
      normalizeNumber(item.stdReturnDoDays),
    ),
  };
}
