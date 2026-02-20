import * as React from 'react';
import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { type DeliveredActionState, type DeliveryOrderListItem } from '@/features/logistic-transaction/model/types';
import { buildDeliveredActionState } from '@/features/logistic-transaction/model/status-actions';
import { calculateStandardReceivedDate, fmtDate, resolveDeliveryKpiStatus } from '@/features/logistic-transaction/model/utils';

type LogisticTransactionStatusDeliveredActionProps = {
  item: DeliveryOrderListItem;
  rowId: string;
  deliveredAction: DeliveredActionState | null;
  setDeliveredAction: React.Dispatch<React.SetStateAction<DeliveredActionState | null>>;
  deliveredSubmittingId: string | null;
  deliverySubmittingId: string | null;
  completedSubmittingId: string | null;
  onSetToDelivered: () => void;
};

export function LogisticTransactionStatusDeliveredAction({
  item,
  rowId,
  deliveredAction,
  setDeliveredAction,
  deliveredSubmittingId,
  deliverySubmittingId,
  completedSubmittingId,
  onSetToDelivered,
}: LogisticTransactionStatusDeliveredActionProps) {
  return (
    <Popover
      open={deliveredAction?.id === rowId}
      onOpenChange={(open) => {
        if (open) {
          setDeliveredAction(buildDeliveredActionState(rowId, item));
          return;
        }
        if (deliveredAction?.id === rowId && !deliveredSubmittingId) {
          setDeliveredAction(null);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
          disabled={Boolean((deliveredSubmittingId && deliveredSubmittingId !== rowId) || deliverySubmittingId || completedSubmittingId)}
        >
          <Check className="size-4" />
          Set Delivered
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-100 space-y-3 text-left" align="start">
        <div className="space-y-1">
          <p className="text-sm font-semibold">Ubah Status ke DELIVERED</p>
          <p className="text-xs text-muted-foreground">{item.doNumber}</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor={`actual-received-date-${rowId}`}>Aktual Barang Diterima</Label>
            <Input
              id={`actual-received-date-${rowId}`}
              type="date"
              value={deliveredAction?.actualReceivedDate ?? ''}
              onChange={(event) =>
                setDeliveredAction((state) =>
                  state && state.id === rowId
                    ? {
                        ...state,
                        actualReceivedDate: event.target.value,
                        doScanReturnDate: event.target.value,
                      }
                    : state,
                )
              }
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`do-scan-return-date-${rowId}`}>Tanggal Scan DO Kembali</Label>
            <Input
              id={`do-scan-return-date-${rowId}`}
              type="date"
              value={deliveredAction?.doScanReturnDate ?? ''}
              onChange={(event) =>
                setDeliveredAction((state) =>
                  state && state.id === rowId ? { ...state, doScanReturnDate: event.target.value } : state,
                )
              }
              required
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor={`received-by-${rowId}`}>Diterima Oleh</Label>
          <Input
            id={`received-by-${rowId}`}
            value={deliveredAction?.receivedBy ?? ''}
            onChange={(event) =>
              setDeliveredAction((state) =>
                state && state.id === rowId ? { ...state, receivedBy: event.target.value } : state,
              )
            }
            placeholder="Nama penerima"
            required
          />
        </div>
        <div className="rounded-md border p-2 text-sm">
          <p className="text-xs text-muted-foreground">KPI Ketepatan Pengiriman</p>
          {(() => {
            const standardReceivedDate = calculateStandardReceivedDate(
              deliveredAction?.shippingDate,
              deliveredAction?.stdLeadTimeDays,
            );
            const kpiStatus = resolveDeliveryKpiStatus(deliveredAction?.actualReceivedDate, standardReceivedDate);
            return (
              <div className="space-y-1">
                <p className="font-medium">Standard Barang Diterima: {standardReceivedDate ? fmtDate(standardReceivedDate) : '-'}</p>
                <p className="text-xs text-muted-foreground">
                  Jika aktual barang diterima ≤ standard barang diterima, status ONTIME. Jika melewati standard, status LATE.
                </p>
                <Badge variant={kpiStatus === 'ONTIME' ? 'primary' : kpiStatus === 'LATE' ? 'destructive' : 'secondary'}>
                  {kpiStatus}
                </Badge>
              </div>
            );
          })()}
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDeliveredAction(null)}
            disabled={deliveredSubmittingId === rowId}
          >
            Batal
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onSetToDelivered}
            disabled={
              deliveredSubmittingId === rowId ||
              !deliveredAction?.actualReceivedDate ||
              !deliveredAction?.receivedBy.trim() ||
              !deliveredAction?.doScanReturnDate
            }
          >
            {deliveredSubmittingId === rowId ? 'Saving...' : 'Simpan'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
