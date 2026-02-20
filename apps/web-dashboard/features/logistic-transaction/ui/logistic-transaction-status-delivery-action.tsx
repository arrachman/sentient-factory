import * as React from 'react';
import { Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { type DeliveryActionState, type DeliveryOrderListItem } from '@/features/logistic-transaction/model/types';
import { buildDeliveryActionState } from '@/features/logistic-transaction/model/status-actions';
import { addDays, fmtDate } from '@/features/logistic-transaction/model/utils';

type LogisticTransactionStatusDeliveryActionProps = {
  item: DeliveryOrderListItem;
  rowId: string;
  deliveryAction: DeliveryActionState | null;
  setDeliveryAction: React.Dispatch<React.SetStateAction<DeliveryActionState | null>>;
  deliverySubmittingId: string | null;
  deliveredSubmittingId: string | null;
  completedSubmittingId: string | null;
  onSetToDelivery: () => void;
};

export function LogisticTransactionStatusDeliveryAction({
  item,
  rowId,
  deliveryAction,
  setDeliveryAction,
  deliverySubmittingId,
  deliveredSubmittingId,
  completedSubmittingId,
  onSetToDelivery,
}: LogisticTransactionStatusDeliveryActionProps) {
  return (
    <Popover
      open={deliveryAction?.id === rowId}
      onOpenChange={(open) => {
        if (open) {
          setDeliveryAction(buildDeliveryActionState(rowId, item));
          return;
        }
        if (deliveryAction?.id === rowId && !deliverySubmittingId) {
          setDeliveryAction(null);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
          disabled={Boolean((deliverySubmittingId && deliverySubmittingId !== rowId) || deliveredSubmittingId || completedSubmittingId)}
        >
          <Truck className="size-4" />
          Set Delivery
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-3 text-left" align="start">
        <div className="space-y-1">
          <p className="text-sm font-semibold">Ubah Status ke DELIVERY</p>
          <p className="text-xs text-muted-foreground">{item.doNumber}</p>
        </div>
        <div className="space-y-1">
          <Label htmlFor={`shipping-date-${rowId}`}>Tanggal Kirim</Label>
          <Input
            id={`shipping-date-${rowId}`}
            type="date"
            value={deliveryAction?.shippingDate ?? ''}
            onChange={(event) =>
              setDeliveryAction((state) =>
                state && state.id === rowId ? { ...state, shippingDate: event.target.value } : state,
              )
            }
            required
          />
        </div>
        <div className="rounded-md border p-2 text-sm">
          <p className="text-xs text-muted-foreground">Standard Barang Diterima</p>
          <p className="font-semibold">{addDays(deliveryAction?.shippingDate, String(deliveryAction?.stdLeadTimeDays ?? 0))}</p>
          <p className="text-xs text-muted-foreground">
            {deliveryAction?.shippingDate ? `${fmtDate(deliveryAction.shippingDate)} + ${deliveryAction.stdLeadTimeDays} hari` : '-'}
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDeliveryAction(null)}
            disabled={deliverySubmittingId === rowId}
          >
            Batal
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onSetToDelivery}
            disabled={deliverySubmittingId === rowId || !deliveryAction?.shippingDate}
          >
            {deliverySubmittingId === rowId ? 'Saving...' : 'Simpan'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
